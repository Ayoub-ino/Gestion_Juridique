using WebApplication1.Models;

namespace WebApplication1.Helpers
{
    public static class ServiceMapper
    {
        public static ServiceTribunal MapToServiceEnum(string serviceName)
        {
            if (Enum.TryParse<ServiceTribunal>(serviceName, true, out var result))
                return result;

            return serviceName switch
            {
                "Bureau d'ordre et bureau administratif" => ServiceTribunal.BureauOrdre,
                "Bureau de Gestion des Dossiers Judiciaires" => ServiceTribunal.OuvertureDossier,
                "KitabaKhasa" => ServiceTribunal.KitabaKhasa,
                "JalsatWaIjra2at" => ServiceTribunal.JalsatWaIjra2at,
                "TaslimNusakh" => ServiceTribunal.TaslimNusakh,
                "Bureau de Notification" => ServiceTribunal.BureauNotification,
                "Archive" => ServiceTribunal.Archive,
                "Bureau d'expertise" => ServiceTribunal.BureauExpertise,
                "Bureau des procédures du commissaire royal" => ServiceTribunal.ProcduresCommissaireRoyal,
                "Bureau de Gestion des Pourvois en Cassation" => ServiceTribunal.GestionPourvoisCassation,
                "Remise de copie de jugement" => ServiceTribunal.RemiseCopieJugement,
                "Bureau de Recouvrement" => ServiceTribunal.BureauRecouvrement,
                "Caisse du Tribunal" => ServiceTribunal.CaisseTribunal,
                "Service de Gestion Financière" => ServiceTribunal.GestionFinanciere,
                "Bureau de l'efficacité judiciaire et des statistiques" => ServiceTribunal.EfficaciteJudiciaire,
                "Cellule informatique" => ServiceTribunal.CelluleInformatique,
                "Direction" => ServiceTribunal.Direction,
                "Greffe" => ServiceTribunal.Greffe,
                _ => ServiceTribunal.BureauOrdre
            };
        }

        public static bool TryParseUserId(string? userIdStr, out int userId)
        {
            userId = 0;
            return userIdStr != null && int.TryParse(userIdStr, out userId);
        }
    }
}
