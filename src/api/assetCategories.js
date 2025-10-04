import { apiHelper } from "./index.js";

const CATEGORY_ENDPOINTS = {
  GET_ALL: "/assets/categories",
  CREATE: "/assets/categories",
  GET_BY_ID: (id) => `/assets/categories/${id}`,
  UPDATE: (id) => `/assets/categories/${id}`,
  DELETE: (id) => `/assets/categories/${id}`,
};

export const assetCategoryService = {
  async getAll() {
    try {
      const res = await apiHelper.get(CATEGORY_ENDPOINTS.GET_ALL);
      return res.data;
    } catch (error) {
      console.error("getAll categories error:", error);
      return { success: false, message: error.message };
    }
  },

  async create(payload) {
    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("status", payload.status);
      formData.append("description", payload.description);
      if (payload.image instanceof File) {
        formData.append("image", payload.image);
      }

      const res = await apiHelper.post(CATEGORY_ENDPOINTS.CREATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      console.error("create asset category error:", error);
      return { success: false, message: error.message };
    }
  },

  async update(id, payload) {
  try {
    let res;

    if (payload.image instanceof File) {
      // Có ảnh mới -> gửi multipart/form-data
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("status", payload.status);
      formData.append("description", payload.description);
      formData.append("image", payload.image);

      res = await apiHelper.patch(CATEGORY_ENDPOINTS.UPDATE(id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      // Không có ảnh mới -> gửi JSON
      const data = {
        name: payload.name,
        status: payload.status,
        description: payload.description,
      };

      res = await apiHelper.patch(CATEGORY_ENDPOINTS.UPDATE(id), data, {
        headers: { "Content-Type": "application/json" },
      });
    }

    return res.data;
  } catch (error) {
    console.error("update asset category error:", error);
    return { success: false, message: error.message };
  }
},

  async delete(id) {
    try {
      const res = await apiHelper.delete(CATEGORY_ENDPOINTS.DELETE(id));
      return res.data;
    } catch (error) {
      console.error("delete category error:", error);
      return { success: false, message: error.message };
    }
  },
};
