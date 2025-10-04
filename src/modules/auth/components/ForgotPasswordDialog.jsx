import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authService } from "../../../api/auth.js";

export default function ForgotPasswordDialog({ open, onClose }) {
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập OTP + mật khẩu mới
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Simple RFC5322-like email regex
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const handleStep1 = async () => {
    setSubmitting(true);
    setMessage("");

    if (!email) {
      setMessage("Vui lòng nhập địa chỉ email");
      setSubmitting(false);
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setMessage("Địa chỉ email không hợp lệ");
      setSubmitting(false);
      return;
    }

    try {
      const result = await authService.requestResetPassword({ email });
      if (result?.success) {
        setMessage("Mã OTP đã được gửi đến email " + email);
        setStep(2); // chuyển sang bước 2
      } else {
        setMessage(result?.message || "Có lỗi xảy ra khi gửi OTP");
      }
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      setMessage(apiMessage || "Có lỗi xảy ra khi gửi OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep2 = async () => {
    setSubmitting(true);
    setMessage("");

    if (!otp) {
      setMessage("Vui lòng nhập mã OTP");
      setSubmitting(false);
      return;
    }

    if (!newPassword) {
      setMessage("Vui lòng nhập mật khẩu mới");
      setSubmitting(false);
      return;
    }

    if (!confirmPassword) {
      setMessage("Vui lòng xác nhận mật khẩu");
      setSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp");
      setSubmitting(false);
      return;
    }

    try {
      const result = await authService.resetPassword({
        email,
        authOTP: otp,
        newPassword,
      });

      if (result?.success) {
        setMessage("Đặt lại mật khẩu thành công!");
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setMessage(result?.message || "Đặt lại mật khẩu thất bại");
      }
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      setMessage(apiMessage || "Có lỗi xảy ra khi đặt lại mật khẩu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        {step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
      </DialogTitle>

      <DialogContent>
        {step === 1 ? (
          <>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, textAlign: "center" }}
            >
              Vui lòng nhập địa chỉ email đã đăng ký để tiếp tục
            </Typography>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </>
        ) : (
          <>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, textAlign: "center" }}
            >
              Nhập mã OTP và mật khẩu mới
            </Typography>
            <TextField
              fullWidth
              label="Mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={submitting}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 6 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor="newPassword">Mật khẩu mới</InputLabel>
              <OutlinedInput
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={submitting}
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
                label="Mật khẩu mới"
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="confirmPassword">
                Xác nhận mật khẩu
              </InputLabel>
              <OutlinedInput
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
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
          </>
        )}

        {message && (
          <Typography
            variant="body2"
            sx={{ mt: 2 }}
            color={message.includes("thành công") ? "success.main" : "error"}
          >
            {message}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={step === 1 ? handleClose : () => setStep(1)}
          disabled={submitting}
          sx={{
            backgroundColor: "rgba(233, 231, 231, 0.95)",
            color: "black",
            "&:hover": {
              backgroundColor: "rgba(230,230,230,1)",
            },
          }}
        >
          {step === 1 ? "Hủy" : "Quay lại"}
        </Button>
        <Button
          variant="contained"
          onClick={step === 1 ? handleStep1 : handleStep2}
          disabled={
            submitting ||
            (step === 1 ? !email : !otp || !newPassword || !confirmPassword)
          }
        >
          {step === 1 ? "Gửi OTP" : "Đặt lại mật khẩu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
