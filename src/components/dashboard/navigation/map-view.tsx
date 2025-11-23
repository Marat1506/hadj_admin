'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { MapTrifoldIcon } from '@phosphor-icons/react/dist/ssr';
import dynamic from 'next/dynamic';
import { LeafletMouseEvent } from 'leaflet'; // Added import for LeafletMouseEvent

// Динамический импорт Leaflet компонентов
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MapViewProps {
  latitude: number;
  longitude: number;
  title: string;
  onLocationSelect?: (lat: number, lng: number) => void;
}

export function MapView({ latitude, longitude, title, onLocationSelect }: MapViewProps): React.JSX.Element {
  const [manualLat, setManualLat] = React.useState(latitude.toString());
  const [manualLng, setManualLng] = React.useState(longitude.toString());
  const [mapError, setMapError] = React.useState(false);
  const [selectedPosition, setSelectedPosition] = React.useState<[number, number] | null>([latitude, longitude]);

  const handleManualSubmit = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (!isNaN(lat) && !isNaN(lng) && onLocationSelect) {
      onLocationSelect(lat, lng);
      setSelectedPosition([lat, lng]);
    }
  };

  // Fallback если Leaflet не загружен
  if (mapError || typeof window === 'undefined') {
    return (
      <Box
        sx={{
          width: '100%',
          height: 400,
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ddd',
          borderRadius: 1,
          p: 3,
        }}
      >
        <MapTrifoldIcon size={48} color="#666" />
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Map failed to load. Please set coordinates manually:
        </Typography>
        
        {onLocationSelect && (
          <Stack spacing={2} sx={{ mt: 2, width: '100%', maxWidth: 300 }}>
            <TextField
              label="Latitude"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              type="number"
              inputProps={{ step: 'any' }}
              size="small"
            />
            <TextField
              label="Longitude"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              type="number"
              inputProps={{ step: 'any' }}
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleManualSubmit}
              fullWidth
            >
              Set Coordinates
            </Button>
          </Stack>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Map failed to load
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 400,
        borderRadius: 1,
        overflow: 'hidden',
        '& .leaflet-container': {
          height: '100%',
          width: '100%',
        },
      }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        // onClick={(e: LeafletMouseEvent) => {
        //   const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
        //   setSelectedPosition(newPosition);
        //   setManualLat(newPosition[0].toString());
        //   setManualLng(newPosition[1].toString());
        //   if (onLocationSelect) {
        //     onLocationSelect(e.latlng.lat, e.latlng.lng);
        //   }
        // }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Исходный маркер */}
        <Marker position={[latitude, longitude]}>
          <Popup>
            <div>
              <h3>{title}</h3>
              <p>Latitude: {latitude.toFixed(6)}</p>
              <p>Longitude: {longitude.toFixed(6)}</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Выбранный маркер */}
        {selectedPosition && (
          <Marker position={selectedPosition}>
            <Popup>
              <div>
                <h3>Selected Location</h3>
                <p>Latitude: {selectedPosition[0].toFixed(6)}</p>
                <p>Longitude: {selectedPosition[1].toFixed(6)}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
} 