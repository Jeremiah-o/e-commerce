import { ShoppingCart, ArrowLeft,Handbag,Truck, Shield, Undo2, ShieldCheck } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart } = useCart();

  console.log(cart)

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div>
      <div className="flex justify-between p-6 items-center">
        <div className="flex gap-2">
          <div className="bg-sand p-3 rounded">
            <ShoppingCart className="text-primary" />
          </div>
          <div className="">
            <h1 className="text-2xl font-bold text-accent">Shopping Cart</h1>
            <p>you have {totalItems} items in your cart</p>
          </div>
        </div>
        <div>
          <Link
            to={"/products"}
            className="flex gap-2 border border-border rounded p-2"
          >
            <ArrowLeft />
            <span>Continue Shopping</span>{" "}
          </Link>
        </div>
      </div>
      <div className="flex p-6 gap-3">
        <div className="border border-border p-4 rounded">
          {cart.map((item)=>(
            <div>
              <div className="flex gap-3">
                <img src={item.product.image} alt={item.product.name} className="h-18 w-10 rounded" />
                <div>
                  <h2 className="text-text font-bold">{item.product.name}</h2>
                  <p className="text-text/50 text-sm">{item.product.category} . <span className="text-green-400">{item.product.stock > 0 ? "In stock" : "Out of stock"}</span></p>
                  <h2 className="text-primary font-bold">Ksh{item.product.price}</h2>
                  
                </div>
              </div>
              <div></div>
              <div></div>
            </div>
          ))}
        </div>
        <div>
          <div className="bg-beige/50 p-4 rounded border border-border/50">
            <h2 className="text-accent text-2xl font-bold ">
              Order Summary
            </h2>
            <div className="my-4 border-y-2 border-border/60 py-4 flex flex-col gap-3">
              <div className="flex justify-between ">
                <p>Subtotal ({totalItems} items)</p>
                <p>Ksh </p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p></p>
              </div>
              <div className="flex justify-between">
                <p>Tax</p>
                <p>Ksh</p>
              </div>
            </div>
            <div className="my-4 border-b-2 pb-4 border-border/60">
              <div className="flex justify-between">
                <h2 className="text-accent text-2xl font-bold mb-4">Total</h2>
                <h2 className="text-primary text-2xl font-bold mb-4">Ksh</h2>
              </div>
              <Link to={"/"} className="bg-primary rounded px-6 py-2 text-background flex gap-2"> <Handbag /> Proceed to Checkout</Link>
            </div>
            <div className="flex">
              <div className="flex flex-col items-center">
                <Truck  className="text-text"/>
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
            <ShieldCheck size={35} className="text-primary"/>
            <div>
              <h3>Safe & Secure Checkout</h3>
              <p className="text-sm text-text/50">Your data is encrypted and safe with us</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
