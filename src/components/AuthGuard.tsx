/**
 * AuthGuard —— 路由守卫（L1-1 · Bottom-Up）.
 *
 * 自 admin-web / desktop 两处同源实现下沉。不依赖任何端内 auth store
 * （避免共享包反向依赖应用层），认证状态由消费端经 `isAuthenticated` prop 注入。
 *
 * 用法（admin-web 示例）:
 *   <Route
 *     element={
 *       <AuthGuard isAuthenticated={useAuthStore((s) => s.isAuthenticated)}>
 *         <BasicLayout />
 *       </AuthGuard>
 *     }
 *   >
 */
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export interface AuthGuardProps {
  children: ReactNode;
  /** 是否已认证；由消费端从各自 auth store 读取传入 */
  isAuthenticated: boolean;
  /** 未认证跳转路径，默认 '/login' */
  loginPath?: string;
}

export function AuthGuard({ children, isAuthenticated, loginPath = "/login" }: AuthGuardProps) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}
