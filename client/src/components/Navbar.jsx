import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {ShoppingBag} from "lucide-react"

function Navbar() {
    const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between gap-6">
        <Link to="/" className="flex gap-1 h-7 items-center">
        <ShoppingBag className="text-blue-600"/>
        <h1 className="text-2xl font-bold">Shop<span className="text-blue-600">Smart</span></h1>
        </Link>
        <div className="flex gap-4">
            <Link to={"/products"}>Products</Link>
             {user ? (
            <>
              <Link to="/cart">Cart</Link>
              <Link to="/profile">Profile</Link>

              <button onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;