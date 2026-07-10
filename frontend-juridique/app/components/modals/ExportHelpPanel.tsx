"use client";

import { useState } from "react";
import { Langue } from "@/app/types";

interface Props {
  langue: Langue;
  cur: any;
}

export function ExportHelpPanel({ langue, cur }: Props) {
  const [show, setShow] = useState(false);

  const requiredColumns = [
    { fr: "Titre / Objet", ar: "الموضوع", key: "objet", required: true },
    { fr: "Numéro de référence", ar: "رقم المرجع", key: "reference", required: true },
    { fr: "Date", ar: "التاريخ", key: "date", required: true },
    { fr: "Source", ar: "المصدر", key: "source", required: false },
    { fr: "Expéditeur", ar: "المرسل", key: "expediteur", required: false },
    { fr: "Destinataire", ar: "المستلم", key: "destinataire", required: false },
    { fr: "Service actuel", ar: "المصلحة الحالية", key: "serviceActuel", required: false },
    { fr: "Statut", ar: "الحالة", key: "statut", required: false },
    { fr: "Description", ar: "الوصف", key: "description", required: false },
    { fr: "Type de circuit", ar: "نوع الدائرة", key: "typeCircuit", required: false },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200 hover:bg-amber-100 flex items-center gap-1"
        aria-expanded={show}
      >
        <span className="text-[11px]">❓</span>
        {langue === "fr" ? "Aide Export" : "مساعدة التصدير"}
        <span className={`transition-transform ${show ? "rotate-180" : ""}`}>▼</span>
      </button>

      {show && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white border border-amber-200 rounded-lg shadow-lg p-3 z-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-amber-800">
              {langue === "fr" ? "Colonnes pour l'import Excel" : "أعمدة استيراد Excel"}
            </h4>
            <button
              type="button"
              onClick={() => setShow(false)}
              className="text-amber-500 hover:text-amber-700 text-xl leading-none px-1"
            >
              ×
            </button>
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto">
            {requiredColumns.map((col) => (
              <div
                key={col.key}
                className="flex items-center gap-2 px-2 py-1.5 rounded text-[10px] bg-amber-50 border border-amber-100"
              >
                <span className={`w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold ${col.required ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
                  {col.required ? "!" : "✓"}
                </span>
                <span className="flex-1 truncate font-medium text-slate-700">
                  {langue === "fr" ? col.fr : col.ar}
                </span>
                <span className={`text-[9px] px-1.5 rounded ${col.required ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                  {col.required
                    ? (langue === "fr" ? "Obligatoire" : "إلزامي")
                    : (langue === "fr" ? "Optionnel" : "اختياري")}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-amber-200">
            <p className="text-[9px] text-slate-500 mb-2">
              {langue === "fr"
                ? "Conseil : Utilisez la 1ère ligne comme en-tête. Les colonnes non reconnues seront ignorées."
                : "نصيحة : استخدم السطر الأول كعنوان. سيتم تجاهل الأعمدة غير المعروفة."}
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  const template = requiredColumns.map(c => c.key).join("\t");
                  navigator.clipboard.writeText(template);
                }}
                className="flex-1 px-2 py-1.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold border border-amber-200 hover:bg-amber-200"
              >
                {langue === "fr" ? "Copier modèle" : "نسخ النموذج"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const csv = requiredColumns.map(c => c.key).join(",");
                  navigator.clipboard.writeText(csv);
                }}
                className="flex-1 px-2 py-1.5 rounded bg-slate-100 text-slate-700 text-[9px] font-bold border border-slate-200 hover:bg-slate-200"
              >
                {langue === "fr" ? "CSV" : "CSV"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}