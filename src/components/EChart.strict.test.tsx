/**
 * EChart StrictMode 挂载测试 —— 验证每个 chart 实例都被喂了初始 option（防白屏）.
 *
 * 背景：echarts.init 与 setOption 若拆成两个独立 effect，
 * StrictMode 双挂载（setup → cleanup → setup）时，若 option 依赖未变导致
 * 更新 effect 不重跑，第二个实例会拿到空 option 白屏。
 */
import { StrictMode } from "react";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import EChart from "./EChart";

interface FakeChart {
  id: number;
  setOption: ReturnType<typeof vi.fn>;
  dispose: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  resize: ReturnType<typeof vi.fn>;
}

const { initMock, instances } = vi.hoisted(() => {
  const instances: FakeChart[] = [];
  const initMock = vi.fn((..._args: unknown[]) => {
    const inst: FakeChart = {
      id: instances.length,
      setOption: vi.fn(),
      dispose: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      resize: vi.fn(),
    };
    instances.push(inst);
    return inst;
  });
  return { initMock, instances };
});

vi.mock("echarts", () => ({
  init: (...args: unknown[]) => initMock(...args),
}));

class FakeResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

beforeEach(() => {
  initMock.mockClear();
  instances.length = 0;
  vi.stubGlobal("ResizeObserver", FakeResizeObserver);
});

describe("EChart StrictMode 挂载", () => {
  it("StrictMode 双挂载时，每个实例都收到初始 option（不白屏）", () => {
    render(
      <StrictMode>
        <EChart option={{ title: { text: "demo" } }} />
      </StrictMode>,
    );

    expect(initMock).toHaveBeenCalledTimes(2); // StrictMode：双挂载
    for (const inst of instances) {
      expect(inst.setOption).toHaveBeenCalledTimes(1); // 每个实例至少拿到一次 option
    }
  });

  it("卸载后重挂（tab 切换），新实例同样拿到 option", () => {
    const { unmount } = render(<EChart option={{ title: { text: "demo" } }} />);
    unmount();
    render(<EChart option={{ title: { text: "demo" } }} />);

    expect(initMock).toHaveBeenCalledTimes(2);
    for (const inst of instances) {
      expect(inst.setOption).toHaveBeenCalledTimes(1);
    }
  });

  it("option 更新时全量替换（notMerge）", () => {
    const { rerender } = render(<EChart option={{ title: { text: "a" } }} />);
    rerender(<EChart option={{ title: { text: "b" } }} />);

    expect(instances).toHaveLength(1);
    expect(instances[0].setOption).toHaveBeenCalledTimes(2);
    expect(instances[0].setOption).toHaveBeenLastCalledWith({ title: { text: "b" } }, true);
  });
});
