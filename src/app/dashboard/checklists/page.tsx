"use client";

import * as React from "react";
import { Button, Card, CardContent, CardHeader, Stack, Typography } from "@mui/material";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";

import { ChecklistForm } from "@/components/dashboard/checklists/checklist-form";
import { ChecklistList } from "@/components/dashboard/checklists/checklist-list";

export default function ChecklistPage(): React.JSX.Element {
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
					<Typography variant="h4">Управление чеклистами</Typography>
				</div>
				<Button startIcon={<PlusIcon />} onClick={handleCreate} variant="contained">
					Добавить чеклист
				</Button>
			</Stack>

			<Card>
				<CardHeader title="Чеклисты" />
				<CardContent>
					<ChecklistList key={refreshKey} onEdit={handleEdit} />
				</CardContent>
			</Card>

			{isFormOpen && (
				<ChecklistForm open={isFormOpen} onClose={handleCloseForm} item={editingItem} onSuccess={handleCloseForm} />
			)}
		</Stack>
	);
}
