/**
 * 轻量自绘 SVG 折线图（@lieshoucloud/charts）.
 *
 * 与 BarChart 同风格：零第三方依赖、原生 <title> 悬浮提示、响应式（宽度 100%）。
 * 支持单序列（一条折线）与多序列（一张图多条线，如节点温度 node1/2/3）。
 *
 * 设计要点：
 * - y 轴：按多序列总 extent 归一化，3 条水平网格线 + 刻度（min/mid/max）
 * - x 轴：首/中/末 3 个标签（时间）
 * - 数据点 ≤ 30 时显示圆点（更少时更易读），否则只画线避免密集
 * - 折线下方半透明面积填充（可选 fill）
 */
import { useMemo } from "react";

import type { LineSeries } from "./series";
import { seriesExtentAll } from "./series";

export interface LineChartProps {
  series: LineSeries[];
  width?: number;
  height?: number;
  /** 面积填充（折线下方半透明色，缺省关闭） */
  area?: boolean;
  /** y 轴单位（显示在刻度后，如 ℃ / dB） */
  unit?: string;
  /** 无障碍标签 */
  ariaLabel?: string;
}

const PAD_X = 10;
const PAD_TOP = 14;
const PAD_BOTTOM = 22;

/** 多序列缺省配色（品牌蓝 / 绿 / 橙 / 粉 / 青 / 紫，循环） */
const SERIES_COLORS = ["#1677ff", "#52c41a", "#fa8c16", "#eb2f96", "#13c2c2", "#722ed1"];

/** 数值格式化（去多余小数） */
function fmt(v: number): string {
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(1);
}

export default function LineChart({
  series,
  width = 560,
  height = 220,
  area = false,
  unit = "",
  ariaLabel,
}: LineChartProps) {
  const all = useMemo(
    () => series.map((s, i) => ({ ...s, color: s.color ?? SERIES_COLORS[i % SERIES_COLORS.length] })),
    [series],
  );
  const { min, max } = useMemo(() => seriesExtentAll(all), [all]);
  const innerW = width - PAD_X * 2;
  const innerH = height - PAD_TOP - PAD_BOTTOM;
  // 单序列点数（用于 x 轴刻度 + 是否显示数据点）
  const pointCount = Math.max(...all.map((s) => s.points.length), 0);
  const showDots = pointCount > 0 && pointCount <= 30;

  // y 轴刻度（min/mid/max），span 为 0 时补 1 避免除零
  const span = max - min || 1;
  const yTicks = [max, (max + min) / 2, min].map((v, idx) => ({
    y: PAD_TOP + (idx === 0 ? 0 : idx === 2 ? innerH : innerH / 2),
    label: `${fmt(v)}${unit}`,
  }));

  // x 轴标签（首/中/末）
  const firstSeries = all.find((s) => s.points.length > 0);
  const tickIdx =
    pointCount > 0 ? [0, Math.floor(pointCount / 2), pointCount - 1] : [];
  const xTicks = tickIdx.map((i) => ({
    x: PAD_X + (pointCount > 1 ? (i / (pointCount - 1)) * innerW : 0),
    label: firstSeries?.points[i]?.label ?? "",
  }));

  /** 单点坐标 */
  const px = (i: number) =>
    PAD_X + (pointCount > 1 ? (i / (pointCount - 1)) * innerW : 0);
  const py = (v: number) => PAD_TOP + ((max - v) / span) * innerH;

  /** 折线 path（多段直线） */
  const linePath = (pts: { value: number }[]): string =>
    pts
      .map((p, i) => `${i === 0 ? "M" : "L"}${px(i)},${py(p.value)}`)
      .join(" ");

  return (
    <div style={{ width: "100%" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height, display: "block" }}
        role="img"
        aria-label={ariaLabel ?? `折线图，${all.length} 条序列`}
      >
        {/* 水平网格 + y 刻度 */}
        {yTicks.map((t) => (
          <g key={t.label + t.y}>
            <line x1={PAD_X} x2={width - PAD_X} y1={t.y} y2={t.y} stroke="#eef0f3" strokeWidth={1} />
            <text x={PAD_X - 2} y={t.y + 4} textAnchor="end" fontSize={10} fill="#9ca3af">
              {t.label}
            </text>
          </g>
        ))}

        {/* 各序列折线 */}
        {all.map((s, si) => {
          if (s.points.length === 0) return null;
          const path = linePath(s.points);
          return (
            <g key={s.name + si}>
              {/* 面积填充 */}
              {area && s.points.length > 1 && (
                <path
                  d={`${path} L${px(s.points.length - 1)},${PAD_TOP + innerH} L${px(0)},${PAD_TOP + innerH} Z`}
                  fill={s.color}
                  opacity={0.08}
                />
              )}
              {/* 折线 */}
              <path d={path} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" />
              {/* 数据点 */}
              {showDots &&
                s.points.map((p, i) => (
                  <g key={i}>
                    <title>{`${s.name} ${p.label}：${fmt(p.value)}${unit}`}</title>
                    <circle cx={px(i)} cy={py(p.value)} r={2.6} fill="#fff" stroke={s.color} strokeWidth={2} />
                  </g>
                ))}
            </g>
          );
        })}

        {/* x 轴刻度 */}
        {xTicks.map((t) => (
          <text key={t.label + t.x} x={t.x} y={height - 5} textAnchor="middle" fontSize={10} fill="#9ca3af">
            {t.label}
          </text>
        ))}
      </svg>

      {/* 图例（多序列时） */}
      {all.length > 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", justifyContent: "center", marginTop: 6 }}>
          {all.map((s) => (
            <span key={s.name} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#595959" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, display: "inline-block" }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
