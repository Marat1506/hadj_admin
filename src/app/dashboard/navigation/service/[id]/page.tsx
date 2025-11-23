'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import { DialogActions } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PlusIcon, ArrowLeftIcon, PencilIcon, TrashIcon, AddressBookIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { useNavigation } from '@/hooks/use-navigation';
import { ObjectFormWithMap } from '@/components/dashboard/navigation/object-form-with-map';

interface ServicePageProps {
  params: any;
}

export default function ServicePage({ params }: ServicePageProps): React.JSX.Element {
  const resolvedParams: any = React.use(params);
  const { id } = resolvedParams;

  const { cities, services, objects, addresses, deleteObject, deleteAddress, getObjectByServices, getServicesById } = useNavigation();
  const [isObjectFormOpen, setIsObjectFormOpen] = React.useState(false);
  const [editingObject, setEditingObject] = React.useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [objectToDelete, setObjectToDelete] = React.useState<any>(null);
  const [selectedObject, setSelectedObject] = React.useState<any>(null);
  const [isAddressFormOpen, setIsAddressFormOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<any>(null);
  const [addressDeleteDialogOpen, setAddressDeleteDialogOpen] = React.useState(false);
  const [addressToDelete, setAddressToDelete] = React.useState<any>(null);
  const [serviceObjects, setServiceObjects] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [serviceInfo, setServiceInfo] = React.useState<any>(null);

  React.useEffect(() => {
    if (id) {
      setIsLoading(true);
      getObjectByServices(id)
        .then((data: any) => {
          setServiceObjects(data);
          if (data.length > 0) {
            setServiceInfo({
              service: data[0].service,
              city: cities.find(city => city.id === data[0].cityId)
            });
          } else {
            getServicesById(id).then((data: any) => {
              setServiceInfo({
                service: data,
                city: data.city
              });
            });
          }
          setIsLoading(false);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [id, getObjectByServices, getServicesById, cities]);

  const handleCreateObject = () => {
    setEditingObject(null);
    setIsObjectFormOpen(true);
  };

  const handleEditObject = (object: any) => {
    setEditingObject(object);
    setIsObjectFormOpen(true);
  };

  const handleCloseObjectForm = () => {
    setIsObjectFormOpen(false);
    setEditingObject(null);
  };

  const handleDeleteObject = (object: any) => {
    setObjectToDelete(object);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (objectToDelete) {
      deleteObject(objectToDelete.id);
      setDeleteDialogOpen(false);
      setObjectToDelete(null);
      if (selectedObject?.id === objectToDelete.id) {
        setSelectedObject(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setObjectToDelete(null);
  };

  const getServiceTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      hotel: 'Отель',
      restaurant: 'Ресторан',
      attraction: 'Достопримечательность',
      transport: 'Транспорт',
      entertainment: 'Развлечения',
      shopping: 'Шоппинг',
      medical: 'Медицина',
      other: 'Другое'
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

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4">Загрузка...</Typography>
      </Container>
    );
  }

  if (!serviceInfo) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4">Сервис не найден</Typography>
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
          <Typography variant="h4" component="h1">{serviceInfo.service.title}</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {serviceInfo.city && <Typography variant="body1" color="text.secondary">в {serviceInfo.city.name}</Typography>}
            <Chip
              label={getServiceTypeLabel(serviceInfo.service.type)}
              size="small"
              color={getServiceTypeColor(serviceInfo.service.type)}
              variant="outlined"
            />
          </Stack>
          {serviceInfo.service.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{serviceInfo.service.description}</Typography>
          )}
        </Box>
        <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateObject}>Добавить объект</Button>
      </Stack>

      {serviceObjects.length > 0 ? (
        <Grid container spacing={3}>
          {serviceObjects.map((object) => {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={object.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>{object.title}</Typography>
                        {object.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{object.description}</Typography>
                        )}
                        {object.latitude && object.longitude && (
                          <Typography variant="body2" color="text.secondary">Координаты: {object.latitude}, {object.longitude}</Typography>
                        )}
                      </Box>
                    </Stack>
                    <Box sx={{ mt: 'auto' }}>
                      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small" onClick={() => handleEditObject(object)} color="primary"><PencilIcon /></IconButton>
                          <IconButton size="small" onClick={() => handleDeleteObject(object)} color="error"><TrashIcon /></IconButton>
                        </Stack>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Объектов пока нет</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Вы можете добавить первый объект для этого сервиса
          </Typography>
          <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateObject}>
            Добавить объект
          </Button>
        </Card>
      )}

      {isObjectFormOpen && (
        <ObjectFormWithMap
          open={isObjectFormOpen}
          onClose={handleCloseObjectForm}
          item={editingObject}
          service={serviceInfo.service}
          city={serviceInfo.city}
        />
      )}

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Удалить объект</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить объект "{objectToDelete?.title}"? Это действие нельзя отменить.
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
