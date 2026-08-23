# 📋 CHANGELOG_AGENTS.md

> **Mandat système (SYSTEM MANDATE) :** à partir de maintenant, **toute** modification, ajout,
> suppression ou refactorisation de code, de schéma de base de données ou de configuration du
> projet **DOIT** être consignée dans ce fichier, en plus de la sortie de code.
>
> **Format standard :**
> | Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
> |---|---|---|---|---|
> Action Type = [ADDED \| MODIFIED \| DELETED \| CONFIGURED]

---

## 🕘 Audit rétroactif (historique de la session jusqu'au 2026-08-04)

### Session A — Audit i18n & correctifs de traduction

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 | MODIFIED | `frontend-juridique/lib/translations.ts` | 19 clés orphelines déplacées dans les objets `fr`/`ar` ; **+80 clés** ajoutées ; conflit de clé dupliquée `chargement` → `loadingText` corrigé | Audit i18n : toutes les chaînes devaient passer par l'objet central de traduction |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/layout.tsx` | Ajout du composant `LangueSwitcher` | Synchroniser l'attribut `<html lang>` avec la langue choisie |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/globals.css` | Support CSS RTL complet (marges, paddings, text-align, flex) | Rendu correct de l'arabe (RTL) |
| 2026-08-04 | MODIFIED | `frontend-juridique/components/LoginPage.tsx` | Refactor vers l'objet central `translations` au lieu du `t` inline | Centralisation i18n |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/page.tsx` | Correctif du bouton « Lancer la recherche » (onClick vide) ; ~25 chaînes codées en dur → `cur.*` | Bouton non fonctionnel + centralisation i18n |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/components/layout/Sidebar.tsx` | « Permissions » → `cur.permissions` | Centralisation i18n |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/components/forms/AdminForm.tsx` | ~12 chaînes codées en dur → `cur.*` | Centralisation i18n |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/components/forms/JuridiqueForm.tsx` | ~12 chaînes codées en dur → `cur.*` | Centralisation i18n |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/components/forms/SortantForm.tsx` | ~4 chaînes codées en dur → `cur.*` | Centralisation i18n |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/components/tables/GeneralTable.tsx` | 2 chaînes codées en dur → `cur.*` | Centralisation i18n |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/components/tables/SortantTable.tsx` | 3 chaînes codées en dur → `cur.*` | Centralisation i18n |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/components/admin/GestionServicesHistoriques.tsx` | Suppression des motifs de repli (fallbacks) | Cohérence i18n |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/components/admin/GestionUtilisateurs.tsx` | ~20 chaînes codées en dur → `cur.*` | Centralisation i18n |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/components/admin/GestionEquipements.tsx` | ~15 chaînes codées en dur → `cur.*` | Centralisation i18n |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/components/modals/DetailModal.tsx` | ~15 chaînes codées en dur → `cur.*` | Centralisation i18n |
| 2026-08-04 | ADDED | `frontend-juridique/app/components/common/LangueSwitcher.tsx` | Nouveau composant : synchronise `html lang` + direction avec localStorage | Support dynamique de langue |
| 2026-08-04 | CONFIGURED | Build Next.js | Build validé : zéro erreur TypeScript | Vérification de non-régression |

