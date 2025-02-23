"use client";

import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTheme } from "next-themes";
import { Button, CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import { Event } from "@/types/events";
import { useRouter } from "next/navigation";

type EventsTableProps = {
  events: Event[];
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "description", headerName: "Description", width: 300 },
  { field: "category", headerName: "Category", width: 150 },
  { field: "eventDate", headerName: "Event Date", width: 180 },
  {
    field: "location",
    headerName: "Location",
    width: 180,
    valueGetter: (params) => JSON.stringify(params),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 200,
    renderCell: (params) => {
      const router = useRouter();

      const handleViewClick = () => {
        router.push(`/event/${params.row.id}`);
      };

      return (
        <Button variant="outlined" size="small" onClick={handleViewClick}>
          View
        </Button>
      );
    },
  },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function EventsTable({ events }: EventsTableProps) {
  const { theme } = useTheme();
  const [muiTheme, setMuiTheme] = useState(
    createTheme({ palette: { mode: "light" } })
  );

  useEffect(() => {
    setMuiTheme(
      createTheme({ palette: { mode: theme === "dark" ? "dark" : "light" } })
    );
  }, [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={events}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </ThemeProvider>
  );
}
