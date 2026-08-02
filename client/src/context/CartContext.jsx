import { createContext, useContext, useEffect, useState } from "react";

import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cartService";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);

      const data = await getCart();
      console.log(data)

      setCart(data.cart?.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addItem = async (productId, quantity = 1) => {
    await addToCart(productId, quantity);
    await fetchCart();
  };

  const updateItem = async (productId, quantity) => {
    await updateCartItem(productId, quantity);
    await fetchCart();
  };

  const removeItem = async (productId) => {
    await removeCartItem(productId);
    await fetchCart();
  };

  const emptyCart = async () => {
    await clearCart();
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        updateItem,
        removeItem,
        emptyCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);