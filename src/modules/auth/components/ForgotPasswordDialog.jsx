import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { authService } from "../../../api/auth.js";
import OtpDialog from "./OtpDialog.jsx";

export default function ForgotPasswordDialog({ open, onClose }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage("");

    try {
      const result = await authService.forgotPassword({ email });
      if (result.success) {
        setMessage("Mã OTP đã được gửi đến email " + email);
        setOtpOpen(true); // mở dialog OTP
      } else {
        setMessage(result.message || t("common.error"));
      }
    } catch (error) {
      console.log(error);
      setMessage(t("common.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpConfirm = async (otp) => {
    try {
      const result = await authService.verifyOtp({ email, otp });
      if (result.success) {
        // ✅ OTP đúng -> chuyển sang bước reset password
        console.log("OTP verified, proceed reset password...");
        setOtpOpen(false);
        onClose(); // hoặc mở dialog ResetPassword riêng
      } else {
        setMessage(result.message || t("common.error"));
      }
    } catch (err) {
      console.log(err);
      setMessage(t("common.error"));
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Quên mật khẩu
        </DialogTitle>
        <DialogContent>
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
            onClick={onClose}
            disabled={submitting}
            sx={{
              backgroundColor: "rgba(233, 231, 231, 0.95)",
              color: "black",
              "&:hover": {
                backgroundColor: "rgba(230,230,230,1)",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || !email}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog OTP */}
      <OtpDialog
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        email={email}
        onConfirm={handleOtpConfirm}
      />
    </>
  );
}
