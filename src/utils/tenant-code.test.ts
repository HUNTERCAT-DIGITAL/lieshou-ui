/**
 * tenant-code storage 工具单测（自 admin-web utils/tenant-code.test.ts 迁移）.
 *
 * 差异:共享层无客户默认值,无记忆时返回 null（默认值由消费方回退）。
 */
import { afterEach, describe, expect, it } from 'vitest';

import {
  clearTenantCode,
  getTenantCode,
  setTenantCode,
  TENANT_CODE_STORAGE_KEY,
} from './tenant-code';

afterEach(() => {
  localStorage.clear();
});

describe('getTenantCode', () => {
  it('空 storage → null（无默认值,由消费方回退）', () => {
    expect(getTenantCode()).toBeNull();
  });

  it('有值 → 返回记忆值', () => {
    localStorage.setItem(TENANT_CODE_STORAGE_KEY, 'acme');
    expect(getTenantCode()).toBe('acme');
  });

  it('空白值 → null（视同未记忆）', () => {
    localStorage.setItem(TENANT_CODE_STORAGE_KEY, '   ');
    expect(getTenantCode()).toBeNull();
  });

  it('trim 后比较', () => {
    localStorage.setItem(TENANT_CODE_STORAGE_KEY, '  acme  ');
    expect(getTenantCode()).toBe('acme');
  });
});

describe('setTenantCode', () => {
  it('正常字符串写入', () => {
    setTenantCode('acme');
    expect(localStorage.getItem(TENANT_CODE_STORAGE_KEY)).toBe('acme');
  });

  it('trim 后写入', () => {
    setTenantCode('  acme  ');
    expect(localStorage.getItem(TENANT_CODE_STORAGE_KEY)).toBe('acme');
  });

  it('空字符串 / null / undefined → 不写', () => {
    setTenantCode('');
    setTenantCode('   ');
    setTenantCode(null);
    setTenantCode(undefined);
    expect(localStorage.getItem(TENANT_CODE_STORAGE_KEY)).toBeNull();
  });
});

describe('clearTenantCode', () => {
  it('写入后清除', () => {
    setTenantCode('acme');
    clearTenantCode();
    expect(getTenantCode()).toBeNull();
  });
});
