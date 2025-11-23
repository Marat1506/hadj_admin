'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import { DialogActions } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { PencilIcon, TrashIcon, BuildingsIcon, PlusIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeIcon } from '@phosphor-icons/react/dist/ssr';

import { useNavigation } from '@/hooks/use-navigation';

interface NavigationListProps {
  cityId?: string;
  serviceId?: string;
  objectId?: string;
  onEditCity: (item: any) => void;
  onCreateService: (city: any) => void;
  onEditService: (item: any, city: any) => void;
  onCreateObject: (service: any, city: any) => void;
  onEditObject: (item: any, service: any, city: any) => void;
  onCreateAddress: (object: any, service: any, city: any) => void;
  onEditAddress: (item: any, object: any, service: any, city: any) => void;
}

export function NavigationList({
  cityId,
  serviceId,
  objectId,
  onEditCity,
  onCreateService,
  onEditService,
  onCreateObject,
  onEditObject,
  onCreateAddress,
  onEditAddress
}: NavigationListProps): React.JSX.Element {
  const { cities, services, objects, addresses, isLoading, deleteCity, deleteService, deleteObject, deleteAddress } = useNavigation();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<any>(null);
  const [deleteType, setDeleteType] = React.useState<'city' | 'service' | 'object' | 'address'>('city');

  const handleDeleteClick = (item: any, type: 'city' | 'service' | 'object' | 'address') => {
    setItemToDelete(item);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        if (deleteType === 'city') {
          await deleteCity(itemToDelete.id);
        } else if (deleteType === 'service') {
          await deleteService(itemToDelete.id);
        } else if (deleteType === 'object') {
          await deleteObject(itemToDelete.id);
        } else if (deleteType === 'address') {
          await deleteAddress(itemToDelete.id);
        }
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const getServiceTypeColor = (type: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'| 'default'> = {
      hotel: 'primary',
      restaurant: 'secondary',
      attraction: 'success',
      transport: 'info',
      entertainment: 'warning',
      shopping: 'error',
      other: 'default'
    };
    return colors[type] || 'default';
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hotel: 'Hotel',
      restaurant: 'Restaurant',
      attraction: 'Attraction',
      transport: 'Transport',
      entertainment: 'Entertainment',
      shopping: 'Shopping',
      medical: 'Medical',
      other: 'Other'
    };
    return labels[type] || 'Other';
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Если выбран конкретный объект, показываем адреса
  if (objectId) {
    const object = objects.find(o => o.id.toString() === objectId);
    const objectAddresses = addresses.filter(a => a.objectId.toString() === objectId);

    if (!object) {
      return (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography color="text.secondary" variant="body1">
            Object not found.
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <Typography variant="h6">
            Addresses for {object.title}
          </Typography>
          <Button
            startIcon={<PlusIcon />}
            onClick={() => onCreateAddress(object, { id: object.serviceId }, { id: 1 })}
            variant="outlined"
            size="small"
          >
            Add Address
          </Button>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>Contact Info</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {objectAddresses.map((address) => (
                <TableRow key={address.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {address.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {address.address}
                    </Typography>
                    {address.description && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {address.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      {address.phone && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PhoneIcon size={14} />
                          <Typography variant="caption">{address.phone}</Typography>
                        </Stack>
                      )}
                      {address.email && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <EnvelopeIcon size={14} />
                          <Typography variant="caption">{address.email}</Typography>
                        </Stack>
                      )}
                      {address.website && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <GlobeIcon size={14} />
                          <Typography variant="caption">{address.website}</Typography>
                        </Stack>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(address.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => onEditAddress(address, object, { id: object.serviceId }, { id: 1 })}
                        color="primary"
                      >
                        <PencilIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(address, 'address')}
                        color="error"
                      >
                        <TrashIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }

  // Если выбран конкретный сервис, показываем объекты
  if (serviceId) {
    const service = services.find(s => s.id.toString() === serviceId);
    const serviceObjects = objects.filter(o => o.serviceId.toString() === serviceId);

    if (!service) {
      return (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography color="text.secondary" variant="body1">
            Сервис не найден
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <Typography variant="h6">
            Объекты в {service.title}
          </Typography>
          <Button
            startIcon={<PlusIcon />}
            onClick={() => onCreateObject(service, { id: service.cityId })}
            variant="outlined"
            size="small"
          >
            Добавить объект
          </Button>
        </Stack>

        <Grid container spacing={2}>
          {serviceObjects.map((object) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={object.id}
              component="div"
            >
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <MapPinIcon size={24} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {object.title}
                    </Typography>
                  </Stack>

                  {object.latitude && object.longitude && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {object.latitude}, {object.longitude}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {addresses.filter(a => a.objectId === object.id).length} addresses
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={() => onCreateAddress(object, service, { id: service.cityId })}
                      startIcon={<PlusIcon />}
                    >
                      Добавить адрес
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => onEditObject(object, service, { id: service.cityId })}
                      color="primary"
                    >
                      <PencilIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(object, 'object')}
                      color="error"
                    >
                      <TrashIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    );
  }

  // Если выбран конкретный город, показываем сервисы
  if (cityId) {
    const city = cities.find(c => c.id.toString() === cityId);
    const cityServices = services.filter(s => s.cityId.toString() === cityId);

    if (!city) {
      return (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography color="text.secondary" variant="body1">
            Город не найден
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <Typography variant="h6">
            Услуги в {city.name}
          </Typography>
          <Button
            startIcon={<PlusIcon />}
            onClick={() => onCreateService(city)}
            variant="outlined"
            size="small"
          >
            Добавить услугу
          </Button>
        </Stack>

        <Grid container spacing={2}>
          {cityServices.map((service) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={service.id}
              component="div"
            >
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <BuildingsIcon size={24} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {service.title}
                      </Typography>
                      <Chip
                        label={getServiceTypeLabel(service.type)}
                        size="small"
                        color={getServiceTypeColor(service.type)}
                        variant="outlined"
                      />
                    </Box>
                  </Stack>

                  {service.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {objects.filter(o => o.serviceId === service.id).length} объекты
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={() => onCreateObject(service, city)}
                      startIcon={<PlusIcon />}
                    >
                      Добавить объект
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => onEditService(service, city)}
                      color="primary"
                    >
                      <PencilIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(service, 'service')}
                      color="error"
                    >
                      <TrashIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </>
    );
  }

  // Показываем все города
  if (!cities || cities.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography color="text.secondary" variant="body1">
          Города не найдены. Создайте свой первый город, чтобы начать.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {cities.map((city) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4 }}
            key={city.id}
            component="div"
          >
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <BuildingsIcon size={24} />
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {city.name}
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {services.filter(s => s.cityId === city.id).length} services
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    onClick={() => onCreateService(city)}
                    startIcon={<PlusIcon />}
                  >
                    Добавить услугу
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => onEditCity(city)}
                    color="primary"
                  >
                    <PencilIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(city, 'city')}
                    color="error"
                  >
                    <TrashIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Удалить {deleteType === 'city' ? 'City' : deleteType === 'service' ? 'Service' : deleteType === 'object' ? 'Object' : 'Address'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Вы уверены, что хотите удалить? "{itemToDelete?.name || itemToDelete?.title}"? Это действие не может быть отменено.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
