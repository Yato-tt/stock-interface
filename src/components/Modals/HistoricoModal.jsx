import { useState, useEffect } from 'react';
import { ArrowDownCircle, ArrowUpCircle, SlidersHorizontal, History } from 'lucide-react';
import movimentacaoService from '../../services/movimentacaoService';
import BaseModal from './BaseModal';

function LinhaMovimentacao({ mov }) {
  const tipo = mov.tipo;
  const isEntrada = tipo === 'entrada';
  const isAjuste  = tipo === 'ajuste';

  const data = new Date(mov.created_at).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const icone = isEntrada ? (
    <ArrowDownCircle size={20} className="text-primary" />
  ) : isAjuste ? (
    <SlidersHorizontal size={20} className="text-gray-400" />
  ) : (
    <ArrowUpCircle size={20} className="text-red-400" />
  );

  const badgeClass = isEntrada
    ? 'bg-primary/10 text-primary'
    : isAjuste
    ? 'bg-gray-100 text-gray-500'
    : 'bg-red-100 text-red-500';

  const badgeLabel = isEntrada
    ? `+${mov.quantidade}`
    : isAjuste
    ? `⇄ ${mov.quantidade_anterior} → ${mov.quantidade_posterior}`
    : `-${mov.quantidade}`;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="mt-0.5 shrink-0">{icone}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-sm truncate">
            {mov.Produto?.nome || '—'}
          </span>
          <span className={`text-xs font-bold shrink-0 px-2 py-0.5 rounded-full ${badgeClass}`}>
            {badgeLabel}
          </span>
        </div>

        {/* Para ajuste, a seta já está no badge — não duplicar na linha abaixo */}
        {!isAjuste && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
            <span>{mov.quantidade_anterior} → {mov.quantidade_posterior}</span>
            <span>·</span>
            <span>{mov.User ? `${mov.User.nome} ${mov.User.sobrenome}` : '—'}</span>
          </div>
        )}

        {isAjuste && (
          <div className="text-xs text-gray-400 mt-0.5">
            {mov.User ? `${mov.User.nome} ${mov.User.sobrenome}` : '—'}
          </div>
        )}

        <div className="flex items-center justify-between mt-0.5">
          {mov.motivo && (
            <span className="text-xs text-gray-500 italic truncate capitalize">{mov.motivo}</span>
          )}
          <span className="text-xs text-gray-300 ml-auto shrink-0">{data}</span>
        </div>
      </div>
    </div>
  );
}

export default function HistoricoModal({ open, close, produto = null }) {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function carregar() {
      setLoading(true);
      try {
        const dados = produto
          ? await movimentacaoService.listarPorProduto(produto.id)
          : await movimentacaoService.listarMovimentacoes();
        setMovimentacoes(dados);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [open, produto]);

  const titulo = produto
    ? `Histórico — ${produto.nome}`
    : 'Histórico de Movimentações';

  return (
    <BaseModal open={open} close={close} title={titulo}>
      <div className="flex flex-col px-2">
        {loading && (
          <div className="flex justify-center py-10 text-gray-400 text-sm">
            Carregando...
          </div>
        )}

        {!loading && movimentacoes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
            <History size={40} className="opacity-40" />
            <p className="text-sm">Nenhuma movimentação encontrada</p>
          </div>
        )}

        {!loading && movimentacoes.length > 0 && (
          <div className="max-h-[60vh] overflow-y-auto scrollable-list pr-1">
            {movimentacoes.map((mov) => (
              <LinhaMovimentacao key={mov.id} mov={mov} />
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  );
}
