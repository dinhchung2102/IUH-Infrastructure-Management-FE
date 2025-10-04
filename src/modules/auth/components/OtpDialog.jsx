// OtpDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import authService from "../../../api/auth";

export default function OtpDialog({ open, onClose, email, onConfirm }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const hasSentOtp = useRef(false);

  useEffect(() => {
    if (open && !hasSentOtp.current) {
      hasSentOtp.current = true;
    }
    if (!open) {
      setOtp("");
      setLoading(false);
      setResendTimer(0);
      setErrorMessage("");
      hasSentOtp.current = false;
    }
  }, [open]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleConfirm = async () => {
    if (!otp) return;
    setLoading(true);
    setErrorMessage("");
    try {
      const result = await onConfirm(otp);
      if (!result?.success) {
        setErrorMessage(result?.message || "OTP không hợp lệ");
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      setErrorMessage(apiMessage || "Có lỗi xảy ra khi xác thực OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await authService.resendOtp({ email });
      setResendTimer(30);
    } catch (err) {
      console.error("Resend OTP failed:", err);
      setErrorMessage(err?.response?.data?.message || "Gửi lại OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
    >
      <DialogTitle
        sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.25rem" }}
      >
        Xác thực email
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Mã OTP đã được gửi đến {email}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <TextField
            fullWidth
            placeholder="••••••"
            inputProps={{
              maxLength: 6,
              style: {
                textAlign: "center",
                fontSize: "1.2rem",
                letterSpacing: "0.5rem",
              },
            }}
            label="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleConfirm();
              }
            }}
          />
        </Box>

        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        )}

        <Button
          variant="text"
          disabled={loading || resendTimer > 0}
          onClick={handleResend}
          type="button"
        >
          {resendTimer > 0 ? `Gửi lại trong ${resendTimer}s` : "Gửi lại mã"}
        </Button>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }} type="button">
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!otp || loading}
          sx={{ borderRadius: 2, px: 3 }}
          startIcon={loading && <CircularProgress size={16} />}
          type="button"
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}
