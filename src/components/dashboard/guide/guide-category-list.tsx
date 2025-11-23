"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { PencilIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";

import { useGuideCategories } from "@/hooks/use-guide-categories";

interface GuideCategoryListProps {
	onEdit: (item: any) => void;
}

export function GuideCategoryList({ onEdit }: GuideCategoryListProps): React.JSX.Element {
	const { items, isLoading, deleteItem } = useGuideCategories();
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [itemToDelete, setItemToDelete] = React.useState<any>(null);

	const getPlaceholderIcon = (id: number) => {
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
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" fill="${color}" rx="8"/>
        <text x="20" y="25" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Icon</text>
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
					Гид. Создайте первую категорию, чтобы начать.
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
							<TableCell>Иконка</TableCell>
							<TableCell>Название</TableCell>
							<TableCell align={"right"}>Действия</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{items.map((item: any) => (
							<TableRow key={item.id}>
								<TableCell>
									<Card sx={{ width: 40, height: 40 }}>
										<CardMedia
											component="img"
											image={
												item.iconUrl
													? item.iconUrl.startsWith("http")
														? item.iconUrl
														: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}${item.iconUrl}`
													: getPlaceholderIcon(item.id)
											}
											alt={item.title}
											sx={{ width: "100%", height: "100%", objectFit: "cover" }}
											onError={(e) => {
												const target = e.target as HTMLImageElement;
												target.src = getPlaceholderIcon(item.id);
											}}
										/>
									</Card>
								</TableCell>
								<TableCell>
									<Typography variant="body2" fontWeight="medium">
										{item.title}
									</Typography>
								</TableCell>
								<TableCell align={"right"}>
									<IconButton size="small" onClick={() => onEdit(item)} color="primary">
										<PencilIcon />
									</IconButton>
									<IconButton size="small" onClick={() => handleDeleteClick(item)} color="error">
										<TrashIcon />
									</IconButton>
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
				<DialogTitle id="delete-dialog-title">Удалить категорию</DialogTitle>
				<DialogContent>
					<DialogContentText id="delete-dialog-description">
						Вы уверены, что хотите удалить "{itemToDelete?.title}"? Это действие нельзя отменить. Все связанные
						подкатегории также будут удалены.
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
