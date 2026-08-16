using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Security;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key is missing from appsettings.json");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = null,
        ValidAudience = null,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// ===== CONFIGURATION JSON : ENUMS EN CHAÎNES =====
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<WebApplication1.Services.PermissionService>();
builder.Services.AddScoped<WebApplication1.Services.PermissionValidationService>();
builder.Services.AddScoped<WebApplication1.Services.SeederService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Global exception handler middleware — catches unhandled exceptions across all controllers
app.UseExceptionHandler(errorApp => errorApp.Run(async context =>
{
    context.Response.ContentType = "application/json";
    context.Response.StatusCode = 500;
    var exception = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;
    var message = app.Environment.IsDevelopment()
        ? $"Une erreur interne s'est produite: {exception?.Message}"
        : "Une erreur interne s'est produite";
    await context.Response.WriteAsJsonAsync(new { error = message });
}));

app.UseCors("AllowReactApp");

app.UseStaticFiles();

// Explicit routing so endpoint metadata (incl. [RequirePermission]) is available
// to the authentication & permission middleware that run after this point.
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Permission enforcement middleware — validates [RequirePermission] attributes
// read from the matched endpoint metadata (server-side, not client-supplied).
app.UseMiddleware<PermissionValidationMiddleware>();

app.MapControllers();

// ========== SEED RBAC (logic moved to Services/SeederService) ==========
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<SeederService>();
    await seeder.SeedAsync();
}

app.Run();

public class PermissionValidationMiddleware
{
    private readonly RequestDelegate _next;

    public PermissionValidationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Read the [RequirePermission(...)] attribute from the matched endpoint metadata.
        // This replaces the old client-supplied ?permission= query string check,
        // which could be bypassed by simply omitting the query parameter.
        var endpoint = context.GetEndpoint();
        var permissionAttribute = endpoint?.Metadata.GetMetadata<RequirePermissionAttribute>();

        if (permissionAttribute != null)
        {
            var userIdStr = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { error = "Non authentifié" });
                return;
            }

            // Resolve from the request-scoped provider: the middleware instance itself
            // is constructed once with the ROOT provider, so resolving a scoped service
            // from the captured provider would throw (captive dependency).
            var permissionValidationService = context.RequestServices.GetRequiredService<PermissionValidationService>();
            var result = await permissionValidationService.ValidatePermissionAsync(userId, permissionAttribute.Permission, context);

            if (!result.IsAllowed)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsJsonAsync(new { error = result.Reason });
                return;
            }
        }

        await _next(context);
    }
}