"use client";

import Skeleton from "@mui/material/Skeleton";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { useTheme } from "next-themes";
import { useRef, useCallback } from "react";

type Props = {
  selectedLocation?: { lat: number; lng: number };
  setSelectedLocation?: (newLocation: { lat: number; lng: number }) => void;
  isDraggable?: boolean;
};

const darkModeStyles = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d",
      },
    ],
  },
];

export default function GMap({
  selectedLocation = { lat: 0, lng: 0 },
  setSelectedLocation,
  isDraggable = true,
}: Props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_KEY || "",
  });
  const { theme } = useTheme();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const onMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!setSelectedLocation) return;
      const newLocation = {
        lat: e.latLng?.lat() || 0,
        lng: e.latLng?.lng() || 0,
      };
      setSelectedLocation(newLocation);
    },
    [setSelectedLocation]
  );

  if (loadError) {
    return (
      <div className="error-message">
        Error loading map: {loadError.message}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{ height: "100%", width: "100%" }}
    >
      {!isLoaded ? (
        <Skeleton
          animation="wave"
          width="100%"
          height="100%"
          variant="rectangular"
        />
      ) : (
        <GoogleMap
          mapContainerStyle={{
            height: "100%",
            width: "100%",
            minHeight: "200px",
          }}
          center={selectedLocation}
          zoom={13}
          options={{ styles: theme === "dark" ? darkModeStyles : [] }}
        >
          <MarkerF
            position={selectedLocation}
            draggable={isDraggable}
            onDragEnd={onMarkerDragEnd}
            icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
          />
        </GoogleMap>
      )}
    </div>
  );
}
