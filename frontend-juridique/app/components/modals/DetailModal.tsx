"use client";

import type { TranslationKeys } from "@/lib/translations";
import { useEffect, useState, useCallback } from "react";
import { CourrierSimule } from "@/app/types";
import { useAuth } from "@/context/AuthContext";
import { SERVICE_GROUPS, getRoleLabel, WORKFLOW_STEPS, getWorkflowProgress, getDelayDays } from "@/lib/constants";
import { api } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/config/env";

interface DetailModalProps {
  doc: CourrierSimule | null;
  onClose: () => void;
  onTransfer?: (doc: CourrierSimule) => void;
  onSaved?: () => void;
  historique: unknown[];
  cur: TranslationKeys;
  langue?: "fr" | "ar";
  token?: string | null;
}

interface HistoryEntry {
  id: number;
  serviceOrigine: string;
  serviceDestination: string;
  date: string;
  remarques: string;
  statut: string;
  commentaire: string;
  motifRefus: string;
  doitRevenir: boolean;
}

interface DocDetails {
  type: string;
  Id: number;
  NumeroOrdre?: string;
  NumeroReference?: string;
  NumeroDossierJuridique?: string;
  Sujet?: string;
  Objet?: string;
  Expediteur?: string;
  Demandeur?: string;
  DateCreation?: string;
  DateReception?: string;
  DateEntree?: string;
  DateEnvoi?: string;
  TypeCircuit?: string;
  MotifException?: string;
  ServiceActuel?: string | number | null;
  StatutActuel?: string | number | null;
  FilePath?: string;
  filePath?: string;
  NumeroBureauOrdre?: string;
  EstSupprime?: boolean;
  TypeSortant?: string;
  DestinataireExterne?: string;
  TribunalOrigine?: string;
  TribunalDestination?: string;
  NumeroEnvoi?: string;
  EtatGlobal?: string;
  Circuit?: string;
  AutoriteRetrait?: string;
  transactions?: unknown[];
}

