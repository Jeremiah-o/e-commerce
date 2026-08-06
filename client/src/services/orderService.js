import api from "./api";

export const placeOrder = async (orderData) => {
  const { data } = await api.post("/orders", orderData);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/myorders");
  return data;
};

export const getAllOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

export const getOrderById = async (orderId) => {
  const { data } = await api.get(`/orders/${orderId}`);
  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const { data } = await api.put(`/orders/${orderId}/status`, { status });
  return data;
};