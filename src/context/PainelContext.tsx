'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '@/services/api';
import type { LojaStatus } from '@/types/cardapio';
import type { ApiResponse } from '@/types/cliente';
import type { ContadoresMenu, UsuarioPainel } from '@/types/painel';

/** Estado de qualquer dado que vem da API. */
export type Remote<T> =
  { state: 'loading' } | { state: 'error'; error: string } | { state: 'ready'; data: T };

type PainelContextValue = {
  loja: Remote<LojaStatus>;
  contadores: Remote<ContadoresMenu>;
  usuario: Remote<UsuarioPainel>;
  /** true enquanto a mudança de aberta/pausada está sendo salva */
  salvandoLoja: boolean;
  /** Mensagem quando a mudança da loja não foi salva */
  erroAoSalvarLoja: string | null;
  alternarLoja: () => void;
  recarregar: () => void;
};

const PainelContext = createContext<PainelContextValue | null>(null);

function toRemote<T>(res: ApiResponse<T>): Remote<T> {
  return res.success && res.data !== null
    ? { state: 'ready', data: res.data }
    : { state: 'error', error: res.error ?? 'Erro inesperado.' };
}

export function PainelProvider({ children }: { children: ReactNode }) {
  const [loja, setLoja] = useState<Remote<LojaStatus>>({ state: 'loading' });
  const [contadores, setContadores] = useState<Remote<ContadoresMenu>>({ state: 'loading' });
  const [usuario, setUsuario] = useState<Remote<UsuarioPainel>>({ state: 'loading' });
  const [salvandoLoja, setSalvandoLoja] = useState(false);
  const [erroAoSalvarLoja, setErroAoSalvarLoja] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    const [resLoja, resContadores, resUsuario] = await Promise.all([
      api.buscarStatusLoja(),
      api.buscarContadoresMenu(),
      api.buscarUsuarioAtual(),
    ]);
    setLoja(toRemote(resLoja));
    setContadores(toRemote(resContadores));
    setUsuario(toRemote(resUsuario));
  }, []);

  useEffect(() => {
    // Busca inicial: os setState acontecem depois da resposta da API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, [carregar]);

  const recarregar = useCallback(() => {
    setLoja({ state: 'loading' });
    setContadores({ state: 'loading' });
    setUsuario({ state: 'loading' });
    void carregar();
  }, [carregar]);

  const alternarLoja = useCallback(() => {
    if (loja.state !== 'ready' || salvandoLoja) return;
    const anterior = loja.data;
    const proximo = { ...anterior, aberta: !anterior.aberta };

    // Muda na tela na hora e confirma com a API; se falhar, volta como estava.
    setLoja({ state: 'ready', data: proximo });
    setSalvandoLoja(true);
    setErroAoSalvarLoja(null);

    void api.alterarLojaAberta(proximo.aberta).then((res) => {
      setSalvandoLoja(false);
      if (res.success && res.data) {
        setLoja({ state: 'ready', data: res.data });
      } else {
        setLoja({ state: 'ready', data: anterior });
        setErroAoSalvarLoja(res.error);
      }
    });
  }, [loja, salvandoLoja]);

  const value = useMemo(
    () => ({
      loja,
      contadores,
      usuario,
      salvandoLoja,
      erroAoSalvarLoja,
      alternarLoja,
      recarregar,
    }),
    [loja, contadores, usuario, salvandoLoja, erroAoSalvarLoja, alternarLoja, recarregar]
  );

  return <PainelContext.Provider value={value}>{children}</PainelContext.Provider>;
}

export function usePainel() {
  const context = useContext(PainelContext);
  if (!context) throw new Error('usePainel precisa estar dentro de <PainelProvider>.');
  return context;
}
