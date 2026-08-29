/**
 * 轻量自绘 SVG 柱状图（@lieshoucloud/charts）.
 *
 * 迁移自 admin-web/src/components/charts/BarChart.tsx（2026-09 下沉）。
 * 去端耦合：data 用通用 BarDatum（label/value）；fill 由调用方传（缺省品牌蓝）；
 * 去 antd Tooltip（原生 <title> 悬浮提示，零依赖）。
 */
import { useMemo } from "react";

import type { BarDatum } from "./series";
import { seriesExtent } from "./series";

export interface BarChartProps {
  data: BarDatum[];
  width?: number;
  height?: number;
  /** 单条柱颜色（缺省品牌主蓝 #1677ff） */
  fill?: string;
  /** 无障碍标签（缺省：图表名 + 数据条数） */
  ariaLabel?: string;
}

const BAR_GAP = 2;
const PAD_X = 8;
const PAD_TOP = 12;
const PAD_BOTTOM = 18;

export default function BarChart({
  data,
  width = 560,
  height = 180,
  fill = "#1677ff",
  ariaLabel,
}: BarChartProps) {
  const { max } = useMemo(() => seriesExtent(data), [data]);
  const innerW = width - PAD_X * 2;
  const innerH = height - PAD_TOP - PAD_BOTTOM;
  const slotW = data.length > 0 ? innerW / data.length : 0;
  const barW = Math.max(2, slotW - BAR_GAP);

  // x 轴刻度：显示首 / 中 / 末共 3 个标签
  const tickIdx = data.length > 0 ? [0, Math.floor(data.length / 2), data.length - 1] : [];
  const ticks = tickIdx.map((i) => ({
    x: PAD_X + i * slotW + slotW / 2,
    label: data[i]?.label ?? "",
  }));

  return (
    <div style={{ width: "100%" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height, display: "block" }}
        role="img"
        aria-label={ariaLabel ?? `柱状图，${data.length} 条数据`}
      >
        {data.map((b, i) => {
          const h = max > 0 ? (b.value / max) * innerH : 0;
          const x = PAD_X + i * slotW + (slotW - barW) / 2;
          const y = PAD_TOP + (innerH - h);
          return (
            <g key={b.label + i}>
              {/* 原生 tooltip（零依赖） */}
              <title>{`${b.label}：${b.value}`}</title>
              {/* 透明的 hover 命中区（更宽更好命中） */}
              <rect x={PAD_X + i * slotW} y={PAD_TOP} width={slotW} height={innerH} fill="transparent" />
              <rect x={x} y={y} width={barW} height={h} fill={fill} rx={2} />
            </g>
          );
        })}
        {/* x 轴 */}
        <line
          x1={PAD_X}
          x2={width - PAD_X}
          y1={PAD_TOP + innerH + 0.5}
          y2={PAD_TOP + innerH + 0.5}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
        {ticks.map((t) => (
          <text key={t.label + t.x} x={t.x} y={height - 4} textAnchor="middle" fontSize={11} fill="#9ca3af">
            {t.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
