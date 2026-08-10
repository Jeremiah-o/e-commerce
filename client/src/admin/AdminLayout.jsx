
import { useState } from "react";
import { NavLink, Outlet,Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CircleUserRound,
  LogOut,
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
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-text">
      <div className="flex h-screen overflow-hidden bg-background">
        <aside className="hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-border bg-white lg:block">
          <div className="border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <Store size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  ShopSmart
                </p>
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
                      : "text-text hover:bg-background hover:text-primary"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    Operations
                  </p>
                  <h2 className="text-lg font-bold text-text">
                    Control Center
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                to="/profile"
                className="relative flex items-center justify-center transition hover:bg-[#efe2d0] rounded-xl border border-border bg-[#fbf7f1] p-2 text-primary"
              >
                <CircleUserRound className="text-primary-dark" size={20} />
              </Link>
              <button
                onClick={logout}
                className="hover:cursor-pointer relative flex items-center justify-center transition hover:bg-[#efe2d0] rounded-xl border border-border bg-[#fbf7f1] p-2 text-primary"
              >
                <LogOut className="text-primary-dark" size={20} />
              </button>
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
                          : "text-text hover:bg-background hover:text-primary"
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

          <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
