'use client';

import { useState } from 'react';
import { AlertTriangle, Bike, Clock, Loader2, MessageSquareText, Store, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { MotivoRecusa, Pedido } from '@/types/pedido';
import {
  MOTIVOS_RECUSA,
  acaoPrincipal,
  formatarReais,
  horaDaLoja,
  minutosNaEtapa,
  nivelDoTempo,
  textoPagamento,
} from './regrasPedidos';
import type { Acao, Coluna, NivelTempo } from './regrasPedidos';

interface CardPedidoProps {
  pedido: Pedido;
  coluna: Coluna;
  /** Hora atual (ms), atualizada pelo quadro a cada 30 s */
  agora: number;
  /** true enquanto uma ação deste pedido está sendo salva */
  ocupado: boolean;
  onAvancar: (pedido: Pedido, acao: Acao) => void;
  onRecusar: (pedido: Pedido, motivo: MotivoRecusa, detalhe: string) => void;
}

export function CardPedido({
  pedido,
  coluna,
  agora,
  ocupado,
  onAvancar,
  onRecusar,
}: CardPedidoProps) {
  const [recusando, setRecusando] = useState(false);
  const minutos = minutosNaEtapa(pedido, agora);
  const nivel = nivelDoTempo(minutos, coluna);
  const acao = acaoPrincipal(pedido);
  const pagamento = textoPagamento(pedido);
  const retirada = pedido.tipoEntrega === 'retirada';
  const novo = pedido.status === 'pendente';

  const destaque =
    nivel === 'atrasado'
      ? 'border-red-300 ring-2 ring-red-200'
      : novo
        ? 'border-brand-yellow ring-2 ring-brand-yellow/30'
        : 'border-brand-black/5';

  return (
    <article
      aria-label={`Pedido ${pedido.numeroPedido}`}
      className={`animate-subir flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm ${destaque}`}
    >
      {/* Número, origem e tempo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl leading-none font-bold tracking-tight">
          #{pedido.numeroPedido}
        </span>
        {pedido.origem === 'ifood' ? (
          <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white">
            iFood
          </span>
        ) : (
          <span className="rounded-full bg-brand-black px-2.5 py-0.5 text-xs font-bold text-white">
            Site
          </span>
        )}
        <TempoPedido minutos={minutos} nivel={nivel} />
      </div>

      {/* Hora, entrega e cliente */}
      <div className="flex flex-col gap-1 text-sm text-gray-600">
        <span className="flex items-center gap-1.5">
          {retirada ? (
            <Store aria-hidden="true" className="size-4 shrink-0 text-amber-500" />
          ) : (
            <Bike aria-hidden="true" className="size-4 shrink-0 text-amber-500" />
          )}
          <span>
            Feito às {horaDaLoja(pedido.criadoEm)} ·{' '}
            <strong className="font-semibold text-brand-black">
              {retirada
                ? 'Retirada no balcão'
                : `Entrega · ${pedido.cliente.bairro ?? 'bairro não informado'}`}
            </strong>
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <User aria-hidden="true" className="size-4 shrink-0 text-amber-500" />
          {pedido.cliente.nome}
        </span>
      </div>

      {/* Itens */}
      <ul className="flex flex-col gap-2 border-t border-dashed border-brand-black/10 pt-3">
        {pedido.itens.map((item, i) => (
          <li key={`${item.produtoId}-${i}`} className="flex gap-2 text-[15px]">
            <span className="min-w-7 font-bold">{item.quantidade}×</span>
            <span className="flex flex-col">
              <span className="font-medium">{item.nome}</span>
              {item.adicionaisEscolhidos && item.adicionaisEscolhidos.length > 0 && (
                <span className="text-sm text-gray-500">
                  {item.adicionaisEscolhidos.join(' · ')}
                </span>
              )}
              {item.observacao && (
                <span className="text-sm font-semibold text-amber-800">
                  Obs.: {item.observacao}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* Observação do pedido */}
      {pedido.observacaoGeral && (
        <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-900">
          <MessageSquareText aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            <span className="sr-only">Observação: </span>
            {pedido.observacaoGeral}
          </span>
        </p>
      )}

      {/* Pagamento e total */}
      <div className="flex items-center justify-between gap-2 border-t border-dashed border-brand-black/10 pt-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            pagamento.pago ? 'bg-emerald-500/10 text-emerald-700' : 'bg-orange-100 text-orange-800'
          }`}
        >
          {pagamento.texto}
        </span>
        <span className="text-lg font-bold">{formatarReais(pedido.totalCentavos)}</span>
      </div>

      {/* Ações */}
      {recusando ? (
        <PainelRecusa
          numero={pedido.numeroPedido}
          ocupado={ocupado}
          onVoltar={() => setRecusando(false)}
          onConfirmar={(motivo, detalhe) => onRecusar(pedido, motivo, detalhe)}
        />
      ) : (
        acao && (
          <div className="flex gap-2">
            {novo && (
              <Button
                variant="outline"
                disabled={ocupado}
                onClick={() => setRecusando(true)}
                className="min-h-12 px-4"
              >
                Recusar
              </Button>
            )}
            <Button
              variant={novo ? 'primary' : pedido.status === 'em_preparo' ? 'secondary' : 'outline'}
              disabled={ocupado}
              onClick={() => onAvancar(pedido, acao)}
              className="min-h-12 flex-1 text-base"
            >
              {ocupado && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
              {acao.rotulo}
            </Button>
          </div>
        )
      )}
    </article>
  );
}

const ESTILO_TEMPO: Record<NivelTempo, { classe: string; palavra: string }> = {
  normal: { classe: 'bg-neutral-100 text-gray-700', palavra: '' },
  atencao: { classe: 'bg-orange-100 text-orange-800', palavra: 'Atenção' },
  atrasado: { classe: 'bg-red-100 text-red-700', palavra: 'Atrasado' },
};

/** Tempo na etapa atual. A cor sempre vem com a palavra (não só a cor). */
function TempoPedido({ minutos, nivel }: { minutos: number; nivel: NivelTempo }) {
  const { classe, palavra } = ESTILO_TEMPO[nivel];
  const tempo = minutos === 0 ? 'agora' : `${minutos} min`;
  const Icone = nivel === 'normal' ? Clock : AlertTriangle;
  return (
    <span
      className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ${classe}`}
      title={`Nesta etapa há ${minutos} min${palavra ? ` · ${palavra}` : ''}`}
    >
      <Icone aria-hidden="true" className="size-3.5" strokeWidth={2.6} />
      {tempo}
      {palavra && <> · {palavra}</>}
    </span>
  );
}

function PainelRecusa({
  numero,
  ocupado,
  onVoltar,
  onConfirmar,
}: {
  numero: number;
  ocupado: boolean;
  onVoltar: () => void;
  onConfirmar: (motivo: MotivoRecusa, detalhe: string) => void;
}) {
  const [motivo, setMotivo] = useState<MotivoRecusa | null>(null);
  const [detalhe, setDetalhe] = useState('');
  const nomeGrupo = `motivo-${numero}`;

  return (
    <fieldset className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50/60 p-3">
      <legend className="sr-only">Por que recusar o pedido #{numero}?</legend>
      <p aria-hidden="true" className="text-sm font-bold text-red-700">
        Por que recusar o pedido #{numero}?
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {MOTIVOS_RECUSA.map((m) => (
          <label
            key={m.valor}
            className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors ${
              motivo === m.valor
                ? 'border-red-500 bg-white text-red-700'
                : 'border-red-200 bg-white/70 text-gray-700 hover:border-red-300'
            }`}
          >
            <input
              type="radio"
              name={nomeGrupo}
              value={m.valor}
              checked={motivo === m.valor}
              onChange={() => setMotivo(m.valor)}
              className="size-4 accent-red-600"
            />
            {m.rotulo}
          </label>
        ))}
      </div>

      {motivo === 'outro' && (
        <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
          Detalhe (opcional)
          <input
            type="text"
            value={detalhe}
            maxLength={120}
            onChange={(e) => setDetalhe(e.target.value)}
            placeholder="Ex.: endereço incompleto"
            className="min-h-11 rounded-xl border border-brand-black/20 bg-white px-3 font-normal focus:ring-2 focus:ring-brand-yellow focus:outline-none"
          />
        </label>
      )}

      {!motivo && (
        <p className="text-xs font-medium text-red-700">Escolha um motivo para recusar.</p>
      )}

      <div className="flex gap-2">
        <Button variant="outline" disabled={ocupado} onClick={onVoltar} className="min-h-12 px-4">
          Voltar
        </Button>
        <button
          type="button"
          disabled={!motivo || ocupado}
          onClick={() => motivo && onConfirmar(motivo, detalhe)}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 font-semibold text-white transition-all hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {ocupado && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          Confirmar recusa
        </button>
      </div>
    </fieldset>
  );
}
