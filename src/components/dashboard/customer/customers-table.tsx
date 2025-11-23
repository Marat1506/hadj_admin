'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export interface Customer {
  id: string;
  phone: string;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  gender: string;
  foreignLastName: string;
  foreignFirstName: string;
  citizenship: string;
  issueCountry: string;
  issueDate: string;
  passportNumber: string;
  expiryDate: string;
  fms: string;
  russianPassportNumber: string;
  passportTerm: string;
  russianExpiryDate: string;
  issuedBy: string;
  issuedDate: string;
  departmentCode: string;
  residence: string;
  snils: string;
  inn: string;
  postalCode: string;
  region: string;
  district: string;
  street: string;
  house: string;
  building: string;
  structure: string;
  apartment: string;
  foreignPassportFile: string;
  russianPassportFile: string;
  visaPhotoFile: string;
  selfieWithPassportFile: string;
  foreignPassportFileUrl: string;
  russianPassportFileUrl: string;
  visaPhotoFileUrl: string;
  selfieWithPassportFileUrl: string;
  roles: string[];
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
}

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Фамилия</TableCell>
              <TableCell>Отчество</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Гражданство</TableCell>
              <TableCell>Дата рождения</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{row.firstName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{row.lastName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{row.middleName}</Typography>
                  </TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.citizenship}</TableCell>
                  <TableCell>{dayjs(row.birthDate).format('DD.MM.YYYY')}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      {/* <Divider /> */}
      {/* <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      /> */}
    </Card>
  );
}
