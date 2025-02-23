"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTheme } from "next-themes";
import { styled } from "@mui/material/styles";

const FullSizeButton = styled(Button)({
  width: "100%",
  height: "100%",
  minWidth: 0,
  padding: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export default function SettingsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [themeAnchorEl, setThemeAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const { theme, setTheme } = useTheme();

  const open = Boolean(anchorEl);
  const openTheme = Boolean(themeAnchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeClick = (event: React.MouseEvent<HTMLElement>) => {
    setThemeAnchorEl(event.currentTarget);
  };

  const handleThemeClose = () => {
    setThemeAnchorEl(null);
  };

  return (
    <div>
      <FullSizeButton
        id="settings-button"
        aria-controls={open ? "settings-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <SettingsIcon />
      </FullSizeButton>
      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
          },
        }}
      >
        <MenuItem onClick={handleThemeClick}>Theme</MenuItem>
      </Menu>

      <Menu
        id="theme-menu"
        anchorEl={themeAnchorEl}
        open={openTheme}
        onClose={handleThemeClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setTheme("light");
            handleThemeClose();
          }}
        >
          Light {theme === "light" ? "✔" : ""}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setTheme("dark");
            handleThemeClose();
          }}
        >
          Dark {theme === "dark" ? "✔" : ""}
        </MenuItem>
      </Menu>
    </div>
  );
}
