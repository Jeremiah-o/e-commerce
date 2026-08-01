import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, Search } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();

  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
  e.preventDefault();

  if (keyword.trim()) {
    navigate(`/search/${keyword}`);
  } else {
    navigate("/products");
  }
};

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between gap-6">
        <div>
          <Link to="/" className="flex gap-1 h-7 items-center">
            <ShoppingBag className="text-blue-600" />
            <h1 className="text-2xl font-bold">
              Shop<span className="text-blue-600">Smart</span>
            </h1>
          </Link>
        </div>
        <div className="flex gap-4">
          <Link to="/"  className="hover:text-blue-600">Home</Link>
          <Link to={"/products"} className="hover:text-blue-600">Products</Link>
          <Link className="hover:text-blue-600">Categories</Link>
          <Link className="hover:text-blue-600">Deals</Link>
          <Link className="hover:text-blue-600">About Us</Link>
        </div>
        <div></div>

        <div className="flex gap-4">
          <form onSubmit={searchHandler} className="flex items-center bg-gray-700 rounded px-2">
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="focus:outline-0"
            />

            <button type="submit"><Search size={20}/></button>
          </form>
          {user ? (
            <>
              <Link to="/cart">Cart</Link>
              <Link to="/profile">Profile</Link>

              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="bg-blue-600 px-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
