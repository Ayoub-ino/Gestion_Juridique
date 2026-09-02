# 📋 Permission Matrix — Complete Reference

> Every permission key in the system, with its protected API endpoints and guarded UI elements.
> Generated from the RBAC system audit (September 2026).

---

## Permission Categories

### 📁 Documents

| Permission Key | API Endpoints (Backend) | UI Elements (Frontend) | Services |
|---|---|---|---|
| `creer_modifier` | `POST /api/CourrierSortant` | Create form for sortant-normal/sortant-demande; Status change buttons (Envoyé/En attente/Annulé) in SortantTable | bureauordre |
| `creer_courrier_admin` | `POST /api/CourrierAdmin` | Create form for entrant-admin; Import Excel button in MesEntitesView & GeneralTable | bureauordre |
| `creer_courrier_juridique` | `POST /api/CourrierJuridique` | Create form for entrant-juridique; Import Excel button in MesEntitesView & GeneralTable | fathmilafat |
| `supprimer` | `DELETE /api/CourrierAdmin/{id}`, `DELETE /api/CourrierJuridique/{id}`, `DELETE /api/CourrierSortant/{id}`, `DELETE /api/Documents/{id}` | Delete buttons in GeneralTable, SortantTable, MesEntitesView (batch + per-row) | bureauordre |
| `transferer` | `POST /api/Transfer` | Transfer buttons in GeneralTable, SortantTable, MesEntitesView (batch + per-row), DetailModal, WorkspaceModal | bureauordre |
| `archiver` | `POST /api/Documents/archive-batch` | Archive batch button in MesEntitesView | bureauordre, archive |
| `restaurer` | `PATCH /api/Documents/{id}/restaurer` | Restore button in ArchivesView (corbeille) | archive |
| `voir_corbeille` | `GET /api/Documents/corbeille` | "Corbeille" tab in ArchivesView | archive |

### ⚖️ Juridique

| Permission Key | API Endpoints (Backend) | UI Elements (Frontend) | Services |
|---|---|---|---|
| `transferer_juridique` | `POST /api/juridique/{id}/TransactionJuridique`, `POST /api/ActionsJuridiques/{id}/TransactionJuridique` | — (backend only) | fathmilafat |
| `retrait_archive` | `POST /api/Retrait`, `GET /api/Retrait`, `PUT /api/Retrait/{id}`, `DELETE /api/Retrait/{id}` | Retrait button in ArchivesView | archive |
| `etape_precedente` | — (middleware guard, not yet on controller) | Previous step button in workspace workflow | Various |
| `etape_suivante` | — (middleware guard, not yet on controller) | Next step button in workspace workflow | Various |
| `ouvrir_dossier` | — (middleware guard, not yet on controller) | Open dossier button in workspace | Various |
| `cloturer` | — (middleware guard, not yet on controller) | Close dossier button in workspace | Various |

### 📬 Notifications

| Permission Key | API Endpoints (Backend) | UI Elements (Frontend) | Services |
|---|---|---|---|
| `accepter` | `PUT /api/Transactions/{id}/accepter` | Accept button in NotificationsPage, TransactionsPage | bureauordre, archive |
| `refuser` | `PUT /api/Transactions/{id}/refuser` | Refuse button in NotificationsPage, TransactionsPage | bureauordre, archive |
| `voir_toutes` | — (backend filter, not a middleware guard) | — (not enforced) | — |

### 🔍 Recherche

| Permission Key | API Endpoints (Backend) | UI Elements (Frontend) | Services |
|---|---|---|---|
| `recherche_avancee` | — (middleware guard on search endpoints) | "Recherche dossiers" sidebar link; RechercheDossiersView | bureauordre |
| `export_excel` | — (middleware guard) | Export Excel buttons in all tables (GeneralTable, SortantTable, MesEntitesView, admin panels) | bureauordre, secretarait, fathmilafat |
| `export_word` | — (middleware guard) | Export Word buttons in all tables | bureauordre, secretarait, fathmilafat |

### 🔧 Administration

