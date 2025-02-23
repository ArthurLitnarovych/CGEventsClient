"use client";

import { useParams, useRouter } from "next/navigation";
import GMap from "@/components/map/GMap";
import {
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Event, EventCategory } from "@/types/events";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<null | Event>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`,
          { method: "GET" }
        );
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRecommendedEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/similar?lat=${event?.location?.lat}&lng=${event?.location?.lng}`,
          { method: "GET" }
        );
        const data = await response.json();
        setRecommendedEvents(data);
      } catch (error) {
        console.error("Error fetching recommended events:", error);
      }
    };

    fetchEvent();
    fetchRecommendedEvents();
  }, [id]);

  const handleDelete = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, {
        method: "DELETE",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (!event) {
    return <Typography>Event not found</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="back"
          onClick={() => router.back()}
          sx={{ position: "absolute", top: 16, left: 16 }}
        >
          <ArrowBackIcon />
        </IconButton>

        {isEditing ? (
          <Formik
            initialValues={{
              name: event.name,
              description: event.description,
              category: event.category,
              location: event.location,
              eventDate: dayjs(event.eventDate),
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("Name is required!"),
              description: Yup.string().max(30, "Description is too big."),
              eventDate: Yup.date().required("Event date is required!"),
              category: Yup.string().required("Category is required!"),
            })}
            onSubmit={async (values) => {
              try {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                  }
                );
                const data = await response.json();
                setEvent(data);
                setIsEditing(false);
              } catch (error) {
                console.error("Error updating event:", error);
              }
            }}
          >
            {({ values, handleChange, setFieldValue, errors, touched }) => (
              <Form>
                <TextField
                  label="Event Name"
                  fullWidth
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Event Date"
                      value={values.eventDate}
                      onChange={(newValue) =>
                        setFieldValue("eventDate", newValue)
                      }
                    />
                  </LocalizationProvider>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={values.category}
                    onChange={(e) => setFieldValue("category", e.target.value)}
                    error={touched.category && Boolean(errors.category)}
                  >
                    {EventCategory.map((category, index) => (
                      <MenuItem key={index} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && touched.category && (
                    <Typography color="error" variant="body2">
                      {errors.category}
                    </Typography>
                  )}
                </FormControl>

                <Typography variant="body2" color="textSecondary">
                  <strong>Location:</strong>
                </Typography>
                <GMap
                  isDraggable
                  selectedLocation={values.location}
                  setSelectedLocation={(location) =>
                    setFieldValue("location", location)
                  }
                />
                {touched.location && errors.location && (
                  <Typography color="error" variant="caption">
                    {typeof errors.location === "string"
                      ? errors.location
                      : JSON.stringify(errors.location)}
                  </Typography>
                )}

                <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <>
            <Typography variant="h4">{event.name}</Typography>
            <Typography variant="body1">{event.description}</Typography>
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
            <GMap isDraggable={false} selectedLocation={event.location} />

            <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpenDialog(true)}
              >
                Delete
              </Button>
            </div>
          </>
        )}

        <Typography variant="h5" sx={{ mt: 4 }}>
          Recommended Events
        </Typography>
        <div>
          {recommendedEvents.length > 0 ? (
            recommendedEvents.slice(0, 3).map((event) => (
              <Card key={event.id} sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6">{event.name}</Typography>
                  <Typography variant="body2">{event.description}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push(`/event/${event.id}`)}
                  >
                    View Event
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No recommended events available.</Typography>
          )}
        </div>
      </CardContent>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this event?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
