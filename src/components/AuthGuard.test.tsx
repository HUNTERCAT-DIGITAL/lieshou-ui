/**
 * AuthGuard 单测（L1-1 · 自 admin-web 迁移，受控 prop 版）.
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AuthGuard } from "./AuthGuard";

describe("AuthGuard", () => {
  it("未认证 → 跳转 /login（带 from 状态）", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <AuthGuard isAuthenticated={false}>
                <div>secret</div>
              </AuthGuard>
            }
          />
          <Route path="/login" element={<div>login-page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("login-page")).toBeInTheDocument();
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });

  it("已认证 → 渲染 children", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <AuthGuard isAuthenticated>
                <div>secret</div>
              </AuthGuard>
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("secret")).toBeInTheDocument();
  });

  it("自定义 loginPath 生效", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <AuthGuard isAuthenticated={false} loginPath="/signin">
                <div>secret</div>
              </AuthGuard>
            }
          />
          <Route path="/signin" element={<div>signin-page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("signin-page")).toBeInTheDocument();
  });
});
