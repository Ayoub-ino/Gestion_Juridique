# 🏛️ System Architecture Overview — Gestion Juridique

> Document vivant. Mis à jour le 2026-08-16 (Session K — refactoring Phases 1→6).
> Chaque modification de code/schéma/configuration est tracée dans `CHANGELOG_AGENTS.md`.

## 1. Tech Stack Summary

| Layer | Technology |
|---|---|
| **Backend** | ASP.NET Core Web API (.NET 10, `WebApplication1`), monolithe |
| **Frontend** | Next.js 16 (App Router, SPA côté client) + React 19, TypeScript, Tailwind CSS 4 |
| **Database** | SQL Server (LocalDB) via EF Core (`AppDbContext`), 20 migrations appliquées |
| **Auth** | JWT (HS256) + BCrypt, RBAC custom (`PermissionService` + `PermissionValidationService` + middleware) |
| **API contract** | OpenAPI (`/openapi/v1.json`) + types TS générés (`openapi-typescript` → `lib/types/api.generated.ts`) |
| **Tests** | Backend : xUnit (**29 tests**) — permission/RBAC, middleware, seeder, transactions, workspace. E2E : Cypress (**35 tests**) |
| **Tooling** | `WebApplication1.slnx`, monorepo 2 apps + `docs/` + `scripts/` |

**Dépendances clés :** `Microsoft.EntityFrameworkCore.SqlServer`, `BCrypt.Net`, `JwtBearer` (backend) ;
`next`, `react`, `tailwindcss`, `openapi-typescript`, `xlsx`, `jspdf`, `pdfjs-dist`, `mammoth` (frontend).

## 2. Core Architecture (état après Session K)

```
-projet-gestion-juridique-main/
├── WebApplication1/
│   ├── WebApplication1.slnx
│   ├── WebApplication1/
│   │   ├── Program.cs                  ← Composition root : DI, JWT, CORS configurable, seed
│   │   ├── Middleware/PermissionValidationMiddleware.cs   ← (sorti de Program.cs)
│   │   ├── Controllers/                ← 22 contrôleurs THIN (parse → service → mapper)
│   │   ├── Services/                   ← Logique métier : Permission*, Seeder,
│   │   │                                  TransactionService, WorkspaceService, ServiceResult
│   │   ├── Models/                     ← Entités EF (persistance uniquement)
│   │   ├── DTO/                        ← Requêtes/réponses (UpdateDocumentDto, AddNoteDto, SortantDto…)
│   │   ├── Data/AppDbContext.cs · Security/RequirePermissionAttribute.cs
│   │   ├── Core/Enums/ · Helpers/ServiceMapper.cs
│   │   └── Migrations/                 ← 20 migrations
│   └── WebApplication1.Tests/          ← xUnit, 29 tests (Unit: services · middleware)
│
├── frontend-juridique/
│   ├── app/
│   │   ├── page.tsx                    ← Shell (~1 740 lignes, en cours de minceur)
│   │   ├── api/courriers/juridique/    ← Seule route proxy Next.js
│   │   ├── components/                 ← layout/ forms/ tables/ admin/ modals/ dashboard/ pages/
│   │   ├── hooks/                      ← useDocuments, useListItems
│   │   └── types/index.ts              ← Modèles de vue UI (CourrierSimule…)
│   ├── components/ → fusionné dans app/components/pages (LoginPage déplacé)
│   ├── context/ (AuthContext, ThemeContext)
│   ├── lib/
│   │   ├── api/client.ts               ← Wrapper fetch central (get/post/put/patch/delete/send)
│   │   ├── config/env.ts               ← API_BASE_URL (source unique)
│   │   ├── types/api.generated.ts      ← Types générés depuis OpenAPI
│   │   └── translations.ts · constants.ts · utils.ts · exportImport.ts
│   └── cypress/                        ← 35 tests E2E
│
├── docs/architecture-audit.md          ← Ce document
├── scripts/grant-permissions-existing-db.sql
└── CHANGELOG_AGENTS.md
```

