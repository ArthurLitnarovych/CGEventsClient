"use client";

import * as React from "react";
import GridViewIcon from "@mui/icons-material/GridView";
import TableViewIcon from "@mui/icons-material/TableView";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useTheme } from "next-themes";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { DISPLAY_VIEW } from "@/app/(dashboard)/page";
import { useEffect, useState } from "react";

interface ToggleDisplayViewProps {
  displayView: "table" | "grid";
  setDisplayView: React.Dispatch<React.SetStateAction<DISPLAY_VIEW>>;
}

export default function ToggleDisplayView({
  displayView,
  setDisplayView,
}: ToggleDisplayViewProps) {
  const { theme } = useTheme();

  const [muiTheme, setMuiTheme] = useState(
    createTheme({ palette: { mode: "light" } })
  );

  useEffect(() => {
    setMuiTheme(
      createTheme({ palette: { mode: theme === "dark" ? "dark" : "light" } })
    );
  }, [theme]);

  const handleDisplay = (
    event: React.MouseEvent<HTMLElement>,
    type: DISPLAY_VIEW
  ) => {
    setDisplayView(type);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ToggleButtonGroup
        value={displayView}
        exclusive
        onChange={handleDisplay}
        aria-label="text alignment"
      >
        <ToggleButton value="table">
          <TableViewIcon />
        </ToggleButton>
        <ToggleButton value="grid">
          <GridViewIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </ThemeProvider>
  );
}
