/**
 * PageLoading 单测（L1-1 · 自 admin-web/desktop 下沉）.
 */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PageLoading from "./PageLoading";

describe("PageLoading", () => {
  it("渲染加载中 Spin", () => {
    render(<PageLoading />);
    expect(document.querySelector(".ant-spin-spinning")).toBeInTheDocument();
  });

  it("minHeight prop 生效", () => {
    const { container } = render(<PageLoading minHeight={240} />);
    expect(container.firstChild).toHaveStyle({ minHeight: "240px" });
  });
});
