/**
 * 轻量自绘图表子路径导出（零第三方依赖，独立于 antd/echarts 大屏组件）.
 *
 * 消费端仅需图表时 import 本子路径，避免拉入整个 ui 包的 antd/echarts/framer-motion：
 *   import { LineChart } from "@lieshoucloud/ui/charts";
 */
export { default as BarChart, type BarChartProps } from "./BarChart";
export { default as LineChart, type LineChartProps } from "./LineChart";
export { seriesExtent, seriesExtentAll, type BarDatum, type LinePoint, type LineSeries } from "./series";
