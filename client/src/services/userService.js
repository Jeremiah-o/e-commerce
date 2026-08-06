import api from "./api";

export const getAllUsers = async () => {
  const { data } = await api.get("/auth/users");
  return data;
};

export const updateUserRole = async (userId, role) => {
  const { data } = await api.put(`/auth/users/${userId}/role`, { role });
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await api.delete(`/auth/users/${userId}`);
  return data;
};
