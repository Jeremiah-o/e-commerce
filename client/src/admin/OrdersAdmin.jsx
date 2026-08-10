import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, ShoppingCart } from "lucide-react";
import { getAllOrders } from "../services/orderService";
import { formatKSh } from "../utils/formatKSh";

const pageSize = 8;

const statusStyles = {
  Pending: "bg-[#fff3cd] text-[#8a6a00]",
  Processing: "bg-[#dbeafe] text-[#1d4ed8]",
  Shipped: "bg-[#ede9fe] text-[#6d28d9]",
  Delivered: "bg-[#dcfce7] text-[#15803d]",
  Cancelled: "bg-[#fee2e2] text-[#b91c1c]",
};

const getOrderStatus = (order) => {
  if (order?.status) return order.status;
  if (order?.isDelivered) return "Delivered";
  if (order?.isPaid) return "Processing";
  return "Pending";
};

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllOrders();
        setOrders(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName = order?.user?.name || "";
      const orderId = order?._id || "";
      const paymentMethod = order?.paymentMethod || "";
      const status = getOrderStatus(order);

      const matchesSearch = !term || [customerName, orderId, paymentMethod].some((value) =>
        value.toLowerCase().includes(term),
      );

      const matchesStatus = statusFilter === "All" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-border bg-white p-5 shadow-[0_12px_30px_rgba(91,58,26,0.07)] md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Order fulfillment</p>
            <h1 className="mt-2 text-2xl font-black text-text md:text-3xl">Orders Management</h1>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl bg-[#fbf7f1] px-4 py-3 text-sm font-semibold text-text">
            <ShoppingCart size={16} className="text-primary" />
            {orders.length} total orders
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={16} />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or payment"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-border bg-[#fbf7f1] py-3 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-border bg-[#fbf7f1] px-3 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(91,58,26,0.07)]">
        {loading ? (
          <div className="space-y-3 p-4 md:p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-2xl border border-border bg-[#faf5ee] p-4">
                <div className="grid gap-3 md:grid-cols-7">
                  <div className="h-5 rounded bg-[#efe4d6] md:col-span-2" />
                  <div className="h-5 rounded bg-[#efe4d6]" />
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
                    <th className="px-4 py-4 font-semibold">Order ID</th>
                    <th className="px-4 py-4 font-semibold">Customer Name</th>
                    <th className="px-4 py-4 font-semibold">Order Date</th>
                    <th className="px-4 py-4 font-semibold">Total Price</th>
                    <th className="px-4 py-4 font-semibold">Payment Method</th>
                    <th className="px-4 py-4 font-semibold">Status</th>
                    <th className="px-4 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length > 0 ? (
                    paginatedOrders.map((order) => {
                      const status = getOrderStatus(order);
                      return (
                        <tr key={order._id} className="border-t border-border/70 align-top">
                          <td className="px-4 py-4 font-semibold text-text">{order._id}</td>
                          <td className="px-4 py-4 text-text/75">{order?.user?.name || "—"}</td>
                          <td className="px-4 py-4 text-text/75">
                            {new Date(order.createdAt).toLocaleDateString("en-KE", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-4 font-semibold text-text">{formatKSh(order.totalPrice || 0)}</td>
                          <td className="px-4 py-4 text-text/75">{order.paymentMethod || "—"}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${statusStyles[status] || statusStyles.Pending}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <Link
                              to={`/admin/orders/${order._id}`}
                              className="inline-flex items-center rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center text-text/65">
                        No orders matched the current search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-border bg-[#fbf7f1] px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-text/65">
                Showing {paginatedOrders.length} of {filteredOrders.length} matching orders
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-text disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>

                <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-text">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
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
    </div>
  );
};

export default OrdersAdmin;
