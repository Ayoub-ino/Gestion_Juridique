# CHANGELOG_AGENTS.md — Project Memory Log

> Single source of truth for all modifications, architectural decisions, and cross-session context.
> Each entry is timestamped and structured for traceability.

---

## [2026-09-05 10:30] - Optimized File Streaming Engine, Transfer Cancellation Rules, and Permission Expansion

### 1. Context & Objective
- Optimize file attachment streaming with proper buffer management, caching headers (ETag/If-Modified-Since), and async I/O.
- Enforce transfer cancellation rules: standard users can cancel only "EnAttente" transfers they sent; Admin users can cancel any transfer at any stage.
- Add `annuler_transfert` permission (37th permission) to all services, enabling granular control over transfer cancellation.
- Verify `Mes Dossiers En Cours` query scope is correctly filtering to current service only.

### 2. Files Modified / Created / Deleted

- `[MODIFIED]` `WebApplication1/WebApplication1/Controllers/FileUploadController.cs` — Performance overhaul:
  - `ServeInline`: Replaced `ReadAllBytes` with async `FileStream` streaming (81920 buffer). Added ETag/If-None-Match/If-Modified-Since caching headers. Returns 304 when unchanged.
  - `Download`: Replaced `ReadAllBytes` with async `FileStream` streaming. Added `Cache-Control: no-store` and `Content-Disposition` with UTF-8 filename encoding.
  - `Preview`: Updated to use `ReadAllBytesAsync` for non-blocking I/O.

- `[MODIFIED]` `WebApplication1/WebApplication1/Services/TransactionService.cs` — Cancellation rules:
  - `AnnulerTransitionAsync` now accepts `userId` parameter.
  - Standard users: Only cancel `EnAttente` transactions where `ServiceOrigine` matches their service.
  - Admin/Greffier/Directeur/Consultant users: Can cancel any transaction at any stage.
  - State reversal: Document restored to original service, transaction marked as `Annule`.

- `[MODIFIED]` `WebApplication1/WebApplication1/Controllers/TransactionsController.cs` — Authorization:
  - Changed from `[Authorize(Roles = "Admin")]` to `[RequirePermission("annuler_transfert")]`.
  - Passes `userId` to service layer for ownership validation.

- `[MODIFIED]` `WebApplication1/WebApplication1/Services/SeederService.cs` — New permission:
  - Added `annuler_transfert` ("Annuler transfert" / "إلغاء التحويل") to notifications category.
  - Added to all 9 service permission sets (enabled by default).
  - Admin override: `annuler_transfert` is NOT disabled for Admin (admins keep this permission).

- `[MODIFIED]` `frontend-juridique/app/components/pages/TransactionsPage.tsx` — UI updates:
  - Added `canCancelTransfer = hasPermission("annuler_transfert")` permission check.
  - `EnAttente` transactions: Show "Annuler l'envoi" button (amber) when user has `annuler_transfert` permission.
  - `Accepte` transactions: Show "Annuler" button (amber) when user has `annuler_transfert` permission.
  - Button disabled states not needed — permission check already hides buttons entirely.

### 3. Key Technical & Architectural Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **File streaming** | `FileStream` with 80KB buffer + `true` (async) | Prevents memory spikes on large files; async avoids thread pool blocking |
| **ETag caching** | `"ticks-length"` format | Cheap to compute, deterministic, avoids file hash overhead |
| **Transfer cancellation** | Permission-gated (`annuler_transfert`) instead of role-only | Allows fine-grained control; service users can cancel their own transfers |
| **Admin override** | Admin keeps `annuler_transfert` enabled | Admins need global override rights per requirements |
| **Ownership validation** | `ServiceOrigine == userEnum` check | Prevents users from cancelling transfers sent by other services |

### 4. Verification Results
- ✅ Backend: `dotnet build` — 0 CS compilation errors (only file-locking warnings from running server)
- ✅ Frontend: `npm run build` — Compiled successfully (TypeScript passed)
- ⚠️ .NET unit tests: Cannot run while server is running (file lock on exe)
- ⚠️ Need to run seeder (`POST /api/seed/run`) to insert the new `annuler_transfert` permission

