'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { CalendarClock, ChevronRight, RotateCw } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Skeleton } from '@/components/ui/Skeleton';
import { Toast } from '@/components/ui/Toast';
import type { ToastData } from '@/components/ui/Toast';
import { usePainel } from '@/context/PainelContext';
import { api } from '@/services/api';
import type { MotivoRecusa, Pedido } from '@/types/pedido';
import { CardPedido } from './CardPedido';
import { COLUNAS, colunaDoPedido } from './regrasPedidos';
import type { Acao, Coluna, ColunaId } from './regrasPedidos';

type Canal = 'todos' | 'site' | 'ifood';

type Estado =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; mensagem: string }
  | { tipo: 'pronto'; pedidos: Pedido[] };

const COR_COLUNA: Record<ColunaId, string> = {
  novos: 'bg-brand-yellow',
  preparo: 'bg-status-warning',
  saida: 'bg-status-success',
};

/** Tela principal do dia (ADM-03): todos os pedidos e o próximo passo de cada um. */
export function QuadroPedidos() {
  const { contadores, atualizarContadores } = usePainel();
  const [estado, setEstado] = useState<Estado>({ tipo: 'carregando' });
  const [atualizando, setAtualizando] = useState(false);
  const [canal, setCanal] = useState<Canal>('todos');
  const [aba, setAba] = useState<ColunaId>('novos');
  const [ocupados, setOcupados] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<ToastData | null>(null);
  const [agora, setAgora] = useState(() => Date.now());
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const carregar = useCallback(async () => {
    const res = await api.buscarPedidosPainel();
    setAgora(Date.now());
    setEstado(
      res.success && res.data
        ? { tipo: 'pronto', pedidos: res.data }
        : { tipo: 'erro', mensagem: res.error ?? 'Não foi possível carregar os pedidos.' }
    );
  }, []);

  useEffect(() => {
    // Busca inicial: o setState acontece depois da resposta da API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, [carregar]);

  // O tempo de cada pedido anda sozinho
  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    []
  );

  function mostrarToast(tipo: ToastData['tipo'], texto: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), tipo, texto });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  async function atualizar() {
    setAtualizando(true);
    if (estado.tipo === 'erro') setEstado({ tipo: 'carregando' });
    await carregar();
    atualizarContadores();
    setAtualizando(false);
  }

  /** Troca um pedido na lista (ou devolve como estava, se a API falhar) */
  function substituir(pedido: Pedido) {
    setEstado((atual) =>
      atual.tipo === 'pronto'
        ? { ...atual, pedidos: atual.pedidos.map((p) => (p.id === pedido.id ? pedido : p)) }
        : atual
    );
  }

  function marcarOcupado(id: string, ocupado: boolean) {
    setOcupados((atual) => {
      const novo = new Set(atual);
      if (ocupado) novo.add(id);
      else novo.delete(id);
      return novo;
    });
  }

  async function avancar(pedido: Pedido, acao: Acao) {
    // Muda na tela na hora; se a API falhar, volta como estava
    substituir({
      ...pedido,
      status: acao.proximoStatus,
      statusAtualizadoEm: new Date().toISOString(),
    });
    marcarOcupado(pedido.id, true);
    const res = await api.mudarStatusPedido(pedido.id, acao.proximoStatus);
    marcarOcupado(pedido.id, false);
    if (res.success && res.data) {
      substituir(res.data);
      mostrarToast('sucesso', acao.confirmacao(pedido.numeroPedido));
      atualizarContadores();
    } else {
      substituir(pedido);
      mostrarToast('erro', res.error ?? 'Não foi possível mudar o pedido.');
    }
  }

  async function recusar(pedido: Pedido, motivo: MotivoRecusa, detalhe: string) {
    marcarOcupado(pedido.id, true);
    const res = await api.recusarPedido(pedido.id, motivo, detalhe);
    marcarOcupado(pedido.id, false);
    if (res.success && res.data) {
      substituir(res.data);
      mostrarToast('sucesso', `Pedido #${pedido.numeroPedido} recusado`);
      atualizarContadores();
    } else {
      mostrarToast('erro', res.error ?? 'Não foi possível recusar o pedido.');
    }
  }

  // Pedidos por coluna, já filtrados pelo canal e do mais antigo para o mais novo
  const porColuna = useMemo(() => {
    const vazio: Record<ColunaId, Pedido[]> = { novos: [], preparo: [], saida: [] };
    if (estado.tipo !== 'pronto') return vazio;
    for (const pedido of estado.pedidos) {
      if (pedido.agendado) continue;
      if (canal !== 'todos' && pedido.origem !== canal) continue;
      const coluna = colunaDoPedido(pedido);
      if (coluna) vazio[coluna].push(pedido);
    }
    const desde = (p: Pedido) => Date.parse(p.statusAtualizadoEm ?? p.criadoEm);
    for (const lista of Object.values(vazio)) lista.sort((a, b) => desde(a) - desde(b));
    return vazio;
  }, [estado, canal]);

  const totalPorCanal = useMemo(() => {
    const ativos =
      estado.tipo === 'pronto'
        ? estado.pedidos.filter((p) => !p.agendado && colunaDoPedido(p))
        : [];
    return {
      todos: ativos.length,
      site: ativos.filter((p) => p.origem === 'site').length,
      ifood: ativos.filter((p) => p.origem === 'ifood').length,
    };
  }, [estado]);

  const agendadosHoje = contadores.state === 'ready' ? contadores.data.agendadosHoje : null;
  const carregando = estado.tipo === 'carregando';

  return (
    <>
      <PageHeader
        title="Pedidos"
        description={`Hoje, ${new Date(agora).toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          timeZone: 'America/Sao_Paulo',
        })}`}
        actions={
          <>
            <div className="w-full sm:w-72">
              <SegmentedControl
                ariaLabel="Filtrar por canal"
                selected={canal}
                onChange={(valor) => setCanal(valor as Canal)}
                options={[
                  {
                    value: 'todos',
                    label: `Todos${carregando ? '' : ` (${totalPorCanal.todos})`}`,
                  },
                  { value: 'site', label: `Site${carregando ? '' : ` (${totalPorCanal.site})`}` },
                  {
                    value: 'ifood',
                    label: `iFood${carregando ? '' : ` (${totalPorCanal.ifood})`}`,
                  },
                ]}
              />
            </div>
            <Button
              variant="outline"
              onClick={atualizar}
              disabled={atualizando || carregando}
              className="px-4"
            >
              <RotateCw
                aria-hidden="true"
                className={`size-4 ${atualizando ? 'animate-spin' : ''}`}
                strokeWidth={2.4}
              />
              Atualizar
            </Button>
          </>
        }
      />

      {/* Aviso de agendados */}
      <Link
        href="/agendados"
        className="mb-5 flex min-h-11 items-center gap-2.5 rounded-2xl border border-brand-black/5 bg-white px-4 py-2.5 text-sm shadow-sm transition-shadow hover:shadow-md"
      >
        <CalendarClock aria-hidden="true" className="size-5 shrink-0 text-amber-500" />
        {agendadosHoje === null ? (
          <Skeleton className="h-4! w-48! rounded-full! border-transparent! bg-brand-black/5! backdrop-blur-none!" />
        ) : agendadosHoje === 0 ? (
          <span className="text-gray-600">Nenhum pedido agendado para hoje</span>
        ) : (
          <span>
            <strong className="font-semibold">
              {agendadosHoje} {agendadosHoje === 1 ? 'pedido agendado' : 'pedidos agendados'} para
              hoje
            </strong>
            <span className="text-gray-500"> · vão para Novos no horário certo</span>
          </span>
        )}
        <ChevronRight aria-hidden="true" className="ml-auto size-4 shrink-0 text-gray-400" />
      </Link>

      {estado.tipo === 'erro' ? (
        <Card className="flex flex-col items-start gap-3 border-red-200 bg-red-50/50">
          <p className="font-medium text-red-600">{estado.mensagem}</p>
          <Button variant="outline" onClick={atualizar}>
            Tentar de novo
          </Button>
        </Card>
      ) : (
        <>
          {/* Celular e tablet em pé: uma coluna por vez, em abas */}
          <Abas aba={aba} onTrocar={setAba} porColuna={porColuna} carregando={carregando} />

          <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-3">
            {carregando && <ManchasDeFundo />}
            {COLUNAS.map((coluna) => (
              <ColunaPedidos
                key={coluna.id}
                coluna={coluna}
                pedidos={porColuna[coluna.id]}
                carregando={carregando}
                visivelNoCelular={aba === coluna.id}
                agora={agora}
                ocupados={ocupados}
                onAvancar={avancar}
                onRecusar={recusar}
              />
            ))}
          </div>
        </>
      )}

      <Toast toast={toast} />
    </>
  );
}

