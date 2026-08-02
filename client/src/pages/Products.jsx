import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ListFilter,
  SlidersHorizontal,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import api from "../services/api";
import p1 from "../assets/p1.jpg";
import p2 from "../assets/p2.jpg";

const heroImages = {
  left: p1,
  right: p2,
};

const Products = () => {
  const { keyword } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const url = keyword ? `/products?keyword=${keyword}` : "/products";
      const { data } = await api.get(url);

      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-lg text-slate-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="bg-background text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-2">
        <section className="relative overflow-hidden rounded-[22px] bg-[#f3ede4] shadow-[0_10px_40px_rgba(82,61,24,0.10)]">
          <div className="relative grid items-stretch lg:grid-cols-[0.9fr_1.1fr_0.9fr]">
            <div className="relative  overflow-hidden lg:h-50">
              <div className="absolute inset-0 bg-linear-to-l from-[#f3ede4] via-[#f3ede4]/55 to-transparent z-10" />
              <img
                src={heroImages.left}
                alt="Premium audio"
                className="w-[95%] h-auto object-contain"
              />
              <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-[#f3ede4] via-[#f3ede4]/80 to-transparent" />
            </div>

            <div className="relative z-20 flex flex-col items-center justify-center px-8 py-10 text-center lg:h-50">
              <h1 className="text-4xl font-black tracking-tight text-text md:text-4xl">
                {keyword ? (
                  <>
                    Results for{" "}
                    <span className="text-primary">"{keyword}"</span>
                  </>
                ) : (
                  <>
                    Browse Our <span className="text-primary">Products</span>
                  </>
                )}
              </h1>
              <p className="mt-4 text-md text-text">
                Discover quality products at unbeatable prices.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Link to="/">Home</Link>
                <span>&gt;</span>
                <span className="text-primary">Products</span>
              </div>
            </div>

            <div className="relative  overflow-hidden lg:h-50">
              <div className="absolute inset-0 bg-linear-to-r from-[#f3ede4] via-[#f3ede4]/55 to-transparent z-10" />
              <img
                src={heroImages.right}
                alt="Premium accessory"
                className="w-[85%] h-auto object-contain ml-auto "
              />
              <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-[#f3ede4] via-[#f3ede4]/80 to-transparent" />
            </div>
          </div>
        </section>

        <section
          className="mt-2 flex flex-col gap-4 rounded bg-white rounded-b-xl shadow-sm border border-border p-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              <ListFilter size={16} />
              All Categories
              <ChevronDown size={16} />
            </button>

            <button className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              Sort by: Newest
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>Showing {products.length} products</span>
            <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white p-1">
              <button className="rounded-md bg-[#f3eadf] p-2 text-[#7b4f1d]">
                <LayoutGrid size={16} />
              </button>
              <button className="rounded-md p-2 text-slate-500">
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>
        </section>

        {products.length > 0 ? (
          <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </section>
        ) : (
          <div className="mt-8 flex h-60 items-center justify-center rounded-[16px] bg-white">
            <p className="text-lg text-slate-600">No products found.</p>
          </div>
        )}

        {products.length > 8 && (
          <div className="mt-8 flex items-center justify-center gap-2 text-sm">
            <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-500">
              <ChevronLeft size={16} />
            </button>
            <button className="rounded-md bg-[#7b4f1d] px-3 py-2 text-white">
              1
            </button>
            <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-600">
              2
            </button>
            <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-600">
              3
            </button>
            <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-600">
              ...
            </button>
            <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-500">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