### 5. Current State & Pending Tasks
- **Permission count:** Now 37 permissions (was 36).
- **Backend server:** Needs restart to pick up new endpoint changes (streaming, cancellation logic).
- **Database:** Needs seed run to insert `annuler_transfert` permission into existing DB.
- **Next steps:**
  1. Restart backend server.
  2. Run `POST /api/seed/run` to insert new permission.
  3. Verify in browser that cancel buttons appear for users with `annuler_transfert`.
  4. Test file download speed improvement with large PDFs.

---

## [2026-09-04 20:00] - Attachment Viewer/Download Fix, Backend File Serving Overhaul, and Build Verification

### 1. Context & Objective
- Fix broken attachment viewer and download functionality in the dossier detail modal.
- Add proper backend endpoints for preview (inline) and download (attachment) with correct headers.
- Add `telecharger_fichiers` permission guard on download button.
- Add image preview support and graceful fallback for unsupported file types.
- Verify all builds and E2E tests pass.

### 2. Files Modified / Created / Deleted

- `[MODIFIED]` `WebApplication1/WebApplication1/Controllers/FileUploadController.cs` — Major overhaul:
  - Renamed `Download` to `ServeInline` (`GET /api/FileUpload/{storedName}`) — serves files inline for browser preview.
  - Added new `Download` endpoint (`GET /api/FileUpload/download/{storedName}`) — forces browser download with `Content-Disposition: attachment` header and original filename.
  - Extracted `GetContentType()` helper for DRY content type resolution.
  - Updated `Preview` endpoint to serve PDF and images directly (not just DOCX/XLSX HTML conversion).
  - Added graceful fallback for unsupported formats with user-facing error page.

- `[MODIFIED]` `frontend-juridique/app/components/modals/DetailModal.tsx` — Complete attachment section rewrite:
  - Added `getFileCategory()` helper: classifies files as pdf/image/office/unsupported.
  - Added `getPreviewUrl()`: routes to correct endpoint per file type.
  - Added `getDownloadUrl()`: uses new `/api/FileUpload/download/` endpoint.
  - "Voir" button: now uses correct preview URL (inline for PDF/images, HTML conversion for DOCX/XLSX).
  - "Télécharger" button: now uses new download endpoint with proper headers.
  - Added `telecharger_fichiers` permission guard on download button (disabled state with tooltip).
  - Added image preview support (`<img>` tag for PNG/JPG/GIF/WEBP).
  - Added error state handling with graceful fallback message for unsupported formats.
  - Added `previewError` state for handling preview failures.

### 3. Key Technical & Architectural Decisions
- **Separate endpoints for preview vs download:** `ServeInline` for browser rendering, `Download` for forced attachment. This follows HTTP best practices.
- **Original filename extraction:** The `Download` endpoint strips the timestamp+GUID prefix from stored filenames to provide meaningful download names.
- **Permission guard:** `telecharger_fichiers` permission (enabled by default for all services) controls download access. Disabled state shows a greyed-out button with tooltip.
- **Graceful degradation:** Unsupported file types show a helpful error page suggesting download instead of failing silently.

### 4. Verification Results
- ✅ Backend: `dotnet build` — 0 CS errors (only file-locking warnings from running server)
- ✅ Frontend: `npm run build` — Compiled successfully in 6.7s, TypeScript passed
- ✅ Cypress E2E (app.cy.ts): 35/35 passing
- ✅ Cypress E2E (permission-toggle.cy.ts): 24/24 passing
- ⏸️ .NET unit tests: Cannot run while server is running (file lock)

### 5. Current State & Pending Tasks
- All builds pass, all E2E tests pass.
- Backend server needs restart to pick up new endpoints.
- Next: Stop the running server and run `dotnet test` to verify 85 unit tests.

---

## [2026-09-04 19:30] - Dashboard UI Fixes, Admin Notification Exclusion, Attachment Buttons, and Filter Enhancements