function Abas({
  aba,
  onTrocar,
  porColuna,
  carregando,
}: {
  aba: ColunaId;
  onTrocar: (aba: ColunaId) => void;
  porColuna: Record<ColunaId, Pedido[]>;
  carregando: boolean;
}) {
  // Setas do teclado trocam de aba
  function teclas(event: KeyboardEvent<HTMLButtonElement>, indice: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const passo = event.key === 'ArrowRight' ? 1 : -1;
    const proxima = COLUNAS[(indice + passo + COLUNAS.length) % COLUNAS.length];
    onTrocar(proxima.id);
    document.getElementById(`aba-${proxima.id}`)?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Etapas dos pedidos"
      className="sticky top-[69px] z-20 -mx-4 mb-4 flex gap-1 bg-neutral-50/90 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 md:top-0 lg:hidden"
    >
      {COLUNAS.map((coluna, indice) => {
        const ativa = aba === coluna.id;
        return (
          <button
            key={coluna.id}
            id={`aba-${coluna.id}`}
            type="button"
            role="tab"
            aria-selected={ativa}
            aria-controls={`coluna-${coluna.id}`}
            tabIndex={ativa ? 0 : -1}
            onClick={() => onTrocar(coluna.id)}
            onKeyDown={(e) => teclas(e, indice)}
            className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl px-2 text-sm font-semibold transition-all ${
              ativa
                ? 'bg-brand-yellow text-brand-black shadow-md shadow-brand-yellow/20'
                : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            <span className="truncate">{coluna.titulo}</span>
            {!carregando && (
              <span
                className={`rounded-full px-1.5 text-xs font-bold ${
                  ativa ? 'bg-brand-black text-white' : 'bg-neutral-100 text-gray-700'
                }`}
              >
                {porColuna[coluna.id].length}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ColunaPedidos({
  coluna,
  pedidos,
  carregando,
  visivelNoCelular,
  agora,
  ocupados,
  onAvancar,
  onRecusar,
}: {
  coluna: Coluna;
  pedidos: Pedido[];
  carregando: boolean;
  visivelNoCelular: boolean;
  agora: number;
  ocupados: Set<string>;
  onAvancar: (pedido: Pedido, acao: Acao) => void;
  onRecusar: (pedido: Pedido, motivo: MotivoRecusa, detalhe: string) => void;
}) {
  return (
    <section
      id={`coluna-${coluna.id}`}
      role="tabpanel"
      aria-labelledby={`titulo-${coluna.id}`}
      aria-busy={carregando}
      className={`relative flex-col gap-3 rounded-2xl bg-neutral-100/80 p-3 lg:flex ${
        visivelNoCelular ? 'flex' : 'hidden'
      }`}
    >
      <div className="flex items-center gap-2 px-1 pt-1">
        <span aria-hidden="true" className={`size-2.5 rounded-full ${COR_COLUNA[coluna.id]}`} />
        <h2 id={`titulo-${coluna.id}`} className="text-base font-bold">
          {coluna.titulo}
        </h2>
        {!carregando && (
          <span className="rounded-full bg-brand-black px-2 py-0.5 text-xs font-bold text-white">
            {pedidos.length}
          </span>
        )}
        <span className="ml-auto text-xs text-gray-500">{coluna.dica}</span>
      </div>

      {carregando ? (
        <>
          <CardCarregando />
          <CardCarregando />
          {coluna.id === 'novos' && <CardCarregando />}
        </>
      ) : pedidos.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-brand-black/10 px-4 py-8 text-center text-sm font-medium text-gray-500">
          Nenhum pedido aqui agora
        </p>
      ) : (
        pedidos.map((pedido) => (
          <CardPedido
            key={pedido.id}
            pedido={pedido}
            coluna={coluna}
            agora={agora}
            ocupado={ocupados.has(pedido.id)}
            onAvancar={onAvancar}
            onRecusar={onRecusar}
          />
        ))
      )}
    </section>
  );
}

/** Card de vidro embaçado enquanto os pedidos carregam */
function CardCarregando() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/40 p-4 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Skeleton className="h-7! w-16!" />
        <Skeleton className="h-6! w-12! rounded-full!" />
        <Skeleton className="ml-auto h-6! w-20! rounded-full!" />
      </div>
      <Skeleton className="h-4! w-3/4!" />
      <Skeleton className="h-4! w-1/2!" />
      <Skeleton className="h-4! w-5/6!" />
      <Skeleton className="h-12! rounded-xl!" />
    </div>
  );
}

/** Manchas de cor atrás dos cards de vidro, para o desfoque aparecer */
function ManchasDeFundo() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
    >
      <div className="absolute top-8 left-[8%] size-64 rounded-full bg-brand-yellow/40 blur-3xl" />
      <div className="absolute top-40 left-[45%] size-56 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="absolute top-10 right-[6%] size-60 rounded-full bg-emerald-300/25 blur-3xl" />
    </div>
  );
}
