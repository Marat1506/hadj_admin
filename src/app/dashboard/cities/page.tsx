'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CitiesList } from '@/components/dashboard/cities/cities-list';
import { CitiesForm } from '@/components/dashboard/cities/cities-form';
import { ServicesList } from '@/components/dashboard/cities/services-list';
import { ServicesForm } from '@/components/dashboard/cities/services-form';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cities-tabpanel-${index}`}
      aria-labelledby={`cities-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CitiesPage(): React.JSX.Element {
  const [tabValue, setTabValue] = React.useState(0);
  const [isCityFormOpen, setIsCityFormOpen] = React.useState(false);
  const [isServiceFormOpen, setIsServiceFormOpen] = React.useState(false);
  const [editingCity, setEditingCity] = React.useState<any>(null);
  const [editingService, setEditingService] = React.useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateCity = () => {
    setEditingCity(null);
    setIsCityFormOpen(true);
  };

  const handleEditCity = (item: any) => {
    setEditingCity(item);
    setIsCityFormOpen(true);
  };

  const handleCloseCityForm = () => {
    setIsCityFormOpen(false);
    setEditingCity(null);
  };

  const handleCreateService = () => {
    setEditingService(null);
    setIsServiceFormOpen(true);
  };

  const handleEditService = (item: any) => {
    setEditingService(item);
    setIsServiceFormOpen(true);
  };

  const handleCloseServiceForm = () => {
    setIsServiceFormOpen(false);
    setEditingService(null);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h4">Управление городами и сервисами</Typography>
          <Typography color="text.secondary" variant="body1">
            Управляйте городами и их сервисами
          </Typography>
        </div>
        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<PlusIcon />}
            onClick={handleCreateCity}
            variant="contained"
          >
            Добавить город
          </Button>
          <Button
            startIcon={<PlusIcon />}
            onClick={handleCreateService}
            variant="outlined"
          >
            Добавить сервис
          </Button>
        </Stack>
      </Stack>

      <Card>
        <CardHeader title="Города и сервисы" />
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="cities tabs">
              <Tab label="Города" id="cities-tab-0" aria-controls="cities-tabpanel-0" />
              <Tab label="Сервисы" id="cities-tab-1" aria-controls="cities-tabpanel-1" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <CitiesList onEdit={handleEditCity} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <ServicesList onEdit={handleEditService} />
          </TabPanel>
        </CardContent>
      </Card>

      {isCityFormOpen && (
        <CitiesForm
          open={isCityFormOpen}
          onClose={handleCloseCityForm}
          item={editingCity}
        />
      )}

      {isServiceFormOpen && (
        <ServicesForm
          open={isServiceFormOpen}
          onClose={handleCloseServiceForm}
          item={editingService}
        />
      )}
    </Stack>
  );
} 