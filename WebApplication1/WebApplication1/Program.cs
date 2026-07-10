using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using WebApplication1.Data;
using WebApplication1.Models;

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

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactApp");

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ========== SEED RBAC ==========
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        context.Database.Migrate();

        // --- 1. Ensure admin user exists ---
        context.ChangeTracker.Clear();
        var admin = context.Utilisateurs.FirstOrDefault(u => u.Login == "admin");
        if (admin == null)
        {
            admin = new Utilisateur
            {
                Login = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Nom = "Administrateur",
                Role = "Admin",
                Service = "Admin"
            };
            context.Utilisateurs.Add(admin);
            context.SaveChanges();
            Console.WriteLine("=========================================");
            Console.WriteLine("ADMIN CREE AUTOMATIQUEMENT !");
            Console.WriteLine("   Login: admin");
            Console.WriteLine("   Mot de passe: admin123");
            Console.WriteLine("=========================================");
        }

        // --- 2. Seed RBAC Services (8 target services) ---
        context.ChangeTracker.Clear();
        if (!context.RbacServices.Any())
        {
            var rbacServices = new List<Service>
            {
                new Service { Nom = "Bureau d'ordre", Code = "bureauordre", Description = "Bureau d'ordre et bureau administratif" },
                new Service { Nom = "Fath M'lafat", Code = "fathmilafat", Description = "Ouverture des dossiers judiciaires" },
                new Service { Nom = "Secrétariat", Code = "secretarait", Description = "Secrétariat général" },
                new Service { Nom = "Séances & Procédures", Code = "seances&procedures", Description = "Gestion des séances et procédures" },
                new Service { Nom = "Khibra (Expertise)", Code = "khibra", Description = "Service d'expertise" },
                new Service { Nom = "Taslim Nusakh", Code = "taslimnosakh", Description = "Délivrance des copies" },
                new Service { Nom = "Tasfiyat Sawa2ir Takmilia", Code = "tasfiatSawa2irTakmilia", Description = "Règlement des affaires complémentaires" },
                new Service { Nom = "Archive", Code = "archive", Description = "Service des archives" }
            };
            context.RbacServices.AddRange(rbacServices);
            context.SaveChanges();
            Console.WriteLine("8 RBAC services créés.");
        }

        // --- 3. Seed Permissions (~40) ---
        context.ChangeTracker.Clear();
        if (!context.Permissions.Any())
        {
            var permissions = new List<Permission>
            {
                // Documents
                new Permission { Key = "transferer", LabelFr = "Transférer", LabelAr = "تحويل", Category = "documents", DefaultEnabled = true },
                new Permission { Key = "consulter", LabelFr = "Consulter", LabelAr = "استشارة", Category = "documents", DefaultEnabled = true },
                new Permission { Key = "creer_modifier", LabelFr = "Créer / Modifier", LabelAr = "إنشاء / تعديل", Category = "documents", DefaultEnabled = true },
                new Permission { Key = "supprimer", LabelFr = "Supprimer", LabelAr = "حذف", Category = "documents", DefaultEnabled = false },
                new Permission { Key = "archiver", LabelFr = "Archiver", LabelAr = "أرشفة", Category = "documents", DefaultEnabled = true },
                new Permission { Key = "restaurer", LabelFr = "Restaurer", LabelAr = "استعادة", Category = "documents", DefaultEnabled = false },
                new Permission { Key = "voir_corbeille", LabelFr = "Voir corbeille", LabelAr = "عرض سلة المهملات", Category = "documents", DefaultEnabled = false },
                new Permission { Key = "creer_courrier_admin", LabelFr = "Créer courrier administratif", LabelAr = "إنشاء رسالة إدارية", Category = "documents", DefaultEnabled = true },
                new Permission { Key = "creer_courrier_juridique", LabelFr = "Créer dossier juridique", LabelAr = "إنشاء ملف قضائي", Category = "documents", DefaultEnabled = true },

                // Notifications
                new Permission { Key = "accepter", LabelFr = "Accepter", LabelAr = "قبول", Category = "notifications", DefaultEnabled = true },
                new Permission { Key = "refuser", LabelFr = "Refuser", LabelAr = "رفض", Category = "notifications", DefaultEnabled = true },
                new Permission { Key = "voir_toutes", LabelFr = "Voir toutes les notifications", LabelAr = "عرض كل الإشعارات", Category = "notifications", DefaultEnabled = false },

                // Juridique
                new Permission { Key = "etape_precedente", LabelFr = "Étape précédente", LabelAr = "المرحلة السابقة", Category = "juridique", DefaultEnabled = true },
                new Permission { Key = "etape_suivante", LabelFr = "Étape suivante", LabelAr = "المرحلة التالية", Category = "juridique", DefaultEnabled = true },
                new Permission { Key = "ouvrir_dossier", LabelFr = "Ouvrir dossier", LabelAr = "فتح ملف", Category = "juridique", DefaultEnabled = true },
                new Permission { Key = "cloturer", LabelFr = "Clôturer", LabelAr = "إغلاق", Category = "juridique", DefaultEnabled = false },
                new Permission { Key = "transferer_juridique", LabelFr = "Transférer juridique", LabelAr = "تحويل قضائي", Category = "juridique", DefaultEnabled = true },
                new Permission { Key = "retrait_archive", LabelFr = "Retrait archive", LabelAr = "سحب من الأرشيف", Category = "juridique", DefaultEnabled = false },

                // Recherche
                new Permission { Key = "recherche_avancee", LabelFr = "Recherche avancée", LabelAr = "بحث متقدم", Category = "recherche", DefaultEnabled = true },
                new Permission { Key = "export_excel", LabelFr = "Export Excel", LabelAr = "تصدير Excel", Category = "recherche", DefaultEnabled = true },
                new Permission { Key = "export_word", LabelFr = "Export Word", LabelAr = "تصدير Word", Category = "recherche", DefaultEnabled = true },

                // Admin
                new Permission { Key = "gerer_utilisateurs", LabelFr = "Gérer utilisateurs", LabelAr = "إدارة المستخدمين", Category = "admin", DefaultEnabled = false },
                new Permission { Key = "gerer_services", LabelFr = "Gérer services", LabelAr = "إدارة المصالح", Category = "admin", DefaultEnabled = false },
                new Permission { Key = "gerer_permissions", LabelFr = "Gérer permissions", LabelAr = "إدارة الصلاحيات", Category = "admin", DefaultEnabled = false },
                new Permission { Key = "gerer_equipements", LabelFr = "Gérer équipements", LabelAr = "إدارة المعدات", Category = "admin", DefaultEnabled = false },
                new Permission { Key = "gerer_listes", LabelFr = "Gérer listes dynamiques", LabelAr = "إدارة اللوائح الديناميكية", Category = "admin", DefaultEnabled = false },
                new Permission { Key = "gerer_substituts", LabelFr = "Gérer substituts", LabelAr = "إدارة البدائل", Category = "admin", DefaultEnabled = false },

                // Autres
                new Permission { Key = "voir_workspace", LabelFr = "Voir espace de travail", LabelAr = "عرض مساحة العمل", Category = "autres", DefaultEnabled = true },
                new Permission { Key = "ajouter_notes", LabelFr = "Ajouter notes", LabelAr = "إضافة ملاحظات", Category = "autres", DefaultEnabled = true },
                new Permission { Key = "voir_historique", LabelFr = "Voir historique", LabelAr = "عرض السجل", Category = "autres", DefaultEnabled = true },
                new Permission { Key = "telecharger_fichiers", LabelFr = "Télécharger fichiers", LabelAr = "تحميل الملفات", Category = "autres", DefaultEnabled = true },
                new Permission { Key = "dashboard", LabelFr = "Tableau de bord", LabelAr = "لوحة القيادة", Category = "autres", DefaultEnabled = true },
                new Permission { Key = "mes_entites", LabelFr = "Mes entités", LabelAr = "كياني", Category = "autres", DefaultEnabled = true },
                new Permission { Key = "transactions", LabelFr = "Transactions", LabelAr = "المعاملات", Category = "autres", DefaultEnabled = true },
                new Permission { Key = "archives_view", LabelFr = "Voir archives", LabelAr = "عرض الأرشيف", Category = "autres", DefaultEnabled = true },
                new Permission { Key = "profil", LabelFr = "Mon profil", LabelAr = "ملفي الشخصي", Category = "autres", DefaultEnabled = true }
            };
            context.Permissions.AddRange(permissions);
            context.SaveChanges();
            Console.WriteLine($"{permissions.Count} permissions créées.");
        }

        // --- 4. Seed ServicePermissions (assign default permissions to each service) ---
        context.ChangeTracker.Clear();
        if (!context.ServicePermissions.Any())
        {
            var allServices = context.RbacServices.ToList();

            // STRICT permission matrix per requirement
            // All services get notification permissions (accepter, refuser) by default
            // Admin is excluded from notifications via AdminPermissionOverrides
            var serviceDefaults = new Dictionary<string, List<string>>
            {
                // Creer, Modifier, Transférer
                ["bureauordre"] = new() { "creer_modifier", "transferer", "consulter", "accepter", "refuser", "dashboard", "mes_entites", "transactions", "recherche_avancee", "export_excel", "export_word", "voir_historique", "telecharger_fichiers", "profil" },
                ["fathmilafat"] = new() { "creer_modifier", "transferer", "consulter", "ouvrir_dossier", "accepter", "refuser", "dashboard", "mes_entites", "transactions", "recherche_avancee", "export_excel", "export_word", "voir_historique", "telecharger_fichiers", "profil" },
                // Modifier, Transférer (no creation)
                ["secretarait"] = new() { "transferer", "consulter", "accepter", "refuser", "dashboard", "mes_entites", "transactions", "recherche_avancee", "export_excel", "export_word", "voir_historique", "telecharger_fichiers", "ajouter_notes", "profil" },
                ["seances&procedures"] = new() { "transferer", "consulter", "etape_precedente", "etape_suivante", "accepter", "refuser", "dashboard", "mes_entites", "transactions", "recherche_avancee", "export_excel", "export_word", "voir_historique", "telecharger_fichiers", "profil" },
                ["khibra"] = new() { "transferer", "consulter", "etape_precedente", "etape_suivante", "accepter", "refuser", "dashboard", "mes_entites", "transactions", "recherche_avancee", "export_excel", "export_word", "voir_historique", "telecharger_fichiers", "ajouter_notes", "profil" },
                // Transférer uniquement
                ["taslimnosakh"] = new() { "transferer", "consulter", "accepter", "refuser", "dashboard", "mes_entites", "transactions", "archives_view", "recherche_avancee", "export_excel", "export_word", "voir_historique", "telecharger_fichiers", "profil" },
                ["tasfiatSawa2irTakmilia"] = new() { "transferer", "consulter", "accepter", "refuser", "dashboard", "mes_entites", "transactions", "recherche_avancee", "export_excel", "export_word", "voir_historique", "telecharger_fichiers", "profil" },
                // Archiver uniquement
                ["archive"] = new() { "archiver", "consulter", "restaurer", "voir_corbeille", "retrait_archive", "accepter", "refuser", "dashboard", "mes_entites", "archives_view", "recherche_avancee", "export_excel", "export_word", "voir_historique", "telecharger_fichiers", "profil" }
            };

            foreach (var service in allServices)
            {
                if (serviceDefaults.TryGetValue(service.Code, out var permKeys))
                {
                    foreach (var key in permKeys)
                    {
                        context.ServicePermissions.Add(new ServicePermission
                        {
                            ServiceId = service.Id,
                            PermissionKey = key,
                            Enabled = true
                        });
                    }
                }
            }
            context.SaveChanges();
            Console.WriteLine("ServicePermissions assignées.");
        }

        // --- 5. Seed AdminPermissionOverrides (default disabled) ---
        context.ChangeTracker.Clear();
        if (!context.AdminPermissionOverrides.Any())
        {
            var adminOverrides = new[]
            {
                "creer_modifier", "transferer", "transferer_juridique", "accepter", "refuser", "voir_toutes"
            };
            foreach (var key in adminOverrides)
            {
                context.AdminPermissionOverrides.Add(new AdminPermissionOverride
                {
                    PermissionKey = key,
                    Enabled = false
                });
            }
            context.SaveChanges();
            Console.WriteLine("AdminPermissionOverrides seedés (6 permissions désactivées).");
        }

        // --- 6. Seed one user per RBAC service ---
        context.ChangeTracker.Clear();
        var rbacServiceList = context.RbacServices.ToList();
        var serviceUserDefs = new[]
        {
            new { Login = "bureauordre", Pass = "bureauordre123", Nom = "Agent Bureau d'Ordre", ServiceCode = "bureauordre" },
            new { Login = "fathmilafat", Pass = "fathmilafat123", Nom = "Agent Fath M'lafat", ServiceCode = "fathmilafat" },
            new { Login = "secretarait", Pass = "secretarait123", Nom = "Agent Secrétariat", ServiceCode = "secretarait" },
            new { Login = "seances", Pass = "seances123", Nom = "Agent Séances & Procédures", ServiceCode = "seances&procedures" },
            new { Login = "khibra", Pass = "khibra123", Nom = "Agent Expertise", ServiceCode = "khibra" },
            new { Login = "taslimnosakh", Pass = "taslim123", Nom = "Agent Taslim Nusakh", ServiceCode = "taslimnosakh" },
            new { Login = "tasfiya", Pass = "tasfiya123", Nom = "Agent Tasfiyat Sawa2ir", ServiceCode = "tasfiatSawa2irTakmilia" },
            new { Login = "archive", Pass = "archive123", Nom = "Agent Archive", ServiceCode = "archive" }
        };

        foreach (var u in serviceUserDefs)
        {
            if (!context.Utilisateurs.Any(x => x.Login == u.Login))
            {
                var svc = rbacServiceList.FirstOrDefault(s => s.Code == u.ServiceCode);
                context.Utilisateurs.Add(new Utilisateur
                {
                    Login = u.Login,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(u.Pass),
                    Nom = u.Nom,
                    Role = "User",
                    Service = u.ServiceCode,
                    ServiceId = svc?.Id
                });
            }
        }
        context.SaveChanges();
        Console.WriteLine("Utilisateurs RBAC créés.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erreur seed: {ex.Message}");
    }
}

app.Run();