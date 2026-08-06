
import {
  CircleUserRound,
  Heart,
  KeyRound,
  LogOut,
  Mail,
  Package,
  Pencil,
  ShieldCheck,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";
  const role = user?.role || "Customer";

  return (
    <div className="min-h-screen bg-[#f8f4ee] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="overflow-hidden rounded-[28px] border border-[#eadcc5] bg-white shadow-[0_12px_32px_rgba(91,58,26,0.08)]">
          <div className="bg-linear-to-r from-[#f3e7d2] via-[#fbf7f1] to-[#f3e7d2] p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#7a4b20] text-3xl font-bold text-white shadow-md md:h-24 md:w-24">
                  {initials}
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-[#4c2f14] md:text-3xl">
                    {user?.name || "Your Profile"}
                  </h1>
                  <p className="flex items-center gap-2 text-sm text-[#6b4b2f] md:text-base">
                    <Mail size={16} className="text-[#87572d]" />
                    {user?.email || "No email available"}
                  </p>
                  <span className="inline-flex items-center rounded-full bg-[#f2e7d7] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#7a4b20]">
                    {role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-[#eadcc5] bg-white p-5 shadow-[0_10px_28px_rgba(91,58,26,0.07)] md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-full bg-[#f5ead9] p-2 text-[#7a4b20]">
                <CircleUserRound size={18} />
              </div>
              <h2 className="text-lg font-semibold text-[#4c2f14]">
                Account Information
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-[#fbf7f1] p-4 transition hover:bg-[#f6ede0]">
                <div className="rounded-full bg-white p-2 text-[#7a4b20] shadow-sm">
                  <UserRound size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#89633a]">
                    Full Name
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#4f3420]">
                    {user?.name || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-[#fbf7f1] p-4 transition hover:bg-[#f6ede0]">
                <div className="rounded-full bg-white p-2 text-[#7a4b20] shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#89633a]">
                    Email Address
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#4f3420]">
                    {user?.email || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-[#fbf7f1] p-4 transition hover:bg-[#f6ede0]">
                <div className="rounded-full bg-white p-2 text-[#7a4b20] shadow-sm">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#89633a]">
                    Account Role
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#4f3420]">
                    {role}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#eadcc5] bg-white p-5 shadow-[0_10px_28px_rgba(91,58,26,0.07)] md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-full bg-[#f5ead9] p-2 text-[#7a4b20]">
                <Pencil size={18} />
              </div>
              <h2 className="text-lg font-semibold text-[#4c2f14]">
                Account Actions
              </h2>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-between rounded-2xl border border-[#e3d3b8] bg-[#f8f3ea] px-4 py-3 text-left text-sm font-semibold text-[#8a6a40] opacity-60"
              >
                <span className="flex items-center gap-3">
                  <Pencil size={16} />
                  Edit Profile
                </span>
                <span className="text-xs uppercase tracking-wide">Disabled</span>
              </button>

              <button
                type="button"
                disabled
                className="flex w-full items-center justify-between rounded-2xl border border-[#e3d3b8] bg-[#f8f3ea] px-4 py-3 text-left text-sm font-semibold text-[#8a6a40] opacity-60"
              >
                <span className="flex items-center gap-3">
                  <KeyRound size={16} />
                  Change Password
                </span>
                <span className="text-xs uppercase tracking-wide">Disabled</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center justify-between rounded-2xl bg-[#7a4b20] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#633912] focus:outline-none focus:ring-2 focus:ring-[#b38356] focus:ring-offset-2"
              >
                <span className="flex items-center gap-3">
                  <LogOut size={16} />
                  Logout
                </span>
              </button>
            </div>
          </section>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[22px] border border-[#eadcc5] bg-white p-5 shadow-[0_10px_28px_rgba(91,58,26,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(91,58,26,0.12)]">
            <Link to={"/cart"}>
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-full bg-[#f5ead9] p-2 text-[#7a4b20]">
                <ShoppingCart size={18} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8a6a40]">
                Cart
              </span>
            </div>
            <p className="text-3xl font-bold text-[#4c2f14]">{totalItems}</p>
            <p className="mt-2 text-sm text-[#7b5a34]">Items currently in cart</p></Link>
          </div>

          <Link to="/orders" className="rounded-[22px] border border-[#eadcc5] bg-white p-5 shadow-[0_10px_28px_rgba(91,58,26,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(91,58,26,0.12)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-full bg-[#f5ead9] p-2 text-[#7a4b20]">
                <Package size={18} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8a6a40]">
                Orders
              </span>
            </div>
            <p className="text-lg font-bold text-[#4c2f14]">Track Orders</p>
            <p className="mt-2 text-sm text-[#7b5a34]">View every purchase</p>
          </Link>

          <div className="rounded-[22px] border border-[#eadcc5] bg-white p-5 shadow-[0_10px_28px_rgba(91,58,26,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(91,58,26,0.12)] sm:col-span-2 xl:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-full bg-[#f5ead9] p-2 text-[#7a4b20]">
                <Heart size={18} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8a6a40]">
                Wishlist
              </span>
            </div>
            <p className="text-lg font-bold text-[#4c2f14]">Coming Soon</p>
            <p className="mt-2 text-sm text-[#7b5a34]">Wishlist</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;