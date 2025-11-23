'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { toast } from 'react-hot-toast';
import { usersApi } from '@/lib/users-api';

export function UpdatePasswordForm(): React.JSX.Element {
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [errors, setErrors] = React.useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    };

    let hasError = false;

    if (!oldPassword) {
      newErrors.oldPassword = 'Старый пароль обязателен.';
      hasError = true;
    }
    if (!newPassword) {
      newErrors.newPassword = 'Новый пароль обязателен.';
      hasError = true;
    }
    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = 'Подтверждение нового пароля обязательно.';
      hasError = true;
    }
    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = 'Новый пароль и подтверждение пароля не совпадают.';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      toast.error('Пожалуйста, исправьте ошибки в форме.');
      return;
    }

    try {
      await usersApi.resetPassword({ oldPassword, newPassword });
      toast.success('Пароль успешно обновлен!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error('Не удалось обновить пароль.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Обновить пароль" title="Пароль" />
        <Divider />
        <CardContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Старый пароль"
              name="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setErrors((prev) => ({ ...prev, oldPassword: '' }));
              }}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword}
            />
            <TextField
              fullWidth
              label="Новый пароль"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors((prev) => ({ ...prev, newPassword: '' }));
              }}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
            />
            <TextField
              fullWidth
              label="Подтвердите новый пароль"
              name="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmNewPassword: '' }));
              }}
              error={!!errors.confirmNewPassword}
              helperText={errors.confirmNewPassword}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Обновить</Button>
        </CardActions>
      </Card>
    </form>
  );
}
