"use client";

import * as React from "react";
import {
	Box,
	Button,
	Card,
	CardMedia,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { PencilIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";

import { useChecklists } from "@/hooks/use-checklists";

interface ChecklistListProps {
	onEdit: (item: any) => void;
}

export function ChecklistList({ onEdit }: ChecklistListProps): React.JSX.Element {
	const { items, isLoading, deleteItem, fetchItems } = useChecklists();
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [itemToDelete, setItemToDelete] = React.useState<any>(null);

	const handleDeleteClick = (item: any) => {
		setItemToDelete(item);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (itemToDelete) {
			try {
				await deleteItem(itemToDelete.id);
				await fetchItems();
				setDeleteDialogOpen(false);
				setItemToDelete(null);
			} catch (error) {
				console.error("Error deleting checklist:", error);
			}
		}
	};

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
		setItemToDelete(null);
	};

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<Typography>Загрузка...</Typography>
			</Box>
		);
	}

	if (!items || items.length === 0) {
		return (
			<Box sx={{ textAlign: "center", p: 3 }}>
				<Typography color="text.secondary" variant="body1">
					Чеклисты не найдены. Создайте первый чеклист, чтобы начать.
				</Typography>
			</Box>
		);
	}

	return (
		<>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Название</TableCell>
							<TableCell>Описание</TableCell>
							<TableCell>Статус</TableCell>
							<TableCell>Создан</TableCell>
							<TableCell align="right">Действия</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{items.map((item: any) => (
							<TableRow key={item.id} hover>
								<TableCell>
									<Typography variant="body2" fontWeight="medium">
										{item.title}
									</Typography>
								</TableCell>

								<TableCell>
									<Typography variant="body2" color="text.secondary">
										{item.description || "—"}
									</Typography>
								</TableCell>

								<TableCell>
									<Typography
										variant="body2"
										color={item.isCompleted ? "success.main" : "text.secondary"}
										fontWeight={item.isCompleted ? "medium" : "normal"}
									>
										{item.isCompleted ? "Завершен" : "Активный"}
									</Typography>
								</TableCell>

								<TableCell>
									<Typography variant="body2" color="text.secondary">
										{new Date(item.createdAt).toLocaleDateString("ru-RU")}
									</Typography>
								</TableCell>

								<TableCell align="right">
									<Stack direction="row" spacing={1} justifyContent="flex-end">
										<IconButton size="small" onClick={() => onEdit(item)} color="primary">
											<PencilIcon />
										</IconButton>
										<IconButton size="small" onClick={() => handleDeleteClick(item)} color="error">
											<TrashIcon />
										</IconButton>
									</Stack>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog
				open={deleteDialogOpen}
				onClose={handleDeleteCancel}
				aria-labelledby="delete-dialog-title"
				aria-describedby="delete-dialog-description"
			>
				<DialogTitle id="delete-dialog-title">Удалить чеклист</DialogTitle>
				<DialogContent>
					<DialogContentText id="delete-dialog-description">
						Вы уверены, что хотите удалить "{itemToDelete?.title}"? Это действие нельзя отменить.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteCancel} color="primary">
						Отмена
					</Button>
					<Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
						Удалить
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
