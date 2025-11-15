/**
 * Validation schema cho Campus form
 * Dựa trên CreateCampusDto từ backend
 */

export interface CampusValidationErrors {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: string;
  manager?: string;
}

export interface CampusFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  status: string;
  manager: string;
}

/**
 * Validate tên campus
 * - Không được để trống
 * - Phải là chuỗi
 * - Tối thiểu 2 ký tự
 * - Tối đa 100 ký tự
 */
export const validateName = (name: string): string | undefined => {
  const trimmed = name.trim();
  if (!trimmed) {
    return "Vui lòng nhập tên cơ sở";
  }
  if (trimmed.length < 2) {
    return "Tên cơ sở phải có ít nhất 2 ký tự";
  }
  if (trimmed.length > 100) {
    return "Tên cơ sở không được vượt quá 100 ký tự";
  }
  return undefined;
};

/**
 * Validate địa chỉ
 * - Không được để trống
 * - Phải là chuỗi
 * - Tối thiểu 10 ký tự
 * - Tối đa 200 ký tự
 */
export const validateAddress = (address: string): string | undefined => {
  const trimmed = address.trim();
  if (!trimmed) {
    return "Vui lòng nhập địa chỉ";
  }
  if (trimmed.length < 10) {
    return "Địa chỉ phải có ít nhất 10 ký tự";
  }
  if (trimmed.length > 200) {
    return "Địa chỉ không được vượt quá 200 ký tự";
  }
  return undefined;
};

/**
 * Validate số điện thoại
 * - Không được để trống
 * - Phải là chuỗi
 * - Phải match pattern: /^[0-9+\-\s()]+$/
 * - Tối đa 20 ký tự
 */
export const validatePhone = (phone: string): string | undefined => {
  const trimmed = phone.trim();
  if (!trimmed) {
    return "Vui lòng nhập số điện thoại";
  }
  if (!/^[0-9+\-\s()]+$/.test(trimmed)) {
    return "Số điện thoại chỉ được chứa số, dấu +, -, khoảng trắng và dấu ngoặc";
  }
  if (trimmed.length > 20) {
    return "Số điện thoại không được vượt quá 20 ký tự";
  }
  return undefined;
};

/**
 * Validate email
 * - Không được để trống
 * - Phải là email hợp lệ
 * - Tối đa 100 ký tự
 */
export const validateEmail = (email: string): string | undefined => {
  const trimmed = email.trim();
  if (!trimmed) {
    return "Vui lòng nhập email";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return "Email không đúng định dạng (ví dụ: example@email.com)";
  }
  if (trimmed.length > 100) {
    return "Email không được vượt quá 100 ký tự";
  }
  return undefined;
};

/**
 * Validate trạng thái
 * - Không được để trống
 * - Phải là ACTIVE hoặc INACTIVE
 */
export const validateStatus = (status: string): string | undefined => {
  if (!status) {
    return "Trạng thái campus không được để trống";
  }
  if (status !== "ACTIVE" && status !== "INACTIVE") {
    return "Trạng thái campus không hợp lệ";
  }
  return undefined;
};

/**
 * Validate manager (MongoDB ObjectId)
 * - Không được để trống
 * - Phải là MongoDB ObjectId hợp lệ (24 ký tự hex)
 */
export const validateManager = (manager: string): string | undefined => {
  if (!manager || !manager.trim()) {
    return "Vui lòng chọn người quản lý";
  }
  // MongoDB ObjectId pattern: 24 hexadecimal characters
  const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
  if (!mongoIdPattern.test(manager.trim())) {
    return "Thông tin người quản lý không hợp lệ";
  }
  return undefined;
};

/**
 * Validate toàn bộ form campus
 * @returns Object chứa các lỗi validation, undefined nếu không có lỗi
 */
export const validateCampusForm = (
  formData: CampusFormData
): CampusValidationErrors | undefined => {
  const errors: CampusValidationErrors = {};

  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;

  const addressError = validateAddress(formData.address);
  if (addressError) errors.address = addressError;

  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const statusError = validateStatus(formData.status);
  if (statusError) errors.status = statusError;

  const managerError = validateManager(formData.manager);
  if (managerError) errors.manager = managerError;

  // Trả về undefined nếu không có lỗi nào
  return Object.keys(errors).length > 0 ? errors : undefined;
};
