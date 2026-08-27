/**
 * useApiError —— 页面统一错误提示 hook（L1-1 · Bottom-Up）.
 *
 * 401 由 api-client 集中处理（自动 refresh → 重试 → 失败跳登录），
 * 页面无需关心；这里只负责把后端透传的错误 message 弹出提示。
 * 错误类型（AuthError / getErrorMessage）直接取 @lieshoucloud/api-client，无本地依赖。
 */
import { App } from "antd";
import { useCallback } from "react";

import { AuthError, getErrorMessage } from "@lieshoucloud/contract-api";

export function useApiError(): (e: unknown) => void {
  const { message } = App.useApp();
  return useCallback(
    (e: unknown) => {
      if (e instanceof AuthError && e.code === "UNAUTHORIZED") return; // api 层已统一处理
      message.error(getErrorMessage(e));
    },
    [message],
  );
}
