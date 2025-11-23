'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import { DialogActions } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PlusIcon, ArrowLeftIcon, PencilIcon, TrashIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { useNavigation } from '@/hooks/use-navigation';
import { ServiceFormWithMap } from '@/components/dashboard/navigation/service-form-with-map';

interface CityPageProps {
  params: Promise<{ id: string }>;
}

export default function CityPage({ params }: CityPageProps): React.JSX.Element {
  const resolvedParams = React.use(params);
  const {
    cities,
    objects,
    deleteService,
    getServicesByCity,
    isLoading
  } = useNavigation();
  const [isServiceFormOpen, setIsServiceFormOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] = React.useState<any>(null);
  const [cityServices, setCityServices] = React.useState<any[]>([]);

  const selectedCity = cities.find(city => city.id === parseInt(resolvedParams.id));

  React.useEffect(() => {
    if (resolvedParams.id) {
      getServicesByCity(resolvedParams.id)
        .then(data => setCityServices(data))
        .catch(console.error);
    }
  }, [resolvedParams.id, getServicesByCity]);

  const handleCreateService = () => {
    setEditingService(null);
    setIsServiceFormOpen(true);
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setIsServiceFormOpen(true);
  };

  const handleCloseServiceForm = () => {
    setIsServiceFormOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (service: any) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete.id);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  const getServiceTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      hotel: 'Hotel',
      restaurant: 'Restaurant',
      attraction: 'Attraction',
      transport: 'Transport',
      entertainment: 'Entertainment',
      shopping: 'Shopping',
      medical: 'Medical',
      other: 'Other'
    };
    return typeMap[type] || type;
  };

  const getServiceTypeColor = (type: string) => {
    const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default'> = {
      hotel: 'primary',
      restaurant: 'success',
      attraction: 'info',
      transport: 'warning',
      entertainment: 'secondary',
      shopping: 'primary',
      medical: 'error',
      other: 'default'
    };
    return colorMap[type] || 'default';
  };

  if (!selectedCity) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4">Город не найден</Typography>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4">Загрузка...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Link href="/dashboard/navigation" passHref>
          <IconButton><ArrowLeftIcon /></IconButton>
        </Link>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">{selectedCity.name}</Typography>
          <Typography variant="body1" color="text.secondary">{cityServices.length} услуги</Typography>
        </Box>
        <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateService}>Добавить услугу</Button>
      </Stack>

      <Grid container spacing={3}>
        {cityServices.map((service) => {
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>{service.title || `${service.type} Услуги`}</Typography>
                      <Typography variant="body2" color="text.secondary">{service.description || `Услуги типа ${service.type}`}</Typography>
                      <Chip
                        label={getServiceTypeLabel(service.type)}
                        size="small"
                        color={getServiceTypeColor(service.type)}
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Stack>
                  <Box sx={{ mt: 'auto' }}>
                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                      <Link href={`/dashboard/navigation/service/${service.id}`} passHref style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>Просмотр объектов</Button>
                      </Link>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={() => handleEditService(service)} color="primary"><PencilIcon /></IconButton>
                        <IconButton size="small" onClick={() => handleDeleteService(service)} color="error"><TrashIcon /></IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {isServiceFormOpen && (
        <ServiceFormWithMap
          open={isServiceFormOpen}
          onClose={handleCloseServiceForm}
          item={editingService}
          city={selectedCity}
        />
      )}

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Удалить службу</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить "{serviceToDelete?.title || serviceToDelete?.type + ' Услуги'}"? Это действие не может быть отменено.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
