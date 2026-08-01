import api from "./api";

export const getProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const getFeaturedProducts = async () => {
  const { data } = await api.get("/products?featured=true");
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};