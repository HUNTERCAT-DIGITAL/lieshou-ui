/**
 * 租户编码记忆工具（自 admin-web utils/tenant-code.ts 下沉 · 纯函数族）.
 *
 * 记住最近一次使用的租户编码（登录体验）。
 * 注意:共享层**不含客户默认值**（历史默认 'jxlkas' 为凌科专属,留在消费方传入/回退）。
 * - 读:返回记忆值,无记忆返回 null
 * - 写:空值/空白不写;只接受非空字符串且 trim 后非空
 */

export const TENANT_CODE_STORAGE_KEY = 'lieshoucloud:lastTenantCode';

/** 安全读取 storage（SSR / 隐私模式抛错兜底）;无记忆返回 null */
export function getTenantCode(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(TENANT_CODE_STORAGE_KEY);
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}

/** 写入;空值/非法输入忽略 */
export function setTenantCode(code: string | undefined | null): void {
  if (typeof window === 'undefined') return;
  const v = (code ?? '').trim();
  if (!v) return; // 空值不写
  try {
    window.localStorage.setItem(TENANT_CODE_STORAGE_KEY, v);
  } catch {
    /* 隐私模式 / 配额超限：忽略 */
  }
}

/** 测试 / 切换租户时可调用 */
export function clearTenantCode(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(TENANT_CODE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
