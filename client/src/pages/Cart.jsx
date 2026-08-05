import {
  ShoppingCart,
  ArrowLeft,
  Handbag,
  Truck,
  Shield,
  Undo2,
  ShieldCheck,
  Trash2,
  Minus, X,
  Plus,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, updateItem, emptyCart,removeItem } = useCart();

  const formatPrice = (price) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(price);

  console.log(cart);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total,item)=> total + (item.quantity* item.product.price), 0)
  const shipping = subtotal > 5000 ? 0: Math.round(subtotal * 0.1);
  const tax = Math.round(subtotal*0.1);
  const totalPrice = subtotal+shipping+tax

  return (
    <div>
      <div className="flex justify-between p-6 items-center">
        <div className="flex gap-2">
          <div className="bg-sand p-3 rounded">
            <ShoppingCart className="text-primary" />
          </div>
          <div className="">
            <h1 className="text-2xl font-bold text-accent">Shopping Cart</h1>
            <p>{totalItems!==0 ? `you have ${totalItems} items in your cart` : "Your cart is empty"}</p>
          </div>
        </div>
        <div>
          <Link
            to={"/products"}
            className="flex gap-2 border border-border rounded p-2 shadow"
          >
            <ArrowLeft />
            <span>Continue Shopping</span>{" "}
          </Link>
        </div>
      </div>
      <div className="flex px-6 pb-4 gap-5">
        <div className="relative border border-border rounded-lg shadow w-[65%]">
          <div className="p-6">
            {cart.map((item) => (
              <div key={item.product._id} className="border-b border-border/50 py-3 flex items-center justify-between ">
                <div className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <div>
                    <h2 className="text-text font-bold">{item.product.name}</h2>
                    <p className="text-text/50 text-sm">
                      {item.product.category} .{" "}
                      <span className="text-green-500">
                        {item.product.stock > 0 ? "In stock" : "Out of stock"}
                      </span>
                    </p>
                    <h2 className="text-primary font-bold">
                      Ksh{item.product.price}
                    </h2>
                  </div>
                </div>
                <div>
                  <div className="flex items-center overflow-hidden rounded-md border border-[#e4dac8] bg-white">
                    <button
                      type="button"
                      disabled={item.quantity === 1}
                      onClick={() =>
                        updateItem(item.product._id, Math.max(1, item.quantity - 1))
                      }
                      className="p-3 text-slate-600 hover:bg-[#f6efe5] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="min-w-12 text-center text-sm font-semibold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateItem(item.product._id, Math.max(1, item.quantity + 1))}
                      className="p-3 text-slate-600 hover:bg-[#f6efe5]"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex gap-3 items-center">
                    <span className="font-semibold text-text">Ksh {item.product.price * item.quantity}</span>
                    <button type="button" className="hover:cursor-pointer" onClick={()=>removeItem(item.product._id)}><X size={15}/></button>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 bg-amber-50 w-full rounded-b-lg px-4 py-2">
            <button disabled={totalItems === 0} type="button" onClick={()=>emptyCart()} className="flex gap-3 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              <Trash2 className="text-primary" />
              <span className="text-text font-semibold">Clear Cart</span>
            </button>
          </div>
        </div>
        <div className="w-[33%]">
          <div className="bg-beige/50 p-4 rounded border border-border/50">
            <h2 className="text-accent text-2xl font-bold ">Order Summary</h2>
            <div className="my-4 border-y-2 border-border/60 py-4 flex flex-col gap-3">
              <div className="flex justify-between ">
                <p>Subtotal ({totalItems} items)</p>
                <p className="font-semibold"> {formatPrice(subtotal)} </p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p className="font-semibold">{subtotal>5000 ? "Free" : formatPrice(shipping)}</p>
              </div>
              <div className="flex justify-between">
                <p>Tax</p>
                <p className="font-semibold">{formatPrice(tax)}</p>
              </div>
            </div>
            <div className="my-4 border-b-2 pb-4 border-border/60">
              <div className="flex justify-between">
                <h2 className="text-accent text-2xl font-bold mb-4">Total</h2>
                <h2 className="text-primary text-2xl font-bold mb-4">{formatPrice(totalPrice)}</h2>
              </div>
              <Link
                to={"/checkout"}
                className="bg-primary rounded  py-2 text-background flex justify-center gap-2"
              >
                {" "}
                <Handbag /> Proceed to Checkout
              </Link>
            </div>
            <div className="flex">
              <div className="flex flex-col items-center">
                <Truck className="text-text" />
                <p className="text-text">Free Delivery</p>
                <p className="text-xs text-text/50">Orders over ksh 5000</p>
              </div>
              <div className="flex flex-col items-center border-x-2 border-border px-2 mx-2">
                <Shield className="text-text" />
                <p className="text-text">Secure Payment</p>
                <p className="text-xs text-text/50">100% protected</p>
              </div>
              <div className="flex flex-col items-center">
                <Undo2 className="text-text" />
                <p className="text-text">Easy Returns</p>
                <p className="text-xs text-text/50">30-day returns</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 bg-beige/50 p-4 rounded border border-border/50">
            <ShieldCheck size={35} className="text-primary" />
            <div>
              <h3>Safe & Secure Checkout</h3>
              <p className="text-sm text-text/50">
                Your data is encrypted and safe with us
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