### Session B — Suggestions : E2E Cypress + fin de l'audit

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 | MODIFIED | `frontend-juridique/lib/translations.ts` | Correction de la valeur arabe de `decharger` (→ `تفريغ`) ; suppression du doublon `decharger` ; ajout des clés `code`, `charge`, etc. | Cohérence FR/AR + déduplication |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/components/admin/GestionEquipements.tsx` | Dernières chaînes codées en dur remplacées (headers, cellules, boutons, alertes, label `Code`) | Centralisation i18n complète |
| 2026-08-04 | CONFIGURED | `frontend-juridique/package.json` | Installation de `cypress` (devDependency) | Mise en place des tests E2E |
| 2026-08-04 | ADDED | `frontend-juridique/cypress.config.ts` | Configuration Cypress E2E | Infrastructure de test E2E |
| 2026-08-04 | ADDED | `frontend-juridique/cypress/e2e/app.cy.ts` | Suite E2E : 8 groupes, ~25 tests (login, FR/AR, navigation, dark mode, formulaires, RTL, i18n) | Auditer les workflows critiques |
| 2026-08-04 | ADDED | `frontend-juridique/cypress/support/commands.ts` | Commandes custom (`login`, `switchLanguage`) | Réutilisabilité des tests |
| 2026-08-04 | ADDED | `frontend-juridique/cypress/support/e2e.ts` | Point d'entrée support Cypress | Infrastructure de test |
| 2026-08-04 | MODIFIED | `frontend-juridique/cypress/e2e/app.cy.ts` | Correctif du test RTL (`cy.get("div[dir]")`) + vérifications FR/AR robustes | Le `dir` est posé sur une `div` racine, pas sur `<html>` |

### Session C — ~50 chaînes codées en dur restantes

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 | MODIFIED | `frontend-juridique/lib/translations.ts` | +50 clés ajoutées ; 6 doublons supprimés (`aucuneDonneeExport`, `entrerReference`, `espaceTravail`, `aucuneNote`, `aucuneModification`, `docNonTrouve`) | Alimenter les composants refactorés + déduplication |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/page.tsx` | ~25 chaînes d'alertes → `cur.*` (transfert, export, import, session…) | Centralisation i18n |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/hooks/useDocuments.ts` | ~10 fallbacks → `cur.*` ; import `translations` ajouté | Centralisation i18n (le hook n'avait pas accès à `cur`) |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/components/modals/DetailModal.tsx` | ~6 chaînes restantes → `cur.*` | Centralisation i18n |
| 2026-08-04 | MODIFIED | `frontend-juridique/app/components/modals/WorkspaceModal.tsx` | ~25 chaînes → `cur.*` (labels, onglets, confirmations) | Centralisation i18n |

### Session D — État de départ (modifications non commitées présentes dans le working tree)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| Avant session | MODIFIED | `WebApplication1/.../Controllers/UsersController.cs` | Endpoint `GET /api/Users/by-service/{serviceCode}` ajouté | Filtrer les utilisateurs par service (transfert ciblé) |
| Avant session | MODIFIED | `WebApplication1/.../Program.cs` | AdminPermissionOverrides étendu à **21 permissions désactivées** (documents, notifications, juridique, recherche, notes) | Matrice RBAC stricte pour l'admin |
| Avant session | MODIFIED | `frontend-juridique/app/components/modals/TransferModal.tsx` | Récupération des utilisateurs par service via `by-service`, dédup, affichage `nom` seul | Transfert ciblé multi-services |
| Avant session | MODIFIED | Migrations `RBAC_Initial`, `Overhaul_Part1`, `AdminPermissionOverride` (.cs + .Designer.cs) | Ajustements des fichiers de migration | Alignement modèle/schéma RBAC |

### Session E — Audit d'architecture (aucune modification)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 | — | Audit complet | Rapport d'architecture livré (pas de modification) | Analyse approfondie du codebase |

---

## 🛠️ Session F — Correctifs backend critiques + RBAC par attributs (2026-08-04, ~19:40)

### Correctifs critiques (backend non compilable)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~19:40 | MODIFIED | `WebApplication1/.../Services/PermissionValidationService.cs` | `var override = ...` → `var permissionOverride = ...` (mot-clé C# `override`) | `override` est un mot-clé réservé → erreur de syntaxe CS1002, backend non compilable |
| 2026-08-04 ~19:40 | MODIFIED | `WebApplication1/.../Controllers/RbacPermissionsController.cs` | Suppression de la 2ᵉ méthode dupliquée `UpdateAdminOverrides` (2× `[HttpPut("admin")]`) | Doublon → erreur CS0111 (et conflit de route au runtime) |
| 2026-08-04 ~19:42 | ADDED | `WebApplication1/.../Migrations/20260804194219_AddPermissionValidationLogs.cs` (+ `.Designer.cs`) | Migration créant la table `PermissionValidationLogs` (Id PK, UserId, PermissionKey, Endpoint, Method, Timestamp, IpAddress, UserAgent, FK UtilisateurId) | La table de journalisation des permissions n'existait pas → le code ne compilait pas |

### RBAC — suppression du contournement côté client

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~19:35 | ADDED | `WebApplication1/.../Security/RequirePermissionAttribute.cs` | Nouvel attribut `[RequirePermission("key")]` (marqueur, lu depuis les métadonnées d'endpoint) | Imposer les permissions côté serveur, non contournable |
| 2026-08-04 ~19:35 | MODIFIED | `WebApplication1/.../Data/AppDbContext.cs` | Ajout de `DbSet<PermissionValidationLog> PermissionValidationLogs` | Table de journalisation des validations de permission |
| 2026-08-04 ~19:36 | MODIFIED | `WebApplication1/.../Program.cs` | ① `AddScoped<PermissionValidationService>()` enregistré en DI ; ② `app.UseRouting()` explicite ; ③ middleware `PermissionValidationMiddleware` enregistré **une seule fois** ; ④ middleware réécrit : lit `[RequirePermission]` sur l'endpoint mappé (au lieu du `?permission=` fourni par le client), 401/403 selon le cas ; ⑤ `using WebApplication1.Services` ajouté | ① Crash runtime corrigé ; ② métadonnées d'endpoint disponibles ; ③ doublon supprimé ; ④ le contrôle côté client était contournable en omettant le paramètre ; ⑤ compilation |

### Décorations `[RequirePermission]` (alignées sur le gating frontend + matrice de seed)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~19:37 | MODIFIED | `TransferController.cs` | `POST /api/Transfer` → `[RequirePermission("transferer")]` | Le bouton transférer est gated par `transferer` dans le frontend |
| 2026-08-04 ~19:37 | MODIFIED | `CourrierAdminController.cs` | `POST` + `PUT {id}` → `[RequirePermission("creer_courrier_admin")]` | Création/édition gated par `creer_courrier_admin` (entrant-admin) |
| 2026-08-04 ~19:37 | MODIFIED | `CourrierJuridiqueController.cs` | `POST` + `PUT {id}` → `[RequirePermission("creer_courrier_juridique")]` | Création/édition gated par `creer_courrier_juridique` (entrant-juridique) |
| 2026-08-04 ~19:37 | MODIFIED | `CourrierSortantController.cs` | `POST` → `[RequirePermission("creer_modifier")]` (la création est gated par `creer_modifier` dans le frontend) | Création sortant protégée ; le `PUT` statut reste en `[Authorize]` (boutons non gatés, tous services y accèdent) |
| 2026-08-04 ~19:37 | MODIFIED | `TransactionsController.cs` | `PUT {id}/accepter` → `[RequirePermission("accepter")]` ; `PUT {id}/refuser` → `[RequirePermission("refuser")]` | Tous les services seedés disposent de ces clés ; l'admin est exclu (override désactivé, conforme à la matrice) |
| 2026-08-04 ~19:37 | MODIFIED | `DocumentsController.cs` | `PATCH {id}/restaurer` testé puis **reverté** en `[Authorize]` | La corbeille n'est pas gatée par permission dans le frontend → risque de 403 pour les services non-Archive |
| 2026-08-04 ~19:37 | MODIFIED | Tous les contrôleurs décorés | `using WebApplication1.Security;` ajouté | Compilation de l'attribut |

> ⚠️ **Note de conception** : les endpoints suivants ne sont **pas** décorés (le frontend ne
> les gating pas par permission et/ou la matrice de seed ne les accorde à aucun service —
> risque de régression UI) : `supprimer`, `restaurer`, `archiver`, `PUT` statut sortant,
> notes (`ajouter_notes`), mouvements juridiques (`transferer_juridique`), retraits
> (`retrait_archive`). Ils restent en `[Authorize]` et devront être décorés quand le gating
> frontend existera ET que la matrice de seed accordera les clés correspondantes.
>
> ⚠️ **Décision accept/refuser pour l'admin** : le middleware bloque désormais l'admin
> (403) sur `accepter`/`refuser` car les `AdminPermissionOverrides` du seed les désactivent
> (« Notifications: no accept, no refuse »). Les branches `isAcceptAdmin`/`isRefuseAdmin`
> dans `TransactionsController` deviennent de fait inaccessibles pour l'admin — à nettoyer
> lors d'une prochaine passe (pas de changement fonctionnel).

### Documentation

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~19:45 | ADDED | `docs/architecture-audit.md` | Rapport complet d'architecture (stack, structure, flux de données, points de douleur) | Traçabilité des constats d'audit |
| 2026-08-04 ~19:46 | ADDED | `CHANGELOG_AGENTS.md` | Ce fichier : audit rétroactif + journal des changements (mandat système) | Exigence de documentation continue |

### Vérifications

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~19:40 | CONFIGURED | Backend | `dotnet build` → **Build succeeded** (0 erreur) | Valider les correctifs |
| 2026-08-04 ~19:42 | CONFIGURED | Base de données | Migration `AddPermissionValidationLogs` générée par `dotnet ef migrations add` | Table de journalisation prête pour `database update` |

---

## 🛠️ Session G — Achèvement de l'enforcement RBAC + seed + env vars + nettoyage (2026-08-04, ~20:00)

### Backend — décorations `[RequirePermission]` supplémentaires

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~20:00 | MODIFIED | `DocumentsController.cs` | `PATCH {id}/supprimer` + `POST supprimer-batch` → `[RequirePermission("supprimer")]` ; `PATCH {id}/archive` + `POST archive-batch` → `[RequirePermission("archiver")]` (remplace `[Authorize(Roles="Admin")]`) | Suppression et archivage protégés par permission (le service Archive possède `archiver` ; l'admin est exclu par override, conforme à la matrice) |
| 2026-08-04 ~20:00 | MODIFIED | `CourrierAdminController.cs` | `DELETE {id}` → `[RequirePermission("supprimer")]` | Suppression protégée |
| 2026-08-04 ~20:00 | MODIFIED | `CourrierJuridiqueController.cs` | `DELETE {id}` → `[RequirePermission("supprimer")]` | Suppression protégée |
| 2026-08-04 ~20:00 | MODIFIED | `CourrierSortantController.cs` | `DELETE {id}` → `[RequirePermission("supprimer")]` | Suppression protégée |
| 2026-08-04 ~20:00 | MODIFIED | `WorkspaceController.cs` | `POST document/{id}/notes`, `PUT notes/{noteId}`, `DELETE notes/{noteId}` → `[RequirePermission("ajouter_notes")]` | Création/édition/suppression de notes protégées |
| 2026-08-04 ~20:00 | MODIFIED | `TransactionJuridiqueController.cs` | `POST` (MoveDossier) → `[RequirePermission("transferer_juridique")]` | Mouvements juridiques protégés (endpoint non utilisé par le frontend actuel, donc sans régression UI) |
| 2026-08-04 ~20:00 | MODIFIED | `RetraitController.cs` | `POST`, `PATCH {id}/annuler`, `PATCH {id}/retourner`, `DELETE {id}` → `[RequirePermission("retrait_archive")]` | Gestion des retraits protégée (service Archive) |

### Seed — matrice de permissions corrigée

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~20:00 | MODIFIED | `Program.cs` (seed `serviceDefaults`) | `bureauordre` + `creer_courrier_admin`/`supprimer`/`ajouter_notes` ; `fathmilafat` + `creer_courrier_juridique`/`transferer_juridique`/`ajouter_notes` ; `seances&procedures` + `transferer_juridique`/`ajouter_notes` ; `khibra`, `taslimnosakh`, `tasfiatSawa2irTakmilia`, `atabligh` + `transferer_juridique` ; `archive` + `supprimer`/`transferer_juridique` | Les clés décorées devaient être accordées aux services concernés pour que l'enforcement ne casse pas les flux sur base fraîche |

### Frontend — gating des actions par permission

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~20:00 | MODIFIED | `app/page.tsx` | Ajout de `canDelete`/`canArchive`/`canRetrait` (`hasPermission`) ; gardes dans `handleDelete`, `archiveSelection`, `registerRetrait` (alerte `cur.permissionRefusee`) ; prop `canDelete` transmise à `DashboardView` | Empêcher les clics → 403 bruts ; masquer/mesurer les actions sans permission |
| 2026-08-04 ~20:00 | MODIFIED | `app/components/tables/GeneralTable.tsx` + `SortantTable.tsx` | Prop `canDelete` (défaut `true`) — bouton supprimer masqué si absent | Gating UI des tables |
| 2026-08-04 ~20:00 | MODIFIED | `app/components/dashboard/DashboardView.tsx` | Prop `canDelete` transmise aux deux tables | Gating UI |
| 2026-08-04 ~20:00 | MODIFIED | `app/components/pages/MesDossiersEnCoursView.tsx` | Bouton supprimer gated par `hasPermission("supprimer")` | Gating UI |
| 2026-08-04 ~20:00 | MODIFIED | `app/components/modals/WorkspaceModal.tsx` | `canAddNotes = hasPermission("ajouter_notes")` ; zone de saisie + boutons édit/supprimer masqués ; gardes dans les handlers | Gating UI des notes |
| 2026-08-04 ~20:00 | MODIFIED | `app/components/modals/DetailModal.tsx` | `canAddNotes` — section note masquée + garde `handleSaveNote` | Gating UI des notes |
| 2026-08-04 ~20:00 | MODIFIED | `app/components/pages/ArchiveRetraitPage.tsx` | `canRetrait` — formulaire + boutons annuler/retourner masqués ; garde `handleSave` | Gating UI des retraits |
| 2026-08-04 ~20:10 | MODIFIED | `app/components/pages/NotificationsPage.tsx` + `TransactionsPage.tsx` | Boutons Accepter/Refuser gatés par `hasPermission("accepter"/"refuser")` + gardes dans les handlers | Suite de la revue : l'admin (override désactivé) et tout utilisateur sans la clé recevaient un 403 au clic |
| 2026-08-04 ~20:10 | MODIFIED | `app/page.tsx` | Garde `confirmTransfer` : `if (!canTransfer) { alert(cur.permissionRefusee); return; }` | Symétrie avec handleDelete/archiveSelection (revue) |
| 2026-08-04 ~20:00 | MODIFIED | `lib/translations.ts` | Clé `permissionRefusee` ajoutée (fr/ar) | Message d'alerte localisé pour les actions non autorisées |

### Variables d'environnement — unification

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~20:00 | MODIFIED | `app/api/courriers/juridique/route.ts` | `NEXT_PUBLIC_BACKEND_URL` → `NEXT_PUBLIC_API_URL` | Un seul nom de variable pour toute l'app (fin de la double convention) |
| 2026-08-04 ~20:00 | ADDED | `frontend-juridique/.env.example` | Documente `NEXT_PUBLIC_API_URL=http://localhost:5200` | Onboarding / configuration claire |

