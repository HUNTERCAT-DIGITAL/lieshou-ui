/**
 * PageLoading —— 路由懒加载 Suspense fallback（L1-1 · Bottom-Up）.
 *
 * 自 admin-web / desktop 两处本地实现下沉；`minHeight` 由消费端按布局微调
 * （admin-web 320 / desktop 240），消除重复。
 */
import { Spin } from "antd";

export interface PageLoadingProps {
  /** 占位区最小高度（px），默认 320 */
  minHeight?: number;
}

export default function PageLoading({ minHeight = 320 }: PageLoadingProps) {
  return (
    <div
      style={{
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin size="large" />
    </div>
  );
}
