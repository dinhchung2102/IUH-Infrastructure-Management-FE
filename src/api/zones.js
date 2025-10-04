import { apiHelper } from "./index.js";

const ZONES_ENDPOINTS = {
  GET_ALL: "/zone-area/zones",
  GET_BY_ID: (id) => `/zone-area/zones/${id}`,
  CREATE: "/zone-area/zones",
  UPDATE: (id) => `/zone-area/zones/${id}`,
  DELETE: (id) => `/zone-area/zones/${id}`,
  GET_BY_BUILDING: (buildingId) => `/zone-area/buildings/${buildingId}/zones`,
};

export const zonesService = {
  /**
   * Lấy danh sách tất cả zones
   */
  async getAll() {
    try {
      const response = await apiHelper.get(ZONES_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error("getAll zones error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  /**
   * Lấy chi tiết zone theo ID
   * @param {string} id 
   */
  async getById(id) {
    try {
      const response = await apiHelper.get(ZONES_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error("getById zones error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  /**
   * Tạo zone mới
   * @param {Object} payload
   */
  async create(payload) {
    try {
      const response = await apiHelper.post(ZONES_ENDPOINTS.CREATE, payload);
      return response.data;
    } catch (error) {
      console.error("create zone error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  /**
   * Cập nhật zone
   * @param {string} id 
   * @param {Object} payload 
   */
  async update(id, payload) {
    try {
      const response = await apiHelper.patch(ZONES_ENDPOINTS.UPDATE(id), payload);
      return response.data;
    } catch (error) {
      console.error("update zone error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  /**
   * Xóa zone
   * @param {string} id 
   */
  async delete(id) {
    try {
      const response = await apiHelper.delete(ZONES_ENDPOINTS.DELETE(id));
      return response.data;
    } catch (error) {
      console.error("delete zone error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },

  /**
   * Lấy tất cả zones thuộc 1 building
   * @param {string} buildingId 
   */
  async getAllZonesByBuilding(buildingId) {
    try {
      const response = await apiHelper.get(ZONES_ENDPOINTS.GET_BY_BUILDING(buildingId));
      return response.data;
    } catch (error) {
      console.error("getAllZonesByBuilding error:", error);
      return { success: false, message: error.message || "Network error occurred" };
    }
  },
};

export default zonesService;
