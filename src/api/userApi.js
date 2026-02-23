import client from "./client";

export const getUsers = async () => {
  const res = await client.get("/api/users");
  return res.data;
};
