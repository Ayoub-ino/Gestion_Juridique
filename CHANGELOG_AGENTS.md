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
