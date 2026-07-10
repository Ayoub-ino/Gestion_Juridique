using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ExcelImportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExcelImportController(AppDbContext context)
        {
            _context = context;
        }

        // DTO for the import request
        public class ExcelImportRequest
        {
            public string DocType { get; set; } = "admin"; // "admin" or "juridique"
            public Dictionary<string, string> Mapping { get; set; } = new(); // excelCol -> dbField
            public List<Dictionary<string, string>> Rows { get; set; } = new(); // mapped data rows
        }

        // Response DTO
        public class ExcelImportResponse
        {
            public int Success { get; set; }
            public int Errors { get; set; }
            public List<string> ErrorDetails { get; set; } = new();
            public string Message { get; set; } = string.Empty;
        }

        [HttpPost]
        public async Task<ActionResult<ExcelImportResponse>> Import([FromBody] ExcelImportRequest request)
        {
            if (request.Rows == null || request.Rows.Count == 0)
            {
                return BadRequest(new ExcelImportResponse
                {
                    Message = "Aucune donnée à importer / لا توجد بيانات للاستيراد"
                });
            }

            var response = new ExcelImportResponse();
            int successCount = 0;
            int errorCount = 0;
            var errorDetails = new List<string>();

            // Use a transaction for atomicity
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var row in request.Rows)
                {
                    try
                    {
                        // Extract mapped values with null/empty checks
                        string GetVal(string key) => row.TryGetValue(key, out var v) ? (v ?? "").ToString().Trim() : "";

                        string objet = GetVal("objet");
                        string reference = GetVal("reference");
                        string dateStr = GetVal("date");
                        string source = GetVal("source");
                        string expediteur = GetVal("expediteur");
                        string destinataire = GetVal("destinataire");
                        string serviceActuel = GetVal("serviceActuel");
                        string statut = GetVal("statut");
                        string description = GetVal("description");
                        string typeCircuit = GetVal("typeCircuit");

                        // Validate required fields
                        if (string.IsNullOrWhiteSpace(objet) && string.IsNullOrWhiteSpace(reference))
                        {
                            errorCount++;
                            errorDetails.Add($"Ligne {successCount + errorCount + 1}: Objet et Référence vides");
                            continue;
                        }

                        // Parse date
                        DateTime dateCreation = DateTime.Now;
                        if (!string.IsNullOrWhiteSpace(dateStr))
                        {
                            if (DateTime.TryParse(dateStr, out var parsed))
                                dateCreation = parsed;
                            else if (DateTime.TryParseExact(dateStr, new[] { "dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd", "dd-MM-yyyy" },
                                System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var parsed2))
                                dateCreation = parsed2;
                        }

                        // Parse service enum
                        var serviceEnum = ServiceTribunal.BureauOrdre; // default
                        if (!string.IsNullOrWhiteSpace(serviceActuel))
                        {
                            if (Enum.TryParse<ServiceTribunal>(serviceActuel, true, out var sEnum))
                                serviceEnum = sEnum;
                        }

                        // Parse statut enum
                        var statutEnum = StatutDossier.Nouveau; // default
                        if (!string.IsNullOrWhiteSpace(statut))
                        {
                            if (Enum.TryParse<StatutDossier>(statut, true, out var stEnum))
                                statutEnum = stEnum;
                        }

                        if (request.DocType == "juridique")
                        {
                            var dossier = new DossierJuridique
                            {
                                Objet = objet,
                                NumeroReference = reference,
                                NumeroBureauOrdre = reference,
                                DateCreation = dateCreation,
                                ServiceActuel = serviceEnum,
                                StatutActuel = statutEnum,
                                Sujet = objet,
                                Demandeur = expediteur,
                                EtatGlobal = description,
                                TypeCircuit = string.IsNullOrWhiteSpace(typeCircuit) ? "classique" : typeCircuit,
                                EtapeService = 1,
                                DateEntree = dateCreation
                            };
                            _context.DossiersJuridiques.Add(dossier);
                        }
                        else
                        {
                            var courrier = new CourrierAdministratif
                            {
                                Objet = objet,
                                NumeroReference = reference,
                                NumeroBureauOrdre = reference,
                                NumeroOrdre = reference,
                                DateCreation = dateCreation,
                                DateReception = dateCreation,
                                ServiceActuel = serviceEnum,
                                StatutActuel = statutEnum,
                                Sujet = objet,
                                Expediteur = expediteur,
                                TypeCircuit = string.IsNullOrWhiteSpace(typeCircuit) ? "entrant-admin" : typeCircuit,
                                Transmissible = true
                            };
                            _context.CourriersAdministratifs.Add(courrier);
                        }

                        successCount++;
                    }
                    catch (Exception ex)
                    {
                        errorCount++;
                        errorDetails.Add($"Ligne {successCount + errorCount}: {ex.Message}");
                    }
                }

                if (successCount > 0)
                {
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                else
                {
                    await transaction.RollbackAsync();
                }

                response.Success = successCount;
                response.Errors = errorCount;
                response.ErrorDetails = errorDetails;
                response.Message = successCount > 0
                    ? $"Import terminé: {successCount} succès, {errorCount} erreurs / تم الاستيراد: {successCount} نجاح, {errorCount} أخطاء"
                    : "Aucune donnée importée /لم يتم استيراد أي بيانات";

                return Ok(response);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new ExcelImportResponse
                {
                    Success = 0,
                    Errors = request.Rows.Count,
                    ErrorDetails = new List<string> { $"Erreur système: {ex.Message}" },
                    Message = "Erreur critique lors de l'import / خطأ حاد أثناء الاستيراد"
                });
            }
        }
    }
}