**Patterns :** backend = `Controller (fin) → Service (logique) → DbContext`. Frontend = SPA avec
**couche API unique** (`lib/api/client.ts`) — plus aucun `fetch` brut dans les composants.
RBAC piloté par données : ~36 clés de permission seedées par service, `[RequirePermission]`
vérifié côté serveur par le middleware via les métadonnées d'endpoint.

## 3. Data & Business Flow

```
Browser (Next.js SPA)
   │  lib/api/client.ts (Bearer token, erreurs normalisées)
   ▼
POST /api/auth/login → AuthController → PermissionService → JWT (claims role/service/permissions)
   ▼
Requêtes suivantes : api.get/post/... → API :5200
   ▼
PermissionValidationMiddleware → PermissionValidationService (403 si refusé, log dans PermissionValidationLogs)
   ▼
Controllers (fins) → Services (Transaction/Workspace/…) → EF Core → SQL Server
   ▼
Document / DossierJuridique / Transaction persistés ; transferts → Transaction + Notification ;
historique via DocumentModification + HistoricalServices.
```

**Seeding :** `SeederService.SeedAsync()` au démarrage (tables vides) + `POST /api/seed/run` (admin, force mode).

## 4. Ce qui a changé pendant le refactoring (Session K)

### ✅ Fait (Phases 1→6)
1. **Middleware** sorti de `Program.cs` → `Middleware/` (fichier dédié).
2. **Prisma supprimé** (dépendance morte) ; **LoginPage** unifié dans `app/components/pages/`.
3. **Client API unique** `lib/api/client.ts` + `lib/config/env.ts` — plus aucun `BASE_URL` dupliqué
   (6 occurrences) ni `fetch` brut dans les composants (24 dans `page.tsx` migrés).
4. **`page.tsx` découpé** : 2226 → ~1740 lignes ; vues extraites = `MesEntitesView`,
   `ArchivesView`, `RechercheDossiersView` (dashboard/forms/admin déjà componentisés).
5. **Couche service backend** : `TransactionService`, `WorkspaceService`, `ServiceResult` ;
   `TransactionsController` 430→~120 lignes, `WorkspaceController` 367→~100 lignes ; 10 tests ajoutés.
6. **Types générés** : `openapi-typescript` + `npm run typegen` → `lib/types/api.generated.ts` ;
   `any[]` de la coquille typés.
7. **Durcissement** : clé JWT hors `appsettings.json` (dev → Development, prod → env `Jwt__Key`) ;
   CORS via `Cors:AllowedOrigins`.

### 🟠 Restants / recommandations
1. **`page.tsx` encore ~1 740 lignes** : extraire l'état des formulaires (40+ `useState`) dans un
   hook dédié (ex. `useCourrierForms`) ou un contexte — prochaine étape naturelle.
2. **Contrats dupliqués** : `app/types/index.ts` (modèles de vue UI) reste manuel — acceptable car ce
   sont des modèles de présentation, pas des DTO API ; les DTO API sont générés.
3. **JWT en localStorage** (XSS) ; pas de refresh token — envisager cookies httpOnly à terme.
4. **Identifiants de seed par défaut** (`admin/admin123`) — à forcer via env en production.
5. **Lint frontend non vert** (~40 erreurs préexistantes : `cur: any` partout, `setState-in-effect`
   du nouveau plugin react-hooks) — chantier distinct ; `tsc` et le build sont propres.
6. **DTO non générés pour les projections anonymes** des contrôleurs — la génération OpenAPI couvre
   les DTOs de requête ; les réponses anonymes restent `object` (à migrer vers des DTOs nommés si on
   veut des types de réponse stricts).
7. **Contrôleurs encore « épais »** : `FileUploadController` (337 l), `CourrierAdminController` (300 l) —
   même extraction service que Transactions/Workspace.

### ✅ Points forts
- Couche API frontend unique (auth header, erreurs, FormData) — suppression massive de duplication.
- Services backend testables ; 29 tests unitaires + 35 tests E2E verts après refactoring complet.
- CORS et JWT configurables ; secrets hors dépôt.
- Historique de migrations complet ; CHANGELOG_AGENTS.md trace chaque action.
