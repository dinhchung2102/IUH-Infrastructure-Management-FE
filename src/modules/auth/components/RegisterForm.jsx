import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../providers/AuthContext.jsx";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Grid,
  CircularProgress,
  Select,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import OtpDialog from "./OtpDialog.jsx";
import { authService } from "../../../api/auth.js";

// Simple RFC5322-like email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function RegisterForm({ onSuccess }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit: gửi OTP đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!formData.email) {
      setMessage("Vui lòng nhập địa chỉ email");
      return;
    }

    if (!EMAIL_REGEX.test(formData.email)) {
      setMessage("Địa chỉ email không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      // Gửi OTP đăng ký tới email
      const result = await authService.sendRegisterOtp({
        email: formData.email,
      });
      if (result?.success) {
        setOtpDialogOpen(true);
      } else {
        setMessage(result?.message || "Có lỗi xảy ra khi gửi OTP đăng ký");
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      setMessage(apiMessage || "Có lỗi xảy ra khi gửi OTP đăng ký");
    } finally {
      setLoading(false);
    }
  };

  // Xác nhận OTP: gọi /auth/register với authOTP, sau đó login và điều hướng
  const handleConfirmOtp = async (otp) => {
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        username: formData.email,
        password: formData.password,
        email: formData.email,
        fullName: formData.fullName,
        gender: formData.gender, // MALE | FEMALE
        authOTP: otp,
      };

      const registerResult = await authService.register(payload);
      if (!registerResult?.success) {
        const msg = registerResult?.message || "Đăng ký thất bại";
        setMessage(msg);
        return { success: false, message: msg };
      }

      // Đăng nhập ngay sau khi đăng ký thành công
      const loginResult = await authService.login({
        username: formData.email,
        password: formData.password,
      });

      if (loginResult?.success && loginResult?.data) {
        // Lưu thông tin đăng nhập vào context
        login(
          loginResult.data.account || loginResult.data.user || {},
          loginResult.data.access_token
        );
        setOtpDialogOpen(false); // đóng dialog OTP
        if (onSuccess) onSuccess(); // đóng form đăng ký
        navigate("/"); // quay về trang chủ
        return { success: true };
      } else {
        const msg = loginResult?.message || "Đăng nhập sau đăng ký thất bại";
        setMessage(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.message || "Có lỗi xảy ra";
      setMessage(apiMessage);
      return { success: false, message: apiMessage };
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 1, maxWidth: 700, mx: "auto" }}
      >
        <Grid container spacing={2} columns={16}>
          {/* Họ và tên */}
          <Grid size={{ xs: 16, sm: 8 }}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="fullName"
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 16, sm: 8 }}>
            <TextField
              fullWidth
              margin="normal"
              id="phone"
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>

          {/* Email và Giới tính cùng hàng */}
          <Grid size={{ xs: 16, sm: 8 }}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="email"
              label="Địa chỉ Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 16, sm: 8 }}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel id="gender-label">Giới tính</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={formData.gender}
                label="Giới tính"
                onChange={handleChange}
              >
                <MenuItem value="MALE">Nam</MenuItem>
                <MenuItem value="FEMALE">Nữ</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Mật khẩu và Xác nhận mật khẩu cùng hàng */}
          <Grid size={{ xs: 16, sm: 8 }}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Mật khẩu</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Mật khẩu"
              />
            </FormControl>
          </Grid>

          <Grid size={{ xs: 16, sm: 8 }}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="confirmPassword">
                Xác nhận mật khẩu
              </InputLabel>
              <OutlinedInput
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Xác nhận mật khẩu"
              />
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {message && (
          <Typography
            variant="body2"
            color={message.includes("thành công") ? "success.main" : "error"}
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
          startIcon={loading && <CircularProgress size={16} />}
        >
          Đăng ký
        </Button>
      </Box>

      {/* OTP Dialog */}
      <OtpDialog
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        email={formData.email}
        formData={formData}
        onConfirm={handleConfirmOtp}
      />
    </>
  );
}
