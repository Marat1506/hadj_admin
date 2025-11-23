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
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { useGuideContent } from "@/hooks/use-guide-content";
import { useGuideCategories } from "@/hooks/use-guide-categories";
import { useGuideSubcategories } from "@/hooks/use-guide-subcategories";

interface GuideContentFormProps {
	open: boolean;
	onClose: () => void;
	item?: any;
	onSuccess?: () => void;
}

export function GuideContentForm({ open, onClose, item, onSuccess }: GuideContentFormProps): React.JSX.Element {
	const { createItem, updateItem } = useGuideContent();
	const { items: categories } = useGuideCategories();
	const { items: subcategories } = useGuideSubcategories();
	
	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [categoryId, setCategoryId] = React.useState("");
	const [subcategoryId, setSubcategoryId] = React.useState("");
	const [mediaType, setMediaType] = React.useState<'image' | 'video'>('image');
	const [mediaFile, setMediaFile] = React.useState<File | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
	const [previewSrc, setPreviewSrc] = React.useState<string | null>(null);
	const [notification, setNotification] = React.useState<{
		open: boolean;
		message: string;
		severity: 'success' | 'error';
	}>({
		open: false,
		message: '',
		severity: 'success'
	});
	
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (open) {
			if (item) {
				setTitle(item.title || "");
				setDescription(item.description || "");
				setCategoryId(item.categoryId?.toString() || "");
				setSubcategoryId(item.subcategoryId?.toString() || "");
				setMediaType(item.mediaType || 'image');
				
				if (item.mediaUrl) {
					const fullUrl = item.mediaUrl.startsWith('http') 
						? item.mediaUrl 
						: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}${item.mediaUrl}`;
					setPreviewSrc(fullUrl);
				} else {
					setPreviewSrc(null);
				}
			} else {
				setTitle("");
				setDescription("");
				setCategoryId("");
				setSubcategoryId("");
				setMediaType('image');
				setPreviewSrc(null);
			}
			setMediaFile(null);
			setErrors({});
		}
	}, [open, item]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Проверка типа файла
		const isImage = file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/);
		const isVideo = file.type.match(/^video\/(mp4|webm|ogg)$/);
		
		if (mediaType === 'image' && !isImage) {
			setErrors({ media: "Пожалуйста, выберите изображение (JPG, PNG, GIF, WebP)" });
			return;
		}
		
		if (mediaType === 'video' && !isVideo) {
			setErrors({ media: "Пожалуйста, выберите видео (MP4, WebM, OGG)" });
			return;
		}

		// Проверка размера (макс 50MB для видео, 10MB для изображений)
		const maxSize = mediaType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
		if (file.size > maxSize) {
			setErrors({ media: `Размер файла не должен превышать ${mediaType === 'video' ? '50MB' : '10MB'}` });
			return;
		}

		setMediaFile(file);
		setErrors({});

		// Создаем превью
		if (mediaType === 'image') {
			const reader = new FileReader();
			reader.onload = (e) => {
				setPreviewSrc(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			// Для видео создаем URL
			const videoUrl = URL.createObjectURL(file);
			setPreviewSrc(videoUrl);
		}
	};

	const handleRemoveMedia = () => {
		setMediaFile(null);
		setPreviewSrc(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const validateForm = (): boolean => {
		const newErrors: { [key: string]: string } = {};
		
		if (!title.trim()) newErrors.title = "Название обязательно";
		if (!description.trim()) newErrors.description = "Описание обязательно";
		if (!categoryId) newErrors.categoryId = "Выберите категорию";
		if (!subcategoryId) newErrors.subcategoryId = "Выберите подкатегорию";
		if (!item && !mediaFile) newErrors.media = "Выберите медиафайл";
		
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
				description: description.trim(),
				categoryId: parseInt(categoryId),
				subcategoryId: parseInt(subcategoryId),
				mediaType
			};
			
			if (mediaFile) {
				data.media = mediaFile;
			}
			
			if (item) {
				await updateItem(item.id, data);
			} else {
				await createItem(data);
			}
			
			setNotification({
				open: true,
				message: 'Контент успешно сохранен!',
				severity: 'success'
			});
			
			onSuccess?.();
			onClose();
		} catch (error) {
			console.error("Error saving guide content:", error);
			setNotification({
				open: true,
				message: 'Произошла ошибка при сохранении',
				severity: 'error'
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		if (!isLoading) onClose();
	};

	const handleCloseNotification = () => {
		setNotification(prev => ({ ...prev, open: false }));
	};

	// Фильтруем подкатегории по выбранной категории
	const filteredSubcategories = subcategories?.filter(sub => 
		sub.categoryId?.toString() === categoryId
	) || [];

	return (
		<>
			<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
				<form onSubmit={handleSubmit}>
					<DialogTitle>{item ? "Редактировать контент" : "Добавить контент"}</DialogTitle>
					<DialogContent>
						<Stack spacing={3} sx={{ mt: 1 }}>
							<TextField
								label="Название *"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								error={!!errors.title}
								helperText={errors.title}
								fullWidth
								disabled={isLoading}
							/>
							
							<TextField
								label="Описание *"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								error={!!errors.description}
								helperText={errors.description}
								fullWidth
								multiline
								rows={4}
								disabled={isLoading}
							/>
							
							<FormControl fullWidth error={!!errors.categoryId}>
								<InputLabel>Категория *</InputLabel>
								<Select
									value={categoryId}
									onChange={(e) => {
										setCategoryId(e.target.value);
										setSubcategoryId(""); // Сбрасываем подкатегорию при смене категории
									}}
									label="Категория *"
									disabled={isLoading}
								>
									{categories?.map((category: any) => (
										<MenuItem key={category.id} value={category.id.toString()}>
											{category.title}
										</MenuItem>
									))}
								</Select>
								{errors.categoryId && (
									<Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
										{errors.categoryId}
									</Typography>
								)}
							</FormControl>
							
							<FormControl fullWidth error={!!errors.subcategoryId}>
								<InputLabel>Подкатегория *</InputLabel>
								<Select
									value={subcategoryId}
									onChange={(e) => setSubcategoryId(e.target.value)}
									label="Подкатегория *"
									disabled={isLoading || !categoryId}
								>
									{filteredSubcategories.map((subcategory: any) => (
										<MenuItem key={subcategory.id} value={subcategory.id.toString()}>
											{subcategory.title}
										</MenuItem>
									))}
								</Select>
								{errors.subcategoryId && (
									<Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
										{errors.subcategoryId}
									</Typography>
								)}
							</FormControl>
							
							<FormControl fullWidth>
								<InputLabel>Тип медиа</InputLabel>
								<Select
									value={mediaType}
									onChange={(e) => {
										setMediaType(e.target.value as 'image' | 'video');
										setMediaFile(null);
										setPreviewSrc(null);
									}}
									label="Тип медиа"
									disabled={isLoading}
								>
									<MenuItem value="image">Изображение</MenuItem>
									<MenuItem value="video">Видео</MenuItem>
								</Select>
							</FormControl>
							
							<Box>
								<Typography variant="subtitle2" gutterBottom>
									{mediaType === 'image' ? 'Изображение' : 'Видео'} {!item && '*'}
								</Typography>
								<input
									ref={fileInputRef}
									type="file"
									accept={mediaType === 'image' ? 'image/*' : 'video/*'}
									onChange={handleFileChange}
									style={{ display: "none" }}
									id="media-upload"
								/>
								<Stack direction="row" spacing={2} alignItems="center">
									<label htmlFor="media-upload">
										<Button variant="outlined" component="span" disabled={isLoading}>
											Выбрать файл
										</Button>
									</label>
									{(mediaFile || previewSrc) && (
										<Button variant="text" color="error" onClick={handleRemoveMedia} disabled={isLoading}>
											Удалить
										</Button>
									)}
								</Stack>
								{mediaFile && (
									<Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
										Выбран файл: {mediaFile.name}
									</Typography>
								)}
								{errors.media && (
									<Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
										{errors.media}
									</Typography>
								)}
								
								{previewSrc && (
									<Box sx={{ mt: 2 }}>
										<Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
											Предпросмотр:
										</Typography>
										<Card sx={{ maxWidth: 300, display: "inline-block" }}>
											{mediaType === 'image' ? (
												<CardMedia
													component="img"
													image={previewSrc}
													alt="Preview"
													sx={{
														width: "100%",
														height: 200,
														objectFit: "cover",
													}}
												/>
											) : (
												<CardMedia
													component="video"
													src={previewSrc}
													controls
													sx={{
														width: "100%",
														height: 200,
													}}
												/>
											)}
										</Card>
									</Box>
								)}
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

			<Snackbar
				open={notification.open}
				autoHideDuration={4000}
				onClose={handleCloseNotification}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<Alert 
					onClose={handleCloseNotification} 
					severity={notification.severity}
					sx={{ width: '100%' }}
				>
					{notification.message}
				</Alert>
			</Snackbar>
		</>
	);
}