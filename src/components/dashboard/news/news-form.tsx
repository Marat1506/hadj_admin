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
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { XIcon } from "@phosphor-icons/react/dist/ssr/X";



import { newsApi } from "@/lib/news-api";
import { useNews } from "@/hooks/use-news";





interface NewsFormProps {
  open: boolean;
  onClose: () => void;
  item?: any;
  onSuccess?: () => void;
}

export function NewsForm({ open, onClose, item, onSuccess }: NewsFormProps): React.JSX.Element {
  const { createItem, updateItem } = useNews();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    additionalInformation: "",
    isPublished: true,
    cover: null as File | null,
    coverUrl: null as string | null,
    coverRemoved: false,
  });
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      if (item) {
        setFormData({
          title: item.title || "",
          description: item.description || "",
          additionalInformation: item.additionalInformation || "",
          isPublished: item.isPublished !== undefined ? item.isPublished : true,
          cover: null,
          coverUrl: item.coverUrl || null,
          coverRemoved: false,
        });
        setPreviewUrl(item.coverUrl || "");
      } else {
        setFormData({
          title: "",
          description: "",
          additionalInformation: "",
          isPublished: true,
          cover: null,
          coverUrl: null,
          coverRemoved: false,
        });
        setPreviewUrl("");
      }
      setErrors({});
    }
  }, [open, item]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, cover: "Пожалуйста, выберите файл изображения" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, cover: "Размер файла не должен превышать 5MB" }));
        return;
      }
      setFormData((prev) => ({ ...prev, cover: file, coverRemoved: false, coverUrl: null }));
      setErrors((prev) => ({ ...prev, cover: "" }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, cover: null, coverRemoved: true, coverUrl: null }));
    setPreviewUrl("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Заголовок обязателен";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Описание обязательно";
    }
    if (!formData.additionalInformation.trim()) {
      newErrors.additionalInformation = "Дополнительная информация обязательна";
    }
    if (formData.title.length > 255) {
      newErrors.title = "Заголовок должен быть менее 255 символов";
    }
    if (formData.description.length > 500) {
      newErrors.description = "Описание должно быть менее 500 символов";
    }
    if (!item && !formData.cover) {
      newErrors.cover = "Обложка обязательна для новой статьи";
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
      const payload: any = {
        title: formData.title,
        description: formData.description,
        additionalInformation: formData.additionalInformation,
        isPublished: formData.isPublished,
      };
      if (formData.cover) {
        payload.cover = formData.cover;
      }
      if (formData.coverRemoved) {
        payload.coverRemoved = true;
      }
      if (item) {
        await updateItem(item.id, payload);
      } else {
        await createItem(payload);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      setErrors({
        submit: "Произошла ошибка при сохранении. Пожалуйста, попробуйте снова.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const shouldShowPreview = Boolean(previewUrl) && !formData.coverRemoved;

  return (
		<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
			<form onSubmit={handleSubmit}>
				<DialogTitle>{item ? "Редактировать новость" : "Создать новую новость"}</DialogTitle>
				<DialogContent>
					<Stack spacing={3} sx={{ mt: 1 }}>
						<TextField
							fullWidth
							label="Заголовок *"
							value={formData.title}
							onChange={(e) => handleInputChange("title", e.target.value)}
							error={!!errors.title}
							helperText={errors.title}
							disabled={isSubmitting}
							required
						/>
						<TextField
							fullWidth
							label="Описание *"
							value={formData.description}
							onChange={(e) => handleInputChange("description", e.target.value)}
							error={!!errors.description}
							helperText={errors.description || "Краткое описание статьи (максимум 500 символов)"}
							disabled={isSubmitting}
							multiline
							rows={3}
							required
						/>
						<TextField
							fullWidth
							label="Дополнительная информация *"
							value={formData.additionalInformation}
							onChange={(e) => handleInputChange("additionalInformation", e.target.value)}
							error={!!errors.additionalInformation}
							helperText={errors.additionalInformation || "Полное содержание статьи"}
							disabled={isSubmitting}
							multiline
							rows={6}
							required
						/>
						<FormControlLabel
							control={
								<Switch
									checked={formData.isPublished}
									onChange={(e) => handleInputChange("isPublished", e.target.checked)}
									disabled={isSubmitting}
								/>
							}
							label="Опубликовано"
						/>
						<Box>
							<Typography variant="subtitle2" gutterBottom>
								Обложка статьи {!item && "*"}
							</Typography>
							{shouldShowPreview ? (
								<Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
									<Card sx={{ maxWidth: 300 }}>
										<CardMedia
											component="img"
											image={previewUrl}
											alt="Preview"
											sx={{
												height: 200,
												objectFit: "cover",
											}}
											onError={() => {
												setPreviewUrl("");
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
										disabled={isSubmitting}
									>
										<XIcon />
									</IconButton>
								</Box>
							) : null}
							{!shouldShowPreview &&
								<Button component="label" variant="outlined" disabled={isSubmitting}>
									{"Загрузить обложку"}
									<input type="file" hidden accept="image/*" onChange={handleImageChange} />
								</Button>
							}
							{errors.cover && <FormHelperText error>{errors.cover}</FormHelperText>}
							<Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
								Рекомендуемый размер: 800×400px. Максимальный размер: 5MB.
								{item && " Оставьте пустым, чтобы использовать текущее изображение."}
							</Typography>
						</Box>
						{errors.submit && (
							<FormHelperText error sx={{ mt: 2 }}>
								{errors.submit}
							</FormHelperText>
						)}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} disabled={isSubmitting}>
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
