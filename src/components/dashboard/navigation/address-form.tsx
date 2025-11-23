'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useNavigation } from '@/hooks/use-navigation';

interface AddressFormProps {
  open: boolean;
  onClose: () => void;
  item?: any;
  object?: any;
  service?: any;
  city?: any;
}

export function AddressForm({ open, onClose, item, object, service, city }: AddressFormProps): React.JSX.Element {
  const { createAddress, updateAddress } = useNavigation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: ''
  });

  React.useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        address: item.address || '',
        phone: item.phone || '',
        email: item.email || '',
        website: item.website || '',
        description: item.description || ''
      });
    } else {
      setFormData({
        title: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        description: ''
      });
    }
  }, [item]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (item) {
        await updateAddress(item.id, {
          ...formData,
          objectId: object?.id
        });
      } else {
        await createAddress({
          ...formData,
          objectId: object?.id
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {item ? 'Edit Address' : 'Add New Address'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            {object && (
              <Typography variant="body2" color="text.secondary">
                Adding address for: <strong>{object.title}</strong>
              </Typography>
            )}
            
            <TextField
              label="Title"
              value={formData.title}
              onChange={handleChange('title')}
              fullWidth
              required
            />
            
            <TextField
              label="Address"
              value={formData.address}
              onChange={handleChange('address')}
              fullWidth
              required
              multiline
              rows={3}
            />
            
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={handleChange('phone')}
              fullWidth
            />
            
            <TextField
              label="Email"
              value={formData.email}
              onChange={handleChange('email')}
              fullWidth
              type="email"
            />
            
            <TextField
              label="Website"
              value={formData.website}
              onChange={handleChange('website')}
              fullWidth
            />
            
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (item ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
} 