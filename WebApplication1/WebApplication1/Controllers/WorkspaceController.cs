using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApplication1.DTO;
using WebApplication1.Helpers;
using WebApplication1.Security;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WorkspaceController : ControllerBase
    {
        private readonly WorkspaceService _service;

        public WorkspaceController(WorkspaceService service)
        {
            _service = service;
        }

        private IActionResult Map(ServiceResult result) =>
            result.Success ? Ok(result.Data) : StatusCode(result.StatusCode, result.Data);

        // ============ GET document full details ============
        [HttpGet("document/{id}")]
        public async Task<IActionResult> GetDocument(int id) =>
            Map(await _service.GetDocumentAsync(id));

        // ============ PUT update document ============
        [HttpPut("document/{id}")]
        public async Task<IActionResult> UpdateDocument(int id, [FromBody] UpdateDocumentDto dto)
        {
            var (userName, userService) = await ResolveUserAsync();
            return Map(await _service.UpdateDocumentAsync(id, dto, userName, userService));
        }

        // ============ NOTES ============
        [HttpGet("document/{id}/notes")]
        public async Task<IActionResult> GetNotes(int id) =>
            Map(await _service.GetNotesAsync(id));

        [HttpPost("document/{id}/notes")]
        [RequirePermission("ajouter_notes")]
        public async Task<IActionResult> AddNote(int id, [FromBody] AddNoteDto dto)
        {
            var (userName, userService) = await ResolveUserAsync();
            return Map(await _service.AddNoteAsync(id, dto, userName, userService));
        }

        [HttpPut("notes/{noteId}")]
        [RequirePermission("ajouter_notes")]
        public async Task<IActionResult> UpdateNote(int noteId, [FromBody] AddNoteDto dto) =>
            Map(await _service.UpdateNoteAsync(noteId, dto));

        [HttpDelete("notes/{noteId}")]
        [RequirePermission("ajouter_notes")]
        public async Task<IActionResult> DeleteNote(int noteId) =>
            Map(await _service.DeleteNoteAsync(noteId));

        // ============ MODIFICATIONS AUDIT ============
        [HttpGet("document/{id}/modifications")]
        public async Task<IActionResult> GetModifications(int id) =>
            Map(await _service.GetModificationsAsync(id));

        private async Task<(string Name, string Service)> ResolveUserAsync()
        {
            if (!ServiceMapper.TryParseUserId(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId))
                return ("Inconnu", "");
            return (await _service.GetUserNameAsync(userId), await _service.GetUserServiceAsync(userId));
        }
    }
}
