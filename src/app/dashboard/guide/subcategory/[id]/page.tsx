'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
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
import Chip from '@mui/material/Chip';
import { PlusIcon, ArrowLeftIcon, PencilIcon, TrashIcon, FileIcon, ImageIcon, VideoIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { useGuideCategories } from '@/hooks/use-guide-categories';
import { useGuideSubcategories } from '@/hooks/use-guide-subcategories';
import { useGuideContent } from '@/hooks/use-guide-content';
import { GuideContentForm } from '@/components/dashboard/guide/guide-content-form';

interface SubcategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function SubcategoryPage({ params }: SubcategoryPageProps): React.JSX.Element {
  const resolvedParams = React.use(params);
  const { items: categories } = useGuideCategories();
  const { items: subcategories } = useGuideSubcategories();
  const { items: content, deleteItem: deleteContent } = useGuideContent();
  const [isContentFormOpen, setIsContentFormOpen] = React.useState(false);
  const [editingContent, setEditingContent] = React.useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [contentToDelete, setContentToDelete] = React.useState<any>(null);

  const selectedSubcategory = subcategories.find(sub => sub.id === parseInt(resolvedParams.id));
  const selectedCategory = selectedSubcategory ? categories.find(cat => cat.id === selectedSubcategory.categoryId) : null;
  const subcategoryContent = content.filter(item => item.subcategoryId === parseInt(resolvedParams.id));

  const handleCreateContent = () => {
    setEditingContent(null);
    setIsContentFormOpen(true);
  };

  const handleEditContent = (contentItem: any) => {
    setEditingContent(contentItem);
    setIsContentFormOpen(true);
  };

  const handleCloseContentForm = () => {
    setIsContentFormOpen(false);
    setEditingContent(null);
  };

  const handleDeleteContent = (contentItem: any) => {
    setContentToDelete(contentItem);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (contentToDelete) {
      deleteContent(contentToDelete.id);
      setDeleteDialogOpen(false);
      setContentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setContentToDelete(null);
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image':
        return <ImageIcon size={20} />;
      case 'video':
        return <VideoIcon size={20} />;
      default:
        return <FileIcon size={20} />;
    }
  };

  const getMediaUrl = (url?: string) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}${url}`;
  };

  if (!selectedSubcategory) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4">Подкатегория не найдена</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Link href={`/dashboard/guide/category/${selectedSubcategory.categoryId}`} passHref>
          <IconButton><ArrowLeftIcon /></IconButton>
        </Link>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">{selectedSubcategory.title}</Typography>
          <Typography variant="body1" color="text.secondary">
            {selectedCategory?.title} → {subcategoryContent.length} материалов
          </Typography>
          {selectedSubcategory.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {selectedSubcategory.description}
            </Typography>
          )}
        </Box>
        <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateContent}>
          Добавить контент
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {subcategoryContent.map((contentItem) => {
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={contentItem.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {contentItem.mediaUrl && (
                  <CardMedia
                    component={contentItem.mediaType === 'video' ? 'video' : 'img'}
                    height="200"
                    image={getMediaUrl(contentItem.mediaUrl) || ''}
                    alt={contentItem.title}
                    controls={contentItem.mediaType === 'video'}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    {getMediaIcon(contentItem.mediaType)}
                    <Chip 
                      label={contentItem.mediaType === 'image' ? 'Изображение' : 'Видео'} 
                      size="small" 
                      color={contentItem.mediaType === 'image' ? 'primary' : 'secondary'}
                      variant="outlined"
                    />
                  </Stack>
                  
                  <Typography variant="h6" gutterBottom>{contentItem.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
                    {contentItem.description}
                  </Typography>
                  
                  <Box sx={{ mt: 'auto' }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditContent(contentItem)} 
                        color="primary"
                      >
                        <PencilIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteContent(contentItem)} 
                        color="error"
                      >
                        <TrashIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {subcategoryContent.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Нет контента
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            В этой подкатегории пока нет материалов
          </Typography>
          <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateContent}>
            Добавить первый материал
          </Button>
        </Box>
      )}

      {isContentFormOpen && (
        <GuideContentForm
          open={isContentFormOpen}
          onClose={handleCloseContentForm}
          item={editingContent}
          onSuccess={handleCloseContentForm}
          preselectedCategoryId={selectedSubcategory?.categoryId}
          preselectedSubcategoryId={selectedSubcategory?.id}
        />
      )}

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Удалить контент</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить "{contentToDelete?.title}"? Это действие не может быть отменено.
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