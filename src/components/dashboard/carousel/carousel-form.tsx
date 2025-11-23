"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { useCarousel } from "@/hooks/use-carousel";

interface CarouselFormProps {
  open: boolean;
  onClose: () => void;
  item?: any;
  onSuccess?: () => void;
}

export function CarouselForm({ open, onClose, item, onSuccess }: CarouselFormProps): React.JSX.Element {
  const { createItem, updateItem } = useCarousel();
  const [title, setTitle] = React.useState("");
  const [link, setLink] = React.useState("");
  const [image, setImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ title?: string; image?: string; link?: string }>({});

  React.useEffect(() => {
    if (open) {
      if (item) {
        setTitle(item.title || "");
        setLink(item.link || "");
        setImage(null);
        if (item.imageUrl) {
          setImagePreview(item.imageUrl);
        } else {
          setImagePreview("");
        }
      } else {
        setTitle("");
        setLink("");
        setImage(null);
        setImagePreview("");
      }
      setErrors({});
    }
  }, [open, item]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Пожалуйста, выберите файл изображения" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Размер файла не должен превышать 5MB" }));
        return;
      }
      setImage(file);
      setErrors((prev) => ({ ...prev, image: undefined }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const isValidUrl = (value: string) => {
    if (!value.trim()) return true;
    try {
      const u = new URL(value);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { title?: string; image?: string; link?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Заголовок обязателен";
    }
    if (link.trim() && !isValidUrl(link.trim())) {
      newErrors.link = "Неверный формат ссылки. Укажите полный URL, например https://example.com";
    }
    if (!image && !imagePreview) {
      newErrors.image = "Изображение обязательно";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      if (item) {
        await updateItem(item.id, {
          title,
          link: link.trim() || undefined,
          image: image || undefined,
        });
      } else {
        await createItem({
          title,
          link: link.trim() || undefined,
          photo: image!,
        });
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving carousel item:", error);
      setErrors({
        title: "Произошла ошибка при сохранении. Пожалуйста, попробуйте снова.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{item ? "Редактировать баннер" : "Добавить баннер"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Заголовок *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              disabled={isLoading}
            />
            <TextField
              label="Ссылка"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              fullWidth
              disabled={isLoading}
              error={!!errors.link}
              helperText={errors.link ?? "Оставьте пустым, если ссылка не нужна"}
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Изображение *
              </Typography>
              {imagePreview ? (
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Card sx={{ maxWidth: 300, maxHeight: 200 }}>
                    <CardMedia
                      component="img"
                      image={imagePreview}
                      alt="Preview"
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxHeight: 200,
                        objectFit: "contain",
                      }}
                    />
                  </Card>
                  <IconButton
                    size="small"
                    onClick={removeImage}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "background.paper",
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                    disabled={isLoading}
                  >
                    <XIcon />
                  </IconButton>
                </Box>
              ) : (
                <Button variant="outlined" component="label" disabled={isLoading}>
                  Выберите изображение
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </Button>
              )}
              {errors.image && (
                <Typography color="error" variant="caption" sx={{ display: "block", mt: 1 }}>
                  {errors.image}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                Рекомендуемый размер: 1200×600px. Максимальный размер: 5MB.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Сохранение..." : item ? "Обновить" : "Создать"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
