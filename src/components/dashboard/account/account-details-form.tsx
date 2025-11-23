'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { usersApi } from '@/lib/users-api';

export function AccountDetailsForm(): React.JSX.Element {
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [notification, setNotification] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await usersApi.findMe();
        setUser(userData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || ''
        });
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setNotification({
          open: true,
          message: 'Не удалось загрузить данные пользователя',
          severity: 'error'
        });
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await usersApi.update(formData);
      setNotification({
        open: true,
        message: 'Профиль успешно обновлен!',
        severity: 'success'
      });
      // Обновляем данные пользователя
      const updatedUser = await usersApi.findMe();
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
      setNotification({
        open: true,
        message: 'Не удалось обновить профиль',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (!user) {
    return (
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader subheader="Информацию можно редактировать" title="Профиль" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid
                size={{
                  md: 6,
                  xs: 12,
                }}
              >
                <FormControl fullWidth required>
                  <InputLabel>Имя</InputLabel>
                  <OutlinedInput 
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    label="Имя" 
                    name="firstName"
                    disabled={isLoading}
                  />
                </FormControl>
              </Grid>
              <Grid
                size={{
                  md: 6,
                  xs: 12,
                }}
              >
                <FormControl fullWidth required>
                  <InputLabel>Фамилия</InputLabel>
                  <OutlinedInput 
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    label="Фамилия" 
                    name="lastName"
                    disabled={isLoading}
                  />
                </FormControl>
              </Grid>
              
              <Grid
                size={{
                  xs: 12,
                }}
              >
                <FormControl fullWidth>
                  <InputLabel>Телефон</InputLabel>
                  <OutlinedInput 
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    label="Телефон" 
                    name="phone" 
                    type="tel"
                    disabled={isLoading}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button 
              type="submit" 
              variant="contained"
              disabled={isLoading}
              sx={{ minWidth: 120 }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  Сохранение...
                </>
              ) : (
                'Сохранить'
              )}
            </Button>
          </CardActions>
        </Card>
      </form>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
