'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getCurrentUser, getMenuCounters, getStoreStatus, setStoreOpen } from '@/services/api';
import type { ApiResult, MenuCounters, StaffUser, StoreStatus } from '@/types/painel';

/** Estado de qualquer dado que vem da API. */
export type Remote<T> =
  { state: 'loading' } | { state: 'error'; error: string } | { state: 'ready'; data: T };

type PainelContextValue = {
  store: Remote<StoreStatus>;
  counters: Remote<MenuCounters>;
  user: Remote<StaffUser>;
  /** true enquanto a mudança de aberta/pausada está sendo salva */
  savingStore: boolean;
  /** Mensagem quando a mudança da loja não foi salva */
  storeSaveError: string | null;
  toggleStore: () => void;
  reload: () => void;
};

const PainelContext = createContext<PainelContextValue | null>(null);

function toRemote<T>(result: ApiResult<T>): Remote<T> {
  return result.ok
    ? { state: 'ready', data: result.data }
    : { state: 'error', error: result.error };
}

export function PainelProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Remote<StoreStatus>>({ state: 'loading' });
  const [counters, setCounters] = useState<Remote<MenuCounters>>({ state: 'loading' });
  const [user, setUser] = useState<Remote<StaffUser>>({ state: 'loading' });
  const [savingStore, setSavingStore] = useState(false);
  const [storeSaveError, setStoreSaveError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [storeResult, countersResult, userResult] = await Promise.all([
      getStoreStatus(),
      getMenuCounters(),
      getCurrentUser(),
    ]);
    setStore(toRemote(storeResult));
    setCounters(toRemote(countersResult));
    setUser(toRemote(userResult));
  }, []);

  useEffect(() => {
    // Busca inicial: os setState acontecem depois da resposta da API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const reload = useCallback(() => {
    setStore({ state: 'loading' });
    setCounters({ state: 'loading' });
    setUser({ state: 'loading' });
    void load();
  }, [load]);

  const toggleStore = useCallback(() => {
    if (store.state !== 'ready' || savingStore) return;
    const previous = store.data;
    const next = { ...previous, isOpen: !previous.isOpen };

    // Muda na tela na hora e confirma com a API; se falhar, volta como estava.
    setStore({ state: 'ready', data: next });
    setSavingStore(true);
    setStoreSaveError(null);

    void setStoreOpen(next.isOpen).then((result) => {
      setSavingStore(false);
      if (result.ok) {
        setStore({ state: 'ready', data: result.data });
      } else {
        setStore({ state: 'ready', data: previous });
        setStoreSaveError(result.error);
      }
    });
  }, [store, savingStore]);

  const value = useMemo(
    () => ({ store, counters, user, savingStore, storeSaveError, toggleStore, reload }),
    [store, counters, user, savingStore, storeSaveError, toggleStore, reload]
  );

  return <PainelContext.Provider value={value}>{children}</PainelContext.Provider>;
}

export function usePainel() {
  const context = useContext(PainelContext);
  if (!context) throw new Error('usePainel precisa estar dentro de <PainelProvider>.');
  return context;
}
