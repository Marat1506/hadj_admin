"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useNavigation } from "@/hooks/use-navigation";

interface CityFormProps {
	open: boolean;
	onClose: () => void;
	item?: any;
}

export function CityForm({ open, onClose, item }: CityFormProps): React.JSX.Element {
	const { createCity, updateCity } = useNavigation();
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [formData, setFormData] = React.useState({
		name: "",
	});
	const [errors, setErrors] = React.useState<Record<string, string>>({});

	React.useEffect(() => {
		if (item) {
			setFormData({
				name: item.name || "",
			});
		} else {
			setFormData({
				name: "",
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

		if (!formData.name.trim()) {
			newErrors.name = "City name is required";
		}

		if (formData.name.length > 255) {
			newErrors.name = "City name must be less than 255 characters";
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
			if (item) {
				await updateCity(item.id, formData);
			} else {
				await createCity(formData);
			}
			onClose();
		} catch (error) {
			console.error("Error saving city:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>{item ? "Изменить город" : "Создать новый город"}</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent>
					<Stack spacing={3}>
						<TextField
							fullWidth
              label="Название города"
							value={formData.name}
							onChange={(e) => handleInputChange("name", e.target.value)}
							error={!!errors.name}
              helperText={errors.name || "Введите название города"}
							required
						/>

						<Box>
							<Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Информация о городе
							</Typography>
							<Typography variant="body2" color="text.secondary">
                После создания города вы можете добавить такие услуги, как отели, рестораны, достопримечательности и многое другое. Каждая
                услуга может содержать несколько объектов с указанием местоположения на карте для удобной навигации.
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