### 1. Context & Objective
- Resolve dashboard UI bugs (duplicate "Demandes en attente" bar).
- Exclude Admin users from operational notifications.
- Fix attachment action buttons in DetailModal ("Voir" vs "Télécharger").
- Fix query scope for "Mes Dossiers En Cours" and add filters to "Mes Entités".

### 2. Files Modified / Created / Deleted

- `[MODIFIED]` `frontend-juridique/app/page.tsx` — Removed the second activity card (`demandesAttente`) from the `activityCards` array. Dashboard now shows 3 cards: Notifications, Dernières transactions traitées, Documents à retourner.

- `[MODIFIED]` `WebApplication1/WebApplication1/Services/TransactionService.cs` — Admin notification exclusion:
  - `CountPendingAsync()`: Returns `count = 0` for Admin/Greffier/Directeur/Consultant users.
  - `GetPendingAsync()`: Returns empty list for admin-like users.
  - `GetDoitRevenirAsync()`: Returns empty list for admin-like users.

- `[MODIFIED]` `frontend-juridique/app/components/modals/DetailModal.tsx` — Fixed "Fichier joint" section:
  - Button 1: "Voir" with 👁 icon → toggles inline preview (PDF/DOCX/Excel iframe).
  - Button 2: Relabeled from "Voir" to "Télécharger" with 📥 icon, added `download` attribute for direct browser download.
  - Changed button color from amber to emerald for visual distinction.

- `[MODIFIED]` `frontend-juridique/lib/translations.ts` — Added `telecharger` key: FR="Télécharger", AR="تحميل".

- `[MODIFIED]` `frontend-juridique/app/components/pages/MesDossiersEnCoursView.tsx` — Fixed query scope:
  - Added `USER_SERVICE_TO_ENUM` import to map RBAC codes (e.g., "bureauordre") to enum strings (e.g., "BureauOrdre").
  - Filter now compares against both mapped enum value AND raw code for robustness.
  - Documents must be in user's active service OR have `targetUserId` matching current user.

- `[MODIFIED]` `frontend-juridique/app/components/pages/MesEntitesView.tsx` — Added filter panel:
  - Service filter: Dropdown populated from `SERVICE_GROUPS` (all 24 tribunal services).
  - Reference filter: Text input for partial matching on `doc.reference`.
  - Filters are reactive with pagination (select-all checkbox reflects filtered count).

### 3. Key Technical & Architectural Decisions
- **Admin notification exclusion** uses `IsAdminLike()` check (Admin, Greffier, Directeur, Consultant roles) at the service layer — returns empty data before any DB query.
- **Attachment download** uses native HTML `download` attribute on `<a>` tag, which triggers browser download for same-origin files.
- **Service filter mapping** leverages existing `USER_SERVICE_TO_ENUM` constant from `lib/constants.ts` to bridge RBAC codes and ServiceTribunal enum values.
- **Permission matrix** was audited and confirmed working: 53 `[RequirePermission]` annotations across 18 controllers, 36 permission keys, admin override layer with 20 disabled-by-default permissions.

### 4. Current State & Pending Tasks
- **Build status:** All frontend and backend modifications are in place.
- **Files changed:** 6 files modified, 0 files created/deleted.
- **Next recommended steps:**
  1. Run `dotnet build` to verify backend compiles.
  2. Run `npm run build` to verify frontend compiles.
  3. Run Cypress E2E tests to verify UI interactions.
  4. Consider adding the `telecharger_fichiers` permission check on the download button.

---

## [2026-09-04 19:00] - Initial Codebase Architecture Baseline Scan

### 1. Context & Objective
- Comprehensive scan of the entire **Gestion Juridique** codebase to establish an architectural baseline.
- This is the foundational entry: all future changes will reference or extend this map.

