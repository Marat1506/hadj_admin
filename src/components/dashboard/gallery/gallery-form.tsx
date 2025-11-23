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
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { useGallery } from "@/hooks/use-gallery";
import { GalleryItem } from "@/lib/gallery-api";

interface GalleryFormProps {
  open: boolean;
  onClose: () => void;
  item?: GalleryItem;
  onSuccess?: () => void;
}

export function GalleryForm({ open, onClose, item, onSuccess }: GalleryFormProps): React.JSX.Element {
  const { createItem, updateItem } = useGallery();
  const [mediaType, setMediaType] = React.useState<'image' | 'video'>('image');
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");
  const [image, setImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ title?: string; image?: string; videoUrl?: string }>({});

  React.useEffect(() => {
    if (open) {
      if (item) {
        setMediaType(item.mediaType);
        setTitle(item.title || "");
        setDescription(item.description || "");
        if (item.mediaType === 'video') {
          setVideoUrl(`https://www.youtube.com/watch?v=${item.mediaUrl}`);
        } else {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
          setImagePreview(`${apiUrl}/gallery/image/${item.mediaUrl}`);
        }
        setImage(null);
      } else {
        setMediaType('image');
        setTitle("");
        setDescription("");
        setVideoUrl("");
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
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Размер файла не должен превышать 10MB" }));
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

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: { title?: string; image?: string; videoUrl?: string } = {};

    if (mediaType === 'image' && !image && !imagePreview) {
      newErrors.image = "Изображение обязательно";
    }

    if (mediaType === 'video') {
      if (!videoUrl.trim()) {
        newErrors.videoUrl = "Ссылка на видео обязательна";
      } else if (!extractYouTubeId(videoUrl.trim())) {
        newErrors.videoUrl = "Неверная ссылка на YouTube видео";
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
    setIsLoading(true);
    try {
      if (item) {
        await updateItem(item.id, {
          title: title.trim() || undefined,
          description: description.trim() || undefined,
          photo: image || undefined,
          videoUrl: mediaType === 'video' ? videoUrl.trim() : undefined,
        });
      } else {
        await createItem({
          mediaType,
          title: title.trim() || undefined,
          description: description.trim() || undefined,
          photo: mediaType === 'image' ? image! : undefined,
          videoUrl: mediaType === 'video' ? videoUrl.trim() : undefined,
        });
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving gallery item:", error);
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

  const getVideoPreview = () => {
    const videoId = extractYouTubeId(videoUrl);
    if (videoId) {
      return (
        <Box sx={{ position: 'relative', paddingTop: '56.25%', width: '100%', maxWidth: 400 }}>
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{item ? "Редактировать элемент галереи" : "Добавить элемент галереи"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {!item && (
              <FormControl>
                <FormLabel>Тип медиа *</FormLabel>
                <RadioGroup
                  row
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
                >
                  <FormControlLabel value="image" control={<Radio />} label="Изображение" />
                  <FormControlLabel value="video" control={<Radio />} label="Видео" />
                </RadioGroup>
              </FormControl>
            )}

            <TextField
              label="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title || "Опционально"}
              fullWidth
              disabled={isLoading}
              inputProps={{ maxLength: 200 }}
            />

            <TextField
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              disabled={isLoading}
              helperText="Опционально"
              inputProps={{ maxLength: 1000 }}
            />

            {mediaType === 'image' && (
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
                  Максимальный размер: 10MB. Форматы: JPEG, PNG, WebP, GIF
                </Typography>
              </Box>
            )}

            {mediaType === 'video' && (
              <Box>
                <TextField
                  label="Ссылка на YouTube видео *"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  error={!!errors.videoUrl}
                  helperText={errors.videoUrl || "Например: https://www.youtube.com/watch?v=VIDEO_ID"}
                  fullWidth
                  disabled={isLoading}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {videoUrl && !errors.videoUrl && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Предпросмотр:
                    </Typography>
                    {getVideoPreview()}
                  </Box>
                )}
              </Box>
            )}
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