| Permission Key | API Endpoints (Backend) | UI Elements (Frontend) | Services |
|---|---|---|---|
| `gerer_utilisateurs` | `GET /api/Users`, `POST /api/Users`, `PUT /api/Users/{id}`, `DELETE /api/Users/{id}`, `PATCH /api/Users/{id}/toggle-active`, `GET /api/Users/{id}/substitutes` | "Utilisateurs" admin sidebar link; GestionUtilisateurs panel | Admin only |
| `gerer_services` | `POST /api/Services`, `PUT /api/Services/{id}`, `DELETE /api/Services/{id}`, `GET /api/Services/historical`, `POST /api/Services/historical`, `PUT /api/Services/historical/{id}`, `DELETE /api/Services/historical/{id}`, `GET /api/Services/historical/restore/{id}`, `POST /api/Services/historical/restore/{id}`, `GET /api/rbac/services`, `PUT /api/rbac/services/{id}` | "Services" + "Services historiques" admin sidebar links; GestionServices + GestionServicesHistoriques panels | Admin, Greffier |
| `gerer_permissions` | `GET /api/rbac/permissions/matrix`, `PUT /api/rbac/permissions/service/{id}`, `PUT /api/rbac/permissions/admin` | "Permissions" admin sidebar link; GestionPermissions panel | Admin only |
| `gerer_equipements` | `POST /api/Equipment`, `PUT /api/Equipment/{id}`, `DELETE /api/Equipment/{id}`, `GET /api/Equipment/{id}/assignments` | "Équipements" admin sidebar link; GestionEquipements panel | Admin, Greffier |
| `gerer_listes` | `POST /api/ListItems`, `PUT /api/ListItems/{id}`, `DELETE /api/ListItems/{id}` | "Listes dynamiques" admin sidebar link; GestionListes panel | Admin, Greffier |

### 📝 Autres

| Permission Key | API Endpoints (Backend) | UI Elements (Frontend) | Services |
|---|---|---|---|
| `ajouter_notes` | `POST /api/Workspace/document/{id}/notes`, `PUT /api/Workspace/notes/{id}`, `DELETE /api/Workspace/notes/{id}` | Note add/edit/delete in WorkspaceModal + DetailModal | bureauordre, fathmilafat, secretarait |
| `voir_workspace` | `GET /api/Workspace/document/{id}` | Workspace open button in GeneralTable, SortantTable | bureauordre |
| `voir_historique` | `GET /api/Workspace/document/{id}/modifications` | Historique tab in WorkspaceModal | bureauordre, secretarait |
| `telecharger_fichiers` | `GET /api/FileUpload/{path}` | File download links in DetailModal | bureauordre, secretarait |
| `dashboard` | — | Dashboard sidebar link; DashboardView | All users |
| `mes_entites` | — | "Mes entités" sidebar link; MesEntitesView | All users |
| `transactions` | — | "Transactions" sidebar link; TransactionsPage | bureauordre, secretarait |
| `archives_view` | — | "Archives" sidebar link; ArchivesView | bureauordre |
| `profil` | — | "Mon profil" sidebar link; ProfilPage | bureauordre, secretarait |

---

## UI Guard Summary

### Sidebar Navigation Links

| Sidebar Link | Permission Required |
|---|---|
| Tableau de bord | `dashboard` |
| Mes entités | `mes_entites` |
| Entrant Admin | `creer_courrier_admin` |
| Entrant Juridique | `creer_courrier_juridique` |
| Sortant Normal | Always visible |
| Sortant Demande | Always visible |
| Recherche dossiers | `recherche_avancee` |
| Notifications | Always visible |
| Transactions | `transactions` |
| Archives | `archives_view` |
| Mon profil | Always visible |
| Administration section | Any `gerer_*` permission |
| → Utilisateurs | `gerer_utilisateurs` |
| → Services | `gerer_services` |
| → Permissions | `gerer_permissions` |
| → Équipements | `gerer_equipements` |
| → Services historiques | `gerer_services` |
| → Listes dynamiques | `gerer_listes` |

### Action Buttons

