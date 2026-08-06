import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, CreditCard, MapPin, PackageCheck, Phone, User } from "lucide-react";
import { toast } from "react-toastify";
import { getOrderById, updateOrderStatus } from "../services/orderService";
import { formatKSh } from "../utils/formatKSh";

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

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("Pending");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);
      setOrder(data);
      setStatus(getOrderStatus(data));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleSaveStatus = async () => {
    try {
      setSaving(true);
      await updateOrderStatus(id, status);
      toast.success("Order status updated successfully.");
      await fetchOrder();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update order status.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-[0_12px_30px_rgba(91,58,26,0.07)] md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded bg-[#efe4d6]" />
          <div className="h-10 w-56 rounded bg-[#efe4d6]" />
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="h-52 rounded-2xl bg-[#faf5ee]" />
              <div className="h-72 rounded-2xl bg-[#faf5ee]" />
            </div>
            <div className="h-96 rounded-2xl bg-[#faf5ee]" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-[28px] border border-border bg-white p-8 text-center shadow-[0_12px_30px_rgba(91,58,26,0.07)]">
        <h1 className="text-2xl font-black text-text">Order not found</h1>
        <p className="mt-2 text-sm text-text/70">The requested order could not be loaded.</p>
        <Link to="/admin/orders" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white">
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
      </div>
    );
  }

  const subtotal = order?.itemsPrice || 0;
  const shipping = order?.shippingPrice || 0;
  const tax = order?.taxPrice || 0;
  const total = order?.totalPrice || 0;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-[0_12px_30px_rgba(91,58,26,0.07)] md:p-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Admin order details</p>
            <h1 className="mt-2 text-2xl font-black text-text md:text-3xl">Order #{order?._id}</h1>
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-[#fbf7f1] px-4 py-2 text-sm font-semibold text-text transition hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <div className="rounded-[24px] border border-border bg-[#fbf7f1] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">Customer information</p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-text">
                    <User size={15} className="text-primary" />
                    {order?.user?.name || "—"}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-text/75">
                    <CreditCard size={15} className="text-primary" />
                    {order?.user?.email || "—"}
                  </div>
                </div>

                <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${statusStyles[status] || statusStyles.Pending}`}>
                  {status}
                </span>
              </div>
            </div>

            <div className="rounded-[24px] border border-border bg-white p-5 shadow-[0_14px_40px_rgba(91,58,26,0.08)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-[#f5ead9] p-2 text-primary">
                  <MapPin size={18} />
                </div>
                <h2 className="text-lg font-bold text-text">Shipping address</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#fbf7f1] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">Full name</p>
                  <p className="mt-2 text-sm font-semibold text-text">{order?.shippingAddress?.fullName || "—"}</p>
                </div>
                <div className="rounded-2xl bg-[#fbf7f1] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">Phone</p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-text">
                    <Phone size={15} className="text-primary" />
                    {order?.shippingAddress?.telNo || "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#fbf7f1] p-4 sm:col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">Address</p>
                  <p className="mt-2 text-sm font-semibold text-text">{order?.shippingAddress?.address || "—"}</p>
                </div>
                <div className="rounded-2xl bg-[#fbf7f1] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">City</p>
                  <p className="mt-2 text-sm font-semibold text-text">{order?.shippingAddress?.city || "—"}</p>
                </div>
                <div className="rounded-2xl bg-[#fbf7f1] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">County</p>
                  <p className="mt-2 text-sm font-semibold text-text">{order?.shippingAddress?.county || "—"}</p>
                </div>
                <div className="rounded-2xl bg-[#fbf7f1] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">Postal code</p>
                  <p className="mt-2 text-sm font-semibold text-text">{order?.shippingAddress?.postalCode || "—"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-border bg-white p-5 shadow-[0_14px_40px_rgba(91,58,26,0.08)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-[#f5ead9] p-2 text-primary">
                  <PackageCheck size={18} />
                </div>
                <h2 className="text-lg font-bold text-text">Ordered products</h2>
              </div>

              <div className="space-y-3">
                {(order?.orderItems || []).map((item) => (
                  <div key={`${order?._id}-${item?.name}`} className="flex items-center gap-3 rounded-2xl border border-border bg-[#fbf7f1] p-3">
                    <img
                      src={item?.image || "https://placehold.co/120x120?text=Product"}
                      alt={item?.name || "Product"}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text">{item?.name || "Unnamed product"}</p>
                      <p className="text-xs text-text/65">Qty: {item?.quantity || 0}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-text">{formatKSh(item?.price || 0)}</p>
                      <p className="text-xs text-text/60">{formatKSh((item?.price || 0) * (item?.quantity || 0))}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[24px] border border-border bg-white p-5 shadow-[0_14px_40px_rgba(91,58,26,0.08)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-[#f5ead9] p-2 text-primary">
                  <CreditCard size={18} />
                </div>
                <h2 className="text-lg font-bold text-text">Payment & totals</h2>
              </div>

              <div className="space-y-3 rounded-2xl bg-[#fbf7f1] p-4 text-sm text-text/75">
                <div className="flex items-center justify-between">
                  <span>Payment Method</span>
                  <span className="font-semibold text-text">{order?.paymentMethod || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text">{formatKSh(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-text">{shipping === 0 ? "Free" : formatKSh(shipping)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span className="font-semibold text-text">{formatKSh(tax)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-base font-bold text-text">
                  <span>Total</span>
                  <span>{formatKSh(total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-border bg-white p-5 shadow-[0_14px_40px_rgba(91,58,26,0.08)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-[#f5ead9] p-2 text-primary">
                  <CalendarDays size={18} />
                </div>
                <h2 className="text-lg font-bold text-text">Update order status</h2>
              </div>

              <div className="space-y-3">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full rounded-xl border border-border bg-[#fbf7f1] px-4 py-3 text-sm outline-none focus:border-primary"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-70"
                >
                  {saving ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
