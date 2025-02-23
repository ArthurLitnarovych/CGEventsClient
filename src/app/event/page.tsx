"use client";

import {
  Box,
  Button,
  Input,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  createTheme,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import GMap from "@/components/map/GMap";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";
import { Event, EventCategory } from "@/types/events";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required!"),
  description: Yup.string().max(30, "Description is too big."),
  eventDate: Yup.date().required("Event date is required!"),
  category: Yup.string().required("Category is required!"),
});

export default function NewEvent() {
  const { theme } = useTheme();
  const [muiTheme, setMuiTheme] = useState(
    createTheme({ palette: { mode: "light" } })
  );

  useEffect(() => {
    setMuiTheme(
      createTheme({ palette: { mode: theme === "dark" ? "dark" : "light" } })
    );
  }, [theme]);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 49.83626897647696,
    lng: 24.027122497558587,
  });
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {}
      );
    }
  }, []);

  const router = useRouter();

  const handleCancel = () => {
    router.push("/");
  };

  const handleSubmit = async (values: Partial<Event>): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) throw new Error("Event creation failed");

      toast.success("Event created successfully!", { theme });
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsLoading(false);
      router.push("/");
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

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="flex justify-center items-center flex-col mt-20">
        <Box className="flex justify-center items-center flex-col w-full max-w-4xl px-4">
          <Typography variant="h5">Create Event</Typography>

          <Formik
            initialValues={{
              name: "",
              description: "",
              eventDate: selectedDate ? selectedDate.toISOString() : "",
              location: selectedLocation,
              category: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue }) => (
              <Form className="w-full mt-4">
                <Box className="flex flex-col md:flex-row w-full">
                  <Box className="flex flex-col space-y-4 w-full md:w-1/2 pr-4 mb-4 md:mb-0">
                    <Field
                      as={Input}
                      name="name"
                      placeholder="Name"
                      fullWidth
                    />
                    {errors.name && touched.name && (
                      <Typography color="error" variant="body2">
                        {errors.name}
                      </Typography>
                    )}

                    <Field
                      as={Input}
                      name="description"
                      placeholder="Description"
                      fullWidth
                    />
                    {errors.description && touched.description && (
                      <Typography color="error" variant="body2">
                        {errors.description}
                      </Typography>
                    )}

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Event Date"
                        value={selectedDate}
                        onChange={(newValue) => {
                          setSelectedDate(newValue);
                          setFieldValue("eventDate", newValue);
                        }}
                      />
                    </LocalizationProvider>
                    {errors.eventDate && touched.eventDate && (
                      <Typography color="error" variant="body2">
                        {typeof errors.eventDate === "string" &&
                          errors.eventDate}
                      </Typography>
                    )}

                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Field
                        as={Select}
                        name="category"
                        fullWidth
                        onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                          setFieldValue("category", e.target.value as string)
                        }
                      >
                        {EventCategory.map(
                          (category: string, index: number) => (
                            <MenuItem key={index} value={category}>
                              {category}
                            </MenuItem>
                          )
                        )}
                      </Field>
                    </FormControl>
                    {errors.category && touched.category && (
                      <Typography color="error" variant="body2">
                        {errors.category}
                      </Typography>
                    )}
                  </Box>
                  <Box className="w-full md:w-1/2">
                    <GMap
                      selectedLocation={selectedLocation}
                      setSelectedLocation={(newLocation) => {
                        setSelectedLocation(newLocation);
                        setFieldValue("location", newLocation);
                      }}
                    />
                  </Box>
                </Box>
                <Box className="mt-4 flex justify-end space-x-2">
                  <Button
                    onClick={handleCancel}
                    color="error"
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </div>
    </ThemeProvider>
  );
}
