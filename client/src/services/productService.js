import api from "./api";

export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
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

export const createProduct = async (payload) => {
  const { data } = await api.post("/products", payload);
  return data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

export const uploadProductImages = async (files, onUploadProgress) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const { data } = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        onUploadProgress(percent);
      }
    },
  });

  return data;
};