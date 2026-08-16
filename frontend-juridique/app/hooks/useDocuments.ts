// app/hooks/useDocuments.ts

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { CourrierSimule, VueActive, Langue } from "@/app/types";
import { getServiceLabel, getStatusLabel } from "@/lib/constants";
import { translations } from "@/lib/translations";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5200";

export function useDocuments(token: string | null, langue: Langue, vueActive: VueActive) {
  const cur = translations[langue];
  const [listeCourriers, setListeCourriers] = useState<CourrierSimule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  const fetchDocuments = async () => {
    if (!token) {
      console.warn("Aucun token disponible");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Appel parallèle aux trois endpoints avec les bonnes routes
      const [adminRes, juridiqueRes, sortantRes] = await Promise.all([
        fetch(`${BASE_URL}/api/CourrierAdmin`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/api/CourrierJuridique`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/api/CourrierSortant`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Tableau pour rassembler tous les documents
      let allDocs: CourrierSimule[] = [];

      // ---- ADMIN ----
      if (adminRes.ok) {
        const data = await adminRes.json();
        const formatted = data.map((c: any) => ({
          id: c.id,
          reference: c.numeroOrdre || c.reference || cur.na,
          objet: c.objet || c.sujet || cur.sansObjet,
          type: "entrant-admin" as VueActive,
          date: new Date(c.dernierTransfert || c.dateCreation).toLocaleDateString(),
          dateRaw: c.dernierTransfert || c.dateCreation,
          source: c.expediteur || c.source || cur.inconnu,
          serviceActuel: getServiceLabel(c.serviceActuel || "BureauOrdre", langue),
          serviceActuelKey: c.serviceActuel || "BureauOrdre",
          statut: getStatusLabel(c.statutActuel || "Nouveau", langue),
          filePath: c.filePath || null,
          description: c.objet || "Aucune description",
          transmissible: c.transmissible === false || c.transmissible === "Non" ? "Non" : "Oui"
        }));
        allDocs = [...allDocs, ...formatted];
      } else if (adminRes.status === 401) {
        logout();
        return;
      } else {
        console.warn(`Admin: ${adminRes.status} - ${adminRes.statusText}`);
      }

      // ---- JURIDIQUE (route corrigée) ----
      if (juridiqueRes.ok) {
        const data = await juridiqueRes.json();
        const formatted = data.map((c: any) => ({
          id: c.id,
          reference: c.numeroReference || c.reference || cur.na,
          objet: c.objet || c.sujet || cur.sansObjet,
          type: "entrant-juridique" as VueActive,
          date: new Date(c.dernierTransfert || c.dateCreation).toLocaleDateString(),
          dateRaw: c.dernierTransfert || c.dateCreation,
          source: c.demandeur || c.source || cur.inconnu,
          serviceActuel: getServiceLabel(c.serviceActuel || "BureauOrdre", langue),
          serviceActuelKey: c.serviceActuel || "BureauOrdre",
          statut: getStatusLabel(c.statutActuel || "Nouveau", langue),
          filePath: c.filePath || null,
          description: c.objet || "Aucune description",
          transmissible: c.transmissible === false || c.transmissible === "Non" ? "Non" : "Oui"
        }));
        allDocs = [...allDocs, ...formatted];
      } else if (juridiqueRes.status === 401) {
        logout();
        return;
      } else {
        console.warn(`Juridique: ${juridiqueRes.status} - ${juridiqueRes.statusText}`);
      }

      // ---- SORTANT ----
      if (sortantRes.ok) {
        const data = await sortantRes.json();
        const formatted = data.map((c: any) => {
          let statutBrut = c.statutActuel || "Nouveau";
          if (statutBrut === "Nouveau") statutBrut = "Brouillon";
          return {
            id: c.id,
            reference: c.numeroEnvoi || c.reference || cur.na,
            objet: c.objet || c.sujet || cur.sansObjet,
            type: c.typeSortant === "demande" ? "sortant-demande" : "sortant-normal",
            date: new Date(c.dernierTransfert || c.dateCreation).toLocaleDateString(),
            dateRaw: c.dernierTransfert || c.dateCreation,
            source: cur.serviceEmetteur,
            serviceActuel: getServiceLabel(c.serviceActuel || "BureauOrdre", langue),
            serviceActuelKey: c.serviceActuel || "BureauOrdre",
            statut: getStatusLabel(statutBrut, langue),
            destinataireExterne: c.destinataireExterne || cur.inconnu,
            dateEnvoi: c.dateEnvoi ? new Date(c.dateEnvoi).toLocaleDateString() : "-",
            typeSortant: c.typeSortant || "normal",
            tribunalOrigine: c.tribunalOrigine || "",
            tribunalDestination: c.tribunalDestination || "",
            filePath: c.filePath || null,
            description: c.objet || "Aucune description"
          };
        });
        allDocs = [...allDocs, ...formatted];
      } else if (sortantRes.status === 401) {
        logout();
        return;
      } else {
        console.warn(`Sortant: ${sortantRes.status} - ${sortantRes.statusText}`);
      }

      // Si aucune donnée n'a été récupérée, on garde un tableau vide
      // mais on ne lance pas d'erreur pour que l'UI reste fonctionnelle
      if (allDocs.length === 0) {
        console.warn("Aucun document trouvé (base vide ou endpoints inaccessibles)");
        setError("Aucun document disponible");
      } else {
        setError(null);
      }

      setListeCourriers(allDocs);
    } catch (err: any) {
      console.error("❌ Erreur fetch:", err);
      // On ne lance pas d'erreur, on laisse un tableau vide
      setError(err.message || "Erreur de chargement");
      setListeCourriers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDocuments();
    }
  }, [vueActive, token, langue]);

  return { listeCourriers, setListeCourriers, loading, error, refetch: fetchDocuments };
}