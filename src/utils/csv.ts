/**
 * CSV 模板下载工具（自 admin-web utils/csv.ts 下沉 · 纯函数族）.
 *
 * 仅含通用实现;业务模板数据（客户/线索/商品字段）留在消费方业务层。
 */

/** 下载 CSV 模板（浏览器 Blob,带 BOM 保证 Excel 中文不乱码） */
export function downloadCsvTemplate(
  filename: string,
  header: string[],
  sampleRows: string[][],
): void {
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const lines = [header.map(esc).join(',')];
  for (const row of sampleRows) lines.push(row.map(esc).join(','));
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
