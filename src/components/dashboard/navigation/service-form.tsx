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

import { useNavigation } from "@/hooks/use-navigation";

interface ServiceFormProps {
	open: boolean;
	onClose: () => void;
	item?: any;
	city: any;
}

const serviceTypes = [
	{ value: "hotel", label: "Hotel" },
	{ value: "restaurant", label: "Restaurant" },
	{ value: "attraction", label: "Attraction" },
	{ value: "transport", label: "Transport" },
	{ value: "entertainment", label: "Entertainment" },
	{ value: "shopping", label: "Shopping" },
	{ value: "medical", label: "Medical" },
	{ value: "other", label: "Other" },
];

export function ServiceForm({ open, onClose, item, city }: ServiceFormProps): React.JSX.Element {
	const { createService, updateService } = useNavigation();
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [formData, setFormData] = React.useState({
		title: "",
		description: "",
		type: "other",
	});
	const [errors, setErrors] = React.useState<Record<string, string>>({});

	React.useEffect(() => {
		if (item) {
			setFormData({
				title: item.title || "",
				description: item.description || "",
				type: item.type || "other",
			});
		} else {
			setFormData({
				title: "",
				description: "",
				type: "other",
			});
		}
		setErrors({});
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
			newErrors.title = "Service title is required";
		}

		if (formData.title.length > 255) {
			newErrors.title = "Service title must be less than 255 characters";
		}

		if (formData.description && formData.description.length > 500) {
			newErrors.description = "Description must be less than 500 characters";
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
				...formData,
				cityId: city.id,
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
			<DialogTitle>
				{item ? "Изменить услугу" : "Создать новую услугу"}
				<Typography variant="subtitle2" color="text.secondary">
					в {city?.name}
				</Typography>
			</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent>
					<Stack spacing={3}>
						<TextField
							fullWidth
							label="Service Title"
							value={formData.title}
							onChange={(e) => handleInputChange("title", e.target.value)}
							error={!!errors.title}
							helperText={errors.title || "Введите название услуги"}
							required
						/>

						<TextField
							fullWidth
							label="Description"
							value={formData.description}
							onChange={(e) => handleInputChange("description", e.target.value)}
							error={!!errors.description}
							helperText={errors.description || "Краткое описание услуги (необязательно)"}
							multiline
							rows={3}
						/>

						<FormControl fullWidth>
							<InputLabel>Тип услуги</InputLabel>
							<Select
								value={formData.type}
								label="Service Type"
								onChange={(e) => handleInputChange("type", e.target.value)}
							>
								{serviceTypes.map((type) => (
									<MenuItem key={type.value} value={type.value}>
										{type.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<Box>
							<Typography variant="subtitle2" color="text.secondary" gutterBottom>
								Информация об обслуживании
							</Typography>
							<Typography variant="body2" color="text.secondary">
								После создания сервиса вы можете добавить в него конкретные объекты, например, отели, рестораны или
								достопримечательности. Для удобства навигации каждый объект можно указать на карте.
							</Typography>
						</Box>
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
