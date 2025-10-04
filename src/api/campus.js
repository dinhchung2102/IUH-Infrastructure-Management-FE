import { apiHelper } from "./index.js";

const CAMPUS_ENDPOINTS = {
  GET_ALL: "/campus",
  CREATE: "/campus",
  GET_BY_ID: (id) => `/campus/${id}`,
  UPDATE: (id) => `/campus/${id}`,
  DELETE: (id) => `/campus/${id}`,
};

export const campusService = {
  /**
   * Lấy danh sách tất cả campus
   * @returns {Promise} Danh sách campus
   */
  async getAll() {
    try {
      const response = await apiHelper.get(CAMPUS_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error("getAll campus error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Lấy chi tiết campus theo ID
   * @param {string} id - ID campus
   * @returns {Promise} Chi tiết campus
   */
  async getById(id) {
    try {
      const response = await apiHelper.get(CAMPUS_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error("getById campus error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
   * Tạo campus mới
   * @param {Object} payload - Thông tin campus
   * @param {string} payload.name
   * @param {string} payload.address
   * @param {string} payload.phone
   * @param {string} payload.email
   * @param {string} payload.status
   * @param {string} payload.manager - ID manager
   * @returns {Promise} Kết quả tạo campus
   */
  async create(payload) {
    try {
      const response = await apiHelper.post(CAMPUS_ENDPOINTS.CREATE, payload);
      return response.data;
    } catch (error) {
      console.error("create campus error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },

  /**
 * Cập nhật campus
 * @param {string} id - ID campus
 * @param {Object} payload - Thông tin cần cập nhật
 * @returns {Promise} Kết quả cập nhật
 */
async update(id, payload) {
  try {
    const response = await apiHelper.patch(CAMPUS_ENDPOINTS.UPDATE(id), payload);
    return response.data;
  } catch (error) {
    console.error("update campus error:", error);
    return {
      success: false,
      message: error.message || "Network error occurred",
    };
  }
},

  /**
   * Xóa campus
   * @param {string} id - ID campus
   * @returns {Promise} Kết quả xóa
   */
  async delete(id) {
    try {
      const response = await apiHelper.delete(CAMPUS_ENDPOINTS.DELETE(id));
      return response.data;
    } catch (error) {
      console.error("delete campus error:", error);
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  },
};

export default campusService;
