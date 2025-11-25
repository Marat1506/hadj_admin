'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
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
import { PlusIcon, ArrowLeftIcon, PencilIcon, TrashIcon, FolderIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { useGuideCategories } from '@/hooks/use-guide-categories';
import { useGuideSubcategories } from '@/hooks/use-guide-subcategories';
import { useGuideContent } from '@/hooks/use-guide-content';
import { GuideSubcategoryForm } from '@/components/dashboard/guide/guide-subcategory-form';

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps): React.JSX.Element {
  const resolvedParams = React.use(params);
  const { items: categories } = useGuideCategories();
  const { items: subcategories, deleteItem: deleteSubcategory } = useGuideSubcategories();
  const { items: content } = useGuideContent();
  const [isSubcategoryFormOpen, setIsSubcategoryFormOpen] = React.useState(false);
  const [editingSubcategory, setEditingSubcategory] = React.useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = React.useState<any>(null);

  const selectedCategory = categories.find(category => category.id === parseInt(resolvedParams.id));
  const categorySubcategories = subcategories.filter(sub => sub.categoryId === parseInt(resolvedParams.id));

  const handleCreateSubcategory = () => {
    setEditingSubcategory(null);
    setIsSubcategoryFormOpen(true);
  };

  const handleEditSubcategory = (subcategory: any) => {
    setEditingSubcategory(subcategory);
    setIsSubcategoryFormOpen(true);
  };

  const handleCloseSubcategoryForm = () => {
    setIsSubcategoryFormOpen(false);
    setEditingSubcategory(null);
  };

  const handleDeleteSubcategory = (subcategory: any) => {
    setSubcategoryToDelete(subcategory);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (subcategoryToDelete) {
      deleteSubcategory(subcategoryToDelete.id);
      setDeleteDialogOpen(false);
      setSubcategoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSubcategoryToDelete(null);
  };

  const getSubcategoryContentCount = (subcategoryId: number) => {
    return content.filter(item => item.subcategoryId === subcategoryId).length;
  };

  if (!selectedCategory) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4">Категория не найдена</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Link href="/dashboard/guide" passHref>
          <IconButton><ArrowLeftIcon /></IconButton>
        </Link>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">{selectedCategory.title}</Typography>
          <Typography variant="body1" color="text.secondary">
            {categorySubcategories.length} подкатегорий
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateSubcategory}>
          Добавить подкатегорию
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {categorySubcategories.map((subcategory) => {
          const contentCount = getSubcategoryContentCount(subcategory.id);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={subcategory.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <FolderIcon size={24} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>{subcategory.title}</Typography>
                      {subcategory.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {subcategory.description}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {contentCount} материалов
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ mt: 'auto' }}>
                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                      <Link href={`/dashboard/guide/subcategory/${subcategory.id}`} passHref style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
                          Просмотр контента
                        </Button>
                      </Link>
                      <Stack direction="row" spacing={1}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditSubcategory(subcategory)} 
                          color="primary"
                        >
                          <PencilIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteSubcategory(subcategory)} 
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

      {isSubcategoryFormOpen && (
        <GuideSubcategoryForm
          open={isSubcategoryFormOpen}
          onClose={handleCloseSubcategoryForm}
          item={editingSubcategory}
          onSuccess={handleCloseSubcategoryForm}
          categoryId={parseInt(resolvedParams.id)}
        />
      )}

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Удалить подкатегорию</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить "{subcategoryToDelete?.title}"? Это действие не может быть отменено и также приведет к удалению всего связанного контента.
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