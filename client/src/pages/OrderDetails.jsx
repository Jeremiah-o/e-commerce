import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  MapPin,
  PackageCheck,
  Phone,
  User,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import { formatKSh } from "../utils/formatKSh";

const statusStyles = {
  Pending: "bg-[#fff3cd] text-[#8a6a00]",
  Processing: "bg-[#dbeafe] text-[#1d4ed8]",
  Shipped: "bg-[#ede9fe] text-[#6d28d9]",
  Delivered: "bg-[#dcfce7] text-[#15803d]",
  Cancelled: "bg-[#fee2e2] text-[#b91c1c]",
};

const getOrderStatus = (order) => {
  if (order?.status) {
    return order.status;
  }

  if (order?.isDelivered) {
    return "Delivered";
  }

  if (order?.isPaid) {
    return "Processing";
  }

  return "Pending";
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Order not found.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="animate-pulse rounded-[28px] border border-border bg-white p-6 md:p-8">
            <div className="mb-6 h-4 w-36 rounded bg-[#efe4d6]" />
            <div className="mb-3 h-8 w-56 rounded bg-[#efe4d6]" />
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="h-40 rounded-2xl bg-[#faf5ee]" />
                <div className="h-72 rounded-2xl bg-[#faf5ee]" />
              </div>
              <div className="h-96 rounded-2xl bg-[#faf5ee]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-white p-8 text-center shadow-[0_14px_40px_rgba(91,58,26,0.08)] md:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f5ead9] text-primary">
            <PackageCheck size={30} />
          </div>
          <h1 className="mt-5 text-2xl font-black text-text md:text-3xl">Order not found</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-text/70">
            We couldn’t find the order you’re looking for. Please return to your order history and try again.
          </p>
          <Link
            to="/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const status = getOrderStatus(order);
  const subtotal = order?.itemsPrice || 0;
  const shipping = order?.shippingPrice || 0;
  const tax = order?.taxPrice || 0;
  const total = order?.totalPrice || 0;

  return (
    <div className="min-h-screen bg-[#f8f4ee] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Order details</p>
          </div>

          <Link
            to="/orders"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <div className="rounded-[28px] border border-border bg-white p-5 shadow-[0_14px_40px_rgba(91,58,26,0.08)] md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[#f5ead9] p-2 text-primary">
                      <CalendarDays size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Date ordered</p>
                      <p className="mt-1 font-semibold text-text">
                        {new Date(order?.createdAt || Date.now()).toLocaleDateString("en-KE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <span
                  className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${statusStyles[status] || statusStyles.Pending}`}
                >
                  {status}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#fbf7f1] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">Payment Method</p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-text">
                    <CreditCard size={15} className="text-primary" />
                    {order?.paymentMethod || "—"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fbf7f1] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">Order ID</p>
                  <p className="mt-2 text-sm font-semibold text-text">{order?._id || "—"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-border bg-white p-5 shadow-[0_14px_40px_rgba(91,58,26,0.08)] md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-[#f5ead9] p-2 text-primary">
                  <MapPin size={18} />
                </div>
                <h2 className="text-lg font-bold text-text">Shipping address</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#fbf7f1] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">Full name</p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-text">
                    <User size={15} className="text-primary" />
                    {order?.shippingAddress?.fullName || "—"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fbf7f1] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">Phone number</p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-text">
                    <Phone size={15} className="text-primary" />
                    {order?.shippingAddress?.telNo || "—"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fbf7f1] p-4 sm:col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">Address</p>
                  <p className="mt-2 text-sm font-semibold text-text">
                    {order?.shippingAddress?.address || "—"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fbf7f1] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">County</p>
                  <p className="mt-2 text-sm font-semibold text-text">{order?.shippingAddress?.county || "—"}</p>
                </div>

                <div className="rounded-2xl bg-[#fbf7f1] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">City</p>
                  <p className="mt-2 text-sm font-semibold text-text">{order?.shippingAddress?.city || "—"}</p>
                </div>

                <div className="rounded-2xl bg-[#fbf7f1] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">Postal code</p>
                  <p className="mt-2 text-sm font-semibold text-text">{order?.shippingAddress?.postalCode || "—"}</p>
                </div>

                <div className="rounded-2xl bg-[#fbf7f1] p-4 sm:col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">Additional notes</p>
                  <p className="mt-2 text-sm font-semibold text-text">
                    {order?.shippingAddress?.notes || "No additional notes provided."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[28px] border border-border bg-white p-5 shadow-[0_14px_40px_rgba(91,58,26,0.08)] md:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-[#f5ead9] p-2 text-primary">
                <PackageCheck size={18} />
              </div>
              <h2 className="text-lg font-bold text-text">Order summary</h2>
            </div>

            <div className="space-y-3">
              {(order?.orderItems || []).map((item) => (
                <div key={`${order?._id}-${item?.name}`} className="rounded-2xl border border-border bg-[#fbf7f1] p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item?.image || "https://placehold.co/120x120?text=Product"}
                      alt={item?.name || "Product"}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text">{item?.name || "Unnamed product"}</p>
                      <div className="mt-1 flex items-center justify-between gap-3 text-xs text-text/65">
                        <span>Qty: {item?.quantity || 0}</span>
                        <span>{formatKSh(item?.price || 0)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-right text-sm font-bold text-text">
                    {formatKSh((item?.price || 0) * (item?.quantity || 0))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 rounded-2xl bg-[#fbf7f1] p-4">
              <div className="flex items-center justify-between text-sm text-text/75">
                <span>Subtotal</span>
                <span className="font-semibold text-text">{formatKSh(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-text/75">
                <span>Shipping</span>
                <span className="font-semibold text-text">{shipping === 0 ? "Free" : formatKSh(shipping)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-text/75">
                <span>Tax</span>
                <span className="font-semibold text-text">{formatKSh(tax)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between text-base font-bold text-text">
                  <span>Total</span>
                  <span>{formatKSh(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
