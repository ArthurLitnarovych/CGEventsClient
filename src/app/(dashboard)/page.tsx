"use client";

import SettingsMenu from "@/components/common/Settings";
import EventsGrid from "@/components/events/EventsGrid";
import EventsTable from "@/components/events/EventsTable";
import ToggleDisplayView from "@/components/common/ToggleDisplayView";
import { Event, EventCategory } from "@/types/events";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export enum DISPLAY_VIEW {
  TABLE = "table",
  GRID = "grid",
}

export type EventsQuery = {
  categories?: string;
  fromDate?: Dayjs | null;
  endDate?: Dayjs | null;
};

export default function Dashboard() {
  const [displayView, setDisplayView] = useState<DISPLAY_VIEW>(
    DISPLAY_VIEW.TABLE
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState<EventsQuery>({
    categories: "",
    fromDate: null,
    endDate: null,
  });

  const router = useRouter();

  const handleAddNewEvent = () => {
    router.push("/event");
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();

        if (query.categories) {
          params.append("categories", query.categories);
        }
        if (query.fromDate) {
          params.append("fromDate", query.fromDate.toISOString());
        }
        if (query.endDate) {
          params.append("endDate", query.endDate.toISOString());
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events?${params.toString()}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error creating event:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [query]);

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <main className="flex flex-col space-y-2 p-4">
        <div className="flex flex-row justify-between">
          <Button onClick={handleAddNewEvent}>Add New Event</Button>
          <div className="flex flex-row space-x-2">
            <ToggleDisplayView
              displayView={displayView}
              setDisplayView={setDisplayView}
            />
            <SettingsMenu />
          </div>
        </div>
        <Box className="flex justify-end mb-4 space-x-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box className="flex space-x-4">
              <DatePicker
                label="From Date"
                value={query.fromDate}
                onChange={(value) =>
                  setQuery((prev) => ({ ...prev, fromDate: value }))
                }
              />
              <DatePicker
                label="To Date"
                value={query.endDate}
                onChange={(value) =>
                  setQuery((prev) => ({ ...prev, endDate: value }))
                }
              />
            </Box>
          </LocalizationProvider>
          <FormControl fullWidth style={{ maxWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={query.categories}
              onChange={(e) =>
                setQuery((prev) => ({ ...prev, categories: e.target.value }))
              }
              label="Category"
            >
              <MenuItem value="">All</MenuItem>
              {EventCategory.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {displayView === DISPLAY_VIEW.TABLE ? (
          <EventsTable events={events} />
        ) : (
          <EventsGrid events={events} />
        )}
      </main>
    </div>
  );
}
