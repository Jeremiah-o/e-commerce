import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  ShoppingBag,
  ShoppingCart,
  CircleUserRound,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [keyword, setKeyword] = useState("");
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
      <div className="mx-auto flex max-w-7xl items-center justify-between  px-6 py-4 w-full">
        <div>
          <Link to="/" className="flex items-center gap-1">
            <ShoppingBag className="text-primary" size={22} />
            <h1 className="text-2xl font-bold">
              Shop<span className="text-primary">Smart</span>
            </h1>
          </Link>
        </div>

        <div className=" ml-10 flex items-center gap-8 text-sm font-medium lg:flex">
          <Link to="/" className="hover:text-primary text-[#333333]">
            Home
          </Link>
          <Link to="/products" className="hover:text-primary text-[#333333]">
            Products
          </Link>
          {/* <Link to="/products" className="hover:text-primary text-[#333333]">
            Categories
          </Link> */}
          {/* <Link to="/products" className="hover:text-primary text-[#333333]">
            Deals
          </Link>
          <Link to="/products" className="hover:text-primary text-[#333333]">
            About Us
          </Link> */}
        </div>

        <div className=" ml-auto flex items-center  gap-3 lg:flex">
          <form
            onSubmit={searchHandler}
            className="flex items-center rounded-md bg-background px-2 text-sm"
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

          {user ? (
            <div className="flex items-center gap-4">
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
              <Link
                to="/profile"
                className=" relative flex items-center justify-center rounded-full bg-[#f7efe4] p-2 transition hover:bg-[#efe2d0]"
              >
                <CircleUserRound className="text-primary-dark" size={20} />
              </Link>
              <button
                onClick={logout}
                className=" hover:cursor-pointer relative flex items-center justify-center rounded-full bg-[#f7efe4] p-2 transition hover:bg-[#efe2d0]"
              >
                <LogOut className="text-primary-dark" size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
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
    </nav>
  );
}

export default Navbar;
