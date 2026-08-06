import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Search,
  Plus,
  PackageSearch,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { deleteProduct, getProducts } from "../services/productService";

const pageSize = 8;

const ProductsAdmin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalProducts: 0, totalPages: 1, currentPage: 1 });
  const [pendingDelete, setPendingDelete] = useState(null);

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((product) => product.category).filter(Boolean))];
    return ["All", ...unique];
  }, [products]);

  const fetchProducts = async (currentPage = page) => {
    try {
      setLoading(true);
      const data = await getProducts({
        keyword: search,
        category: category !== "All" ? category : undefined,
        page: currentPage,
        limit: pageSize,
      });

      setProducts(data.products || []);
      setMeta(data.pagination || { totalProducts: 0, totalPages: 1, currentPage });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [search, category]);

  const handleDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteProduct(pendingDelete._id);
      setPendingDelete(null);
      fetchProducts(page);
    } catch (error) {
      console.error(error);
    }
  };

  const categoryOptions = [
    "All",
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Books",
    "Toys",
    "Groceries",
    "Phones",
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-border bg-white p-5 shadow-[0_12px_30px_rgba(91,58,26,0.07)] md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Catalog management</p>
            <h1 className="mt-2 text-2xl font-black text-text md:text-3xl">Products</h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/products/new")}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={16} />
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-border bg-[#fbf7f1] py-3 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-border bg-[#fbf7f1] px-3 py-3 text-sm outline-none focus:border-primary"
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(91,58,26,0.07)]">
        {loading ? (
          <div className="space-y-3 p-4 md:p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-2xl border border-border bg-[#faf5ee] p-4">
                <div className="grid gap-3 md:grid-cols-7">
                  <div className="h-14 w-14 rounded-xl bg-[#efe4d6]" />
                  <div className="h-5 rounded bg-[#efe4d6] md:col-span-2" />
                  <div className="h-5 rounded bg-[#efe4d6]" />
                  <div className="h-5 rounded bg-[#efe4d6]" />
                  <div className="h-5 rounded bg-[#efe4d6]" />
                  <div className="h-5 rounded bg-[#efe4d6]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#fbf7f1] text-text/60">
                  <tr>
                    <th className="px-4 py-4 font-semibold">Product Image</th>
                    <th className="px-4 py-4 font-semibold">Product Name</th>
                    <th className="px-4 py-4 font-semibold">Category</th>
                    <th className="px-4 py-4 font-semibold">Price</th>
                    <th className="px-4 py-4 font-semibold">Stock</th>
                    <th className="px-4 py-4 font-semibold">Rating</th>
                    <th className="px-4 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product._id} className="border-t border-border/70 align-top">
                        <td className="px-4 py-4">
                          <img
                            src={product.images?.[0] || "https://placehold.co/120x120?text=Product"}
                            alt={product.name}
                            className="h-14 w-14 rounded-xl object-cover"
                          />
                        </td>
                        <td className="px-4 py-4 font-semibold text-text">{product.name}</td>
                        <td className="px-4 py-4 text-text/70">{product.category}</td>
                        <td className="px-4 py-4 font-semibold text-text">
                          KSh {Number(product.price || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-text/70">{product.stock}</td>
                        <td className="px-4 py-4 text-text/70">{product.rating || 0}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                              className="inline-flex items-center gap-2 rounded-lg bg-[#f7efe4] px-3 py-2 text-sm font-semibold text-primary transition hover:bg-[#efe2d0]"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(product)}
                              className="inline-flex items-center gap-2 rounded-lg bg-[#fbe4e4] px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-[#f7d4d4]"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-text/65">
                          <PackageSearch size={24} className="text-primary" />
                          <span>No products matched your search.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-border bg-[#fbf7f1] px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-text/65">
                Showing {products.length} of {meta.totalProducts || 0} products
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextPage = Math.max(1, page - 1);
                    setPage(nextPage);
                    fetchProducts(nextPage);
                  }}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-text disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-text">
                  Page {meta.currentPage || 1} of {meta.totalPages || 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const nextPage = Math.min(meta.totalPages || 1, page + 1);
                    setPage(nextPage);
                    fetchProducts(nextPage);
                  }}
                  disabled={page >= (meta.totalPages || 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-text disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1b17]/45 px-4">
          <div className="w-full max-w-md rounded-[24px] border border-border bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
            <h2 className="text-xl font-black text-text">Delete product?</h2>
            <p className="mt-3 text-sm text-text/70">
              Are you sure you want to delete <strong>{pendingDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-lg border border-border bg-[#fbf7f1] px-4 py-2 text-sm font-semibold text-text transition hover:text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;
