/**
 * 轻量图表数据工具（纯函数）.
 */

/** 单条柱数据（通用化：label + value，不绑定任何端内业务类型） */
export interface BarDatum {
  label: string;
  value: number;
}

/** 序列数值范围（y 轴归一化用；空数组返回 { max: 0, min: 0 }） */
export function seriesExtent(data: readonly BarDatum[]): { min: number; max: number } {
  if (data.length === 0) return { min: 0, max: 0 };
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const d of data) {
    if (d.value < min) min = d.value;
    if (d.value > max) max = d.value;
  }
  return { min, max };
}
