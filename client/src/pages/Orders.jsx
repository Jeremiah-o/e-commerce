import { useEffect, useState } from "react";
import { PackageSearch, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import OrderCard from "../components/OrderCard";
import { getMyOrders } from "../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load your orders right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f4ee] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Customer account</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-text md:text-4xl">My Orders</h1>
          <p className="mt-2 text-sm text-text/70 md:text-base">Track and manage your purchases</p>
        </header>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-[24px] border border-border bg-white p-4 md:p-5">
                <div className="mb-4 h-4 w-32 rounded bg-[#efe4d6]" />
                <div className="mb-3 h-6 w-56 rounded bg-[#efe4d6]" />
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, itemIndex) => (
                    <div key={itemIndex} className="h-16 rounded-xl bg-[#faf5ee]" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[24px] border border-border bg-white p-8 text-center shadow-[0_14px_40px_rgba(91,58,26,0.08)]">
            <p className="text-red-600">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[52vh] items-center justify-center">
            <div className="w-full max-w-xl rounded-[28px] border border-border bg-white p-10 text-center shadow-[0_14px_40px_rgba(91,58,26,0.08)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f5ead9] text-primary">
                <PackageSearch size={32} />
              </div>
              <h2 className="mt-5 text-2xl font-black text-text">No Orders Yet</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm text-text/70">
                Your order history will appear here once you start shopping with us.
              </p>
              <Link
                to="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                <ShoppingBag size={16} />
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
