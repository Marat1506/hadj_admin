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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useGuideCategories } from "@/hooks/use-guide-categories";
import { useGuideSubcategories } from "@/hooks/use-guide-subcategories";

interface GuideSubcategoryFormProps {
	open: boolean;
	onClose: () => void;
	item?: any;
	categoryId?: number;
	onSuccess?: () => void;
}

export function GuideSubcategoryForm({
	open,
	onClose,
	item,
	categoryId,
	onSuccess,
}: GuideSubcategoryFormProps): React.JSX.Element {
	const { createItem, updateItem } = useGuideSubcategories();
	const { items: categories } = useGuideCategories();

	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [imageFile, setImageFile] = React.useState<File | null>(null);
	const [selectedCategoryId, setSelectedCategoryId] = React.useState<number>(categoryId || 0);
	const [isLoading, setIsLoading] = React.useState(false);
	const [errors, setErrors] = React.useState<{
		title?: string;
		description?: string;
		image?: string;
		categoryId?: string;
	}>({});
	const [previewSrc, setPreviewSrc] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (open) {
			if (item) {
				setTitle(item.title || "");
				setDescription(item.description || "");
				setSelectedCategoryId(item.categoryId || categoryId || 0);
				// Показываем существующее изображение
				if (item.image) {
					const fullUrl = item.image.startsWith("http")
						? item.image
						: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}${item.image}`;
					setPreviewSrc(fullUrl);
				} else {
					setPreviewSrc(getPlaceholderImage());
				}
			} else {
				setTitle("");
				setDescription("");
				setSelectedCategoryId(categoryId || 0);
				setPreviewSrc(getPlaceholderImage());
			}
			setImageFile(null);
			setErrors({});
		}
	}, [open, item, categoryId]);

	const svgToDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

	const getPlaceholderImage = () => {
		const svg = `
      <svg width="120" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#f5f5f5" rx="4"/>
        <text x="60" y="45" font-family="Arial" font-size="12" fill="#999" text-anchor="middle">Изображение</text>
      </svg>
    `;
		return svgToDataUri(svg);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Проверка типа файла
		if (!file.type.match(/^image\/(jpeg|jpg|png|gif|svg\+xml|webp)$/)) {
			setErrors({ image: "Пожалуйста, выберите изображение (JPG, PNG, GIF, SVG, WebP)" });
			return;
		}

		// Проверка размера (макс 5MB)
		if (file.size > 5 * 1024 * 1024) {
			setErrors({ image: "Размер файла не должен превышать 5MB" });
			return;
		}

		setImageFile(file);
		setErrors({});

		// Создаем превью
		const reader = new FileReader();
		reader.onload = (e) => {
			setPreviewSrc(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveImage = () => {
		setImageFile(null);
		setPreviewSrc(getPlaceholderImage());
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const validateForm = (): boolean => {
		const newErrors: {
			title?: string;
			description?: string;
			image?: string;
			categoryId?: string;
		} = {};

		if (!title.trim()) newErrors.title = "Название подкатегории обязательно";
		if (!selectedCategoryId) newErrors.categoryId = "Выберите категорию";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			const data: any = {
				title: title.trim(),
				description: description.trim() || undefined,
				categoryId: selectedCategoryId,
			};
			if (imageFile) {
				data.imageFile = imageFile;
			}

			if (item) await updateItem(item.id, data);
			else await createItem(data);

			onSuccess?.();
			onClose();
		} catch (error) {
			console.error("Error saving guide subcategory:", error);
			setErrors({
				title: "Произошла ошибка при сохранении. Пожалуйста, попробуйте снова.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		if (!isLoading) onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
			<form onSubmit={handleSubmit}>
				<DialogTitle>{item ? "Редактировать подкатегорию" : "Добавить подкатегорию"}</DialogTitle>
				<DialogContent>
					<Stack spacing={3} sx={{ mt: 1 }}>
						<FormControl fullWidth error={!!errors.categoryId} disabled={!!categoryId}>
							<InputLabel>Категория *</InputLabel>
							<Select
								value={selectedCategoryId}
								label="Категория *"
								onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
							>
								{categories.map((category) => (
									<MenuItem key={category.id} value={category.id}>
										{category.title}
									</MenuItem>
								))}
							</Select>
							{errors.categoryId && (
								<Typography variant="caption" color="error">
									{errors.categoryId}
								</Typography>
							)}
						</FormControl>

						<TextField
							label="Название подкатегории *"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							error={!!errors.title}
							helperText={errors.title}
							fullWidth
							disabled={isLoading}
						/>

						<TextField
							label="Описание"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							error={!!errors.description}
							helperText={errors.description}
							multiline
							rows={3}
							fullWidth
							disabled={isLoading}
						/>

						<Box>
							<Typography variant="subtitle2" gutterBottom>
								Изображение
							</Typography>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								style={{ display: "none" }}
								id="image-upload"
							/>
							<Stack direction="row" spacing={2} alignItems="center">
								<label htmlFor="image-upload">
									<Button variant="outlined" component="span" disabled={isLoading}>
										Выбрать файл
									</Button>
								</label>
								{imageFile && (
									<Button variant="text" color="error" onClick={handleRemoveImage} disabled={isLoading}>
										Удалить
									</Button>
								)}
							</Stack>
							{imageFile && (
								<Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
									Выбран файл: {imageFile.name}
								</Typography>
							)}
							{errors.image && (
								<Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
									{errors.image}
								</Typography>
							)}
							<Box sx={{ mt: 2 }}>
								<Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
									Предпросмотр изображения:
								</Typography>
								<Card sx={{ width: 120, height: 80, display: "inline-block" }}>
									<CardMedia
										component="img"
										image={previewSrc || getPlaceholderImage()}
										alt="Image preview"
										sx={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
										}}
									/>
								</Card>
							</Box>
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
