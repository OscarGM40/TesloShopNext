import { PeopleOutline } from '@mui/icons-material';
import { AdminLayout } from '../../components/layouts';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, MenuItem, Select } from '@mui/material';
import useSWR from 'swr';
import { IUser } from '../../interfaces';
import useTranslation from 'next-translate/useTranslation';
import { tesloApi } from '../../api';
import { useEffect, useState } from 'react';

const UsersPage = () => {
  const { t } = useTranslation('home');

  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) return <></>;

  const onRoleUpdate = async (userId: string, newRole: string) => {
    const previousUsers = [...users]
    // const previousUsers = users.map( user => ({...user}))
    const updatedUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }));
    setUsers(updatedUsers);

    try {
      await tesloApi.put('/admin/users', { userId, role: newRole });
    } catch (error) {
      setUsers(previousUsers);
      console.log(error);
      alert('No se pudo actualizar el rol del usuario');
    }
  };

  // siempre hay que definir los headers y las columnas,y planchar este array con valores que hagan match con lo que defina(Array<{email,name,role}>)
  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'name', headerName: t('historyPageFullName'), width: 300 },
    {
      field: 'role',
      headerName: 'Role',
      width: 300,
      renderCell: (params) => {
        return (
          <Select
            value={params.row.role}
            label="Rol"
            onChange={({ target }) => onRoleUpdate(params.row.id, target.value)}
            sx={{ width: '300px' }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="superuser">Superuser</MenuItem>
            <MenuItem value="CEO">CEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  // aunque no vaya a mostrar la columna ID,cada fila necesita un id único
  const newRows: { email: string; name: string; role: string }[] = users.map(
    (user) => ({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
  );

  return (
    <AdminLayout
      title="Users"
      subtitle="Users management"
      icon={<PeopleOutline />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={newRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};
export default UsersPage;
