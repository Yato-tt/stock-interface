import { useEffect, useRef } from 'react';
import { API_BASE_URL } from '../services/api';

// Eventos:
//   'estoque'  — quantidade de um produto mudou  { produto_id, quantidade }
//   'catalogo' — produto criado/atualizado/deletado { acao, produto_id }
export function useEstoqueSync({ onEstoque, onCatalogo }) {
  const esRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // EventSource não suporta headers nativamente —
    // passamos o token como query param e a API valida dos dois modos
    const url = `${API_BASE_URL}/eventos?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);
    esRef.current = es;

    es.addEventListener('estoque', (e) => {
      try {
        const dados = JSON.parse(e.data);
        onEstoque?.(dados);
      } catch { /* ignora payload malformado */ }
    });

    es.addEventListener('catalogo', (e) => {
      try {
        const dados = JSON.parse(e.data);
        onCatalogo?.(dados);
      } catch { /* ignora */ }
    });

    es.onerror = () => {
      // EventSource reconecta sozinho — não precisamos fazer nada
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, []);   // monta uma vez, desconecta no unmount
}
