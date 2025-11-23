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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PlusIcon, BuildingsIcon, PencilIcon, TrashIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { useNavigation } from '@/hooks/use-navigation';
import { CityForm } from '@/components/dashboard/navigation/city-form';

export default function NavigationPage(): React.JSX.Element {
  const { cities, services, deleteCity } = useNavigation();
  const [isCityFormOpen, setIsCityFormOpen] = React.useState(false);
  const [editingCity, setEditingCity] = React.useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [cityToDelete, setCityToDelete] = React.useState<any>(null);

  const handleCreateCity = () => {
    setEditingCity(null);
    setIsCityFormOpen(true);
  };

  const handleEditCity = (city: any) => {
    setEditingCity(city);
    setIsCityFormOpen(true);
  };

  const handleCloseCityForm = () => {
    setIsCityFormOpen(false);
    setEditingCity(null);
  };

  const handleDeleteCity = (city: any) => {
    setCityToDelete(city);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (cityToDelete) {
      deleteCity(cityToDelete.id);
      setDeleteDialogOpen(false);
      setCityToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setCityToDelete(null);
  };

  return (
    <Container maxWidth="xl">
      {/* Header with Add City button */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">Навигация</Typography>
        </Box>
        <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateCity}>Добавить город</Button>
      </Stack>

      {/* Cities Grid */}
      <Grid container spacing={3}>
        {cities.map((city: any) => {
          const cityServices = services.filter(s => s.cityId === city.id);
          return (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={city.id}
              component="div"
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <BuildingsIcon size={24} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>{city.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{city.services.length} услуги</Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ mt: 'auto' }}>
                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                      <Link href={`/dashboard/navigation/city/${city.id}`} passHref style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>Посмотреть услуги</Button>
                      </Link>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEditCity(city); }} color="primary"><PencilIcon /></IconButton>
                        <IconButton size="small" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteCity(city); }} color="error"><TrashIcon /></IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* City Form */}
      {isCityFormOpen && (<CityForm open={isCityFormOpen} onClose={handleCloseCityForm} item={editingCity} />)}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Удалить город</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить "{cityToDelete?.name}"? Это действие не может быть отменено и также приведет к удалению всех связанных с ним служб, объектов и адресов.
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
