import { useEffect, useMemo, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  ArrowUpRight,
  Box,
  PackageSearch,
  ShoppingCart,
  Users,
  TrendingUp,
  CalendarRange,
} from "lucide-react";
import { getAllOrders } from "../services/orderService";
import { getProducts } from "../services/productService";
import { getAllUsers } from "../services/userService";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler
);

const statCards = [
  {
    key: "revenue",
    label: "Revenue",
    icon: ArrowUpRight,
  },
  {
    key: "orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    key: "customers",
    label: "Customers",
    icon: Users,
  },
  {
    key: "products",
    label: "Products",
    icon: Box,
  },
];

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [productResponse, orderResponse, userResponse] = await Promise.all([
          getProducts(),
          getAllOrders(),
          getAllUsers(),
        ]);

        setProducts(productResponse.products || []);
        setOrders(Array.isArray(orderResponse) ? orderResponse : orderResponse.orders || []);
        setUsers(userResponse.users || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
    const lowStockProducts = products.filter((product) => Number(product.stock) <= 5).slice(0, 5);

    const productMap = new Map(products.map((product) => [String(product._id), product]));
    const topProductMap = new Map();
    const salesByCategory = new Map();

    orders.forEach((order) => {
      order.orderItems?.forEach((item) => {
        const itemProduct = productMap.get(String(item.product));
        const category = itemProduct?.category || "Uncategorized";
        const quantity = Number(item.quantity || 0);
        const revenue = Number(item.price || 0) * quantity;

        topProductMap.set(item.name, {
          name: item.name,
          quantity: (topProductMap.get(item.name)?.quantity || 0) + quantity,
          revenue: (topProductMap.get(item.name)?.revenue || 0) + revenue,
        });

        salesByCategory.set(category, {
          category,
          revenue: (salesByCategory.get(category)?.revenue || 0) + revenue,
          quantity: (salesByCategory.get(category)?.quantity || 0) + quantity,
        });
      });
    });

    const topProducts = [...topProductMap.values()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const categoryTotals = [...salesByCategory.values()].sort((a, b) => b.revenue - a.revenue);
    const latestOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const latestCustomers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    const monthlyRevenue = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      return {
        month: date.toLocaleString("en", { month: "short" }),
        value: orders
          .filter((order) => {
            const orderDate = new Date(order.createdAt);
            const orderMonth = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
            return orderMonth === monthKey;
          })
          .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
      };
    });

    const monthlyOrders = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      return {
        month: date.toLocaleString("en", { month: "short" }),
        count: orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          const orderMonth = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
          return orderMonth === monthKey;
        }).length,
      };
    });

    return {
      revenue: totalRevenue,
      orders: orders.length,
      products: products.length,
      customers: users.length,
      lowStockProducts,
      topProducts,
      categoryTotals,
      latestOrders,
      latestCustomers,
      monthlyRevenue,
      monthlyOrders,
    };
  }, [orders, products, users]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const revenueChartData = {
    labels: analytics.monthlyRevenue.map((entry) => entry.month),
    datasets: [
      {
        label: "Revenue",
        data: analytics.monthlyRevenue.map((entry) => entry.value),
        borderColor: "#3d7a2a",
        backgroundColor: "rgba(61, 122, 42, 0.18)",
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const ordersChartData = {
    labels: analytics.monthlyOrders.map((entry) => entry.month),
    datasets: [
      {
        label: "Orders",
        data: analytics.monthlyOrders.map((entry) => entry.count),
        backgroundColor: ["#7b4f25", "#caa46d", "#b87f42", "#8a5b2f", "#dbb067", "#734516"],
        borderRadius: 10,
      },
    ],
  };

  const categoryChartData = {
    labels: analytics.categoryTotals.map((entry) => entry.category),
    datasets: [
      {
        label: "Sales by category",
        data: analytics.categoryTotals.map((entry) => entry.revenue),
        backgroundColor: ["#7b4f25", "#3d7a2a", "#cf9b4e", "#c35d3d", "#8b5cf6", "#1d4ed8"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(91, 58, 26, 0.08)",
        },
        ticks: {
          callback: (value) => `KSh ${value}`,
        },
      },
    },
  };

  const renderLoadingCards = () => (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-[22px] border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 h-10 w-10 rounded-2xl bg-[#efe4d6]" />
          <div className="h-4 w-24 rounded bg-[#efe4d6]" />
          <div className="mt-3 h-7 w-28 rounded bg-[#efe4d6]" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-border bg-white p-6 shadow-[0_12px_35px_rgba(91,58,26,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Admin analytics</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-text md:text-4xl">Welcome back, Admin</h1>
        <p className="mt-2 text-sm text-text/70">Track revenue, order momentum, customer growth, and top-performing categories at a glance.</p>
      </section>

      {loading ? (
        renderLoadingCards()
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ key, label, icon: Icon }) => (
            <article key={key} className="rounded-[22px] border border-border bg-white p-5 shadow-[0_12px_30px_rgba(91,58,26,0.07)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-2xl bg-[#f7efe4] p-3 text-primary">
                  <Icon size={18} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text/55">Live</span>
              </div>
              <p className="text-sm text-text/70">{label}</p>
              <p className="mt-3 text-2xl font-black text-text">
                {key === "revenue" && formatCurrency(analytics.revenue)}
                {key === "orders" && analytics.orders}
                {key === "customers" && analytics.customers}
                {key === "products" && analytics.products}
              </p>
            </article>
          ))}
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[26px] border border-border bg-white p-5 shadow-[0_12px_30px_rgba(91,58,26,0.07)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">Revenue Overview</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f7efe4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              <TrendingUp size={12} />
              6 months
            </span>
          </div>
          <div className="h-[320px]">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </article>

        <article className="rounded-[26px] border border-border bg-white p-5 shadow-[0_12px_30px_rgba(91,58,26,0.07)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">Orders per Month</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f7efe4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              <CalendarRange size={12} />
              Monthly
            </span>
          </div>
          <div className="h-[320px]">
            <Bar data={ordersChartData} options={chartOptions} />
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[26px] border border-border bg-white p-5 shadow-[0_12px_30px_rgba(91,58,26,0.07)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">Top Selling Products</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Performance</span>
          </div>

          <div className="space-y-4">
            {analytics.topProducts.map((product, index) => (
              <div key={product.name} className="rounded-2xl bg-[#faf6ef] p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-bold text-text">#{index + 1} {product.name}</span>
                    <div className="mt-1 text-text/65">{product.quantity} units sold</div>
                  </div>
                  <span className="font-black text-primary">{formatCurrency(product.revenue)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-2 rounded-full bg-gradient-to-r from-primary to-[#c08a46]" style={{ width: `${Math.min(100, (product.quantity / Math.max(...analytics.topProducts.map((entry) => entry.quantity), 1)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[26px] border border-border bg-white p-5 shadow-[0_12px_30px_rgba(91,58,26,0.07)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">Sales by Category</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Mix</span>
          </div>
          <div className="h-[320px]">
            <Doughnut data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }} />
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[26px] border border-border bg-white p-5 shadow-[0_12px_30px_rgba(91,58,26,0.07)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">Latest Orders</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Recent</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-text/60">
                  <th className="pb-3 pr-4 font-semibold">Customer</th>
                  <th className="pb-3 pr-4 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.latestOrders.map((order) => (
                  <tr key={order._id} className="border-b border-border/60 last:border-b-0">
                    <td className="py-3 pr-4 font-semibold text-text">{order.shippingAddress?.fullName || "Guest"}</td>
                    <td className="py-3 pr-4 text-text/75">{formatCurrency(order.totalPrice || 0)}</td>
                    <td className="py-3 text-text/75">{new Date(order.createdAt).toLocaleDateString("en-KE")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-[26px] border border-border bg-white p-5 shadow-[0_12px_30px_rgba(91,58,26,0.07)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">Latest Customers</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">New</span>
          </div>

          <div className="space-y-3">
            {analytics.latestCustomers.map((customer) => (
              <div key={customer._id} className="flex items-center gap-3 rounded-2xl bg-[#faf6ef] p-3">
                <img
                  src={customer.avatar || "https://placehold.co/120x120?text=User"}
                  alt={customer.name}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-text">{customer.name}</div>
                  <div className="text-sm text-text/65">{customer.email}</div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-[26px] border border-border bg-white p-5 shadow-[0_12px_30px_rgba(91,58,26,0.07)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text">Low Stock Watchlist</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Inventory</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text/60">
                <th className="pb-3 pr-4 font-semibold">Product</th>
                <th className="pb-3 pr-4 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Stock</th>
              </tr>
            </thead>
            <tbody>
              {analytics.lowStockProducts.length > 0 ? (
                analytics.lowStockProducts.map((product) => (
                  <tr key={product._id} className="border-b border-border/60 last:border-b-0">
                    <td className="py-3 pr-4 font-semibold text-text">{product.name}</td>
                    <td className="py-3 pr-4 text-text/70">{product.category}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-[#fbe4e4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-600">
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-text/65">
                    <div className="flex flex-col items-center gap-2">
                      <PackageSearch size={20} className="text-primary" />
                      <span>All products are well stocked.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