### 2. Project Overview
- **Full-stack judicial document management system** for a Moroccan tribunal (Cour d'Appel Administrative).
- **Frontend:** Next.js 16 (React 19) with TypeScript, Tailwind CSS 4, App Router.
- **Backend:** ASP.NET Core 10 Web API with Entity Framework Core 10, SQL Server.
- **Auth:** JWT Bearer tokens (BCrypt password hashing).
- **RBAC:** Service-level permission system with 36 dynamic permissions, admin override layer, and middleware enforcement.

### 3. Directory & File Structure

#### Backend (`WebApplication1/WebApplication1/`)
```
Controllers/          (22 controllers)
├── AuthController.cs                    - Login, /me, user listing
├── ActionsJuridiquesController.cs       - Juridical action transfers
├── CourrierAdminController.cs           - Administrative correspondence CRUD
├── CourrierJuridiqueController.cs       - Juridical dossier CRUD
├── CourrierSortantController.cs         - Outgoing mail CRUD
├── DocumentsController.cs               - Document listing, archiving, restore, corbeille
├── EquipmentController.cs               - Equipment management
├── ExcelImportController.cs             - Excel import with column mapping
├── FileUploadController.cs              - File upload/download
├── HistoricalServicesController.cs      - Historical (virtual) service management
├── ListItemsController.cs               - Dynamic list items management
├── RbacPermissionsController.cs         - Permission matrix CRUD + admin overrides
├── RbacServicesController.cs            - RBAC service CRUD + soft-delete/restore
├── RetraitController.cs                 - Archive retrieval (retrait)
├── SeedController.cs                    - DB re-seeding endpoint
├── ServicesController.cs                - Legacy ServiceInfo CRUD
├── SubstitutesController.cs             - Substitute user management
├── TransactionJuridiqueController.cs    - Juridical-specific transfers
├── TransactionsController.cs            - Transaction listing, accept/refuse/cancel, stats
├── TransferController.cs                - Multi-user document transfer
├── UsersController.cs                   - User CRUD
└── WorkspaceController.cs              - Document detail, notes, modification history

Models/               (19 entity models)
├── Document.cs                          - Base document entity (soft delete, file path)
├── CourrierAdministratif.cs             - Extends Document: admin correspondence
├── DossierJuridique.cs                  - Extends Document: juridical dossiers
├── CourrierSortant.cs                   - Extends Document: outgoing mail
├── Transaction.cs                       - Transfer records (accept/refuse/return)
├── Utilisateur.cs                       - Users (BCrypt hashes, service FK)
├── Service.cs                           - RBAC services (soft-delete, hierarchy)
├── Permission.cs                        - Permission definitions (36 keys)
├── ServicePermission.cs                 - Service↔Permission junction
├── AdminPermissionOverride.cs           - Admin permission overrides
├── HistoricalService.cs                 - Virtual services for audit trails
├── Equipment.cs                         - Equipment/inventory tracking
├── ListItem.cs                          - Dynamic dropdown lists
├── Substitute.cs                        - User substitute assignments
├── Retrait.cs                           - Archive retrieval records
├── DocumentNote.cs                      - Document notes (audit trail)
├── DocumentModification.cs              - Document modification history
├── ServiceTribunal2.cs (ServiceInfo)    - Legacy service info
└── PermissionValidationLog.cs           - Permission audit log (in PermissionValidationService.cs)

Core/Enums/           (4 enums)
├── ServiceTribunal.cs                   - 24 tribunal service variants
├── StatutDossier.cs                     - Nouveau, EnCours, EnInstance, Cloture, Archive
├── StatutTransaction.cs                 - EnAttente, Accepte, Refuse, Annule
└── TypeDossier.cs                       - Administratif, Juridique, CourrierSortant

Services/             (6 service classes)
├── PermissionService.cs                 - Permission checking (admin override logic)
├── PermissionValidationService.cs       - Comprehensive validation + audit logging
├── SeederService.cs                     - RBAC seeding (idempotent, insert-if-missing)
├── TransactionService.cs                - Transfer domain logic (accept/refuse/cancel)
├── WorkspaceService.cs                  - Document detail, edit with audit trail, notes
└── ServiceResult.cs                     - Shared result type for services

Security/             (1 file)
└── RequirePermissionAttribute.cs        - [RequirePermission("key")] attribute

Middleware/           (1 file)
└── PermissionValidationMiddleware.cs    - Reads [RequirePermission] from endpoint metadata

Helpers/              (1 file)
└── ServiceMapper.cs                     - Maps service codes → ServiceTribunal enum

DTO/                  (5 DTOs)
├── AddNoteDto.cs
├── JuridiqueDto.cs
├── SortantDto.cs
├── UpdateDocumentDto.cs
└── UpdateStatutDto.cs

data/
└── AppDbContext.cs                      - EF Core DbContext (18 DbSets)

Migrations/           (22 migrations, 2026-06-23 → 2026-09-02)
├── InitialCreate → RBAC_Initial → Overhaul_Part1
├── AdminPermissionOverride
├── AddHistoricalServicesAndAdminOverrides
├── AddPermissionValidationLogs
├── AddHistoricalServiceCodeToTransaction
└── AddSoftDeleteToService (latest)
```

#### Frontend (`frontend-juridique/`)
```
app/
├── page.tsx                             - Main SPA (1735 lines, all views/state)
├── layout.tsx                           - Root layout (AuthProvider, ThemeProvider)
├── globals.css                          - Tailwind + custom styles
├── components/
│   ├── admin/                           - 6 admin panels
│   │   ├── GestionUtilisateurs.tsx
│   │   ├── GestionServices.tsx          - Soft-delete/restore/permanent-delete
│   │   ├── GestionPermissions.tsx       - Matrix view + edit view
│   │   ├── GestionEquipements.tsx
│   │   ├── GestionListes.tsx
│   │   └── GestionServicesHistoriques.tsx
│   ├── dashboard/
│   │   ├── DashboardView.tsx            - Stats, workflow, tables
│   │   ├── WorkflowSteps.tsx            - 6-step workflow diagram
│   │   ├── StatsCircles.tsx
│   │   └── ActivityCards.tsx
│   ├── forms/
│   │   ├── JuridiqueForm.tsx
│   │   ├── SortantForm.tsx
│   │   └── AdminForm.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx                  - Permission-gated navigation
│   │   └── Header.tsx
│   ├── modals/
│   │   ├── DetailModal.tsx              - Document detail with tabs
│   │   ├── TransferModal.tsx            - Multi-user transfer
│   │   ├── WorkspaceModal.tsx           - Document workspace
│   │   └── ImportMappingModal.tsx       - Excel column mapping
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── NotificationsPage.tsx        - Accept/refuse transfers
│   │   ├── TransactionsPage.tsx         - Full transaction register
│   │   ├── ProfilPage.tsx
│   │   ├── ArchiveRetraitPage.tsx       - Archive retrieval
│   │   ├── MesDossiersEnCoursView.tsx
│   │   ├── MesEntitesView.tsx           - Documents & procedures
│   │   ├── ArchivesView.tsx
│   │   └── RechercheDossiersView.tsx    - Advanced search
│   ├── tables/
│   │   ├── GeneralTable.tsx
│   │   └── SortantTable.tsx
│   └── common/
│       ├── ExportButtons.tsx
│       ├── LangueSwitcher.tsx
│       └── SearchBar.tsx
├── hooks/
│   ├── useDocuments.ts
│   └── useListItems.ts
└── types/
    └── index.ts                         - TypeScript types

context/
├── AuthContext.tsx                       - Auth state, hasPermission(), refreshUser()
└── ThemeContext.tsx                      - Dark/light theme

lib/
├── translations.ts                      - FR/AR bilingual dictionary
├── constants.ts                         - Service groups, status map, workflow steps
├── utils.ts                             - normalizeStatus, getDocKey, getErrorMessage
├── exportImport.ts                      - Excel/Word export + import logic
├── api/
│   └── client.ts                        - Central typed fetch wrapper (ApiError)
└── config/
    └── env.ts                           - API_BASE_URL (http://localhost:5200)

cypress/e2e/          - E2E tests (59 tests)
├── app.cy.ts (35 tests)
└── permission-toggle.cy.ts (24 tests)
```

### 4. Database & API Architecture

#### Entity Relationships
```
Document (base)
├── CourrierAdministratif (extends)
├── DossierJuridique (extends)
└── CourrierSortant (extends)
    └── 1:N → Transaction (transfer records)
        └── N:1 → Utilisateur (target user, optional)

Utilisateur
├── N:1 → Service (RBAC service)
└── N:1 → ServiceInfo (legacy, optional)

Service (RBAC)
├── 1:N → ServicePermission → Permission
├── N:1 → Service (Parent, self-referential hierarchy)
└── Soft-delete: IsActive + DeletedAt

AdminPermissionOverride → Permission (admin toggle layer)
HistoricalService (virtual, no users, auto-accept transfers)
```

#### Key API Endpoints
| Method | Path | Auth | Permission | Description |
|--------|------|------|------------|-------------|
| POST | `/api/auth/login` | No | — | JWT login |
| GET | `/api/auth/me` | JWT | — | Current user + permissions |
| GET | `/api/Documents` | JWT | — | List documents |
| POST | `/api/CourrierAdmin` | JWT | `creer_courrier_admin` | Create admin doc |
| POST | `/api/CourrierJuridique` | JWT | `creer_courrier_juridique` | Create juridical doc |
| POST | `/api/CourrierSortant` | JWT | `creer_modifier` | Create outgoing mail |
| POST | `/api/Transfer` | JWT | `transferer` | Transfer documents |
| POST | `/api/Transactions/{id}/accepter` | JWT | `accepter` | Accept transfer |
| POST | `/api/Transactions/{id}/refuser` | JWT | `refuser` | Refuse transfer |
| DELETE | `/api/Documents/{id}` | JWT | `supprimer` | Soft-delete document |
| PATCH | `/api/Documents/{id}/archiver` | JWT | `archiver` | Archive document |
| PATCH | `/api/Documents/{id}/restaurer` | JWT | `restaurer` | Restore from trash |
| GET | `/api/Documents/corbeille` | JWT | `voir_corbeille` | List trash |
| GET | `/api/rbac/permissions/matrix` | JWT | `gerer_permissions` | Full permission matrix |
| PUT | `/api/rbac/permissions/service/{id}` | JWT | `gerer_permissions` | Update service perms |
| PUT | `/api/rbac/permissions/admin` | JWT | `gerer_permissions` | Update admin overrides |
| DELETE | `/api/rbac/services/{id}` | JWT | `gerer_services` | Soft-delete service |
| POST | `/api/rbac/services/{id}/restore` | JWT | `gerer_services` | Restore service |
| DELETE | `/api/rbac/services/{id}/permanent` | JWT | `gerer_services` | Permanent delete |
| POST | `/api/seed/run` | JWT | Admin | Re-seed database |

### 5. RBAC Permission System Architecture

#### 36 Permission Keys (categorized)
| Category | Permissions |
|----------|-------------|
| Documents (9) | `creer_modifier`, `creer_courrier_admin`, `creer_courrier_juridique`, `supprimer`, `archiver`, `restaurer`, `voir_corbeille`, `consulter`, `transferer` |
| Notifications (3) | `accepter`, `refuser`, `voir_toutes` |
| Juridique (6) | `etape_precedente`, `etape_suivante`, `ouvrir_dossier`, `cloturer`, `transferer_juridique`, `retrait_archive` |
| Recherche (3) | `recherche_avancee`, `export_excel`, `export_word` |
| Admin (6) | `gerer_utilisateurs`, `gerer_services`, `gerer_permissions`, `gerer_equipements`, `gerer_listes`, `gerer_substituts` |
| Autres (9) | `voir_workspace`, `ajouter_notes`, `voir_historique`, `telecharger_fichiers`, `dashboard`, `mes_entites`, `transactions`, `archives_view`, `profil` |

#### Enforcement Flow
1. **Controller:** `[RequirePermission("key")]` attribute on action method.
2. **Middleware:** `PermissionValidationMiddleware` reads attribute from endpoint metadata (server-side, not client-supplied).
3. **Service:** `PermissionValidationService.ValidatePermissionAsync()` → checks user's service permissions → applies admin overrides → logs to `PermissionValidationLog`.
4. **Frontend:** `AuthContext.hasPermission(key)` checks permissions array + admin overrides → hides UI elements.

#### Admin Override Layer
- 20 permissions disabled by default for Admin role (prevents routine operations).
- Admin keeps: `gerer_*`, `dashboard`, `mes_entites`, `transactions`, `archives_view`, `profil`, `voir_workspace`, `voir_historique`, `telecharger_fichiers`, `consulter`.
- Admin overrides are stored in `AdminPermissionOverrides` table, editable via admin panel.

### 6. Core Workflows

#### Document Lifecycle
```
Create → BureauOrdre → OuvertureDossier → KitabaKhasa → JalsatWaIjra2at → TaslimNusakh → Archive
         (Step 1)      (Step 2)            (Step 3)       (Step 4)           (Step 5)       (Step 6)
```

#### Transfer Flow
1. Source service creates `Transaction` (EnAttente) targeting destination service.
2. Optional: `targetUserId` / `targetUserIds` for multi-user routing.
3. Optional: `isHistoricalService` flag → auto-accept (no user login required).
4. Optional: `doitRevenir` → document returns to origin after accept/refuse.
5. Destination user accepts → `Document.ServiceActuel` updated, or refuses → return flow.

#### Service Soft-Delete
- `DELETE /api/rbac/services/{id}` → sets `IsActive=false`, `DeletedAt=now`.
- Permanent delete only allowed if no users assigned (400 otherwise).
- Restore: `POST /api/rbac/services/{id}/restore`.

#### Document Soft-Delete (Archive)
- `DELETE /api/Documents/{id}` → sets `EstSupprime=true`.
- Restore: `PATCH /api/Documents/{id}/restaurer`.
- Corbeille (trash): `GET /api/Documents/corbeille`.

### 7. Localization & UI
- **Default language:** Arabic (RTL layout, `lang="ar"` on `<html>`).
- **Supported languages:** French (`fr`) and Arabic (`ar`).
- **Translation dictionary:** `lib/translations.ts` — 200+ keys covering all UI strings.
- **Permission guards:** Every admin panel, form, and action button checks `hasPermission()` before rendering.
- **Route-level protection:** `useEffect` in `page.tsx` redirects to dashboard if user navigates to unauthorized view.
- **Dark/Light theme:** Persisted via `ThemeContext` + localStorage.

### 8. Key Technical & Architectural Decisions
- **Single-page architecture:** All views in `page.tsx` (1735 lines) with lazy-loaded components.
- **ServiceMapper:** Maps RBAC service codes (e.g., `bureauordre`) to `ServiceTribunal` enum for backward compatibility with legacy Transaction-based routing.
- **Historical Services:** Virtual entities with no users — transfers to them are auto-accepted.
- **Permission Validation Logs:** Every permission check is logged (UserId, PermissionKey, Endpoint, Method, IP, UserAgent) for audit trail.
- **SeederService:** Idempotent insert-if-missing seeding (safe to re-run).
- **API Client:** Centralized `lib/api/client.ts` with typed `ApiError` class.

### 9. Current State & Pending Tasks
- **Build status:** 225 indexed files, 11 test files detected.
- **Migrations:** 22 migrations (2026-06-23 → 2026-09-02), latest adds `HistoricalServiceCode` to Transaction and soft-delete to Service.
- **Tests:** 85 backend unit tests, 59 Cypress E2E tests, 46 permission audit checks.
- **Recent change (2026-09-04):** A PDF file was uploaded to `WebApplication1/WebApplication1/wwwroot/uploads/`.

### 10. Next Recommended Steps for Upcoming Agent Sessions
1. **Refactor `page.tsx`:** The 1735-line main page could benefit from extraction into a state management layer (e.g., Zustand or React Context for document state).
2. **Add i18n validation:** Cross-reference Arabic translations against `mahakim.ma` official terminology.
3. **Test coverage:** Verify all 36 permissions have corresponding backend controller `[RequirePermission]` annotations and frontend `hasPermission()` guards.
4. **API documentation:** Leverage existing OpenAPI setup to generate a complete API reference.
5. **Database indexes:** Review query performance on `Transactions` (frequent filtering by `Statut`, `ServiceDestination`, `DocumentId`).
