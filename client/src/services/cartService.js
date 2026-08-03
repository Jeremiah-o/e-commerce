import api from "./api";

export const addToCart = async (productId, quantity) => {
  const { data } = await api.post("/cart", {
    productId,
    quantity,
  });

  return data;
};

export const getCart = async () => {
  const { data } = await api.get("/cart");
  return data;
};

export const updateCartItem = async (productId, quantity) => {
  const { data } = await api.put(`/cart/${productId}`, {
    productId,
    quantity,
  });

  return data;
};

export const removeCartItem = async (productId) => {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await api.delete("/cart");
  return data;
};