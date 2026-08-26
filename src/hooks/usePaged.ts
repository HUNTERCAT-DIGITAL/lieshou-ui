/**
 * usePaged —— 分页子列表通用钩子（L1-1 · Bottom-Up）.
 *
 * 自 admin-web 本地实现下沉（案件详情 Tab / 知识资产中心等共用），
 * 依赖共享 useApiError。fetcher 契约：`(page, size) => Promise<{ items, total }>`。
 */
import { useCallback, useEffect, useState } from "react";

import { useApiError } from "./useApiError";

export interface PagedResult<T> {
  items: T[];
  total: number;
}

export interface UsePaged<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  loading: boolean;
  reload: () => void;
  goPage: (p: number) => void;
}

export function usePaged<T>(fetcher: (page: number, size: number) => Promise<PagedResult<T>>): UsePaged<T> {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const handleError = useApiError();
  const size = 20;

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const r = await fetcher(p, size);
        setItems(r.items);
        setTotal(r.total);
        setPage(p);
      } catch (e) {
        handleError(e);
      } finally {
        setLoading(false);
      }
    },
    [fetcher, handleError],
  );

  useEffect(() => {
    void load(1);
  }, [load]);

  return {
    items,
    total,
    page,
    size,
    loading,
    reload: () => load(page),
    goPage: (p: number) => load(p),
  };
}
