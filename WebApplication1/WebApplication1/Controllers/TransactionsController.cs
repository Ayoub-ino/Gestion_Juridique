using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Helpers;
using WebApplication1.Security;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!ServiceMapper.TryParseUserId(userIdStr, out var userId))
                return Unauthorized();

            var user = await _context.Utilisateurs.FindAsync(userId);
            if (user == null) return Unauthorized();

            var role = user.Role ?? "";
            var isAdminLike = role == "Admin" || role == "Greffier" || role == "Directeur" || role == "Consultant";
            var userServiceEnum = ServiceMapper.MapToServiceEnum(user.Service ?? "");

            var query = _context.Transactions
                .Include(t => t.Document)
                .Where(t => t.Statut == StatutTransaction.EnAttente);

            if (!isAdminLike)
            {
                query = query.Where(t => t.ServiceDestination == userServiceEnum
                    && (t.TargetUserId == null || t.TargetUserId == userId));
            }

            var transactions = await query
                .OrderByDescending(t => t.DateTransaction)
                .Select(t => new
                {
                    id = t.Id,
                    documentId = t.DocumentId,
                    documentType = t.Document is CourrierAdministratif ? "entrant-admin"
                                 : t.Document is DossierJuridique ? "entrant-juridique"
                                 : t.Document is CourrierSortant ? ((CourrierSortant)t.Document).TypeSortant == "demande" ? "sortant-demande" : "sortant-normal"
                                 : "unknown",
                    documentSujet = t.Document.Objet ?? t.Document.Sujet ?? "",
                    sourceServiceId = t.ServiceOrigine.ToString(),
                    destinationServiceId = t.ServiceDestination.ToString(),
                    message = t.Remarques ?? "",
                    statut = t.Statut.ToString(),
                    dateEnvoi = t.DateTransaction,
                    doitRevenir = t.DoitRevenir,
                    sourceUserName = t.UtilisateurId
                })
                .ToListAsync();

            return Ok(transactions);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!ServiceMapper.TryParseUserId(userIdStr, out var userId))
                return Unauthorized();

            var user = await _context.Utilisateurs.FindAsync(userId);
            if (user == null) return Unauthorized();

            var role = user.Role ?? "";
            var isAdminLike = role == "Admin" || role == "Greffier" || role == "Directeur" || role == "Consultant";
            var userServiceEnum = ServiceMapper.MapToServiceEnum(user.Service ?? "");

            var query = _context.Transactions
                .Include(t => t.Document)
                .AsQueryable();

            if (!isAdminLike)
            {
                query = query.Where(t => t.ServiceOrigine == userServiceEnum || t.ServiceDestination == userServiceEnum);
            }

            var transactions = await query
                .OrderByDescending(t => t.DateTransaction)
                .Select(t => new
                {
                    id = t.Id,
                    documentId = t.DocumentId,
                    documentSujet = t.Document.Objet ?? t.Document.Sujet ?? "",
                    sourceServiceId = t.ServiceOrigine.ToString(),
                    destinationServiceId = t.ServiceDestination.ToString(),
                    message = t.Remarques ?? "",
                    statut = t.Statut.ToString(),
                    dateEnvoi = t.DateTransaction,
                    doitRevenir = t.DoitRevenir,
                    commentaire = t.Commentaire,
                    motifRefus = t.MotifRefus
                })
                .ToListAsync();

            return Ok(transactions);
        }

        [HttpPut("{id}/accepter")]
        [RequirePermission("accepter")]
        public async Task<IActionResult> Accepter(int id, [FromBody] CommentDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!ServiceMapper.TryParseUserId(userIdStr, out var userId))
                return Unauthorized();

            var user = await _context.Utilisateurs.FindAsync(userId);
            if (user == null) return Unauthorized();

            var transaction = await _context.Transactions
                .Include(t => t.Document)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (transaction == null) return NotFound(new { error = "Transaction non trouvée" });
            if (transaction.Statut != StatutTransaction.EnAttente)
                return BadRequest(new { error = "Cette transaction n'est plus en attente" });

            // Permission 'accepter' is enforced by the middleware ([RequirePermission]);
            // here we only enforce the service-ownership check.
            var userEnum = ServiceMapper.MapToServiceEnum(user.Service ?? "");
            if (transaction.ServiceDestination != userEnum)
                return Forbid();

            transaction.Statut = StatutTransaction.Accepte;
            transaction.Commentaire = dto.Commentaire;

            if (transaction.DoitRevenir)
            {
                transaction.Document.ServiceActuel = transaction.ServiceOrigine;
                transaction.Document.StatutActuel = StatutDossier.EnInstance;

                var retourTransaction = new Transaction
                {
                    DocumentId = transaction.DocumentId,
                    ServiceOrigine = transaction.ServiceDestination,
                    ServiceDestination = transaction.ServiceOrigine,
                    DateTransaction = DateTime.Now,
                    Remarques = $"Document retourné automatiquement (doitRevenir)",
                    UtilisateurId = userIdStr,
                    Statut = StatutTransaction.EnAttente,
                    DoitRevenir = false
                };
                _context.Transactions.Add(retourTransaction);
            }
            else
            {
                transaction.Document.ServiceActuel = transaction.ServiceDestination;
                transaction.Document.StatutActuel = StatutDossier.EnCours;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Transaction acceptée avec succès" });
        }

        [HttpPut("{id}/refuser")]
        [RequirePermission("refuser")]
        public async Task<IActionResult> Refuser(int id, [FromBody] RefusDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!ServiceMapper.TryParseUserId(userIdStr, out var userId))
                return Unauthorized();

            var user = await _context.Utilisateurs.FindAsync(userId);
            if (user == null) return Unauthorized();

            var transaction = await _context.Transactions
                .Include(t => t.Document)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (transaction == null) return NotFound(new { error = "Transaction non trouvée" });
            if (transaction.Statut != StatutTransaction.EnAttente)
                return BadRequest(new { error = "Cette transaction n'est plus en attente" });

            // Permission 'refuser' is enforced by the middleware ([RequirePermission]);
            // here we only enforce the service-ownership check.
            var userEnum = ServiceMapper.MapToServiceEnum(user.Service ?? "");
            if (transaction.ServiceDestination != userEnum)
                return Forbid();

            transaction.Statut = StatutTransaction.Refuse;
            transaction.MotifRefus = dto.Commentaire;

            if (transaction.DoitRevenir || dto.DoitRevenir)
            {
                transaction.DoitRevenir = true;
                transaction.Document.ServiceActuel = transaction.ServiceOrigine;
                transaction.Document.StatutActuel = StatutDossier.EnCours;

                var retourTransaction = new Transaction
                {
                    DocumentId = transaction.DocumentId,
                    ServiceOrigine = transaction.ServiceDestination,
                    ServiceDestination = transaction.ServiceOrigine,
                    DateTransaction = DateTime.Now,
                    Remarques = $"Document retourné après refus (doitRevenir): {dto.Commentaire ?? ""}",
                    UtilisateurId = userIdStr,
                    Statut = StatutTransaction.EnAttente,
                    DoitRevenir = false
                };
                _context.Transactions.Add(retourTransaction);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Transaction refusée" });
        }

        [HttpPut("{id}/annuler-transition")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AnnulerTransition(int id)
        {
            var transaction = await _context.Transactions
                .Include(t => t.Document)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (transaction == null)
                return NotFound(new { error = "Transaction non trouvée" });

            if (transaction.Statut != StatutTransaction.Accepte)
                return BadRequest(new { error = "Seules les transactions acceptées peuvent être annulées" });

            // Find all transactions for the same document that happened at or after this one and are not already annulled
            var transactionsToAnnul = await _context.Transactions
                .Include(t => t.Document)
                .Where(t => t.DocumentId == transaction.DocumentId
                    && t.DateTransaction >= transaction.DateTransaction
                    && t.Statut != StatutTransaction.Annule)
                .ToListAsync();

            foreach (var tx in transactionsToAnnul)
            {
                tx.Statut = StatutTransaction.Annule;
            }

            // Restore the document
            var document = transaction.Document;
            document.ServiceActuel = transaction.ServiceOrigine;
            document.StatutActuel = transaction.StatutPrecedent ?? StatutDossier.EnCours;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Transition annulée avec succès",
                annulledTransactionIds = transactionsToAnnul.Select(t => t.Id).ToList()
            });
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!ServiceMapper.TryParseUserId(userIdStr, out var userId))
                return Unauthorized();

            var user = await _context.Utilisateurs.FindAsync(userId);
            if (user == null) return Unauthorized();

            var role = user.Role ?? "";
            var isAdminLike = role == "Admin" || role == "Greffier" || role == "Directeur" || role == "Consultant";
            var userServiceEnum = ServiceMapper.MapToServiceEnum(user.Service ?? "");

            var query = _context.Transactions.AsQueryable();

            if (!isAdminLike)
            {
                query = query.Where(t => t.ServiceOrigine == userServiceEnum || t.ServiceDestination == userServiceEnum);
            }

            var total = await query.CountAsync();
            var acceptes = await query.CountAsync(t => t.Statut == StatutTransaction.Accepte);
            var refuses = await query.CountAsync(t => t.Statut == StatutTransaction.Refuse);
            var enAttente = await query.CountAsync(t => t.Statut == StatutTransaction.EnAttente);

            var pourcentage = total > 0 ? Math.Round((double)acceptes / total * 100, 1) : 0;

            return Ok(new
            {
                total,
                acceptes,
                refuses,
                enAttente,
                pourcentage
            });
        }

        [HttpGet("stats-by-service")]
        public async Task<IActionResult> GetStatsByService()
        {
            var stats = await _context.Transactions
                .GroupBy(t => t.ServiceOrigine)
                .Select(g => new
                {
                    service = g.Key.ToString(),
                    total = g.Count(),
                    acceptes = g.Count(t => t.Statut == StatutTransaction.Accepte),
                    refuses = g.Count(t => t.Statut == StatutTransaction.Refuse),
                    enAttente = g.Count(t => t.Statut == StatutTransaction.EnAttente)
                })
                .ToListAsync();

            return Ok(stats);
        }

        [HttpGet("count-pending")]
        public async Task<IActionResult> CountPending()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!ServiceMapper.TryParseUserId(userIdStr, out var userId))
                return Ok(new { count = 0 });

            var user = await _context.Utilisateurs.FindAsync(userId);
            if (user == null) return Ok(new { count = 0 });

            var role = user.Role ?? "";
            var isAdminLike = role == "Admin" || role == "Greffier" || role == "Directeur" || role == "Consultant";
            var userServiceEnum = ServiceMapper.MapToServiceEnum(user.Service ?? "");

            var countQuery = _context.Transactions
                .Where(t => t.Statut == StatutTransaction.EnAttente);

            if (!isAdminLike)
            {
                countQuery = countQuery.Where(t => t.ServiceDestination == userServiceEnum);
            }

            var count = await countQuery.CountAsync();

            return Ok(new { count });
        }

        [HttpGet("doit-revenir")]
        public async Task<IActionResult> GetDoitRevenir()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!ServiceMapper.TryParseUserId(userIdStr, out var userId))
                return Unauthorized();

            var user = await _context.Utilisateurs.FindAsync(userId);
            if (user == null) return Unauthorized();

            var role = user.Role ?? "";
            var isAdminLike = role == "Admin" || role == "Greffier" || role == "Directeur" || role == "Consultant";
            var userServiceEnum = ServiceMapper.MapToServiceEnum(user.Service ?? "");

            var query = _context.Transactions
                .Include(t => t.Document)
                .Where(t => t.DoitRevenir && (t.Statut == StatutTransaction.Refuse || t.Statut == StatutTransaction.EnAttente));

            if (!isAdminLike)
            {
                query = query.Where(t => t.ServiceDestination == userServiceEnum);
            }

            var transactions = await query
                .OrderByDescending(t => t.DateTransaction)
                .Select(t => new
                {
                    id = t.Id,
                    documentId = t.DocumentId,
                    documentSujet = t.Document.Objet ?? t.Document.Sujet ?? "",
                    sourceServiceId = t.ServiceOrigine.ToString(),
                    destinationServiceId = t.ServiceDestination.ToString(),
                    message = t.MotifRefus ?? "",
                    statut = t.Statut.ToString(),
                    dateEnvoi = t.DateTransaction,
                    doitRevenir = t.DoitRevenir
                })
                .ToListAsync();

            return Ok(transactions);
        }

        [HttpGet("history/{documentId}")]
        public async Task<IActionResult> GetHistory(int documentId)
        {
            var transactions = await _context.Transactions
                .Where(t => t.DocumentId == documentId)
                .OrderBy(t => t.DateTransaction)
                .Select(t => new
                {
                    id = t.Id,
                    serviceOrigine = t.ServiceOrigine.ToString(),
                    serviceDestination = t.ServiceDestination.ToString(),
                    date = t.DateTransaction,
                    remarques = t.Remarques ?? "",
                    statut = t.Statut.ToString(),
                    commentaire = t.Commentaire ?? "",
                    motifRefus = t.MotifRefus ?? "",
                    doitRevenir = t.DoitRevenir
                })
                .ToListAsync();

            return Ok(transactions);
        }
    }

    public class CommentDto
    {
        public string? Commentaire { get; set; }
    }

    public class RefusDto
    {
        public string? Commentaire { get; set; }
        public bool DoitRevenir { get; set; }
    }
}
