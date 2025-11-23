'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { useNavigation } from '@/hooks/use-navigation';

interface ObjectFormWithMapProps {
  open: boolean;
  onClose: () => void;
  item?: any;
  service: any;
  city: any;
}

export function ObjectFormWithMap({ open, onClose, item, service, city }: ObjectFormWithMapProps): React.JSX.Element {
  const { createObject, updateObject } = useNavigation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    latitude: '',
    longitude: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        latitude: item.latitude?.toString() || '',
        longitude: item.longitude?.toString() || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        latitude: '',
        longitude: '',
      });
    }
    setErrors({});
  }, [item, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название объекта обязательно';
    }

    if (formData.title.length > 255) {
      newErrors.title = 'Название объекта должно быть короче 255 символов';
    }

    if (formData.latitude) {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'Широта должна быть между -90 и 90';
      }
    }

    if (formData.longitude) {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'Долгота должна быть между -180 и 180';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        serviceId: service.id,
        title: formData.title,
        description: formData.description,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      };

      if (item) {
        await updateObject(item.id, submitData);
      } else {
        await createObject(submitData);
      }
      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении объекта:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {item ? 'Редактировать объект' : 'Создать новый объект'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            в {service?.title} ({city?.name})
          </Typography>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Название объекта"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title || 'Введите название объекта (например, название отеля, ресторана)'}
              required
            />

            <TextField
              fullWidth
              label="Описание"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={4}
              helperText="Дополнительная информация об объекте"
            />

            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Широта"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  error={!!errors.latitude}
                  helperText={errors.latitude || 'Например: 31.7054'}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Долгота"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  error={!!errors.longitude}
                  helperText={errors.longitude || 'Например: 35.2007'}
                />
              </Grid>
            </Grid>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Информация об объекте
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Этот объект будет отображаться на карте при просмотре данного сервиса.
                Координаты не обязательны, но рекомендуются для отображения на карте.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Сохранение...' : (item ? 'Обновить' : 'Создать')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
