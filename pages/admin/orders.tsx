import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useTranslation from 'next-translate/useTranslation';
import useSWR from 'swr';
import { AdminLayout } from '../../components/layouts';
import { IOrder, IUser } from '../../interfaces';

type RowType = {
  email: string;
  name: string;
  total: number;
  isPaid: boolean;
  noProducts:number;
  createdAt: string
};

const OrdersPage = () => {
  const { t } = useTranslation('home');
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  if (!data && !error) return <></>;

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'name', headerName: t('historyPageFullName'), width: 250 },
    { field: 'total', headerName: 'Total', width: 150 },
    {
      field: 'isPaid',
      headerName: 'Order Paid',
      width: 150,
      renderCell: ({ row }) => {
        return row.isPaid ? (
          <Chip variant="outlined" label="Paid" color="success" />
        ) : (
          <Chip variant="outlined" label="Not Paid" color="error" />
        );
      },
    },
    {
      field: 'noProducts',
      headerName: 'No.Products',
      align: 'center',
      width: 150,
    },
    {
      field: 'check',
      headerName: 'Order Details',
      width: 150,
      renderCell: ({ row }) => {
        return <a href={`/admin/orders/${row.id}`} target="_blank" >Ver orden</a>;
      },
    },

    { field: 'createdAt', headerName: 'Created At', width: 200 },
  ];

  const newRows: RowType[] = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt!
  }));

  return (
    <AdminLayout
      title="Orders"
      subtitle="orders management"
      icon={<ConfirmationNumberOutlined />}
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
export default OrdersPage;
