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
  Radio,
  RadioGroup,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function RegisterForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "student", // mặc định chọn student
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 1, maxWidth: 700, mx: "auto" }}
    >
      <Grid container spacing={2} columns={16}>
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
          <FormControl component="fieldset" margin="normal" required>
            <RadioGroup
              row
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <FormControlLabel
                value="student"
                control={<Radio />}
                label={t("auth.register.role.student")}
              />
              <FormControlLabel
                value="guest"
                control={<Radio />}
                label={t("auth.register.role.guest")}
              />
            </RadioGroup>
          </FormControl>
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
          />
        </Grid>
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
      <Grid container spacing={2} columns={16}>
        <Grid size={16}>
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
        </Grid>
        <Grid size={16}>
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
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        {t("auth.register.termsText")}
      </Typography>
<Grid container spacing={2} columns={16} justifyContent="center">
  <Grid item size={{ xs: 16, sm: 8 }}>
    <Button
      type="submit"
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
    >
      {t("auth.register.signUp")}
    </Button>
  </Grid>
</Grid>

      
    </Box>
  );
}
