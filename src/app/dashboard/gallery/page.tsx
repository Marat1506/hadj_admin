"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";

import { GalleryForm } from "@/components/dashboard/gallery/gallery-form";
import { GalleryList } from "@/components/dashboard/gallery/gallery-list";
import { GalleryItem } from "@/lib/gallery-api";

export default function GalleryPage(): React.JSX.Element {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<GalleryItem | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <Typography variant="h4">Управление галереей</Typography>
        </div>
        <Button startIcon={<PlusIcon />} onClick={handleCreate} variant="contained">
          Добавить элемент
        </Button>
      </Stack>

      <Card>
        <CardHeader title="Галерея" />
        <CardContent>
          <GalleryList key={refreshKey} onEdit={handleEdit} />
        </CardContent>
      </Card>

      {isFormOpen && (
        <GalleryForm open={isFormOpen} onClose={handleCloseForm} item={editingItem || undefined} onSuccess={handleCloseForm} />
      )}
    </Stack>
  );
}