| Button | Permission Required |
|---|---|
| Delete (per-row & batch) | `supprimer` |
| Transfer (per-row & batch) | `transferer` |
| Archive batch | `archiver` |
| Status change (Envoyé/En attente/Annulé) | `creer_modifier` |
| Import Excel | `creer_courrier_admin` OR `creer_courrier_juridique` |
| Export Excel / Word | `export_excel` / `export_word` |
| Edit (DetailModal) | `creer_modifier` |
| Edit (WorkspaceModal) | `creer_modifier` |
| Add/Edit/Delete notes | `ajouter_notes` |
| Retrait archive | `retrait_archive` |

### Route-Level Protection

| Hidden View | Redirects to Dashboard When |
|---|---|
| admin-utilisateurs | `gerer_utilisateurs` disabled |
| admin-services | `gerer_services` disabled (and not Greffier) |
| admin-permissions | `gerer_permissions` disabled |
| admin-equipements | `gerer_equipements` disabled (and not Greffier) |
| admin-services-historiques | `gerer_services` disabled |
| admin-listes | `gerer_listes` disabled (and not Greffier) |
| entrant-admin | `creer_courrier_admin` disabled |
| entrant-juridique | `creer_courrier_juridique` disabled |
| recherche-dossiers | `recherche_avancee` disabled |
| transactions | `transactions` disabled |
| archives | `archives_view` disabled |

---

## Service Permission Matrix

| Service | Key Permissions Enabled |
|---|---|
| **bureauordre** | `transferer`, `consulter`, `creer_modifier`, `supprimer`, `archiver`, `creer_courrier_admin`, `accepter`, `refuser`, `recherche_avancee`, `export_excel`, `export_word`, `voir_workspace`, `ajouter_notes`, `voir_historique`, `telecharger_fichiers`, `dashboard`, `mes_entites`, `transactions`, `archives_view`, `profil` |
| **fathmilafat** | `transferer`, `consulter`, `creer_courrier_juridique`, `transferer_juridique`, `accepter`, `refuser`, `export_excel`, `export_word`, `recherche_avancee`, `voir_workspace`, `ajouter_notes`, `voir_historique`, `telecharger_fichiers`, `dashboard`, `mes_entites`, `transactions`, `profil` |
| **secretarait** | `transferer`, `consulter`, `accepter`, `refuser`, `export_excel`, `export_word`, `recherche_avancee`, `voir_historique`, `telecharger_fichiers`, `ajouter_notes`, `dashboard`, `mes_entites`, `transactions`, `profil` |
| **archive** | `transferer`, `consulter`, `archiver`, `restaurer`, `voir_corbeille`, `retrait_archive`, `accepter`, `refuser`, `export_excel`, `export_word`, `recherche_avancee`, `voir_workspace`, `ajouter_notes`, `voir_historique`, `telecharger_fichiers`, `dashboard`, `mes_entites`, `transactions`, `archives_view`, `profil` |
| **Admin** | All permissions (subject to 20 admin overrides) |

---

## Admin Override System

The Admin user has a special override layer: 20 permissions are disabled by default via admin overrides. This prevents the Admin from performing routine operations (creating, deleting, transferring documents) while retaining administrative capabilities (managing users, services, permissions, equipment, lists).

**Disabled by default for Admin:**
`ajouter_notes`, `archiver`, `creer_courrier_admin`, `creer_courrier_juridique`, `creer_modifier`, `restaurer`, `supprimer`, `transferer`, `cloturer`, `etape_precedente`, `etape_suivante`, `ouvrir_dossier`, `retrait_archive`, `transferer_juridique`, `accepter`, `refuser`, `voir_toutes`, `export_excel`, `export_word`, `recherche_avancee`

**NOT overridden (Admin retains):**
All `gerer_*` permissions, `voir_corbeille`, `voir_workspace`, `voir_historique`, `telecharger_fichiers`, `dashboard`, `mes_entites`, `transactions`, `archives_view`, `profil`

---

## Audit Commands

```bash
# Run the full permission audit (46 checks)
bash scripts/permission-audit.sh

# Run Cypress E2E tests (52 tests)
cd frontend-juridique && npx cypress run

# Run .NET unit tests (85 tests)
cd WebApplication1 && dotnet test WebApplication1.Tests/WebApplication1.Tests.csproj

# Re-seed the database
curl -X POST http://localhost:5200/api/seed/run -H "Authorization: Bearer $ADMIN_TOKEN"
```
