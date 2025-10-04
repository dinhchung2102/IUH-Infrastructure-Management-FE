import { apiHelper } from "./index.js";

const TYPE_ENDPOINTS = {
  GET_ALL: "/assets/types",
  CREATE: "/assets/types",
  GET_BY_ID: (id) => `/assets/types/${id}`,
  UPDATE: (id) => `/assets/types/${id}`,
  DELETE: (id) => `/assets/types/${id}`,
};

export const assetTypeService = {
  async getAll() {
    try {
      const res = await apiHelper.get(TYPE_ENDPOINTS.GET_ALL);
      return res.data;
    } catch (error) {
      console.error("getAll asset types error:", error);
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

      const res = await apiHelper.post(TYPE_ENDPOINTS.CREATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      console.error("create asset type error:", error);
      return { success: false, message: error.message };
    }
  },

  async update(id, payload) {
    try {
      let res;

      if (payload.image instanceof File) {
        const formData = new FormData();
        formData.append("name", payload.name);
        formData.append("status", payload.status);
        formData.append("description", payload.description);
        formData.append("image", payload.image);

        res = await apiHelper.patch(TYPE_ENDPOINTS.UPDATE(id), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const data = {
          name: payload.name,
          status: payload.status,
          description: payload.description,
        };

        res = await apiHelper.patch(TYPE_ENDPOINTS.UPDATE(id), data, {
          headers: { "Content-Type": "application/json" },
        });
      }

      return res.data;
    } catch (error) {
      console.error("update asset type error:", error);
      return { success: false, message: error.message };
    }
  },

  async delete(id) {
    try {
      const res = await apiHelper.delete(TYPE_ENDPOINTS.DELETE(id));
      return res.data;
    } catch (error) {
      console.error("delete asset type error:", error);
      return { success: false, message: error.message };
    }
  },

  async getById(id) {
    try {
      const res = await apiHelper.get(TYPE_ENDPOINTS.GET_BY_ID(id));
      return res.data;
    } catch (error) {
      console.error("get asset type by id error:", error);
      return { success: false, message: error.message };
    }
  },
};

export default assetTypeService;
