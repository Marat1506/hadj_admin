"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useParams } from "next/navigation";
import { useNavigation } from "@/hooks/use-navigation";

interface ServiceFormWithMapProps {
  open: boolean;
  onClose: () => void;
  item?: any;
  city?: any;
}

export function ServiceFormWithMap({ open, onClose, item }: ServiceFormWithMapProps): React.JSX.Element {
  const params = useParams();
  const cityId = params.id as string;
  const { createService, updateService } = useNavigation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: "",
    type: "",
    cityId: parseInt(cityId),
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const serviceTypes = [
    { value: "hotel", label: "Hotel - Отели и гостиницы" },
    { value: "restaurant", label: "Restaurant - Рестораны и кафе" },
    { value: "attraction", label: "Attraction - Достопримечательности" },
    { value: "alharm", label: "Аль Харам" },
    { value: "PilgrimCamp", label: "Лагерь паломников" },
    { value: "transport", label: "Transport - Транспортные услуги" },
    { value: "entertainment", label: "Entertainment - Развлечения" },
    { value: "shopping", label: "Shopping - Магазины" },
    { value: "medical", label: "Medical - Медицинские услуги" },
    { value: "other", label: "Other - Другие услуги" },
  ];

  React.useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || "",
        type: item.type || "",
        cityId: item.cityId || parseInt(cityId),
      });
    } else {
      setFormData({
        title: "",
        type: "",
        cityId: parseInt(cityId),
      });
    }
    setErrors({});
  }, [item, open, cityId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Название обязательно";
    }

    if (!formData.type) {
      newErrors.type = "Тип сервиса обязателен";
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
        title: formData.title,
        type: formData.type,
        cityId: formData.cityId,
      };

      if (item) {
        await updateService(item.id, submitData);
      } else {
        await createService(submitData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{item ? "Изменить место" : "Создать новое место"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Название Места"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              required
            />

            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Тип сервиса *</InputLabel>
              <Select
                value={formData.type}
                label="Тип сервиса *"
                onChange={(e) => handleInputChange("type", e.target.value)}
                required
              >
                {serviceTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Сохранение..." : item ? "Обновить" : "Создать"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
