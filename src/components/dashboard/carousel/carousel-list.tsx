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

import { useCarousel } from "@/hooks/use-carousel";

interface CarouselListProps {
	onEdit: (item: any) => void;
}

export function CarouselList({ onEdit }: CarouselListProps): React.JSX.Element {
	const { items, isLoading, deleteItem } = useCarousel();
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [itemToDelete, setItemToDelete] = React.useState<any>(null);

	const getPlaceholderImage = (id: number) => {
		const colors = [
			"#f44336",
			"#e91e63",
			"#9c27b0",
			"#673ab7",
			"#3f51b5",
			"#2196f3",
			"#03a9f4",
			"#00bcd4",
			"#009688",
			"#4caf50",
		];
		const color = colors[id % colors.length];
		const svg = `
      <svg width="80" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="60" fill="${color}"/>
        <text x="40" y="35" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Image ${id}</text>
      </svg>
    `;
		return `data:image/svg+xml;base64,${btoa(svg)}`;
	};

	const handleDeleteClick = (item: any) => {
		setItemToDelete(item);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (itemToDelete) {
			await deleteItem(itemToDelete.id);
			setDeleteDialogOpen(false);
			setItemToDelete(null);
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
					Баннеры не найдены. Создайте первый баннер, чтобы начать.
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
							<TableCell>Ссылка</TableCell>
							<TableCell>Создан</TableCell>
							<TableCell>Действия</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{items.map((item: any) => (
							<TableRow key={item.id}>
								<TableCell>
									<Card sx={{ width: 80, height: 60 }}>
										<CardMedia
											component="img"
											image={item.imageUrl}
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
									{item.link ? (
										<Chip label="Есть ссылка" size="small" color="primary" variant="outlined" />
									) : (
										<Chip label="Нет ссылки" size="small" color="default" variant="outlined" />
									)}
								</TableCell>
								<TableCell>
									<Typography variant="body2" color="text.secondary">
										{new Date(item.createdAt).toLocaleDateString()}
									</Typography>
								</TableCell>
								<TableCell align="right">
									<Stack direction="row" spacing={1}>
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
				<DialogTitle id="delete-dialog-title">Удалить баннер</DialogTitle>
				<DialogContent>
					<DialogContentText id="delete-dialog-description">
						Вы уверены, что хотите удалить "{itemToDelete?.title}"? Это действие нельзя отменить.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteCancel} color="primary">
						Отмена
					</Button>
					<Button onClick={handleDeleteConfirm} color="error" variant="contained">
						Удалить
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
