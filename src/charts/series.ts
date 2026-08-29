/**
 * 轻量图表数据工具（纯函数）.
 */

/** 单条柱数据（通用化：label + value，不绑定任何端内业务类型） */
export interface BarDatum {
  label: string;
  value: number;
}

/** 折线图数据点（时序 x 轴为时间/序号标签，y 为数值） */
export interface LinePoint {
  label: string;
  value: number;
}

/** 折线图序列（多序列 = 一张图多条线，如节点温度 node1/2/3） */
export interface LineSeries {
  name: string;
  color: string;
  points: LinePoint[];
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

/** 多序列总数值范围（折线图 y 轴归一化用；空返回 { max: 0, min: 0 }） */
export function seriesExtentAll(series: readonly LineSeries[]): { min: number; max: number } {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const s of series) {
    for (const p of s.points) {
      if (p.value < min) min = p.value;
      if (p.value > max) max = p.value;
    }
  }
  if (min === Number.POSITIVE_INFINITY) return { min: 0, max: 0 };
  return { min, max };
}
