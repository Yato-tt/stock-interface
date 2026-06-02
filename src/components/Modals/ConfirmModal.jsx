import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';
import Button from '../Button';

// variant: 'danger' | 'info'
export default function ConfirmModal({ open, title, message, onConfirm, onCancel, variant = 'danger', confirmLabel = 'Confirmar', cancelLabel = 'Cancelar' }) {
  if (!open) return null;

  const isInfo = variant === 'info';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`p-3 rounded-full ${isInfo ? 'bg-primary/10' : 'bg-red-100'}`}>
                {isInfo
                  ? <Info size={28} className="text-primary" />
                  : <AlertTriangle size={28} className="text-red-500" />
                }
              </div>

              <h2 className="font-semibold text-lg">{title}</h2>

              {message && (
                <p className="text-sm text-gray-500">{message}</p>
              )}

              <div className="flex gap-3 mt-2 w-full">
                <Button
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg"
                  onClick={onCancel}
                >
                  {cancelLabel}
                </Button>
                <Button
                  className={`flex-1 py-2 rounded-lg text-white ${isInfo ? '' : 'bg-red-500 border-red-500 hover:bg-red-400'}`}
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
