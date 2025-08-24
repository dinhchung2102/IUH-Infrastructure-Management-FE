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
  MenuItem,
  Select,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function RegisterForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    mssv: "",
    className: "",
    faculty: "",
    mgv: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register form submitted:", formData);
    // TODO: Implement registration logic
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const faculties = [
    "Công nghệ thông tin",
    "Điện - Điện tử",
    "Cơ khí",
    "Quản trị kinh doanh",
    "Ngôn ngữ Anh",
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} title="ly">
      {/* Full name */}
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

      {/* Email */}
      <TextField
        required
        fullWidth
        margin="normal"
        id="email"
        label={t("auth.register.email")}
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      {/* Phone */}
      <TextField
        fullWidth
        margin="normal"
        id="phone"
        label={t("auth.register.phone")}
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />

      {/* Role */}
      <FormControl fullWidth margin="normal" required>
        <InputLabel id="role-label">{t("auth.register.position")}</InputLabel>
        <Select
          labelId="role-label"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          label={t("auth.register.position")}
        >
          <MenuItem value="student">{t("auth.register.role.student")}</MenuItem>
          <MenuItem value="guest">{t("auth.register.role.guest")}</MenuItem>
          <MenuItem value="teacher">{t("auth.register.role.teacher")}</MenuItem>
        </Select>
      </FormControl>

      {/* Nếu role là sinh viên */}
      {formData.role === "student" && (
        <>
          <TextField
            fullWidth
            margin="normal"
            id="mssv"
            label={t("auth.register.studentFields.mssv")}
            name="mssv"
            value={formData.mssv}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            id="className"
            label={t("auth.register.studentFields.className")}
            name="className"
            value={formData.className}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="faculty-student-label">
              {t("auth.register.studentFields.faculty")}
            </InputLabel>
            <Select
              labelId="faculty-student-label"
              id="faculty"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
            >
              {faculties.map((f) => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      {/* Nếu role là giảng viên */}
      {formData.role === "teacher" && (
        <>
          <TextField
            fullWidth
            margin="normal"
            id="mgv"
            label={t("auth.register.teacherFields.mgv")}
            name="mgv"
            value={formData.mgv}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="faculty-teacher-label">
              {t("auth.register.teacherFields.faculty")}
            </InputLabel>
            <Select
              labelId="faculty-teacher-label"
              id="faculty"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
            >
              {faculties.map((f) => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      {/* Password */}
      <FormControl margin="normal" required fullWidth>
        <InputLabel htmlFor="password">{t("auth.register.password")}</InputLabel>
        <OutlinedInput
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={t("auth.register.password")}
        />
      </FormControl>

      {/* Confirm Password */}
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
                aria-label="toggle confirm password visibility"
                onClick={handleClickShowConfirmPassword}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={t("auth.register.confirmPassword")}
        />
      </FormControl>

      <Divider sx={{ my: 2 }} />

      {/* Agree To Terms */}
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

      {/* Subscribe Newsletter */}
      <FormControlLabel
        control={
          <Checkbox
            name="subscribeNewsletter"
            checked={formData.subscribeNewsletter}
            onChange={handleChange}
          />
        }
        label={t("auth.register.subscribeNewsletter")}
      />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        {t("auth.register.termsText")}
      </Typography>

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {t("auth.register.signUp")}
      </Button>
    </Box>
  );
}
