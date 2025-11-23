import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createCampus, updateCampus } from "../api/campus.api";
import { getAccounts } from "@/admin/account-management/api/account.api";
import { validateCampusForm } from "../validations/campus.validation";
import type { AccountResponse } from "@/admin/account-management/types/account.type";

interface CampusAddFormValues {
  name: string;
  address: string;
  phone: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  manager: string;
}

interface CampusAddFormErrors {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  manager?: string;
}

interface CampusWithOptionalManager {
  _id?: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: string;
  manager?:
    | { _id?: string }
    | { _id?: string; fullName: string; email: string }
    | null
    | undefined;
}

interface UseCampusAddFormOptions<
  TCampus extends CampusWithOptionalManager = CampusWithOptionalManager
> {
  open: boolean;
  mode: "add" | "edit";
  campus?: TCampus;
  onSuccess?: () => void;
  onClose: () => void;
}

/**
 * Custom hook to manage state and submit logic for Campus add/edit dialog
 */
export function useCampusAddForm<
  TCampus extends CampusWithOptionalManager = CampusWithOptionalManager
>({
  open,
  mode,
  campus,
  onSuccess,
  onClose,
}: UseCampusAddFormOptions<TCampus>) {
  const [form, setForm] = useState<CampusAddFormValues>({
    name: "",
    address: "",
    phone: "",
    email: "",
    status: "ACTIVE",
    manager: "",
  });

  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<AccountResponse[]>([]);
  const [errors, setErrors] = useState<CampusAddFormErrors>({});

  // Fetch managers when dialog opens
  useEffect(() => {
    if (open) {
      void fetchManagers();
    }
  }, [open]);

  const fetchManagers = async () => {
    try {
      const res = await getAccounts({
        role: "CAMPUS_ADMIN",
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setManagers(res?.data?.accounts || []);
    } catch (err) {
      console.error("Error fetching campus managers:", err);
      toast.error("Không thể tải danh sách người quản lý.");
    }
  };

  // Initialize form when editing or opening
  useEffect(() => {
    if (mode === "edit" && campus) {
      setForm({
        name: campus.name || "",
        address: campus.address || "",
        phone: campus.phone || "",
        email: campus.email || "",
        status: campus.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        manager: (campus as CampusWithOptionalManager).manager?._id || "",
      });
    } else if (open) {
      setForm({
        name: "",
        address: "",
        phone: "",
        email: "",
        status: "ACTIVE",
        manager: "",
      });
      setErrors({});
    }
  }, [mode, campus, open]);

  const handleChange = (field: keyof CampusAddFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const validationErrors = validateCampusForm({
      name: form.name,
      address: form.address,
      phone: form.phone,
      email: form.email,
      status: form.status,
      manager: form.manager,
    });

    if (validationErrors) {
      setErrors({
        name: validationErrors.name,
        address: validationErrors.address,
        phone: validationErrors.phone,
        email: validationErrors.email,
        manager: validationErrors.manager,
      });

      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        status: form.status,
        manager: form.manager || null,
      };

      const res =
        mode === "edit" && campus?._id
          ? await updateCampus(campus._id, payload)
          : await createCampus(payload);

      if (res.success) {
        toast.success(
          res.message ||
            (mode === "edit"
              ? "Cập nhật cơ sở thành công!"
              : "Thêm cơ sở thành công!")
        );
        onClose();
        onSuccess?.();
      } else {
        toast.error(res.message || "Thao tác không thành công.");
      }
    } catch (err: unknown) {
      console.error("Error saving campus:", err);
      const error = err as { response?: { data?: { message?: string } } };
      const message =
        error.response?.data?.message || "Có lỗi xảy ra khi lưu cơ sở.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    loading,
    managers,
    handleChange,
    handleSubmit,
  };
}
