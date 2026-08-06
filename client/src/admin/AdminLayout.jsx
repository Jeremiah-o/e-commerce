import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/", label: "Back to Store", icon: Store },
];

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-text">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-border bg-white shadow-[0_10px_35px_rgba(91,58,26,0.06)] lg:flex">
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <Store size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">ShopSmart</p>
                <h1 className="text-lg font-bold text-text">Admin</h1>
              </div>
            </div>
          </div>

          <nav className="space-y-2 px-4 py-5">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={label}
                to={to}
                end={to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-primary text-white shadow-[0_10px_24px_rgba(155,115,80,0.28)]"
                      : "text-text hover:bg-[#f8f2ea] hover:text-primary"
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border bg-white/90 backdrop-blur-md">
            <div className="flex items-center justify-between px-4 py-4 md:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileOpen((prev) => !prev)}
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-[#fbf7f1] p-2 text-text transition hover:text-primary lg:hidden"
                >
                  {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Operations</p>
                  <h2 className="text-lg font-bold text-text">Control Center</h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-border bg-[#fbf7f1] px-3 py-2 text-sm text-text/70 md:flex">
                  <Search size={15} className="text-primary" />
                  Search analytics
                </div>
                <div className="rounded-xl border border-border bg-[#fbf7f1] p-2 text-primary">
                  <Bell size={18} />
                </div>
              </div>
            </div>
          </header>

          {isMobileOpen && (
            <div className="border-b border-border bg-white p-4 lg:hidden">
              <nav className="space-y-2">
                {navItems.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={label}
                    to={to}
                    end={to === "/admin"}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-text hover:bg-[#f8f2ea] hover:text-primary"
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}

          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
