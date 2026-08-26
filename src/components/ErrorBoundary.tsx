/**
 * ErrorBoundary —— 全局错误边界（L1-1 · Bottom-Up）.
 *
 * 页面渲染 / 生命周期异常时兜底展示，避免白屏；提供「刷新」「返回工作台」。
 * 自 admin-web 本地实现下沉，`homePath` 由消费端配置（默认 /welcome）。
 * 建议在 App 层与布局内容层各挂一层：布局崩溃由外层兜，页面崩溃保住菜单。
 */
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button, Result } from "antd";

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** 「返回工作台」按钮跳转路径，默认 '/welcome' */
  homePath?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info);
  }

  private reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children, homePath = "/welcome" } = this.props;
    if (error) {
      return (
        <Result
          status="500"
          title="页面出错了"
          subTitle={error.message || "发生未知错误，请刷新重试"}
          extra={[
            <Button key="reload" type="primary" onClick={() => window.location.reload()}>
              刷新页面
            </Button>,
            <Button
              key="home"
              onClick={() => {
                this.reset();
                window.location.href = homePath;
              }}
            >
              返回工作台
            </Button>,
          ]}
        />
      );
    }
    return children;
  }
}