export function DetailModal({ doc, onClose, onTransfer, onSaved, cur, langue = "fr", token }: DetailModalProps) {
  const { hasPermission } = useAuth();
  const canAddNotes = hasPermission("ajouter_notes");
  const canEdit = hasPermission("creer_modifier");
  const canTransferDoc = hasPermission("transferer");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [docDetails, setDocDetails] = useState<DocDetails | null>(null);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedFields, setEditedFields] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const getServiceLabel = (value: string) => {
    for (const group of SERVICE_GROUPS) {
      for (const child of group.children) {
        if (child.value === value) return langue === "fr" ? child.fr : child.ar;
      }
    }
    return getRoleLabel(value, langue);
  };

  const fetchDocDetails = useCallback(async () => {
    if (!doc || !token) return;
    setLoadingDoc(true);
    try {
      const data = await api.get<DocDetails>(`/api/Workspace/document/${doc.id}`, token);
      setDocDetails(data);
      setEditedFields({
        NumeroOrdre: data.NumeroOrdre || "",
        Objet: data.Objet || "",
        Sujet: data.Sujet || "",
        Expediteur: data.Expediteur || "",
        Demandeur: data.Demandeur || "",
        DestinataireExterne: data.DestinataireExterne || "",
        TribunalOrigine: data.TribunalOrigine || "",
        TribunalDestination: data.TribunalDestination || "",
        TypeCircuit: data.TypeCircuit || "",
        MotifException: data.MotifException || "",
        EtatGlobal: data.EtatGlobal || "",
        Circuit: data.Circuit || "",
        AutoriteRetrait: data.AutoriteRetrait || "",
      });
    } catch (err) {
      console.error("Erreur fetch doc:", err);
    } finally {
      setLoadingDoc(false);
    }
  }, [doc, token]);

  const fetchHistory = useCallback(async () => {
    if (!doc || !token) return;
    setLoadingHistory(true);
    try {
      setHistory(await api.get<HistoryEntry[]>(`/api/Transactions/history/${doc.id}`, token));
    } catch (err) {
      console.error("Erreur fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [doc, token]);

  useEffect(() => {
    if (doc) {
      fetchDocDetails();
      fetchHistory();
      setEditMode(false);
      setEditedFields({});
      setNote("");
      setSuccessMsg("");
    }
  }, [doc, fetchDocDetails, fetchHistory]);

  useEffect(() => {
    if (!showPreview || !docDetails?.filePath) {
      return;
    }
    // Word/Excel/PDF all use backend preview endpoint now
    // No client-side conversion needed
  }, [showPreview, docDetails?.filePath]);

  const handleSave = async () => {
    if (!doc || !token) return;
    setSaving(true);
    try {
      await api.put(`/api/Workspace/document/${doc.id}`, editedFields, token);
      setSuccessMsg(cur.enregistreSucces);
      setEditMode(false);
      fetchDocDetails();
      if (onSaved) onSaved();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Erreur save:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async () => {
    if (!canAddNotes) { alert(cur.permissionRefusee); return; }
    if (!doc || !token || !note.trim()) return;
    setSavingNote(true);
    try {
      await api.post(`/api/Workspace/document/${doc.id}/notes`, { contenu: note.trim() }, token);
      setNote("");
      setSuccessMsg(cur.noteAjoutee);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Erreur note:", err);
    } finally {
      setSavingNote(false);
    }
  };

  if (!doc) return null;

  const getStatutBadge = (statut: string) => {
    if (statut === "EnAttente") return "bg-amber-100 text-amber-700";
    if (statut === "Accepte") return "bg-emerald-100 text-emerald-700";
    if (statut === "Refuse") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-600";
  };

  const getStatutLabel = (statut: string) => {
    if (statut === "EnAttente") return cur.enAttente;
    if (statut === "Accepte") return cur.statAcceptees;
    if (statut === "Refuse") return cur.statRefusees;
    return statut;
  };

  const progress = getWorkflowProgress(doc.serviceActuelKey || doc.serviceActuel);
  const delayDays = getDelayDays(doc.dateRaw || doc.date);
  const isLate = delayDays > 7;

  const inputClass = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition";

  const renderField = (label: string, fieldKey: string, value: string | undefined) => {
    if (editMode && fieldKey !== "NumeroOrdre") {
      return (
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <input
            type="text"
            value={editedFields[fieldKey] ?? value ?? ""}
            onChange={(e) => setEditedFields(prev => ({ ...prev, [fieldKey]: e.target.value }))}
            className={inputClass}
          />
        </div>
      );
    }
    return (
      <div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-sm dark:text-slate-200">{value || "-"}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {editMode
              ? cur.modificationDossier
              : cur.detailDossier}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
        </div>

        <div className="p-5 space-y-4">
          {loadingDoc ? (
            <p className="text-center text-slate-400 py-8">{cur.loadingText}</p>
          ) : (
            <>
              {/* Success Message */}
              {successMsg && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-sm font-bold text-emerald-700 dark:text-emerald-400 text-center">
                  {successMsg}
                </div>
              )}

              {/* Progress Bar */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {cur.avancement}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{progress.label}</span>
                </div>
                <div className="flex gap-1">
                  {WORKFLOW_STEPS.map((step, i) => {
                    const isActive = i < progress.step;
                    const isCurrent = i === progress.step - 1;
                    return (
                      <div key={i} className="flex-1">
                        <div className={`h-2 rounded-full ${isActive ? (isCurrent ? "bg-blue-500" : "bg-emerald-500") : "bg-slate-200 dark:bg-slate-600"}`}></div>
                        <p className={`text-[9px] mt-1 text-center ${isCurrent ? "text-blue-600 font-bold" : "text-slate-400"}`}>                           {langue === "fr" ? step.labelFr : step.labelAr}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delay Alert */}
              {isLate && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-red-700 dark:text-red-400">
                    {cur.enRetard ? (typeof cur.enRetard === 'function' ? cur.enRetard(delayDays) : cur.enRetard) : `En retard: ${delayDays}j`}
                  </span>
                </div>
              )}

              {/* Editable Fields */}
              <div className="grid grid-cols-2 gap-3">
                {renderField(cur.tblRef, "NumeroOrdre", docDetails?.NumeroOrdre || doc.reference)}
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{cur.tblType}</p>
                  <p className="text-sm dark:text-slate-200">{doc.type === "entrant-admin" ? cur.admin : doc.type === "entrant-juridique" ? cur.juridique : cur.sortants}</p>
                </div>
                {renderField(cur.tblDate, "DateCreation", docDetails?.DateCreation || doc.date)}
                {renderField(cur.tblSource, "Expediteur", docDetails?.Expediteur || doc.source)}
                {renderField(cur.tblTitre, "Objet", docDetails?.Objet || doc.objet)}
                {renderField(cur.serviceActuel, "ServiceActuel", typeof docDetails?.ServiceActuel === "string" ? docDetails.ServiceActuel : doc.serviceActuel)}
                {docDetails?.type === "entrant-juridique" && renderField(                   cur.demandeur,
                  "Demandeur",
                  docDetails?.Demandeur
                )}
                {docDetails?.type === "sortant-normal" || docDetails?.type === "sortant-demande" ? (
                  <>
                    {renderField(
                      cur.tribunalOrigine,
                      "TribunalOrigine",
                      docDetails?.TribunalOrigine
                    )}
                    {renderField(
                      cur.tribunalDestination,
                      "TribunalDestination",
                      docDetails?.TribunalDestination
                    )}
                  </>
                ) : null}
                {docDetails?.DestinataireExterne && (
                  <div className="col-span-2">
                    {renderField(cur.destinataireExterne, "DestinataireExterne", docDetails.DestinataireExterne)}
                  </div>
                )}
                {docDetails?.TypeCircuit && (
                  <div className="col-span-2">
                    {renderField(
                      cur.tblType,
                      "TypeCircuit",
                      docDetails.TypeCircuit
                    )}
                  </div>
                )}
                {docDetails?.MotifException && (
                  <div className="col-span-2">
                    {renderField(
                      cur.commentaire,
                      "MotifException",
                      docDetails.MotifException
                    )}
                  </div>
                )}
              </div>

              {/* Fichier joint - Section séparée */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">                   {cur.fichierJoint}
                </p>
                {docDetails?.filePath ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${showPreview ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"}`}
                      >
                        {showPreview ? (cur.fermer) : (cur.btnVoir)}
                      </button>
                      <a
                        href={`${API_BASE_URL}/api/FileUpload/${docDetails.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition"
                      >
                        📎 {cur.btnVoir}
                      </a>
                    </div>
                    {showPreview && (
                      <div className="border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden">
                        {docDetails.filePath.endsWith(".pdf") && (
                          <iframe
                            src={`${API_BASE_URL}/api/FileUpload/${docDetails.filePath}`}
                            className="w-full h-[500px]"
                            title="Preview PDF"
                          />
                        )}
                        {(docDetails.filePath.endsWith(".docx") || docDetails.filePath.endsWith(".doc")) && (
                          <iframe
                            src={`${API_BASE_URL}/api/FileUpload/preview/${docDetails.filePath}`}
                            className="w-full h-[500px]"
                            title="Preview Word"
                          />
                        )}
                        {(docDetails.filePath.endsWith(".xlsx") || docDetails.filePath.endsWith(".xls")) && (
                          <iframe
                            src={`${API_BASE_URL}/api/FileUpload/preview/${docDetails.filePath}`}
                            className="w-full h-[500px]"
                            title="Preview Excel"
                          />
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 text-xs font-bold">
                    {cur.aucunFichierJoint}
                  </div>
                )}
              </div>

              {/* Note */}
              {canAddNotes && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">                   {cur.ajouterNote}
                </p>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={cur.commentaire}
                    className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs dark:bg-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    disabled={!note.trim() || savingNote}
                    className="self-end px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {savingNote ? "..." : cur.addNote}
                  </button>
                </div>
              </div>
              )}

              {/* Timeline */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">                   {cur.chronologie}
                </h4>                 {loadingHistory ? (
                   <p className="text-xs text-slate-400">{cur.loadingText}</p>
                ) : history.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">{cur.aucunMouvement}</p>
                ) : (
                  <div className="relative max-h-48 overflow-y-auto">
                    <div className="absolute start-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-emerald-500 to-slate-200"></div>
                    <div className="space-y-3">
                      {history.map((entry, index) => {
                        const isLast = index === history.length - 1;
                        return (
                          <div key={entry.id} className="relative ps-8">
                            <div className={`absolute start-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                              entry.statut === "Accepte" ? "bg-emerald-500" :
                              entry.statut === "Refuse" ? "bg-red-500" :
                              isLast ? "bg-blue-500 animate-pulse" : "bg-amber-500"
                            }`}></div>
                            <div className={`p-2 rounded-lg border ${isLast ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" : "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700"}`}>
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                                  {getServiceLabel(entry.serviceOrigine)} → {getServiceLabel(entry.serviceDestination)}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getStatutBadge(entry.statut)}`}>
                                  {getStatutLabel(entry.statut)}
                                </span>
                              </div>
                              <div className="text-[9px] text-slate-500 dark:text-slate-400">
                                {new Date(entry.date).toLocaleString()}
                              </div>
                              {entry.remarques && (
                                <div className="text-[9px] text-slate-600 dark:text-slate-300 mt-1 italic">{entry.remarques}</div>
                              )}
                              {entry.motifRefus && (
                                <div className="text-[9px] text-red-600 dark:text-red-400 mt-1">
                                  {entry.motifRefus}
                                  {entry.doitRevenir && (
                                    <span className="ms-1 text-amber-600 font-bold"> —                {cur.retourne}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between">
            <div className="flex gap-2">
              {onTransfer && canTransferDoc && doc.transmissible !== "Non" && (
                <button
                  type="button"
                  onClick={() => { onClose(); onTransfer(doc); }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"
                >
                  {cur.btnSuivant}
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => { setEditMode(false); fetchDocDetails(); }}
                    className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-500 transition"
                  >
                    {cur.annulerLabel}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition"
                  >
                    {saving ? "..." : cur.enregistrerLabel}
                  </button>
                </>
              ) : (
                <>
                  {canEdit && (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition"
                  >
                    {cur.modifierLabel}
                  </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-500 transition"
                  >
                    {cur.fermer}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
