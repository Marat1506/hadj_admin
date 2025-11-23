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
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { PencilIcon, TrashIcon, Image as ImageIcon, VideoCamera } from "@phosphor-icons/react/dist/ssr";

import { useGallery } from "@/hooks/use-gallery";
import { GalleryItem } from "@/lib/gallery-api";

interface GalleryListProps {
  onEdit: (item: GalleryItem) => void;
}

export function GalleryList({ onEdit }: GalleryListProps): React.JSX.Element {
  const { items, isLoading, deleteItem } = useGallery();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<GalleryItem | null>(null);

  const handleDeleteClick = (item: GalleryItem) => {
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

  const getImageUrl = (item: GalleryItem) => {
    if (item.mediaType === 'image') {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      return `${apiUrl}/gallery/image/${item.mediaUrl}`;
    }
    return `https://img.youtube.com/vi/${item.mediaUrl}/mqdefault.jpg`;
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
          Элементы галереи не найдены. Создайте первый элемент, чтобы начать.
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
              <TableCell>Превью</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Заголовок</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Создан</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Card 
                    sx={{ 
                      width: 100, 
                      height: 75, 
                      cursor: item.mediaType === 'video' ? 'pointer' : 'default',
                      '&:hover': item.mediaType === 'video' ? { opacity: 0.8 } : {}
                    }}
                    onClick={() => {
                      if (item.mediaType === 'video') {
                        window.open(`https://www.youtube.com/watch?v=${item.mediaUrl}`, '_blank');
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={getImageUrl(item)}
                      alt={item.title || 'Gallery item'}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Card>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={item.mediaType === 'image' ? <ImageIcon /> : <VideoCamera />}
                    label={item.mediaType === 'image' ? 'Изображение' : 'Видео'}
                    size="small"
                    color={item.mediaType === 'image' ? 'primary' : 'secondary'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {item.title || '—'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>
                    {item.description ? (item.description.length > 50 ? item.description.substring(0, 50) + '...' : item.description) : '—'}
                  </Typography>
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
        <DialogTitle id="delete-dialog-title">Удалить элемент галереи</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Вы уверены, что хотите удалить "{itemToDelete?.title || 'этот элемент'}"? Это действие нельзя отменить.
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
