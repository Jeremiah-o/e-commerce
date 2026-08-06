import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ChevronRight,
  Truck,
  ArrowLeft,
  CreditCard,
  ShoppingCart,
} from "lucide-react";
import { placeOrder } from "../services/orderService";
import { useCart } from "../context/CartContext";

export const Checkout = () => {
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    telNo: "",
    country: "Kenya",
    county: "",
    city: "",
    address: "",
    apartment: "",
    postalCode: "",
    notes: "",
  });

  const {cart}=useCart()

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const formatPrice = (price) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(price);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !shippingAddress.fullName ||
      !shippingAddress.telNo ||
      !shippingAddress.county ||
      !shippingAddress.city ||
      !shippingAddress.address
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const result = await placeOrder({
        shippingAddress,
        paymentMethod: "Mpesa",
      });
      toast.success("Order placed successfully!");
      console.log(result);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total,item)=> total + (item.quantity* item.product.price), 0)
  const shipping = subtotal > 5000 ? 0: Math.round(subtotal * 0.1);
  const tax = Math.round(subtotal*0.1);
  const totalPrice = subtotal+shipping+tax

  return (
    <div className="px-7 py-4">
      <div>
        <h1 className="text-accent font-bold text-3xl">Checkout</h1>
        <div className="mb-6 mt-2 flex items-center gap-2 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-[#7b4f1d]">
            Home
          </Link>
          <ChevronRight size={16} />
          <Link to="/cart" className="hover:text-[#7b4f1d]">
            Cart
          </Link>
          <ChevronRight size={16} />
          <span className="text-[#7b4f1d]">Checkout</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="shadow border rounded-lg p-6 border-border">
            <div className="flex gap-2 items-center">
              <Truck size={30} className="text-primary" />
              <div>
                <h2 className="font-bold text-text text-lg">
                  Shipping Information
                </h2>
                <p className="text-text/60 text-sm">
                  Please provide your shipping details
                </p>
              </div>
            </div>
            <hr className="my-5 border-border" />
            <form className="grid grid-cols-2 grid-rows-4 gap-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleChange}
                  className=" rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="telNo"
                  value={shippingAddress.telNo}
                  onChange={handleChange}
                  className=" rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  County
                </label>
                <select
                  name="county"
                  value={shippingAddress.county}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 max-w-[70%]"
                >
                  <option value="">Select County</option>
                  <option>Nairobi</option>
                  <option>Kiambu</option>
                  <option>Kisumu</option>
                  <option>Mombasa</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Town/City
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  className=" rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 font-medium text-gray-700">
                  Apartment / Building (Optional)
                </label>

                <input
                  type="text"
                  name="apartment"
                  value={shippingAddress.apartment}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 font-medium text-gray-700">
                  Additional information (optional)
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  value={shippingAddress.notes}
                  onChange={handleChange}
                  className=" rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
            </form>
          </div>
          <div className="shadow border rounded-lg p-6 border-border mt-3">
            <div className="flex gap-2 items-center">
              <CreditCard size={30} className="text-primary" />
              <div>
                <h2 className="font-bold text-text text-lg">Payment Method</h2>
                <p className="text-text/60 text-sm">
                  Currently we accept Mpesa only
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="shadow border rounded-lg p-6 border-border">
          <div className=" flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <ShoppingCart className="text-primary" />
              <h2 className="text-text font-bold text-lg">Order Summary</h2>
            </div>
            <p>{totalItems} items</p>
          </div>
          <hr className="my-5 border-border" />
          <div>
            {cart.map((item) => (
              <div key={item.product._id} className="border-b border-border/50 py-3 flex items-center justify-between ">
                <div className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <div>
                    <h2 className="text-text font-semibold">{item.product.name}</h2>
                    <p className="text-text/50 text-sm">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <div>
                </div>
                <div>
                  <div className="flex gap-3 items-center">
                    <span className="font-semibold text-text">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <div className="my-4  py-4 flex flex-col gap-3">
              <div className="flex justify-between ">
                <p>Subtotal ({totalItems} items)</p>
                <p className="font-semibold"> {formatPrice(subtotal)} </p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p className="font-semibold">{subtotal>5000 ? "Free" : formatPrice(shipping)}</p>
              </div>
              <div className="flex justify-between">
                <p>Tax (10%)</p>
                <p className="font-semibold">{formatPrice(tax)}</p>
              </div>
            </div>
          </div>
          <hr className="my-5 border-border" />
          <div>
            <div className="flex justify-between">
              <h2 className="text-accent text-2xl font-bold mb-4">Total</h2>
              <h2 className="text-primary text-2xl font-bold mb-4">{formatPrice(totalPrice)}</h2>
            </div>
            <button disabled={loading} onClick={handleSubmit} className="mt-6 w-full bg-primary hover:bg-primary-dark hover:cursor-pointer text-white py-3 rounded-lg font-semibold transition">
              {loading ? "Placing Order":"Place Order" }
            </button>
            <p className="text-text/60 text-xs mt-2">
              By placing your order, you agree to our{" "}
              <a href="" className="text-primary">
                Terms and Conditions
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <Link
          to={"/cart"}
          className="flex gap-2 border border-border rounded py-2 px-2 shadow w-[15%]"
        >
          <ArrowLeft />
          <span>Back to Cart</span>{" "}
        </Link>
      </div>
    </div>
  );
};

export default Checkout;
