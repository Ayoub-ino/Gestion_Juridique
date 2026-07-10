using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/rbac/services")]
    [Authorize]
    public class RbacServicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RbacServicesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var services = await _context.RbacServices
                .Include(s => s.Parent)
                .OrderBy(s => s.Nom)
                .Select(s => new
                {
                    s.Id,
                    s.Nom,
                    s.Code,
                    s.Description,
                    s.ParentId,
                    ParentNom = s.Parent != null ? s.Parent.Nom : null,
                    UserCount = _context.Utilisateurs.Count(u => u.ServiceId == s.Id)
                })
                .ToListAsync();

            return Ok(services);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var service = await _context.RbacServices.FindAsync(id);
            if (service == null)
                return NotFound(new { error = "Service non trouvé" });

            return Ok(new
            {
                service.Id,
                service.Nom,
                service.Code,
                service.Description,
                service.ParentId
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateServiceDto dto)
        {
            if (dto == null)
                return BadRequest(new { error = "Données invalides" });

            var exists = await _context.RbacServices.AnyAsync(s => s.Code == dto.Code);
            if (exists)
                return Conflict(new { error = "Ce code existe déjà" });

            var service = new Service
            {
                Nom = dto.Nom,
                Code = dto.Code,
                Description = dto.Description,
                ParentId = dto.ParentId
            };

            _context.RbacServices.Add(service);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Service créé avec succès", id = service.Id });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateServiceDto dto)
        {
            var service = await _context.RbacServices.FindAsync(id);
            if (service == null)
                return NotFound(new { error = "Service non trouvé" });

            if (dto.Nom != null) service.Nom = dto.Nom;
            if (dto.Code != null) service.Code = dto.Code;
            if (dto.Description != null) service.Description = dto.Description;
            if (dto.ParentId.HasValue) service.ParentId = dto.ParentId;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Service modifié avec succès" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var service = await _context.RbacServices.FindAsync(id);
            if (service == null)
                return NotFound(new { error = "Service non trouvé" });

            // Check if users are assigned
            var userCount = await _context.Utilisateurs.CountAsync(u => u.ServiceId == id);
            if (userCount > 0)
                return BadRequest(new { error = $"Impossible de supprimer: {userCount} utilisateur(s) assigné(s) à ce service" });

            // Remove service permissions
            var perms = await _context.ServicePermissions.Where(sp => sp.ServiceId == id).ToListAsync();
            _context.ServicePermissions.RemoveRange(perms);

            _context.RbacServices.Remove(service);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Service supprimé avec succès" });
        }
    }

    public class CreateServiceDto
    {
        public string Nom { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? ParentId { get; set; }
    }

    public class UpdateServiceDto
    {
        public string? Nom { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public int? ParentId { get; set; }
    }
}
