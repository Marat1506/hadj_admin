'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PlusIcon, BookOpenIcon, PencilIcon, TrashIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { useGuideCategories } from '@/hooks/use-guide-categories';
import { useGuideSubcategories } from '@/hooks/use-guide-subcategories';
import { GuideCategoryForm } from '@/components/dashboard/guide/guide-category-form';

export default function GuidePage(): React.JSX.Element {
  const { items: categories, deleteItem: deleteCategory } = useGuideCategories();
  const { items: subcategories } = useGuideSubcategories();
  const [isCategoryFormOpen, setIsCategoryFormOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState<any>(null);

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryFormOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleCloseCategoryForm = () => {
    setIsCategoryFormOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (category: any) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const getCategorySubcategoriesCount = (categoryId: number) => {
    return subcategories.filter(sub => sub.categoryId === categoryId).length;
  };

  return (
    <Container maxWidth="xl">
      {/* Header with Add Category button */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">Гид паломника</Typography>
        </Box>
        <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateCategory}>
          Добавить категорию
        </Button>
      </Stack>

      {/* Categories Grid */}
      <Grid container spacing={3}>
        {categories.map((category: any) => {
          const subcategoriesCount = getCategorySubcategoriesCount(category.id);
          return (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={category.id}
              component="div"
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <BookOpenIcon size={24} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>{category.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {subcategoriesCount} подкатегорий
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ mt: 'auto' }}>
                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                      <Link href={`/dashboard/guide/category/${category.id}`} passHref style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
                          Просмотреть подкатегории
                        </Button>
                      </Link>
                      <Stack direction="row" spacing={1}>
                        <IconButton 
                          size="small" 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            e.stopPropagation(); 
                            handleEditCategory(category); 
                          }} 
                          color="primary"
                        >
                          <PencilIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            e.stopPropagation(); 
                            handleDeleteCategory(category); 
                          }} 
                          color="error"
                        >
                          <TrashIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Category Form */}
      {isCategoryFormOpen && (
        <GuideCategoryForm
          open={isCategoryFormOpen}
          onClose={handleCloseCategoryForm}
          item={editingCategory}
          onSuccess={handleCloseCategoryForm}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Удалить категорию</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить "{categoryToDelete?.title}"? Это действие не может быть отменено и также приведет к удалению всех связанных подкатегорий и контента.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
