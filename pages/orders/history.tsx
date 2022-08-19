import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useTranslation from 'next-translate/useTranslation';
import NextLink from 'next/link';
import { ShopLayout } from '../../components/layouts';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

/* const rows = [
  { id: 1, paid: true, fullname: 'Fernando Herrera' },
  { id: 2, paid: false, fullname: 'Melissa Flores' },
  { id: 3, paid: true, fullname: 'Hernando Vallejo' },
  { id: 4, paid: false, fullname: 'Emin Reyes' },
  { id: 5, paid: false, fullname: 'Eduardo Rios' },
  { id: 6, paid: true, fullname: 'Natalia Herrera' },
]; */

interface Props {
  orders: IOrder[];
}
const HistoryPage: NextPage<Props> = ({ orders }) => {
  const { t } = useTranslation('home');

  const newRows = orders.map(({ _id, isPaid, shippingAddress }, idx) => ({
    id: ++idx,
    paid: isPaid,
    fullname: shippingAddress.firstName + ' ' + shippingAddress.lastName,
    orderId: _id,
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: t('historyPageFullName'), width: 300 },
    {
      field: 'paid',
      headerName: t('historyPagePaid'),
      description: t('historyPagePaidDesc'),
      width: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridValueGetterParams) => {
        return params.row.paid ? (
          <Chip
            color="success"
            label={t('historyPagePaid')}
            variant="outlined"
          />
        ) : (
          <Chip
            color="error"
            label={t('historyPageNoPaid')}
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'link',
      headerName: t('historyPageLink'),
      description: t('historyPageLinkDesc'),
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      width: 400,
      renderCell: (params: GridValueGetterParams) => {
        return (
          <NextLink href={`/orders/${params.row.orderId}`} passHref>
            <Link>
              <Chip
                color="secondary"
                label={t('historyPageLinkButton') + params.row.orderId}
                variant="outlined"
                sx={{ cursor: 'pointer' }}
              />
            </Link>
          </NextLink>
        );
      },
    },
  ];

  return (
    <ShopLayout
      title={'History or orders'}
      pageDescription={'History or orders'}
    >
      <Typography variant="h1" component="h1">
        {t('historyPageTitle')}
      </Typography>
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
    </ShopLayout>
  );
};
export default HistoryPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session: any = await getSession({ req: ctx.req });
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false,
      },
    };
  }
  // si tengo una session quiero el id
  const orders = await dbOrders.getOrdersByUser(session.user._id);

  return {
    props: {
      orders,
    },
  };
};
