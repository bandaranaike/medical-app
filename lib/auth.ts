import api from "@/lib/axios";

export async function getUser() {
  try {
    const response = await api.get("/api/user");
    return response.data;
  } catch {
    return null;
  }
}
