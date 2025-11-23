"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { PencilIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";

import { newsApi } from "@/lib/news-api";
import { useNews } from "@/hooks/use-news";

interface NewsListProps {
	onEdit: (item: any) => void;
}

export function NewsList({ onEdit }: NewsListProps): React.JSX.Element {
	const { items, isLoading, deleteItem, fetchItems } = useNews();
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
				console.error("Error deleting news item:", error);
			}
		}
	};

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
		setItemToDelete(null);
	};

	const newsItems = items?.data || items || [];

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<Typography>Загрузка...</Typography>
			</Box>
		);
	}

	if (!newsItems || newsItems.length === 0) {
		return (
			<Box sx={{ textAlign: "center", p: 3 }}>
				<Typography color="text.secondary" variant="body1">
					Новостные статьи не найдены. Создайте первую статью, чтобы начать.
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
							<TableCell>Изображение</TableCell>
							<TableCell>Заголовок</TableCell>
							<TableCell>Описание</TableCell>
							<TableCell>Статус</TableCell>
							<TableCell>Создана</TableCell>
							<TableCell align="right">Действия</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{newsItems.map((item: any) => (
							<TableRow key={item.id} hover>
								<TableCell>
									<Card sx={{ width: 80, height: 60, overflow: "hidden" }}>
										<CardMedia
											component="img"
											image={item.coverUrl}
											alt={item.title}
											sx={{ width: "100%", height: "100%", objectFit: "cover" }}
										/>
									</Card>
								</TableCell>
								<TableCell>
									<Typography variant="body2" fontWeight="medium">
										{item.title}
									</Typography>
								</TableCell>
								<TableCell>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{
											maxWidth: 300,
											display: "-webkit-box",
											WebkitLineClamp: 2,
											WebkitBoxOrient: "vertical",
											overflow: "hidden",
										}}
									>
										{item.description}
									</Typography>
								</TableCell>
								<TableCell>
									<Chip
										label={item.isPublished ? "Опубликовано" : "Черновик"}
										size="small"
										color={item.isPublished ? "success" : "default"}
										variant="outlined"
									/>
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
				<DialogTitle id="delete-dialog-title">Удалить новостную статью</DialogTitle>
				<DialogContent>
					<DialogContentText id="delete-dialog-description">
						Вы уверены, что хотите удалить статью "{itemToDelete?.title}"? Это действие нельзя отменить.
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
