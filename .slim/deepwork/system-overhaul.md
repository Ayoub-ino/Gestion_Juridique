# 7-Part System Overhaul — COMPLETE

## Status: ✅ All 5 phases complete

## What was built

### 1. Soft Delete Users
- `Utilisateur.IsActive` (bool) + `DeletedAt` (DateTime?)
- `UsersController.Delete()` → sets IsActive=false, DeletedAt=now
- `POST /api/Users/{id}/restore` → reactivates
- `AuthController.Login()` → rejects inactive users
- `GetAll()` → filters inactive by default, `?includeInactive=true` to include

### 2. Transfer with Target User
- `TransferDto.TargetUserId` (int?) — optional
- When set, skips fan-out to child services
- `Transaction.TargetUserId` FK to Utilisateur
- `TransactionsController.GetPending()` → filters by TargetUserId
- Frontend: TransferModal has optional user dropdown per selected service

### 3. Equipment Fields
- `Equipment.NumeroInventaire` (string?, unique index) + `Bureau` (string?)
- `EquipmentController` uses DTOs (CreateEquipmentDto, UpdateEquipmentDto)
- Unique check on NumeroInventaire in Create
- Frontend: form + table updated with new fields

### 4. Export UI
- All "Excel" → "📊 Excel", "Word" → "📄 Word" across 7 files

### 5. Import Mapping
- New `ImportMappingModal.tsx` component
- Auto-matches Excel columns to DB fields
- 10 DB field options with FR/AR labels
- Ignores unmatched columns

### 6. Permission Matrix Strict Defaults
| Service | Permissions |
|---|---|
| bureauordre | Creer, Modifier, Transférer |
| fathmilafat | Creer, Modifier, Transférer |
| secretarait | Modifier, Transférer (no creation) |
| seances&procedures | Modifier, Transférer |
| khibra | Modifier, Transférer |
| taslimnosakh | Transférer only |
| tasfiatSawa2irTakmilia | Transférer only |
| archive | Archiver only |
| Admin | NO creer_modifier, NO transferer, NO notifications |

### 7. Admin Rollback
- `PUT /api/Transactions/{id}/annuler-transition` (Admin only)
- Annuls all transactions for same document after target
- Restores document to original service + status
- Frontend: "Annuler" button on accepted transactions (Admin only)
- `StatutTransaction.Annule = 3` added

### Migration
- `Overhaul_Part1` — adds all new columns + constraints
