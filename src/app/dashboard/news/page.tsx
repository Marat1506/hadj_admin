"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";

import { NewsForm } from "@/components/dashboard/news/news-form";
import { NewsList } from "@/components/dashboard/news/news-list";

export default function NewsPage(): React.JSX.Element {
	const [isFormOpen, setIsFormOpen] = React.useState(false);
	const [editingItem, setEditingItem] = React.useState<any>(null);
	const [refreshKey, setRefreshKey] = React.useState(0);

	const handleCreate = () => {
		setEditingItem(null);
		setIsFormOpen(true);
	};

	const handleEdit = (item: any) => {
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
					<Typography variant="h4">Управление новостями</Typography>
				</div>
				<Button startIcon={<PlusIcon />} onClick={handleCreate} variant="contained">
					Добавить новостную статью
				</Button>
			</Stack>

			<Card>
				<CardHeader title="Новостные статьи" />
				<CardContent>
					<NewsList key={refreshKey} onEdit={handleEdit} />
				</CardContent>
			</Card>

			{isFormOpen && (
				<NewsForm open={isFormOpen} onClose={handleCloseForm} item={editingItem} onSuccess={handleCloseForm} />
			)}
		</Stack>
	);
}
