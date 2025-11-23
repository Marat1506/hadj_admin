'use client';

import * as React from 'react';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';

interface AttractionsFormProps {
  open: boolean;
  onClose: () => void;
  item?: any | null;
  createItem: (data: any) => Promise<any>;
  updateItem: (id: number, data: any) => Promise<any>;
}

export function AttractionsForm({ open, onClose, item, createItem, updateItem }: AttractionsFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    cover: null as File | null,
    coverUrl: '',
    title: '',
    description: '',
    additionalInformation: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (item) {
      setFormData({
        cover: null,
        coverUrl: item.coverUrl || '',
        title: item.title || '',
        description: item.description || '',
        additionalInformation: item.additionalInformation || '',
      });
    } else {
      setFormData({
        cover: null,
        coverUrl: '',
        title: '',
        description: '',
        additionalInformation: '',
      });
    }
    setErrors({});
  }, [item, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, cover: file, coverUrl: url }));
      if (errors.cover) setErrors((prev) => ({ ...prev, cover: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.cover && !formData.coverUrl) newErrors.cover = 'Изображение обязательно';
    if (!formData.title.trim()) newErrors.title = 'Название обязательно';
    if (!formData.description.trim()) newErrors.description = 'Описание обязательно';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData: any = {
      title: formData.title,
      description: formData.description,
      additionalInformation: formData.additionalInformation,
    };

    if (formData.cover instanceof File) submitData.cover = formData.cover;
    else if (formData.coverUrl && !formData.cover) submitData.coverUrl = formData.coverUrl;

    setIsSubmitting(true);
    try {
      if (item) await updateItem(item.id, submitData);
      else await createItem(submitData);
      onClose();
    } catch (err) {
      console.error('Error saving attraction:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{item ? 'Редактировать достопримечательность' : 'Создать новую достопримечательность'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Название"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              required
            />
            <TextField
              fullWidth
              label="Описание"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={3}
              required
            />
            <TextField
              fullWidth
              label="Дополнительная информация"
              value={formData.additionalInformation}
              onChange={(e) => handleInputChange('additionalInformation', e.target.value)}
              multiline
              rows={2}
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>Обложка *</Typography>
              {formData.coverUrl && (
                <Card sx={{ mb: 2, maxWidth: 300 }}>
                  <CardMedia
                    component="img"
                    image={formData.coverUrl}
                    alt="Preview"
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton size="small" onClick={() => setFormData(prev => ({ ...prev, cover: null, coverUrl: '' }))}>
                      <XIcon />
                    </IconButton>
                  </Box>
                </Card>
              )}
              <Button component="label" variant="outlined" fullWidth sx={{ height: 56 }}>
                {formData.coverUrl ? 'Изменить изображение' : 'Загрузить изображение'}
                <input type="file" hidden accept="image/*" onChange={handleCoverChange} />
              </Button>
              {errors.cover && <FormHelperText error>{errors.cover}</FormHelperText>}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение...' : item ? 'Обновить' : 'Создать'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
