import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface ToastData {
  id: number;
  tipo: 'sucesso' | 'erro';
  texto: string;
}

/** Confirmação rápida no rodapé da tela. Quem usa decide quando some. */
export const Toast = ({ toast }: { toast: ToastData | null }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {toast && (
        <div
          key={toast.id}
          className={`flex max-w-md items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg animate-subir ${
            toast.tipo === 'sucesso' ? 'bg-brand-black text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.tipo === 'sucesso' ? (
            <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-brand-yellow" />
          ) : (
            <XCircle aria-hidden="true" className="size-5 shrink-0" />
          )}
          {toast.texto}
        </div>
      )}
    </div>
  );
};
