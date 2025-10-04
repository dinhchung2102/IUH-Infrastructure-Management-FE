import { apiHelper } from "./index.js"; 
const AREAS_ENDPOINTS = {
  GET_ALL: "/zone-area/areas",
  GET_ALL_BY_CAMPUS: (campusId) => `/zone-area/campus/${campusId}/areas`, // chỉ còn campus
  CREATE: "/zone-area/areas",
  GET_BY_ID: (id) => `/zone-area/areas/${id}`,
  UPDATE: (id) => `/zone-area/areas/${id}`,
  DELETE: (id) => `/zone-area/areas/${id}`,
};

export const areasService = {
  // Lấy tất cả khu vực
  async getAll() {
    try {
      const response = await apiHelper.get(AREAS_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error("getAll areas error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  // Lấy tất cả khu vực theo campus
  async getAllByCampus(campusId) {
    try {
      const response = await apiHelper.get(AREAS_ENDPOINTS.GET_ALL_BY_CAMPUS(campusId));
      return response.data;
    } catch (error) {
      console.error("getAllByCampus areas error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  async getById(id) {
    try {
      const response = await apiHelper.get(AREAS_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error("getById areas error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  async create(payload) {
    try {
      const response = await apiHelper.post(AREAS_ENDPOINTS.CREATE, payload);
      return response.data;
    } catch (error) {
      console.error("create areas error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  async update(id, payload) {
    try {
      const response = await apiHelper.patch(AREAS_ENDPOINTS.UPDATE(id), payload);
      return response.data;
    } catch (error) {
      console.error("update areas error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  async delete(id) {
    try {
      const response = await apiHelper.delete(AREAS_ENDPOINTS.DELETE(id));
      return response.data;
    } catch (error) {
      console.error("delete areas error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },
};

export default areasService;
