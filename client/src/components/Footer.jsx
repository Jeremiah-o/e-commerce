import { Mail, ShoppingBag } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-sand text-white">
      <div className="mx-auto max-w-7xl px-12 py-4">
        <div className=" grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <ShoppingBag className="text-primary" size={22} />
              <h1 className="text-2xl font-bold">
                Shop<span className="text-primary">Smart</span>
              </h1>
            </div>
            <p className="mt-3 max-w-sm text-sm text-text">
              Your one-stop shop for amazing products at unbeatable prices.
            </p>
            <div className="mt-4 flex gap-3 text-primary">
              <FaFacebookF size={18} className="hover:text-primary-dark hover:cursor-pointer" />
              <FaInstagram size={18} className="hover:text-primary-dark hover:cursor-pointer" />
              <FaLinkedinIn size={18} className="hover:text-primary-dark hover:cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-accent">Quick Links</h4>
            <ul className="space-y-2 text-sm text-text">
              <li>Home</li>
              <li>Products</li>
              <li>Categories</li>
              <li>Deals</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-accent">Customer Service</h4>
            <ul className="space-y-2 text-sm text-text">
              <li>Contact Us</li>
              <li>FAQs</li>
              <li>Shipping & Delivery</li>
              <li>Returns & Refunds</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-accent">My Account</h4>
            <ul className="space-y-2 text-sm text-text">
              <li>Login</li>
              <li>Register</li>
              <li>My Orders</li>
              <li>Wishlist</li>
              <li>Track Order</li>
            </ul>
          </div>
        </div>

        <div className="mt-2 border-t border-white/10 pt-5 text-center text-sm text-text">
          © 2026 ShopSmart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
