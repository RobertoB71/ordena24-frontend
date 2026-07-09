import { API_BASE_URL } from "../../../services/API/axiosInstance";

export const resolveImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) {
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80";
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl}`;
};
