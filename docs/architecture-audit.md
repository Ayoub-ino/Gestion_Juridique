# 🏛️ System Architecture Overview — Gestion Juridique

> Audit réalisé le 2026-08-04. Aucun code n'a été modifié au moment de l'audit ;
> les corrections issues de ce rapport sont consignées dans `CHANGELOG_AGENTS.md`.

## 1. Tech Stack Summary

| Layer | Technology |
|---|---|
| **Backend** | ASP.NET Core Web API (.NET 10, `WebApplication1`), monolithe |
| **Frontend** | Next.js 15 (App Router, SPA côté client) + React, TypeScript, Tailwind CSS |
| **Database** | SQL Server (LocalDB) via EF Core (`AppDbContext`), migrations code-first |
| **Auth** | JWT (HS256) + BCrypt, RBAC custom (PermissionService + middleware) |
| **ORM frontend** | Prisma `schema.prisma` présent mais **inutilisé** — le frontend appelle l'API .NET en `fetch` direct |
| **Tests** | Cypress E2E (nouvellement ajouté) — aucun test backend unitaire/intégration |
| **Tooling** | `WebApplication1.slnx`, un seul dépôt contenant les 2 apps + docs `.slim/` |

**Dépendances clés :** `Microsoft.EntityFrameworkCore.SqlServer`, `BCrypt.Net`, `JwtBearer`,
`System.IdentityModel.Tokens.Jwt` (backend) ; `next`, `react`, `tailwindcss`, `prisma` (déclaré, inutilisé) (frontend).

## 2. Core Architecture

```
-projet-gestion-juridique-main/
├── WebApplication1/                  ← Backend .NET (port 5200)
│   └── WebApplication1/
│       ├── Program.cs                ← Point d'entrée : DI, JWT, CORS, seed au démarrage
│       ├── Controllers/              ← 22 contrôleurs (Auth, Documents, Transfer,
│       │                               Transaction*, Courrier*, RBAC*, Equipment, …)
│       ├── Models/                   ← Entités EF (Document, DossierJuridique,
│       │                               Transaction, Utilisateur, Service, Permission…)
│       ├── Data/AppDbContext.cs      ← DbContext EF Core (SQL Server)
│       ├── Services/                 ← PermissionService, PermissionValidationService
│       ├── Security/                 ← RequirePermissionAttribute (nouveau)
│       ├── Core/Enums/               ← ServiceTribunal, StatutDossier, StatutTransaction
│       └── Migrations/               ← 13+ migrations (RBAC_Initial → AddPermissionValidationLogs)
│
├── frontend-juridique/               ← Frontend Next.js (port 3000)
│   ├── app/
│   │   ├── page.tsx                  ← Shell SPA (dashboard, modales, langue)
│   │   ├── components/               ← layout/ forms/ tables/ admin/ modals/ dashboard/
│   │   ├── hooks/                    ← useDocuments, useListItems
│   │   ├── api/courriers/juridique/  ← Unique route API Next.js (proxy fin)
│   │   └── types/index.ts            ← Interfaces TS partagées
│   ├── context/                      ← AuthContext (JWT), ThemeContext
│   ├── lib/                          ← translations (fr/ar ~650 clés), utils, exportImport
│   └── cypress/                      ← Suite E2E (~25 tests)
│
└── docs/architecture-audit.md        ← Ce rapport
```

**Patterns :** backend = monolithe **Controller → Service → DbContext**. Frontend = **SPA client**
(appels API directs depuis le navigateur, sauf une route proxy). RBAC piloté par données :
~40 clés de permission seedées par service, vérifiées via les claims JWT et le
`PermissionValidationMiddleware` (désormais piloté par attributs `[RequirePermission]`).

## 3. Data & Business Flow

```
Browser (Next.js SPA)
   │  POST /api/auth/login {login, password}
   ▼
AuthController → BCrypt verify → PermissionService.GetUserPermissionsAsync()
   │  JWT émis : claims role, service + claims "permission" (expiration 8h)
   ▼
Requêtes suivantes : fetch(`${NEXT_PUBLIC_API_URL}/api/...`, Bearer token)
   ▼
PermissionValidationMiddleware (global)
   │  lit [RequirePermission("key")] sur l'endpoint mappé → PermissionValidationService
   │  vérifie les permissions (ServicePermissions / AdminPermissionOverrides) → 403 si refusé
   │  journalise chaque contrôle dans PermissionValidationLogs
   ▼
Controllers → EF Core (AppDbContext) → SQL Server
   ▼
Les lignes Document / DossierJuridique / Transaction sont persistées ; les transferts créent
des Transaction + Notification ; l'historique via HistoricalServices.
```

**Seeding :** `Program.cs` exécute les migrations puis seed à chaque démarrage — admin
(`admin/admin123`), 9 services RBAC, ~40 permissions, matrice de permissions par service,
21 overrides admin (désactivés), 20 services historiques, 1 utilisateur démo par service.

## 4. Key Observations / Pain Points

### 🔴 Corrigés (voir CHANGELOG_AGENTS.md)
1. **`PermissionValidationLogs` DbSet manquant** — le code référençait `_context.PermissionValidationLogs`
   sans DbSet ni migration → erreur de compilation. → **Corrigé** : DbSet ajouté + migration
   `AddPermissionValidationLogs`.
2. **`PermissionValidationService` jamais enregistré en DI** → crash au runtime. → **Corrigé**.
3. **`PermissionValidationMiddleware` enregistré 2 fois** → validation dupliquée. → **Corrigé**.
4. **Vérification de permission pilotée par le client** (`?permission=` en query string) →
   contournable en omettant le paramètre. → **Corrigé** : `[RequirePermission]` lu depuis les
   métadonnées d'endpoint (côté serveur).
5. **Backend non compilable** : `var override` (mot-clé C#) dans `PermissionValidationService.cs`
   + doublon `UpdateAdminOverrides` dans `RbacPermissionsController.cs`. → **Corrigés**.

### 🟠 Restants / recommandations
6. **Clé JWT en clair dans `appsettings.json`** + identifiants par défaut `admin/admin123` seedés.
7. **CORS limité à `http://localhost:3000`** — aucun origine de production.
8. **JWT en localStorage** (`AuthContext`) → exposable au XSS ; pas de refresh token.
9. **Double nom de variable d'env** : `NEXT_PUBLIC_API_URL` vs `NEXT_PUBLIC_BACKEND_URL` (route proxy).
10. **Prisma = poids mort** : dépendance + schéma déclarés, jamais utilisés.
11. **Contrats dupliqués** : `app/types/index.ts` re-déclare des DTO backend sans contrat partagé/OpenAPI.
12. **Logique de seed dans `Program.cs`** (600+ lignes) — à extraire dans un service `Seeder`.
13. **Zéro test backend** ; les tests Cypress dépendent des identifiants de seed.
14. **Permissions non décorées restantes** : `supprimer`, `archiver`, notes, mouvements juridiques,
    retraits — laissées en `[Authorize]` car non câblées côté frontend / matrice de seed
    incohérente (voir CHANGELOG). À mapper proprement quand le frontend gatera ces actions.

### ✅ Points forts
- Système i18n bilingue propre (fr/ar, ~650 clés, support RTL) entièrement câblé.
- Modèle RBAC sensé (clés uniques, matrice par service, overrides admin).
- Exception handler global + sérialisation JSON des enums.
- Historique de migrations complet reflétant l'évolution réelle du schéma.
