import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

import herobg from "../assets/herobg.png";
import phone from "../assets/phone.png";
import laptop from "../assets/laptop.png";
import fashion from "../assets/fashion.png";
import toy from "../assets/toy.png";
import ball from "../assets/ball.png";
import beat from "../assets/beauty.png";

const categoryCards = [
  { name: "Phones", image: phone },
  { name: "Electronics", image: laptop },
  { name: "Fashion", image: fashion },
  { name: "Toys", image: toy },
  { name: "Beauty", image: beat },
  { name: "Sports", image: ball },
];

const reasons = [
  {
    title: "Fast Delivery",
    text: "Quick and reliable delivery to your doorstep.",
    icon: Truck,
    accent: "text-emerald-600",
  },
  {
    title: "Secure Payments",
    text: "Your payments are protected with top-tier security.",
    icon: ShieldCheck,
    accent: "text-emerald-600",
  },
  {
    title: "Quality Products",
    text: "We offer only the best products from trusted brands.",
    icon: BadgeCheck,
    accent: "text-amber-500",
  },
];

function SparkleIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="M20 15l.8 2.2L23 18l-2.2.8L20 21l-.8-2.2L17 18l2.2-.8L20 15Z" />
      <path d="M4 15l.8 2.2L7 18l-2.2.8L4 21l-.8-2.2L1 18l2.2-.8L4 15Z" />
    </svg>
  );
}

function TrophyIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M7 4h10v3a5 5 0 0 1-4 4.9V14" />
      <path d="M17 4h3v3a5 5 0 0 1-5 5" />
      <path d="M7 4H4v3a5 5 0 0 0 5 5" />
      <path d="M12 14v4" />
      <path d="M9 18h6" />
    </svg>
  );
}

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const featured = (data.products || []).filter(
          (product) => product.featured,
        );
        setProducts(
          featured.length
            ? featured.slice(0, 4)
            : (data.products || []).slice(0, 4),
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-background text-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-1">
        <section
          className="relative min-h-[85vh] bg-cover bg-center flex items-center overflow-hidden rounded-[18px] bg-linear-to-r from-slate-100 via-blue-100 to-blue-200 px-8 py-10 shadow-sm"
          style={{ backgroundImage: `url(${herobg})` }}
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_480px] lg:items-center">
            <div className="pl-4">
              <h1 className="max-w-lg text-5xl font-extrabold leading-[1.02] tracking-tight text-accent">
                Shop Smarter.
                <br />
                Live Better.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-accent">
                Discover amazing products at unbeatable prices. Quality you can
                trust, value you&apos;ll love.
              </p>
              <Link
                to="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-[#FFFFFF] shadow-md transition hover:bg-primary-dark"
              >
                Shop Now
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 px-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-2xl font-bold text-accent">
              <span>Best Selling</span>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-primary hover:text-primary-dark"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        <section className="mt-10 px-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-2xl font-bold text-accent">
              <span>Shop by Category</span>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-primary hover:text-primary-dark"
            >
              View all categories
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categoryCards.map(({ name, image: img }) => (
              <Link
                to={`/products?category=${name}`}
                key={name}
                className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-2 hover:shadow-lg duration-300"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl text-blue-600">
                  <img src={img} alt="" className="w-20" />
                </div>
                <p className="mt-4 text-base font-semibold text-slate-800">
                  {name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[20px]r px-5 py-8 ">
          <div className="mb-6 flex items-center gap-2 text-2xl font-bold text-accent">
            <span>Why Choose ShopSmart?</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {reasons.map(({ title, text, icon: Icon, accent }) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-xl border border-border bg-beige p-4"
              >
                <div className={`rounded-xl bg-white p-3 shadow-sm ${accent}`}>
                  <Icon size={28} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{title}</h3>
                  <p className="text-sm text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
