import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../providers/ThemeContext";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import { LightMode, DarkMode, SettingsBrightness } from "@mui/icons-material";

const themeModes = [
  {
    value: "light",
    icon: LightMode,
  },
  {
    value: "dark",
    icon: DarkMode,
  },
  {
    value: "system",
    icon: SettingsBrightness,
  },
];

export default function ThemeSwitcher() {
  const { t } = useTranslation();
  const { mode, setMode } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (newMode) => {
    setMode(newMode);
    handleClose();
  };

  const currentTheme = themeModes.find((theme) => theme.value === mode);

  return (
    <>
      <Tooltip title={t("theme.changeTheme")}>
        <IconButton onClick={handleClick} color="inherit" sx={{ ml: 1 }}>
          {currentTheme && <currentTheme.icon />}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {themeModes.map((theme) => {
          const IconComponent = theme.icon;
          return (
            <MenuItem
              key={theme.value}
              onClick={() => handleThemeChange(theme.value)}
              selected={theme.value === mode}
            >
              <ListItemIcon>
                <IconComponent />
              </ListItemIcon>
              <ListItemText>{t(`theme.${theme.value}`)}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
