"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
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

import { useGuideCategories } from "@/hooks/use-guide-categories";
import { useGuideSubcategories } from "@/hooks/use-guide-subcategories";

interface GuideSubcategoryListProps {
	categoryId?: number;
	onEdit: (item: any) => void;
}

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

export function GuideSubcategoryList({ categoryId, onEdit }: GuideSubcategoryListProps): React.JSX.Element {
	const { items, isLoading, deleteItem } = useGuideSubcategories(categoryId);
	const { items: categories, isLoading: categoriesLoading } = useGuideCategories();
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [itemToDelete, setItemToDelete] = React.useState<any>(null);

	const getCategoryName = (categoryId: number) => {
		if (categoriesLoading) return "Загрузка...";
		const category = categories.find((cat) => cat.id === categoryId);
		// Debug logging
		if (!category) {
			console.log("Category not found:", categoryId, "Available categories:", categories);
		}
		return category?.title || "Неизвестная категория";
	};

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
      <svg width="60" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="40" fill="${color}" rx="4"/>
        <text x="30" y="25" font-family="Arial" font-size="10" fill="white" text-anchor="middle">Img</text>
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
					Подкатегории не найдены. Создайте первую подкатегорию.
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
							<TableCell>Название</TableCell>
							<TableCell>Описание</TableCell>
							{!categoryId && <TableCell>Категория</TableCell>}
							<TableCell>Действия</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{items.map((item: any) => (
							<TableRow key={item.id}>
								<TableCell>
									<Card sx={{ width: 60, height: 40 }}>
										<CardMedia
											component="img"
											image={
												item.image
													? item.image.startsWith("http")
														? item.image
														: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}${item.image}`
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
								<TableCell>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{
											maxWidth: 200,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										{item.description || "—"}
									</Typography>
								</TableCell>
								{!categoryId && (
									<TableCell>
										<Typography variant="body2">{getCategoryName(item.categoryId)}</Typography>
									</TableCell>
								)}
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
				<DialogTitle id="delete-dialog-title">Удалить подкатегорию</DialogTitle>
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
