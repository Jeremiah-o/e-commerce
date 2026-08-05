import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight,Truck } from "lucide-react";

export const Checkout = () => {
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
      <div>
        <div>
          <div className="shadow border rounded-lg p-2 border-border">
            <div className="flex gap-2 items-center">
              <Truck size={30} className="text-primary"/>
              <div>
                <h2 className="font-bold text-text text-lg">Shipping Information</h2>
                <p className="text-text/60 text-sm">Please provide your shipping details</p>
              </div>
              
            </div>
            <form className="grid grid-cols-2 grid-rows-4 gap-4">
                <div>
                  <h3>Full Name</h3>
                  <input type="text" name="fName" className="shadow rounded border border-border" />
                </div>
                <div>
                  <h3>Phone Number</h3>
                  <input type="number" name="telNo" className="shadow rounded border border-border" />
                </div>
                <div>
                  <h3>County</h3>
                </div>
                <div>
                  <h3>Town/City</h3>
                  <input type="text" />
                </div>
                <div className="col-span-2">
                  <h3>Street Address</h3>
                  <input type="text" />
                </div>
                <div className="col-span-2">
                  <h3>Additional information (optional)</h3>
                  <input type="text" />
                </div>
              </form>
          </div>
          <div></div>
        </div>
        <div></div>
      </div>
      <div></div>
    </div>
  );
};

export default Checkout;
