import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

function BaseModal({ open, close, title, children, loading = false }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={loading ? undefined : close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className={`fixed z-50 bg-white shadow-xl overflow-y-auto ${
              isMobile
                ? "bottom-0 left-0 right-0 rounded-t-2xl p-4 max-h-[85vh]"
                : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 w-[90%] max-w-lg max-h-[90vh]"
            }`}
            initial={{ y: isMobile ? "100%" : "-20px", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: isMobile ? "100%" : "-20px", opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">{title}</h2>
              <button
                onClick={close}
                disabled={loading}
                className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <X size={18} />
              </button>
            </div>

            {/* Conteúdo com overlay de loading */}
            <div className="relative">
              {children}

              {/* Overlay escuro sobre o conteúdo durante o carregamento */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    className="absolute inset-0 bg-white/75 rounded-xl z-10 flex flex-col items-center justify-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Loader2 size={32} className="animate-spin text-primary" />
                    <span className="text-sm text-gray-500">Aguarde...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BaseModal;