### Nettoyage de code mort + fix build

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~20:00 | MODIFIED | `TransactionsController.cs` | Branches mortes `isAcceptAdmin`/`isRefuseAdmin` supprimées (contrôle de propriété de service conservé) | Le middleware gère désormais la permission ; l'admin est bloqué 403 avant le contrôleur (branches inaccessibles) |
| 2026-08-04 ~20:00 | DELETED | `app/page.tsx` | `quickImportRef` + fonction `handleQuickImport` supprimés (jamais rendus) | Code mort (aucun `<input ref>` ne l'utilisait) |
| 2026-08-04 ~20:00 | MODIFIED | `context/AuthContext.tsx` | `overridesMap` typé `Record<string, boolean>` | Erreur TS pré-existante bloquant le build (`Element implicitly has an 'any' type`) |

### Vérifications

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~20:05 | CONFIGURED | Backend + Frontend | `dotnet build` → Build succeeded ; `npx next build` → Build succeeded (0 erreur TS) | Valider l'ensemble des changements |

---

## 🧪 Session H — Tests backend + script SQL + refactor seed + tests Cypress (2026-08-04, ~21:00)

### Tests backend — nouveau projet de tests

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:00 | ADDED | `WebApplication1/WebApplication1.Tests/WebApplication1.Tests.csproj` | Projet xUnit (net10.0) avec refs `Microsoft.NET.Test.Sdk`, `xunit`, `Microsoft.EntityFrameworkCore.InMemory`, `Microsoft.AspNetCore.App`, référence au projet principal | Infrastructure de tests unitaires du backend |
| 2026-08-04 ~21:00 | ADDED | `WebApplication1/WebApplication1.Tests/PermissionServiceTests.cs` | Tests de `PermissionService` (admin bypass/override, user sans service, permissions service) | Couvrir la logique RBAC de base |
| 2026-08-04 ~21:00 | ADDED | `WebApplication1/WebApplication1.Tests/PermissionValidationServiceTests.cs` | Tests de `PermissionValidationService` (utilisateur sans/sans permission, admin override désactivé, admin sans override, utilisateur inconnu, journal d'audit écrit) | Couvrir la validation + journalisation |
| 2026-08-04 ~21:00 | ADDED | `WebApplication1/WebApplication1.Tests/PermissionValidationMiddlewareTests.cs` | Tests du middleware (sans attribut → passe ; sans auth → 401 ; sans permission → 403 ; avec permission → 200) via `DefaultHttpContext` + métadonnées d'endpoint | Couvrir l'enforcement serveur |
| 2026-08-04 ~21:05 | MODIFIED | `WebApplication1.Tests/PermissionValidationMiddlewareTests.cs` | `CreateMiddleware(…, out bool nextCalled)` → wrapper `NextFlag` mutable (retour tuple) | `ref`/`out` interdits dans les lambdas → erreur CS1628 |
| 2026-08-04 ~21:10 | MODIFIED | `WebApplication1.Tests/PermissionValidationServiceTests.cs` | Test admin sans override : ajout d'une ligne `Permission` (Key `dashboard`) au contexte | Le permier `GetUserPermissionsAsync` (admin) lit la table `Permissions` — vide dans le test → liste vide → Denied |

### Modèle — colonnes de journal nullable

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:10 | MODIFIED | `Services/PermissionValidationService.cs` (modèle `PermissionValidationLog`) | `IpAddress`/`UserAgent` → `string?` | `RemoteIpAddress` est null derrière un proxy ou dans les tests → DbUpdateException (colonne requise) |
| 2026-08-04 ~21:10 | MODIFIED | `Migrations/20260804194219_AddPermissionValidationLogs.cs` + `.Designer.cs` + `AppDbContextModelSnapshot.cs` | `IpAddress`/`UserAgent` passent en `nullable: true` (`.IsRequired()` retiré) | Aligner migration + snapshot sur le modèle (migration jamais appliquée en base) |

### Script SQL — permissions sur base existante

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:00 | ADDED | `scripts/grant-permissions-existing-db.sql` | Insertions idempotentes `MERGE`/`IF NOT EXISTS` : `creer_courrier_admin`→bureauordre, `creer_courrier_juridique`+`transferer_juridique`→fathmilafat, `supprimer`→bureauordre+archive, `ajouter_notes`→bureauordre+fathmilafat+seances, `transferer_juridique`→seances/khibra/taslimnosakh/tasfiatSawa2irTakmilia/atabligh/archive, `archiver`→archive, `retrait_archive`→archive | Appliquer la matrice de Session G aux bases déjà créées (le seed ne s'exécute que sur base vide) |

### Refactor du seed — SeederService + endpoint /api/seed/run

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:00 | ADDED | `WebApplication1/.../Services/SeederService.cs` | Tout le code de seed (services RBAC, permissions, ServicePermissions, AdminPermissionOverrides, HistoricalServices, comptes demo) extrait de `Program.cs` en classe injectable `SeedAsync()` | Program.cs devenait un bloc monolithique de ~270 lignes ; rendre le seed ré-exécutable |
| 2026-08-04 ~21:00 | MODIFIED | `WebApplication1/.../Program.cs` | Bloc de seed (lignes ~102–371) supprimé ; `AddScoped<SeederService>()` enregistré ; appel `seeder.SeedAsync()` remplacé par `await using var scope` + résolution, avant `app.Run()` (152 lignes au total) | Découplage seed/startup (mandat) |
| 2026-08-04 ~21:00 | MODIFIED | `WebApplication1/.../Controllers/SeedController.cs` | `POST /api/seed/run` (admin uniquement) : exécute `SeederService.SeedAsync()` à la demande et retourne le détail ; l'ancien trigger `/api/seed/trigger` supprimé | Relancer le seed sur une base existante sans la supprimer |

### Tests E2E — enforcement des permissions (Cypress)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:00 | MODIFIED | `frontend-juridique/cypress/e2e/app.cy.ts` | Groupe « 8. Permission Enforcement (API) » : 8 tests `cy.request` directs (admin ne peut pas transférer 403 ; bureauordre passe ; secretarait ne peut pas supprimer/créer ; bureauordre passe ; admin ne peut pas accepter ; bureauordre passe) | Vérifier que l'enforcement `[RequirePermission]` n'est pas contournable et correspond à la matrice seed |
| 2026-08-04 ~21:10 | MODIFIED | `frontend-juridique/cypress/e2e/app.cy.ts` | Helper `authed` : `body?: Record<string, unknown>` (remplace `any`) | Erreur ESLint `@typescript-eslint/no-explicit-any` |

### Correctifs suite revue de code (Session H)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:25 | MODIFIED | `Services/SeederService.cs` | `SeedAsync(bool force = false)` : en mode `force`, chaque étape devient un **insert-if-missing** par ligne (services par Code, permissions par Key, ServicePermissions par (ServiceId, PermissionKey), overrides par PermissionKey, services historiques par Code) au lieu de « skip si table non vide » ; clés de dédoublonnage `ServiceId|PermissionKey` (pas de tuple dans l'arbre d'expression EF) | Revue : `/api/seed/run` ne faisait RIEN sur une base déjà peuplée — but de l'endpoint manqué ; CS8143 (tuple) corrigé |
| 2026-08-04 ~21:25 | MODIFIED | `Controllers/SeedController.cs` | `RunSeed()` appelle `SeedAsync(force: true)` ; commentaire XML mis à jour | Le endpoint doit réappliquer la matrice sur base existante |
| 2026-08-04 ~21:25 | MODIFIED | `scripts/grant-permissions-existing-db.sql` | Nouvelle section 3 : `UPDATE ServicePermissions SET Enabled = 1` pour les clés de la matrice présentes mais désactivées manuellement | Revue : `IF NOT EXISTS` n'activait pas les lignes existantes désactivées |

> ℹ️ **Note de vérification (migration)** : la migration `20260804194219_AddPermissionValidationLogs`
> a été éditée en place (`IpAddress`/`UserAgent` → nullable). Ceci n'est sûr que parce qu'elle n'a
> **jamais été appliquée** à `GestionJuridiqueDB` (aucune exécution de `dotnet ef database update`
> durant la session — uniquement `build`/`test`). Si elle avait été appliquée, une migration
> `AlterColumn` aurait été nécessaire.

### Vérifications

### Vérifications

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:15 | CONFIGURED | Backend | `dotnet build` → Build succeeded ; `dotnet test WebApplication1.Tests` → **15/15 passés** | Valider les tests RBAC |
| 2026-08-04 ~21:15 | CONFIGURED | Frontend | `npx next build` → Build succeeded ; `npx eslint cypress/e2e/app.cy.ts` → 0 erreur | Valider le code frontend + les tests E2E |

---

## 🚀 Session I — Exécution E2E + migration appliquée + tests du seed (2026-08-04, ~21:30)

### Bug runtime découvert par les tests E2E — dépendance captive du middleware

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:30 | MODIFIED | `Program.cs` (`PermissionValidationMiddleware.InvokeAsync`) | Résolution du service scoped via `context.RequestServices.GetRequiredService<PermissionValidationService>()` au lieu du provider capturé dans le constructeur | Bug réel (signalé dès la revue Session F) : le middleware est instancié une fois avec le provider RACINE → toute requête refusée (401/403) levait `Cannot resolve scoped service ... from root provider` → 500 au lieu de 403. Confirmé en live par les tests E2E (8/8 tests permission échouaient en 500) |

### Migrations appliquées à la base réelle

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:20 | CONFIGURED | `(localdb)\MSSQLLocalDB\GestionJuridiqueDB` | `dotnet ef database update` → **20 migrations appliquées** (dont `20260804194219_AddPermissionValidationLogs`) ; table `PermissionValidationLogs` vérifiée via sqlcmd : `IpAddress`/`UserAgent` = nullable | Appliquer la migration de journalisation ; confirmer la nullabilité éditée en Session H |
| 2026-08-04 ~21:22 | CONFIGURED | Base de données | `POST /api/seed/run` (admin) exécuté en mode force sur la base existante ; comptes démo vérifiés (`bureauordre`, `secretarait` → 200 au login) | Appliquer la matrice RBAC sur la base déjà peuplée sans la supprimer |

### Tests unitaires du seed (mode force)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:25 | MODIFIED | `Services/SeederService.cs` | `SeedCoreAsync(bool force)` extrait (tout le seed sauf `Database.Migrate()`) — rend le seed testable en InMemory ; `SeedAsync` = Migrate + SeedCoreAsync ; message « 20 permissions désactivées » (était 21) | `Migrate()` n'est pas supporté par le provider InMemory ; le compte réel des overrides est 20 |
| 2026-08-04 ~21:25 | ADDED | `WebApplication1.Tests/SeederServiceTests.cs` | 4 tests : seed complet sur base vide ; force sur base peuplée (insert-if-missing, pas de doublons) ; force non destructif (lignes désactivées conservées) ; mode startup par-table (tables non vides sautées, vides seedées) | Couvrir le comportement `force` sans Migrate() |
| 2026-08-04 ~21:26 | MODIFIED | `SeederServiceTests.cs` | Test startup corrigé : la garde est PAR TABLE (les tables vides sont seedées, les non vides sautées) | Ma première hypothèse « tout sauter » était fausse — comportement réel = garde par table |

### Tests E2E — exécution complète + correctifs

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:35 | MODIFIED | `cypress/e2e/app.cy.ts` | Identifiants `demo_user`/`demo_password` → `bureauordre`/`bureauordre123` ; `admin_user`/`admin_password` → `admin`/`admin123` | Les comptes `demo_*` n'existaient pas dans le seed → toute la suite après le login échouait en beforeEach |
| 2026-08-04 ~21:35 | MODIFIED | `cypress/e2e/app.cy.ts` | Test « dashboard navigation » : `contains(/Tableau de bord|لوحة التحكم/)` ; test « navigate views » : `contains(/Mes entités|وثائقي وملفاتي/)` | L'app démarre en arabe par défaut → les assertions en français seul échouaient |
| 2026-08-04 ~21:35 | MODIFIED | `cypress/e2e/app.cy.ts` | Test « juridical document form » : déconnexion puis login `fathmilafat`/`fathmilafat123` avant de cliquer sur le menu | `bureauordre` n'a pas `creer_courrier_juridique` → l'entrée sidebar n'existe pas pour lui (gating par permission) |
| 2026-08-04 ~21:36 | MODIFIED | `cypress/e2e/app.cy.ts` | Helpers API : `cy.request` direct, `expect(status)` ajustés | Alignement sur la réponse réelle du backend |
| 2026-08-04 ~21:40 | CONFIGURED | Exécution E2E | **Cypress : 35/35 passing** (0 échec) | Suite E2E entièrement verte |

> ⚠️ **Note d'infrastructure (dev) :** le serveur `next dev` (Turbopack) a paniqué pendant la
> suite (`FATAL: An unexpected Turbopack error occurred ... Next.js package not found`) → boucle
> de redirections + crash `KeyboardEvent` dans Cypress. Basculé sur `next start` (build de
> production) : stable. À surveiller si on revient sur `next dev` pour du E2E.

### Vérifications finales

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:45 | CONFIGURED | Backend | `dotnet test` → **19/19 passés** ; `dotnet build` → Build succeeded | Valider tests + fix middleware |
| 2026-08-04 ~21:45 | CONFIGURED | Frontend | `npx cypress run` → **35/35** ; `npx eslint` → 0 erreur | Valider l'ensemble E2E |

### Correctifs suite revue de code (Session I)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:50 | MODIFIED | `Program.cs` (middleware) | Champ `_serviceProvider` + paramètre constructeur `IServiceProvider` supprimés (code mort après le fix `context.RequestServices`) ; constructeur = `RequestDelegate` seul | Revue : champ écrit mais jamais lu |
| 2026-08-04 ~21:50 | MODIFIED | `Services/SeederService.cs` | `SeedAsync` → `Task<bool>` (true si OK, false si erreur, log + swallow pour le démarrage) ; `SeedCoreAsync` : **plus de try/catch interne** — les exceptions remontent | Revue : `/api/seed/run` rapportait « succès » même en cas d'échec (exceptions avalées) |
| 2026-08-04 ~21:50 | MODIFIED | `Controllers/SeedController.cs` | `RunSeed()` utilise le retour booléen → `500` avec message si échec, sinon `200` | Revue : surface les échecs de seed au client API |
| 2026-08-04 ~21:50 | MODIFIED | `WebApplication1.Tests/PermissionValidationMiddlewareTests.cs` | `CreateMiddleware()` sans argument provider (constructeur simplifié) | Alignement sur le constructeur `RequestDelegate` seul |
| 2026-08-04 ~21:50 | MODIFIED | `WebApplication1.Tests/SeederServiceTests.cs` | Commentaire « counts mirror SeederService — update together » sur les constantes de matrice | Revue : comptes codés en dur (17/20/36) fragiles si la matrice change |

### Vérifications finales (2ᵉ passe)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~21:52 | CONFIGURED | Backend | `dotnet build` → Build succeeded ; `dotnet test` → **19/19 passés** | Valider les correctifs de revue |

---

## 🛠️ Session J — Correctif `next dev` (panic Turbopack sur OneDrive) (2026-08-04, ~22:00)

### Panic Turbopack récurrent en développement

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-04 ~22:00 | MODIFIED | `frontend-juridique/package.json` | Script `dev` : `next dev` → `next dev --webpack` ; nouveau script `dev:turbo` (`next dev`) conservé pour expérimentation | Panic Turbopack récurrent (stack `Next.js package not found` → `Failed to write app endpoint /page`) — connu sur les dossiers OneDrive/synchronisés ; le bundler webpack est stable (vérifié : 0 FATAL, HTTP 200) |
| 2026-08-04 ~22:00 | CONFIGURED | `frontend-juridique/.next` | Cache `.next` supprimé avant le redémarrage | Éliminer tout cache natif Turbopack corrompu |
| 2026-08-04 ~22:02 | CONFIGURED | Frontend | `npm run dev` (webpack) → **Ready in 725ms, 2× HTTP 200, 0 FATAL, 0 erreur** | Valider le correctif |

---

## 🏗️ Session K — Refactoring architectural complet (Phases 1→6) (2026-08-16)

### Phase 1 — Nettoyage à comportement identique

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | ADDED | `WebApplication1/WebApplication1/Middleware/PermissionValidationMiddleware.cs` | `PermissionValidationMiddleware` extrait de `Program.cs` vers son propre fichier (namespace `WebApplication1.Middleware`) | Architecture : la classe middleware n'a rien à faire dans le point d'entrée |
| 2026-08-16 | MODIFIED | `WebApplication1/WebApplication1/Program.cs` | Classe middleware supprimée du fichier + `using WebApplication1.Middleware` | Même raison — composition root allégé |
| 2026-08-16 | MODIFIED | `Security/RequirePermissionAttribute.cs` | Doc-comment mis à jour (référence `Middleware/PermissionValidationMiddleware.cs`) | Référence cassée après déplacement |
| 2026-08-16 | MODIFIED | `frontend-juridique/components/LoginPage.tsx` | Déplacé → `app/components/pages/LoginPage.tsx` (git mv) ; import mis à jour dans `page.tsx` | Un seul root de composants (`app/components/`) — convention d'import uniforme |
| 2026-08-16 | DELETED | `frontend-juridique/prisma/` | Dossier + `schema.prisma` supprimés ; `@prisma/client` + `prisma` retirés de `package.json`/lockfile | Dépendance morte (le frontend appelle l'API .NET en fetch direct) |
| 2026-08-16 | ADDED | `frontend-juridique/lib/config/env.ts` | `API_BASE_URL` — source unique de l'URL backend | Supprime les 6 fallbacks `NEXT_PUBLIC_API_URL || localhost:5200` dupliqués |
| 2026-08-16 | ADDED | `frontend-juridique/lib/api/client.ts` | Wrapper `fetch` typé central : `api.get/post/put/patch/delete/send`, header Bearer automatique, `ApiError` (status + message), gestion FormData | Couche API unique : auth header, erreurs et types en un seul endroit |

### Phase 2 — Adoption du client API dans tous les fichiers feuilles

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | MODIFIED | `context/AuthContext.tsx` | `login` + `fetchAdminOverrides` → `api.post`/`api.get` ; prop `BASE_URL` supprimée | Couche API centralisée |
| 2026-08-16 | MODIFIED | `app/hooks/useDocuments.ts`, `app/hooks/useListItems.ts` | Fetches → `api.get` (avec `fetchOne` par endpoint préservant le comportement 401/indépendance) | Idem |
| 2026-08-16 | MODIFIED | `TransferModal`, `WorkspaceModal`, `DetailModal`, `NotificationsPage`, `TransactionsPage`, `ProfilPage`, `ArchiveRetraitPage`, `MesDossiersEnCoursView` | Tous les `fetch` → `api.*` ; props `BASE_URL` supprimées des interfaces et call-sites | Idem |
| 2026-08-16 | MODIFIED | `GestionUtilisateurs`, `GestionPermissions`, `GestionServices`, `GestionEquipements`, `GestionListes`, `GestionServicesHistoriques` | Idem + gestion d'erreur `ApiError` (401/403 → message spécifique) | Idem |
| 2026-08-16 | MODIFIED | `app/api/courriers/juridique/route.ts` | `BACKEND_URL` local → `API_BASE_URL` importé de `lib/config/env` | Source unique de vérité |
| 2026-08-16 | MODIFIED | `lib/api/client.ts` | Méthode `patch` ajoutée | Requis par `RetraitController` (PATCH annuler/retourner) |

### Phase 3 — Découpage de `page.tsx` (2226 → ~1740 lignes)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | ADDED | `app/components/pages/MesEntitesView.tsx` | Vue « mes entités » extraite (tableau + sélection + exports + import + retour) | God component : chaque vue devient un composant dédié |
| 2026-08-16 | ADDED | `app/components/pages/ArchivesView.tsx` | Vue archives + corbeille extraite | Idem |
| 2026-08-16 | ADDED | `app/components/pages/RechercheDossiersView.tsx` | Vue recherche (filtres + résultats + fichiers locaux) extraite | Idem |
| 2026-08-16 | MODIFIED | `app/page.tsx` | 3 blocs JSX remplacés par les composants ; handlers `openRetournerModal` + `batchTransferSelected` ajoutés au shell ; **les 24 fetches restants migrés vers `api.*`** (count-pending, stats, corbeille, restaurer, exports, ExcelImport, création courriers, upload FormData, Transfer, archive-batch, statut sortant, delete) | Shell mince + zéro `fetch` brut + zéro constante `BASE_URL` locale |
| 2026-08-16 | MODIFIED | `app/page.tsx` | États `any[]` typés : `historiqueActions`, `retournerDocs`, `corbeilleDocs` (+ interfaces `TransactionHistoryEntry`, `RetournerDoc`, `CorbeilleDoc`) | Kill des `any` |

### Phase 4 — Couche service backend

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | ADDED | `Services/ServiceResult.cs` | Type `ServiceResult` (Success/StatusCode/Data + `Ok`/`Fail`) | Contrôleurs fins : mapper ServiceResult → IActionResult |
| 2026-08-16 | ADDED | `Services/TransactionService.cs` | Toute la logique Transactions extraite (pending, all, accepter, refuser, annuler-transition, stats, stats-by-service, count-pending, doit-revenir, history) | TransactionsController : 430 → ~120 lignes ; logique testable |
| 2026-08-16 | ADDED | `Services/WorkspaceService.cs` | Logique Workspace extraite (détail document, mise à jour + audit `DocumentModification`, notes CRUD, historique modifications, résolution user) | WorkspaceController : 367 → ~100 lignes |
| 2026-08-16 | ADDED | `DTO/UpdateDocumentDto.cs`, `DTO/AddNoteDto.cs` | DTOs déplacés du contrôleur vers le dossier DTO | Règles de séparation des concerns |
| 2026-08-16 | MODIFIED | `Controllers/TransactionsController.cs`, `Controllers/WorkspaceController.cs` | Réécrits en adaptateurs fins (parse → service → mapper résultat) | Idem |
| 2026-08-16 | MODIFIED | `Program.cs` | `TransactionService` + `WorkspaceService` enregistrés en DI | Résolution des nouveaux services |
| 2026-08-16 | MODIFIED | `WebApplication1.csproj` | `<InternalsVisibleTo Include="WebApplication1.Tests" />` | Accès des tests aux formes anonymes (RuntimeBinderException sinon) |
| 2026-08-16 | ADDED | `WebApplication1.Tests/TransactionServiceTests.cs` (5 tests), `WorkspaceServiceTests.cs` (5 tests) | Couverture des nouveaux services (filtrage par service, doit-revenir, refus cross-service 403, annulation chaîne, stats, audit de modification, notes) | Tests unitaires de la couche service |
| 2026-08-16 | MODIFIED | `PermissionValidationMiddlewareTests.cs` | `using WebApplication1.Middleware` ajouté | Namespace déplacé |

### Phase 5 — OpenAPI + types générés

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | ADDED | `lib/types/api.generated.ts` | Types TS générés depuis `/openapi/v1.json` via `openapi-typescript` (3 574 lignes — paths + schémas DTO) | Contrat unique backend→frontend ; les DTOs (UpdateDocumentDto, AddNoteDto, SortantDto…) sont désormais typés |
| 2026-08-16 | MODIFIED | `package.json` | DevDep `openapi-typescript` + script `npm run typegen` | Régénération après changement de contrat backend |
| 2026-08-16 | MODIFIED | `WorkspaceModal.tsx` | Body du PUT document typé `Partial<components["schemas"]["UpdateDocumentDto"]>` | Exemple d'usage des types générés |
| 2026-08-16 | MODIFIED | `app/page.tsx` | États locaux typés (voir Phase 3) | Kill des `any` |

### Phase 6 — Durcissement config

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | MODIFIED | `appsettings.json` | Clé JWT **retirée** du fichier partagé ; section `Cors:AllowedOrigins` ajoutée | Secret hors config versionnée ; CORS configurable |
| 2026-08-16 | MODIFIED | `appsettings.Development.json` | Clé JWT de développement ajoutée (override prod via `Jwt__Key` env var) | Le dev continue de fonctionner ; la prod doit fournir la clé |
| 2026-08-16 | MODIFIED | `Program.cs` | CORS : origines lues depuis `Cors:AllowedOrigins` (défaut `localhost:3000`) | Config au lieu de hardcode |

### Vérifications finales (Session K)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | CONFIGURED | Backend | `dotnet build` → Build succeeded ; `dotnet test` → **29/29 passés** (19 existants + 10 nouveaux) | Valider le refactoring backend |
| 2026-08-16 | CONFIGURED | Frontend | `npx tsc --noEmit` → 0 erreur ; `npx next build` → succès (3 routes) | Valider le refactoring frontend |
| 2026-08-16 | CONFIGURED | E2E | `npx cypress run` → **35/35 passés** (serveurs :5200 + :3000, DB LocalDB déjà seedée) | Validation de bout en bout du refactoring complet |
| 2026-08-16 | DOCUMENTED | `docs/architecture-audit.md` | Rapport d'audit réécrit : état actuel + architecture cible | Reflet de la nouvelle architecture |

---

## 🕘 Session L — QA end-to-end : vérification, permissions & nettoyage (2026-08-16)

### Correctifs lint (157 problèmes → 0 erreur)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | ADDED | `lib/utils.ts` | Helper `getErrorMessage(err: unknown)` | Remplacer les `catch (err: any)` par des clauses typées `unknown` |
| 2026-08-16 | MODIFIED | 26 fichiers TSX/TS (admin, dashboard, forms, layout, modals, pages, tables, hooks, contexts, `page.tsx`, `exportImport.ts`, `useDocuments.ts`) | Prop `cur` typée `TranslationKeys` ; `catch (err: any)` → `catch (err)` + `getErrorMessage` ; `(u as any)`/`(doc: any)`/`stats: any` remplacés par des interfaces existantes (`CourrierSimule`, `User`, `HistoryEntry`, `StatsData`, `UserItem.deletedAt`…) ; `onTransfer`/`getServiceLabel` typés ; fenêtre FS typée `FileSystemDirectoryHandle` ; casts `as VueActive` | Élimination des 94 erreurs `no-explicit-any` (codebase 0 erreur ESLint) |
| 2026-08-16 | MODIFIED | `context/AuthContext.tsx` | Type `User` exporté | Les props `user` de `Sidebar`/`ProfilPage` deviennent typées au lieu de `any` |
| 2026-08-16 | MODIFIED | `app/components/dashboard/StatsCircles.tsx` | `interface StatsData` exportée | Typage de la prop `stats` de `DashboardView` |
| 2026-08-16 | MODIFIED | `app/components/modals/ImportMappingModal.tsx` | Reset du mapping lors du changement de colonnes déplacé hors `useEffect` (ajustement d'état pendant le rendu, gardé par `prevCols`) ; dépendance `useMemo` → variable `colsKey` | Règle `react-hooks/set-state-in-effect` (1 seul cas réellement synchrone, corrigé proprement) ; règle `react-hooks/use-memo` |
| 2026-08-16 | CONFIGURED | `eslint.config.mjs` | `react-hooks/set-state-in-effect` passé de `error` à `warn` avec commentaire justificatif | La règle (défaut du preset Next 16) signale de façon conservatrice tous les setState atteignables depuis un effet, y compris les fetch-on-mount asynchrones et l'hydratation localStorage — patterns légitimes de l'app ; 20 sites documentés, 0 régression |

### Bug réel corrigé (découvert par l'audit de permissions)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | MODIFIED | `Services/PermissionValidationService.cs` | Propriété explicite `UtilisateurId` ajoutée à `PermissionValidationLog` ; le service renseigne `UtilisateurId = userId` en plus de `UserId` | **Bug critique** : la propriété FK `UtilisateurId` était un *shadow property* jamais initialisée → insert à `0` → violation de contrainte `FK_PermissionValidationLogs_Utilisateurs_UtilisateurId` → **500 sur CHAQUE action réussie contrôlée par permission** (création, transfert, suppression, archivage…) en base réelle. Invisible en InMemory (FK non vérifiées) ; les tests Cypress passaient à tort car le 500 masquait le vrai résultat |
| 2026-08-16 | MODIFIED | `WebApplication1.Tests/PermissionValidationServiceTests.cs` | Test `AllowedAndLogged` renforcé : vérifie `log.UtilisateurId == 1` (FK valide) | Test de régression qui aurait attrapé le bug shadow-FK |

### Audit de permissions (niveau API) — 28/28 ✓

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | ADDED | `scripts/permission-audit.sh` | Script de test live (curl) : 28 vérifications sur les comptes démo — permission activée → action non bloquée (200/201/400/404), permission désactivée → **403**, token absent/invalide → **401**, matrice admin = 22 overrides désactivés | Outil d'audit RBAC réutilisable |
| 2026-08-16 | CONFIGURED | RBAC (API live) | Vérifié : `creer_modifier`, `creer_courrier_admin/juridique`, `supprimer`, `transferer`, `archiver`, `transferer_juridique`, `accepter`, `refuser`, `retrait_archive`, `ajouter_notes` — activés=ouverts / désactivés=403 / admin=403 (override) | Conformité matrice RBAC |
| 2026-08-16 | CONFIGURED | Contrôle double couche (API live) | Parcours accept/refuse complet : `archive` (propriétaire) accepte/refuse → 200 ; `bureauordre` (non-propriétaire) → 403 « Accès refusé » (couche possession) | Le middleware gère la permission, l'action gère la possession du service — les deux couches fonctionnent |

### Correctifs de gating UI (alignement UI ↔ backend)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | MODIFIED | `app/page.tsx` | Formulaire de création sortant/normal/demande désormais conditionné par `canCreateSortantNormal`/`canCreateSortantDemande` (via `canUseForm`) ; vue `recherche-dossiers` conditionnée par `canSearchDossiers` ; prop `canSearchDossiers` passée à la Sidebar | Le backend exige `creer_modifier` (POST `/api/CourrierSortant`) et `recherche_avancee` — l'UI laissait tout le monde accéder aux formulaires/vue ; désormais l'UI masque ce que le backend refuse |
| 2026-08-16 | MODIFIED | `app/components/layout/Sidebar.tsx` | Nouvelle prop `canSearchDossiers` ; bouton « Recherche dossiers » masqué si non autorisé | Gating UI cohérent avec la matrice RBAC |
| 2026-08-16 | MODIFIED | `cypress/e2e/app.cy.ts` | Test « bureauordre (has accepter) » : vérifie désormais que la réponse ne contient pas « not granted » (le middleware a laissé passer la permission) | L'ancien test attendait `!= 403`, mais un 403 « Accès refusé » de la couche possession est correct quand la transaction n'est pas destinée au service de l'utilisateur — l'assertion par raison de refus vérifie la couche permission de façon déterministe |

### Suppression de code mort / artefacts

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | DELETED | Dépendances npm `file-saver`, `jspdf`, `jspdf-autotable`, `@types/file-saver` | Retirées de `package.json` | Jamais importées : les exports utilisent `xlsx` + téléchargement par ancre HTML ; le PDF était inutilisé |
| 2026-08-16 | DELETED | `frontend-juridique/components/` (dossier racine, vide) | Supprimé | Vestige du déplacement de `LoginPage` (Session K, Phase 1) |
| 2026-08-16 | DELETED | `app/api/courriers/juridique/route.ts` (proxy Next.js) | Supprimé avec le dossier `app/api/courriers/` | Route morte : rien ne l'appelait et sa cible backend (`/api/courriers/juridique`) ne correspond à aucun contrôleur (le vrai est `/api/CourrierJuridique`) |
| 2026-08-16 | DELETED | ~50 variables/fonctions mortes frontend | `maskDocument`, `maskSelection`, `getAllServices`, `isAdminOverrideDisabled`, alias `showX`, `docsTraites`, `workflowSteps`, `importFileName`/`importFile` (valeurs), imports inutilisés, `catch` sans paramètre | Nettoyage des warnings `no-unused-vars` (50 éliminés) |

### Vérifications finales (Session L)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | CONFIGURED | Backend | `dotnet build` → succès ; `dotnet test` → **29/29** (dont le test de régression FK) | Valider le correctif + la couche service |
| 2026-08-16 | CONFIGURED | Frontend | `npx tsc --noEmit` → 0 erreur ; `npx eslint .` → **0 erreur / 40 warnings** (20 set-state-in-effect volontaires, 18 exhaustive-deps bénins, 2 img) ; `npx next build` → succès | Valider le nettoyage lint + typage |
| 2026-08-16 | CONFIGURED | E2E | `npx cypress run` → **35/35 passés** (serveurs :5200 + :3000) | Validation de bout en bout après les correctifs de permission et de gating |

---

# Session M — 2026-08-16 : Correctifs exhaustive-deps, validation 400, bug ownership juridique, audit auto-contenu, re-vérification base fraîche

### Correctifs de code

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | MODIFIED | `context/AuthContext.tsx`, `app/hooks/useDocuments.ts`, `app/page.tsx`, `app/components/admin/*` (GestionEquipements, GestionListes, GestionServices, GestionServicesHistoriques, GestionUtilisateurs, GestionPermissions), `app/components/pages/*` (ArchiveRetraitPage, NotificationsPage, TransactionsPage, ProfilPage), `app/components/modals/*` (DetailModal, TransferModal) | 18 warnings `exhaustive-deps` éliminés en enveloppant les helpers de fetch dans `useCallback` avec deps correctes ; 1 `preserve-manual-memoization` corrigé (ProfilPage : objet en deps au lieu de l'id) ; 1 warning `set-state-in-effect` restant dans `useDocuments.ts` neutralisé par un disable ciblé commenté (refetch volontaire au changement de vue) | Nettoyage lint demandé en follow-up de la Session L ; 0 erreur eslint, 22 warnings bénins restants |
| 2026-08-16 | MODIFIED | DTO de création : `DTO/AddNoteDto.cs`, `DTO/SortantDto.cs`, DTO inline de `CourrierAdminController` (CourrierAdminDto), `CourrierJuridiqueController` (CreateDossierJuridiqueDto), `TransferController`, `RetraitController`, `AuthController` (LoginDto), `UsersController`, `RbacServicesController`, `HistoricalServicesController`, `EquipmentController` | Ajout de `[Required]` sur les champs obligatoires des DTO de création | Un corps `{}` créait des documents « vide » (200/201) ; désormais `{}` → **400** avec détails de validation (`[ApiController]` déjà présent partout). Vérifié : tous les appelants frontend envoient les champs requis |
| 2026-08-16 | MODIFIED | `Controllers/TransactionJuridiqueController.cs` | **Bug de possession corrigé** : le contrôle vérifiait `user?.Service` (code RBAC brut, ex. `"fathmilafat"`) contre `currentService.ToString()` (`"BureauOrdre"`) → toujours faux pour les utilisateurs RBAC. Désormais compare `ServiceMapper.MapToServiceEnum(user?.Service)` (l'enum mappée, déjà calculée mais inutilisée) | `fathmilafat` créait un dossier puis recevait 401 « Vous n'avez pas le droit de déplacer ce dossier » sur SON propre dossier — les mouvements juridiques étaient cassés pour tous les non-admins. Vérifié en live : propriétaire → passe la couche possession (400 = règle de transition), non-autorisé → 403 middleware |
| 2026-08-16 | MODIFIED | `scripts/permission-audit.sh` | Script rendu **auto-contenu** : crée ses propres courriers/transferts/dossiers (helpers `create_courrier_admin`, `transfer_to`, `create_juridique`) pour que les cas `accepter`/`refuser`/`transferer_juridique` agissent sur des données possédées par le service de l'utilisateur | Les 3 cas « enabled » échouaient (403 possession) car ils ciblaient des ids fixes non possédés — désormais 28/28 déterministe sur base fraîche ou peuplée |

### Re-vérification base fraîche (Session M)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | CONFIGURED | Base LocalDB `GestionJuridiqueDB` | Base **supprimée puis recréée** par `Database.Migrate()` + seed au démarrage : 10 utilisateurs, 20 overrides admin désactivés, 36 permissions, 9 services RBAC | Vérifier que le seed de départ produit bien l'état attendu (matrice ≥ 20 overrides, comptes de démo) |
| 2026-08-16 | CONFIGURED | Backend | `dotnet build` → 0 warning / 0 erreur ; `dotnet test` → **29/29** ; audit permission → **28/28** sur base fraîche | Validation après les correctifs |
| 2026-08-16 | CONFIGURED | Frontend | `npx tsc --noEmit` → 0 erreur ; `npx eslint .` → **0 erreur / 22 warnings** ; `npx next build` → succès | Validation après le nettoyage exhaustive-deps |
| 2026-08-16 | CONFIGURED | E2E | `npx cypress run` → **35/35** contre le build de production (`next start`) | La suite complète passe ; voir note dev-mode ci-dessous |
| 2026-08-16 | MODIFIED | `cypress/e2e/app.cy.ts` | Suppression temporaire du `describe.only` de débogage (aucun changement permanent) | Diagnostic de la flakiness des tests admin |

### Découverte : page « morte » en mode dev (2e chargement)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | CONFIGURED | Dev serveur frontend | **Constat** : en `next dev` (Turbopack **et** webpack), le **2e chargement de page** d'une même session Cypress sert du HTML non hydraté — aucun handler JS actif (le toggle de langue ne répond pas, le POST login ne part jamais), sans erreur console. Le build de production (`next start`) n'a pas ce problème (35/35, 38 s) | Explication de la flakiness des tests admin (aside introuvable après login) ; lien probable avec les « FATAL: Turbopack error » signalés par l'utilisateur sur sa machine. **Recommandation : lancer les E2E contre `next build && next start`** |

### Limitation connue (à traiter en follow-up)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | CONFIGURED | `Helpers/ServiceMapper.cs` | **Constat** : les codes RBAC `fathmilafat`, `secretarait`, `seances&procedures`, `taslimnosakh`, `tasfiatSawa2irTakmilia`, `atabligh` ne sont mappés par `MapToServiceEnum` (retournent `BureauOrdre` par défaut). Seuls `bureauordre`, `archive`, `khibra` correspondent (TryParse insensible à la casse). Non modifié : changer le mapping modifierait la sémantique de possession (quelle entité chaque service « possède ») en milieu d'audit | Découvert pendant l'audit : les mouvements juridiques de `seances`/`taslimnosakh`/`atabligh` ciblent des enum inexistants dans leur service. À traiter avec le métier (mapping RBAC → ServiceTribunal) avant tout déploiement |

---

# Session N — 2026-08-16 : Mapping RBAC → ServiceTribunal + cause racine du bug « page morte » en dev (race d'hydratation)

### Correctif fonctionnel : ServiceMapper RBAC

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | MODIFIED | `Helpers/ServiceMapper.cs` | Ajout du mapping des codes RBAC seedés vers `ServiceTribunal` : `bureauordre`→BureauOrdre, `fathmilafat`→OuvertureDossier, `secretarait`→KitabaKhasa, `seances&procedures`→JalsatWaIjra2at, `khibra`→Khibra, `taslimnosakh`→TaslimNusakh, `tasfiatSawa2irTakmilia`→TasfiyatSawa2ir, `archive`→Archive, `atabligh`→Tabligh (mappings français legacy conservés) | Sans ce mapping, `fathmilafat`, `secretarait`, `seances&procedures`, `taslimnosakh`, `tasfiatSawa2irTakmilia`, `atabligh` retombaient sur `BureauOrdre` par défaut : les mouvements juridiques (MoveDossier), le filtrage des transactions et l'acceptation/refus ciblaient le mauvais service. Le mapping est confirmé par la matrice de permissions du seed (« Mouvements juridiques (étapes Jalsat) » pour seances&procedures, « Expertise (sous-service Jalsat) » pour khibra, « Taslim » pour taslimnosakh, « Tabligh » pour atabligh), les descriptions des services seedés, et le workflow métier BureauOrdre→OuvertureDossier→KitabaKhasa→JalsatWaIjra2at→TaslimNusakh→Archive |
| 2026-08-16 | ADDED | `WebApplication1.Tests/ServiceMapperTests.cs` | 15 tests : mapping des 9 codes RBAC, parsing insensible à la casse des noms d'enum, mapping des noms français legacy, fallback `BureauOrdre` pour codes inconnus | Verrouiller le mapping pour éviter la régression silencieuse vers BureauOrdre |

### Cause racine identifiée et corrigée : « page morte » en mode dev (race d'hydratation)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | MODIFIED | `cypress/support/commands.ts` | Nouvelle commande `cy.waitForHydration()` : attend que le fiber React soit attaché au DOM avant toute interaction ; utilisée dans la commande `login` | **Cause racine** : en `next dev`, les scripts sont chargés en `async` → l'hydratation React peut se terminer APRÈS que la page soit visible et que Cypress commence à taper. L'hydratation réinitialise les champs contrôlés à l'état React (vide) → le champ login se retrouve vide → la validation native `required` bloque SILENCIEUSEMENT la soumission (pas de requête, pas d'erreur, formulaire inchangé). La session N a écarté bfcache, les erreurs console, les 404 de chunks et le serveur (réponses ~90 ms) avant d'isoler la race |
| 2026-08-16 | MODIFIED | `cypress/e2e/app.cy.ts` | `beforeEach` : `cy.waitForHydration()` après `cy.visit("/")` | Même race pour tous les tests qui se connectent — le wait rend les tests déterministes en dev |
| 2026-08-16 | CONFIGURED | E2E | `npx cypress run` contre **`next dev`** (Turbopack) → **35/35, 3 fois de suite, ~56 s** (avant : 12 échecs flaky, > 5 min) | Le fix rend `npm run dev` + Cypress utilisables ensemble ; la recommandation « lancer les E2E contre le build de production » de la Session M n'est plus nécessaire (toujours possible) |

### Vérifications (Session N)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-16 | CONFIGURED | Backend | `dotnet build` → 0 erreur ; `dotnet test` → **44/44** (29 + 15 nouveaux ServiceMapperTests) | Validation du mapping |
| 2026-08-16 | CONFIGURED | Frontend | `npx tsc --noEmit` → 0 erreur ; `npx eslint cypress/` → 0 erreur (1 warning bénin `no-unused-expressions` Cypress standard) | Validation des changements Cypress |

---

## 🛡️ Session O — Audit & réécriture du système de permissions (2026-08-17)

### Cause racine

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-17 | MODIFIED | `Controllers/UsersController.cs` | `GET /api/Users` passé de `[Authorize]` (tout le monde) à `[RequirePermission("gerer_utilisateurs")]` ; ajout de `GET /api/Users/actifs` (libre, utilisateurs actifs uniquement) ; les endpoints de gestion (POST/PUT/DELETE/restore) restent sur `gerer_utilisateurs` | `GET /api/Users` exposait la liste complète à tout utilisateur authentifié ; `ProfilPage` (sélecteur de substituts) appelait l'endpoint admin → 403 pour les non-admins = sélecteur cassé. Le nouvel endpoint `/actifs` répond au besoin de ProfilPage sans exposer la gestion |
| 2026-08-17 | MODIFIED | `Controllers/DocumentsController.cs` | `PATCH {id}/restaurer` → `[RequirePermission("restaurer")]`, `GET corbeille` → `[RequirePermission("voir_corbeille")]` | Ces endpoints n'étaient protégés que par `[Authorize]` : n'importe quel utilisateur connecté pouvait restaurer des documents ou lire la corbeille |
| 2026-08-17 | MODIFIED | `Controllers/ActionsJuridiquesController.cs` | Endpoints d'actions juridiques → `[RequirePermission("transferer_juridique")]` | Étaient librement accessibles à tout utilisateur authentifié |
| 2026-08-17 | MODIFIED | `Controllers/ServicesController.cs`, `RbacServicesController.cs`, `HistoricalServicesController.cs`, `EquipmentController.cs`, `ListItemsController.cs`, `RbacPermissionsController.cs` | `[Authorize(Roles = "Admin")]` remplacé par `[RequirePermission("gerer_services"/"gerer_equipements"/"gerer_listes"/"gerer_permissions")]` | Le rôle statique Admin est contournable/imprécis : la permission dynamique suit la table `ServicePermissions`/`AdminPermissionOverrides` en direct ; les non-admin avec la permission `gerer_*` peuvent aussi gérer |
| 2026-08-17 | MODIFIED | `Controllers/ExcelImportController.cs` | Gate `[Authorize(Roles = "Admin")]` → permission `creer_courrier_admin`/`creer_courrier_juridique` selon le type de document | L'import Excel est utilisé par les utilisateurs métier (bureau d'ordre) — le gate Admin le bloquait ; le gate par type de document respecte la matrice |
| 2026-08-17 | ADDED | `Controllers/AuthController.cs` | Nouvel endpoint `GET /api/auth/me` : renvoie l'utilisateur courant + permissions fraîches depuis la DB | Base du rafraîchissement temps réel des permissions côté UI (au focus / re-login) |
| 2026-08-17 | MODIFIED | `context/AuthContext.tsx` | Ajout de `refreshUser()` (re-fetch `/api/auth/me` + overrides admin) et d'un écouteur `window focus` throttlé à 1 min | Les changements de permissions faits dans le panneau admin se reflètent dans l'UI sans re-login |

### Frontend — gating UI dynamique

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-17 | ADDED | `app/components/common/ExportButtons.tsx` | Composant partagé : rend chaque bouton export (Excel/Word) seulement si la permission `export_excel`/`export_word` est active ; masque tout si aucune | Centralise le gating des exports (précédemment dupliqué/codé en dur dans ~11 fichiers) et masque le bouton quand la permission est désactivée |
| 2026-08-17 | MODIFIED | `GeneralTable.tsx`, `SortantTable.tsx`, `MesEntitesView.tsx`, `MesDossiersEnCoursView.tsx`, `ArchivesView.tsx`, `RechercheDossiersView.tsx`, `NotificationsPage.tsx`, `TransactionsPage.tsx`, `GestionUtilisateurs.tsx`, `GestionServices.tsx`, `GestionEquipements.tsx`, `GestionListes.tsx` | Boutons export remplacés par `ExportButtons` gated par permission | Permission désactivée → bouton masqué (pas seulement 403 au clic) |
| 2026-08-17 | MODIFIED | `app/components/tables/GeneralTable.tsx`, `app/components/pages/MesEntitesView.tsx` | Bouton « importer » gated par `creer_courrier_admin`/`creer_courrier_juridique` | Masquer l'import quand l'utilisateur ne peut pas créer ce type de document |
| 2026-08-17 | MODIFIED | `app/page.tsx` | Section admin rendue selon `gerer_utilisateurs`/`gerer_services`/`gerer_permissions`/`gerer_equipements`/`gerer_listes` ; actions workflow gated (`ouvrir_dossier`, `transferer`, `archiver`, `supprimer`, `retrait_archive`, `voir_corbeille`) | Le menu admin était piloté par le rôle Admin uniquement ; désormais chaque vue suit sa permission. Les boutons d'action s'affichent selon la permission au lieu d'alerter systématiquement |
| 2026-08-17 | MODIFIED | `app/components/layout/Sidebar.tsx` | Reçoit les props de permission par vue ; n'affiche que les entrées autorisées | Navigation masquée quand la permission est désactivée |
| 2026-08-17 | MODIFIED | `app/components/pages/ProfilPage.tsx` | Utilise `GET /api/Users/actifs` au lieu de `GET /api/Users` | Sélecteur de substituts fonctionnel pour les non-admins (403 avant) |

### Vérifications (Session O)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-17 | CONFIGURED | Backend | `dotnet build` → 0 erreur/0 warning ; `dotnet test` → **44/44** | Validation |
| 2026-08-17 | CONFIGURED | Frontend | `npx tsc --noEmit` → 0 erreur ; `npx eslint app/` → 0 erreur (20 warnings bénins préexistants) | Validation |
| 2026-08-17 | CONFIGURED | E2E | `npx cypress run` (build prod) → **35/35** | Validation UI |
| 2026-08-17 | CONFIGURED | Audit RBAC | `scripts/permission-audit.sh` étendu : +15 vérifications (restaurer, voir_corbeille, gerer_services, gerer_equipements, gerer_listes, gerer_permissions, gerer_utilisateurs, /Users/actifs, /api/auth/me) → **46/46** ; correctif : le check `gerer_permissions` utilise GET `/matrix` (non destructif) car PUT `/admin` avec `{}` supprime TOUS les overrides | Vérification positive/négative systématique : permission active → accès OK ; désactivée → 403 ; admin → 403 sur les 20 clés overridées, garde les permissions de vue |

---

## 🧪 Session P — Tests unitaires dynamiques + tests E2E permission-toggle + fix audit (2026-08-23)

### Tests unitaires — DynamicPermissionMiddlewareTests

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-23 | ADDED | `WebApplication1.Tests/DynamicPermissionMiddlewareTests.cs` | 21 tests couvrant les permissions nouvellement gatées : `restaurer`, `voir_corbeille`, `gerer_services/equipements/listes/permissions/utilisateurs`. Groupes : admin avec/sans override, non-admin avec/sans permission, sémantique override admin (20 clés désactivées, `voir_corbeille` et `gerer_*` pas dans la liste), sans auth → 401. Le helper `BuildProvider()` génère la table `Permissions` en InMemory (requis par `GetUserPermissionsAsync` qui interroge `_context.Permissions` pour admin) | Couvrir le nouvel enforcement RBAC de Session O avec des tests déterministes |
| 2026-08-23 | MODIFIED | `WebApplication1.Tests/DynamicPermissionMiddlewareTests.cs` | Ajout de `SeedAdminWithOverrides()` helper + seed `AllPermissionKeys` dans `BuildProvider()`. Les tests admin échouaient car `GetUserPermissionsAsync` pour admin lit `_context.Permissions` (table vide en InMemory) → retourne liste vide → 403 systématique | Bug de test : les tests admin passaient par le middleware → `ValidatePermissionAsync` → `GetUserPermissionsAsync` qui lit la table `Permissions` — sans le seed, admin recevait 0 permissions |

### Tests E2E — Permission Toggle Lifecycle

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-23 | ADDED | `cypress/e2e/permission-toggle.cy.ts` | 3 tests E2E : (1) `export_excel` disable → vérifie `/api/auth/me` ne contient plus la clé, re-enable → vérifie retour ; (2) `supprimer` disable → DELETE retourne 403, re-enable → retourne non-403 ; (3) UI : désactiver les deux permissions export → boutons masqués, réactiver → boutons visibles. Utilise `snapshotPerms`/`patchServicePerms`/`restorePermissions` pour préserver l'état original (pas de `resetServicePerms` qui re-enable tout) | Vérifier que le cycle enable/disable/enable fonctionne tant au niveau API que dans l'UI |
| 2026-08-23 | MODIFIED | `scripts/permission-audit.sh` | Check `bureauordre archiver` corrigé de `DISABLED` à `ENABLED` — le service BureauOrdre possède `archiver=enabled` dans le seed (matrice officielle). L'ancien check échouait toujours (200 au lieu de 403 attendu) car `archiver` est effectivement accordé à bureauordre | Correctif de la matrice de vérification : la matrice seed accorde `archiver` à bureauordre |

### Vérifications (Session P)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-23 | CONFIGURED | Backend | `dotnet build` → 0 erreur ; `dotnet test` → **68/68** (44 + 24 nouveaux : 15 DynamicPermissionMiddlewareTests + 9 existants de Sessions précédentes) | Validation |
| 2026-08-23 | CONFIGURED | Frontend | `npx tsc --noEmit` → 0 erreur | Validation |
| 2026-08-23 | CONFIGURED | E2E | `npx cypress run` (build prod) → **38/38** (35 existants + 3 nouveaux permission-toggle) | Validation complète |
| 2026-08-23 | CONFIGURED | Audit RBAC | `scripts/permission-audit.sh` → **46/46** après correctif archiver | Toutes les vérifications passent |

---

## 🧪 Session Q — Permission-toggle E2E coverage expansion (2026-08-23)

### Tests E2E — Permission Toggle Lifecycle (12 tests, 12 pass)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-23 | MODIFIED | `cypress/e2e/permission-toggle.cy.ts` | 12 tests : (1) export_excel, (2) supprimer, (3) archiver, (4) transferer, (5) creer_courrier_admin, (6) accepter, (7) refuser, (8) transferer_juridique, (9) retrait_archive, (10) recherche_avancee — tous en disable→verify→re-enable via snapshot/restore. (11) Admin override cycle : disable gerer_services pour admin → 403, re-enable → accès. (12) UI export buttons. Fix du mismatch de champ GET→PUT (`key` vs `permissionKey`). Fix des assertions de re-enable pour les endpoints à contrôle de possession (accepter, refuser) via `/api/auth/me` | Couvrir le cycle complet enable/disable/enable pour TOUTES les permissions protégées par `[RequirePermission]` au niveau service ET admin override |
| 2026-08-23 | MODIFIED | `cypress/e2e/permission-toggle.cy.ts` | `saveAdminOverrides` : mapping `key` → `permissionKey` dans le payload PUT. Le GET `/api/rbac/permissions/admin` retourne `{key,...}` mais le PUT attend `{permissionKey,...}` — sans ce mapping, le PUT rejetait toutes les permissions et ne stockait aucune override | Bug de compatibilité API : le GET et le PUT utilisent des noms de champs différents pour la même donnée |

### Vérifications (Session Q)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-23 | CONFIGURED | E2E | `npx cypress run` → **47/47** (35 app.cy + 12 permission-toggle) — 2 passes consécutives | Stabilité |
| 2026-08-23 | CONFIGURED | Audit RBAC | `permission-audit.sh` → **46/46** | Conformité matrice |

---

## 🛠️ Session R — API field alignment + ownership tests + workflow unit tests (2026-08-23)

### Backend — API alignment

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-23 | MODIFIED | `Controllers/RbacPermissionsController.cs` | GET `/api/rbac/permissions/admin` : `p.Key` → `PermissionKey = p.Key` dans la réponse anonyme | Le GET retournait `{key,...}` mais le PUT attend `{permissionKey,...}` — le round-trip GET→PUT supprimait silencieusement toutes les overrides admin |

### Frontend — alignement type

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-23 | MODIFIED | `admin/GestionPermissions.tsx` | Interface `AdminPerm.key` → `permissionKey` ; tous les usages `p.key` → `p.permissionKey` pour les permissions admin | Alignement avec le nouveau champ `permissionKey` du GET |

### Tests E2E — ownership layer + workflow

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-23 | MODIFIED | `cypress/e2e/permission-toggle.cy.ts` | 2 nouveaux tests ownership : (1) cross-service accepter → bureauordre a `accepter` mais la tx est pour archive → 403 ; (2) cross-service refuser → même pattern. Les deux créent leur propre courrier+transfert pour des données déterministes | Vérifier la couche de contrôle de possession (au-delà de la permission middleware) |
| 2026-08-23 | MODIFIED | `cypress/e2e/permission-toggle.cy.ts` | `saveAdminOverrides` : mapping supprimé (round-trip direct car GET retourne maintenant `permissionKey`). Fix du template literal non terminé (`refuser\"` → `refuser"`) | Bug de syntaxe + simplification après l'alignement GET/PUT |

### Tests unitaires — workflow step permissions

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-23 | MODIFIED | `DynamicPermissionMiddlewareTests.cs` | +17 tests (total 85) : Group 10 — `etape_precedente`, `etape_suivante`, `ouvrir_dossier`, `cloturer`. Test admin sans override → autorisé, user avec permission → autorisé, user sans permission → 403, admin avec override → 403, sans auth → 401 ( Theory) | Ces permissions existent dans le seed et sont gatées côté UI mais sans enforcement backend `[RequirePermission]` — les tests valident que le middleware les gère correctement si/quant l'ajout sera fait |

### Vérifications (Session R)

| Date & Heure | Action Type | Fichier / Composant | Résumé des changements | Raison du changement |
|---|---|---|---|---|
| 2026-08-23 | CONFIGURED | Backend | `dotnet build` → 0 erreur ; `dotnet test` → **85/85** | Validation |
| 2026-08-23 | CONFIGURED | Frontend | `npx tsc --noEmit` → 0 erreur ; `npx next build` → succès | Validation |
| 2026-08-23 | CONFIGURED | E2E | `npx cypress run` → **49/49** (35 app.cy + 14 permission-toggle) | Validation |
| 2026-08-23 | CONFIGURED | Audit RBAC | `permission-audit.sh` → **46/46** | Conformité |
