'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useServices } from '@/hooks/use-services';
import { useCities } from '@/hooks/use-cities';

interface ServicesFormProps {
  open: boolean;
  onClose: () => void;
  item?: any;
}

const serviceTypes = [
  { value: 'hotel', label: 'Отель' },
  { value: 'restaurant', label: 'Ресторан' },
  { value: 'attraction', label: 'Достопримечательность' },
  { value: 'transport', label: 'Транспорт' },
  { value: 'entertainment', label: 'Развлечения' },
  { value: 'shopping', label: 'Шоппинг' },
  { value: 'medical', label: 'Медицина' },
  { value: 'other', label: 'Другое' },
];

export function ServicesForm({ open, onClose, item }: ServicesFormProps): React.JSX.Element {
  const { createItem, updateItem } = useServices();
  const { items: cities } = useCities();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    type: 'other',
    cityId: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        type: item.type || 'other',
        cityId: item.cityId?.toString() || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'other',
        cityId: '',
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
      newErrors.title = 'Название сервиса обязательно';
    }

    if (!formData.cityId) {
      newErrors.cityId = 'Город обязателен';
    }

    if (formData.title.length > 255) {
      newErrors.title = 'Название сервиса должно быть менее 255 символов';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Описание должно быть менее 500 символов';
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
        ...formData,
        cityId: parseInt(formData.cityId),
      };

      if (item) {
        await updateItem(item.id, submitData);
      } else {
        await createItem(submitData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {item ? 'Редактировать сервис' : 'Создать новый сервис'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Название сервиса"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title || 'Введите название сервиса'}
              required
            />

            <TextField
              fullWidth
              label="Описание"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description || 'Краткое описание сервиса (необязательно)'}
              multiline
              rows={3}
            />

            <FormControl fullWidth error={!!errors.cityId}>
              <InputLabel>Город</InputLabel>
              <Select
                value={formData.cityId}
                label="Город"
                onChange={(e) => handleInputChange('cityId', e.target.value)}
                required
              >
                {cities?.map((city) => (
                  <MenuItem key={city.id} value={city.id.toString()}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.cityId && (
                <FormHelperText>{errors.cityId}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Тип сервиса</InputLabel>
              <Select
                value={formData.type}
                label="Тип сервиса"
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                {serviceTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Информация о сервисе
              </Typography>
              <Typography variant="body2" color="text.secondary">
                После создания сервиса вы можете добавить конкретные объекты, такие как отели, рестораны или достопримечательности к этому сервису.
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