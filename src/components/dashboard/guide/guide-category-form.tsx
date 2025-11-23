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
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useGuideCategories } from "@/hooks/use-guide-categories";

interface GuideCategoryFormProps {
	open: boolean;
	onClose: () => void;
	item?: any;
	onSuccess?: () => void;
}

export function GuideCategoryForm({ open, onClose, item, onSuccess }: GuideCategoryFormProps): React.JSX.Element {
	const { createItem, updateItem } = useGuideCategories();
	const [title, setTitle] = React.useState("");
	const [iconFile, setIconFile] = React.useState<File | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [errors, setErrors] = React.useState<{ title?: string; icon?: string }>({});
	const [previewSrc, setPreviewSrc] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (open) {
			if (item) {
				setTitle(item.title || "");
				// Показываем существующую иконку
				if (item.iconUrl) {
					const fullUrl = item.iconUrl.startsWith('http') 
						? item.iconUrl 
						: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}${item.iconUrl}`;
					setPreviewSrc(fullUrl);
				} else {
					setPreviewSrc(getPlaceholderIcon());
				}
			} else {
				setTitle("");
				setPreviewSrc(getPlaceholderIcon());
			}
			setIconFile(null);
			setErrors({});
		}
	}, [open, item]);

	const svgToDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

	const getPlaceholderIcon = () => {
		const svg = `
      <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#e0e0e0" rx="8"/>
        <text x="40" y="45" font-family="Arial" font-size="12" fill="#666" text-anchor="middle">Иконка</text>
      </svg>
    `;
		return svgToDataUri(svg);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Проверка типа файла
		if (!file.type.match(/^image\/(jpeg|jpg|png|gif|svg\+xml|webp)$/)) {
			setErrors({ icon: "Пожалуйста, выберите изображение (JPG, PNG, GIF, SVG, WebP)" });
			return;
		}

		// Проверка размера (макс 5MB)
		if (file.size > 5 * 1024 * 1024) {
			setErrors({ icon: "Размер файла не должен превышать 5MB" });
			return;
		}

		setIconFile(file);
		setErrors({});

		// Создаем превью
		const reader = new FileReader();
		reader.onload = (e) => {
			setPreviewSrc(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveIcon = () => {
		setIconFile(null);
		setPreviewSrc(getPlaceholderIcon());
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const validateForm = (): boolean => {
		const newErrors: { title?: string; icon?: string } = {};
		if (!title.trim()) newErrors.title = "Название категории обязательно";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!validateForm()) return;
		setIsLoading(true);
		try {
			const data: any = { title: title.trim() };
			if (iconFile) {
				data.icon = iconFile;
			}
			if (item) await updateItem(item.id, data);
			else await createItem(data);
			onSuccess?.();
			onClose();
		} catch (error) {
			console.error("Error saving guide category:", error);
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
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<form onSubmit={handleSubmit}>
				<DialogTitle>{item ? "Редактировать категорию" : "Добавить категорию"}</DialogTitle>
				<DialogContent>
					<Stack spacing={3} sx={{ mt: 1 }}>
						<TextField
							label="Название категории *"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							error={!!errors.title}
							helperText={errors.title}
							fullWidth
							disabled={isLoading}
						/>
						<Box>
							<Typography variant="subtitle2" gutterBottom>
								Иконка
							</Typography>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								style={{ display: "none" }}
								id="icon-upload"
							/>
							<Stack direction="row" spacing={2} alignItems="center">
								<label htmlFor="icon-upload">
									<Button variant="outlined" component="span" disabled={isLoading}>
										Выбрать файл
									</Button>
								</label>
								{iconFile && (
									<Button variant="text" color="error" onClick={handleRemoveIcon} disabled={isLoading}>
										Удалить
									</Button>
								)}
							</Stack>
							{iconFile && (
								<Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
									Выбран файл: {iconFile.name}
								</Typography>
							)}
							{errors.icon && (
								<Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
									{errors.icon}
								</Typography>
							)}
							<Box sx={{ mt: 2 }}>
								<Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
									Предпросмотр иконки:
								</Typography>
								<Card sx={{ width: 80, height: 80, display: "inline-block" }}>
									<CardMedia
										component="img"
										image={previewSrc || getPlaceholderIcon()}
										alt="Icon preview"
										sx={{
											width: "100%",
											height: "100%",
											objectFit: "contain",
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
