import { CalendarDays, CreditCard, Package, ShoppingBag, Truck } from "lucide-react";
import { Link } from "react-router-dom";
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

const OrderCard = ({ order }) => {
  const status = getOrderStatus(order);
  const itemsCount = order?.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <article className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_14px_40px_rgba(91,58,26,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(91,58,26,0.12)]">
      <div className="flex flex-col gap-4 p-4 md:p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Order ID
              </p>
              <h3 className="mt-1 text-lg font-bold text-text">{order?._id || "—"}</h3>
            </div>

            <span
              className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${statusStyles[status] || statusStyles.Pending}`}
            >
              {status}
            </span>
          </div>

          <div className="grid gap-3 text-sm text-text/80 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex items-center gap-2 rounded-xl bg-[#f8f3ea] px-3 py-2">
              <CalendarDays size={16} className="text-primary" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-text/55">Date placed</p>
                <p className="font-semibold text-text">
                  {new Date(order?.createdAt || Date.now()).toLocaleDateString("en-KE", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#f8f3ea] px-3 py-2">
              <Package size={16} className="text-accent" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-text/55">Items</p>
                <p className="font-semibold text-text">{itemsCount} item(s)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#f8f3ea] px-3 py-2">
              <CreditCard size={16} className="text-primary" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-text/55">Payment</p>
                <p className="font-semibold text-text">{order?.paymentMethod || "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#f8f3ea] px-3 py-2">
              <ShoppingBag size={16} className="text-accent" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-text/55">Total</p>
                <p className="font-semibold text-text">{formatKSh(order?.totalPrice || 0)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-[#fbf7f1] p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-text/65">
              <Truck size={14} className="text-accent" />
              Order preview
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {(order?.orderItems || []).slice(0, 3).map((item) => (
                <div key={`${order?._id}-${item?.name}`} className="flex items-center gap-3 rounded-xl bg-white p-2 shadow-sm">
                  <img
                    src={item?.image || "https://placehold.co/120x120?text=Product"}
                    alt={item?.name || "Product preview"}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">{item?.name || "Unnamed item"}</p>
                    <p className="text-xs text-text/65">Qty: {item?.quantity || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end lg:w-44">
          <Link
            to={`/orders/${order?._id}`}
            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default OrderCard;
