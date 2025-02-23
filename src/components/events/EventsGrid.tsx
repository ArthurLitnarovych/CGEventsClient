"use client";

import * as React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Event } from "@/types/events";
import dayjs from "dayjs";
import GMap from "../map/GMap";
import { useRouter } from "next/navigation";

type EventsGridProps = {
  events: Event[];
};

export default function EventsGrid({ events }: EventsGridProps) {
  const { theme } = useTheme();
  const router = useRouter();
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
      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} key={event.id}>
            <Card
              onClick={() => router.push(`/event/${event.id}`)}
              sx={{ cursor: "pointer" }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {event.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Category:</strong> {event.category}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Event Date:</strong>{" "}
                  {dayjs(event.eventDate).format("MMMM DD, YYYY")}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Location:</strong>
                </Typography>
                <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                  <GMap isDraggable={false} selectedLocation={event.location} />
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </ThemeProvider>
  );
}
