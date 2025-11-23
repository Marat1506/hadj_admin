"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
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
import { PencilIcon, TrashIcon, PlayIcon, ImageIcon } from "@phosphor-icons/react/dist/ssr";

import { useGuideContent } from "@/hooks/use-guide-content";

interface GuideContentListProps {
	onEdit: (item: any) => void;
}

export function GuideContentList({ onEdit }: GuideContentListProps): React.JSX.Element {
	const { items, isLoading, deleteItem } = useGuideContent();
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [itemToDelete, setItemToDelete] = React.useState<any>(null);

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

	const getMediaPreview = (item: any) => {
		if (!item.mediaUrl) return null;
		
		const fullUrl = item.mediaUrl.startsWith('http') 
			? item.mediaUrl 
			: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}${item.mediaUrl}`;
		
		if (item.mediaType === 'video') {
			return (
				<Card sx={{ width: 60, height: 60, position: 'relative' }}>
					<CardMedia
						component="video"
						src={fullUrl}
						sx={{ width: "100%", height: "100%", objectFit: "cover" }}
					/>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							backgroundColor: 'rgba(0,0,0,0.6)',
							borderRadius: '50%',
							width: 24,
							height: 24,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<PlayIcon size={12} color="white" />
					</Box>
				</Card>
			);
		}
		
		return (
			<Card sx={{ width: 60, height: 60 }}>
				<CardMedia
					component="img"
					image={fullUrl}
					alt={item.title}
					sx={{ width: "100%", height: "100%", objectFit: "cover" }}
				/>
			</Card>
		);
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
					Контент не найден. Создайте первый элемент контента, чтобы начать.
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
							<TableCell>Медиа</TableCell>
							<TableCell>Название</TableCell>
							<TableCell>Описание</TableCell>
							<TableCell>Категория</TableCell>
							<TableCell>Подкатегория</TableCell>
							<TableCell>Тип</TableCell>
							<TableCell align="right">Действия</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{items.map((item: any) => (
							<TableRow key={item.id}>
								<TableCell>
									{getMediaPreview(item) || (
										<Card sx={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
											{item.mediaType === 'video' ? (
												<PlayIcon size={24} color="#999" />
											) : (
												<ImageIcon size={24} color="#999" />
											)}
										</Card>
									)}
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
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap'
										}}
									>
										{item.description}
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="body2">
										{item.category?.title || 'Не указана'}
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="body2">
										{item.subcategory?.title || 'Не указана'}
									</Typography>
								</TableCell>
								<TableCell>
									<Chip 
										label={item.mediaType === 'image' ? 'Изображение' : 'Видео'}
										size="small"
										color={item.mediaType === 'image' ? 'primary' : 'secondary'}
										variant="outlined"
									/>
								</TableCell>
								<TableCell align="right">
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
				<DialogTitle id="delete-dialog-title">Удалить контент</DialogTitle>
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