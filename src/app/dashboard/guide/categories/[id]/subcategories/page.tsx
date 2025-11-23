"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";

import { useGuideCategories } from "@/hooks/use-guide-categories";
import { GuideSubcategoryForm } from "@/components/dashboard/guide/guide-subcategory-form";
import { GuideSubcategoryList } from "@/components/dashboard/guide/guide-subcategory-list";

export default function CategorySubcategoriesPage(): React.JSX.Element {
	const params = useParams();
	const categoryId = Number(params.id);
	const { items: categories, getItem } = useGuideCategories();
	const [isFormOpen, setIsFormOpen] = React.useState(false);
	const [editingItem, setEditingItem] = React.useState<any>(null);
	const [refreshKey, setRefreshKey] = React.useState(0);
	const [category, setCategory] = React.useState<any>(null);

	React.useEffect(() => {
		if (categoryId) {
			const loadCategory = async () => {
				try {
					const cat = await getItem(categoryId);
					setCategory(cat);
				} catch (error) {
					console.error("Error loading category:", error);
				}
			};
			loadCategory();
		}
	}, [categoryId, getItem]);

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
			<Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
				<div>
					<Typography variant="h4">Подкатегории: {category?.title || "Загрузка..."}</Typography>
				</div>
				<Box sx={{ flex: 1 }} />
				<Button startIcon={<PlusIcon />} onClick={handleCreate} variant="contained">
					Добавить подкатегорию
				</Button>
			</Stack>

			<Card>
				<CardContent>
					<GuideSubcategoryList key={refreshKey} categoryId={categoryId} onEdit={handleEdit} />
				</CardContent>
			</Card>

			{isFormOpen && (
				<GuideSubcategoryForm
					open={isFormOpen}
					onClose={handleCloseForm}
					item={editingItem}
					categoryId={categoryId}
					onSuccess={handleCloseForm}
				/>
			)}
		</Stack>
	);
}
