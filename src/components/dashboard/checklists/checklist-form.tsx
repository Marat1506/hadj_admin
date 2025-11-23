"use client";

import * as React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormHelperText,
	Stack,
	TextField,
} from "@mui/material";

import { useChecklists } from "@/hooks/use-checklists";

interface ChecklistFormProps {
	open: boolean;
	onClose: () => void;
	item?: any | null;
	onSuccess?: () => void;
}

export function ChecklistForm({ open, onClose, item, onSuccess }: ChecklistFormProps): React.JSX.Element {
	const { createItem, updateItem } = useChecklists();
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [formData, setFormData] = React.useState<{
		title: string;
		description: string;
	}>({
		title: "",
		description: "",
	});
	const [errors, setErrors] = React.useState<Record<string, string>>({});

	React.useEffect(() => {
		if (open) {
			if (item) {
				setFormData({
					title: item.title || "",
					description: item.description || "",
				});
			} else {
				setFormData({
					title: "",
					description: "",
				});
			}
			setErrors({});
		}
	}, [item, open]);

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
		} else if (formData.title.length > 255) {
			newErrors.title = "Название должно быть менее 255 символов";
		}

		if (!formData.description.trim()) {
			newErrors.description = "Описание обязательно";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!validateForm()) return;

		const submitData = {
			title: formData.title,
			description: formData.description,
		};

		setIsSubmitting(true);
		try {
			if (item) {
				await updateItem(item.id, submitData);
			} else {
				await createItem(submitData);
			}
			onSuccess?.();
			onClose();
		} catch (error) {
			console.error("Error saving checklist:", error);
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

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>{item ? "Редактировать чеклист" : "Создать новый чеклист"}</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent>
					<Stack spacing={3} sx={{ mt: 1 }}>
						<TextField
							fullWidth
							label="Название *"
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
							helperText={errors.description}
							disabled={isSubmitting}
							required
							multiline
							rows={3}
						/>

						{errors.submit && <FormHelperText error>{errors.submit}</FormHelperText>}
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
