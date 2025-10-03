import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import OtpDialog from "./OtpDialog.jsx";
import { authService } from "../../../api/auth.js";

export default function RegisterForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Khi nhấn submit form → mở OTP dialog và gửi OTP tới email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage(t("auth.register.passwordMismatch"));
      return;
    }

    if (!formData.email) {
      setMessage(t("auth.register.emailRequired"));
      return;
    }

    try {
      setLoading(true);

      const result = await authService.sendOtp({ email: formData.email });
      console.log(result);

      if (result.success) {
        setOtpDialogOpen(true);
      } else {
        setMessage(result.message || t("common.error"));
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setMessage(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  // Function to determine role based on email
  const getRoleFromEmail = (email) => {
    return email.endsWith("@student.iuh.edu.vn") ? "student" : "guest";
  };

  const handleConfirmOtp = async (otp) => {
    setLoading(true);
    setMessage("");
    try {
      // Xác thực OTP
      console.log("Xác thực OTP", formData.email, otp);
      const verifyResult = await authService.verifyOtp({
        email: formData.email,
        authOTP: otp,
      });

      if (verifyResult.message.includes("OTP đã được xác thực")) {
        // Tự động xác định role dựa trên email
        const userRole = getRoleFromEmail(formData.email);

        const payload = {
          username: formData.email,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phone,
          password: formData.password,
          role: userRole, // Tự động xác định role
        };

        console.log("Registering with role:", userRole);

        const registerResult = await authService.register(payload);
        if (registerResult.success) {
          setOtpDialogOpen(false);
          alert(
            `Đăng ký thành công! Bạn được xác định là ${
              userRole === "student" ? "sinh viên" : "khách"
            }.`
          );
        } else {
          setMessage(registerResult.message || "Đăng ký thất bại");
        }
      } else {
        setMessage(verifyResult.message || "OTP không hợp lệ");
      }
    } catch (err) {
      console.error("Confirm OTP error:", err);
      setMessage(err.response?.data?.message || "Có lỗi xảy ra");
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
              label={t("auth.register.fullName")}
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
              label={t("auth.register.phone")}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>

          {/* Email */}
          <Grid size={{ xs: 16, sm: 8 }}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="email"
              label={t("auth.register.email")}
              name="email"
              value={formData.email}
              onChange={handleChange}
              helperText="Email @student.iuh.edu.vn sẽ được xác định là sinh viên"
            />
          </Grid>

          {/* Password */}
          <Grid size={{ xs: 16, sm: 8 }}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">
                {t("auth.register.password")}
              </InputLabel>
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
                label={t("auth.register.password")}
              />
            </FormControl>
          </Grid>

          {/* Confirm Password */}
          <Grid size={{ xs: 16, sm: 8 }}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="confirmPassword">
                {t("auth.register.confirmPassword")}
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
                label={t("auth.register.confirmPassword")}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Checkbox */}
        <Grid container spacing={2} columns={16}>
          <Grid size={16}>
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
              }
              label={t("auth.register.agreeToTerms")}
            />
          </Grid>
        </Grid>

        {message && (
          <Typography
            variant="body2"
            color={message.includes("thành công") ? "success.main" : "error"}
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}

        <Grid container spacing={2} columns={16} justifyContent="center">
          <Grid item size={{ xs: 16, sm: 8 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
              startIcon={loading && <CircularProgress size={16} />}
            >
              {t("auth.register.signUp")}
            </Button>
          </Grid>
        </Grid>
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
