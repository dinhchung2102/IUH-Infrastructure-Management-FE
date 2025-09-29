import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authService } from "../../../api/auth.js";
import { useAuth } from "../../../providers/AuthContext.jsx";

export default function LoginForm({
  onError,
  onClose,
  onSwitchToRegister,
  onSwitchToForgot,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (onError) onError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (onError) onError("");

    try {
      const result = await authService.login(formData);

      if (result.success && result.data) {
        console.log("Login successful:", result.message);

        login(result.data.account, result.data.access_token);

        login(
          result.data.account,
          result.data.access_token,
          result.data.refresh_token
        );

        if (onClose) onClose();

        navigate("/");
      } else {
        if (onError) onError(result.message || t("auth.loginError"));
        console.log("Login failed:", result);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      if (onError) onError(t("auth.loginError"));
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label={t("auth.username")}
          name="username"
          autoComplete="username"
          autoFocus
          value={formData.username}
          onChange={handleChange}
          disabled={loading}
        />

        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="password">{t("auth.password")}</InputLabel>
          <OutlinedInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                  disabled={loading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={t("auth.password")}
          />
        </FormControl>

        {/* Quên mật khẩu */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              mt: 1,
              cursor: "pointer",
              textAlign: "right",
              color: "primary.main",
              fontSize: "0.85rem",
              fontStyle: "italic",
            }}
            onClick={() => {
              onClose(); // Đóng dialog login trước
              if (onSwitchToRegister) onSwitchToRegister(); // Gọi callback để AppBar xử lý
            }}
          >
            Đăng ký tài khoản
          </Typography>
          <Typography
            sx={{
              mt: 1,
              cursor: "pointer",
              textAlign: "right",
              color: "primary.main",
              fontSize: "0.85rem",
              fontStyle: "italic",
            }}
            onClick={() => {
              if (onSwitchToForgot) onSwitchToForgot(); // Chỉ mở dialog quên mật khẩu, không đóng login
            }}
          >
            Quên mật khẩu?
          </Typography>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t("auth.login.signIn")
          )}
        </Button>
      </Box>
    </>
  );
}
