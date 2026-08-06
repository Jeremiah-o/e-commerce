import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  ShoppingBag,
  ShoppingCart,
  CircleUserRound,
  LogOut,
  Package,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { cart } = useCart();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const searchHandler = (e) => {
    e.preventDefault();

    const query = keyword.trim();

    if (query) {
      navigate(`/search/${encodeURIComponent(query)}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <nav className="bg-sand text-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <Link to="/" className="flex items-center gap-1">
            <ShoppingBag className="text-primary" size={22} />
            <h1 className="text-2xl font-bold">
              Shop<span className="text-primary">Smart</span>
            </h1>
          </Link>
        </div>

        <div className="ml-10 hidden items-center gap-8 text-sm font-medium lg:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition hover:text-primary ${isActive ? "text-primary" : "text-[#333333]"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `transition hover:text-primary ${isActive ? "text-primary" : "text-[#333333]"}`
            }
          >
            Products
          </NavLink>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <form
            onSubmit={searchHandler}
            className="hidden items-center rounded-md bg-background px-2 text-sm md:flex"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-56 bg-transparent px-2 py-2 text-white outline-none placeholder:text-slate-300"
            />
            <button
              type="submit"
              className="text-primary hover:text-primary-dark hover:cursor-pointer"
            >
              <Search size={18} />
            </button>
          </form>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-full bg-[#f7efe4] p-2 text-primary-dark transition hover:bg-[#efe2d0] lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {user ? (
            <div className="hidden items-center gap-4 lg:flex">
              <Link
                to="/cart"
                className="relative flex items-center justify-center rounded-full bg-[#f7efe4] p-2 transition hover:bg-[#efe2d0]"
              >
                <ShoppingCart className="text-primary-dark" size={20} />

                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-dark px-1 text-[10px] font-bold text-white">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `flex items-center gap-2 transition text-primary bg-[#f7efe4] p-2 rounded-full hover:text-primary-dark ${isActive ? "text-primary" : "text-[#333333]"}`
                }
              >
                <Package size={20} />
              </NavLink>

              <Link
                to="/profile"
                className="relative flex items-center justify-center rounded-full bg-[#f7efe4] p-2 transition hover:bg-[#efe2d0]"
              >
                <CircleUserRound className="text-primary-dark" size={20} />
              </Link>
              <button
                onClick={logout}
                className="hover:cursor-pointer relative flex items-center justify-center rounded-full bg-[#f7efe4] p-2 transition hover:bg-[#efe2d0]"
              >
                <LogOut className="text-primary-dark" size={20} />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                to="/login"
                className="hover:text-primary-dark text-primary"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-dark"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border/50 bg-[#f8f2ea] px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-[#333333]">
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 transition hover:bg-[#efe2d0] hover:text-primary ${isActive ? "bg-[#efe2d0] text-primary" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 transition hover:bg-[#efe2d0] hover:text-primary ${isActive ? "bg-[#efe2d0] text-primary" : ""}`
              }
            >
              Products
            </NavLink>
            {user && (
              <NavLink
                to="/orders"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-[#efe2d0] hover:text-primary ${isActive ? "bg-[#efe2d0] text-primary" : ""}`
                }
              >
                <Package size={15} />
                My Orders
              </NavLink>
            )}

            {user ? (
              <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-3">
                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-[#efe2d0] hover:text-primary"
                >
                  <ShoppingCart size={16} />
                  Cart
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-[#efe2d0] hover:text-primary"
                >
                  <CircleUserRound size={16} />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-[#efe2d0] hover:text-primary"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-3 py-2 transition hover:bg-[#efe2d0] hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg bg-primary px-3 py-2 text-center font-semibold text-white transition hover:bg-primary-dark"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
