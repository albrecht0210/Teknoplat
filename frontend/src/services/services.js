import axios from "axios";
import Cookies from "js-cookie";

export async function refreshAccessToken() {
    try {
      const response = await axios.post("http://localhost:8000/api/token/refresh/", {
        refresh: Cookies.get("refresh")
      });
  
      Cookies.set("access", response.data.access);
    } catch (error) {
      throw error;
    }
}
