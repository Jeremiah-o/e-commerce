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
    try {
      await addToCart(productId, quantity);
      await fetchCart();
    } catch (err) {
      console.error(err)
    }
  };

  const updateItem = async (productId, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      ),
    );

    try {
      await updateCartItem(productId, quantity);
    } catch (err) {
      console.error(err);
      await fetchCart();
    }
  };

  const removeItem = async (productId) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));

    try {
      await removeCartItem(productId);
    } catch (err) {
      console.error(err);
      fetchCart();
    }
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
