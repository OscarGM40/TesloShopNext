import { AddOutlined, ConfirmationNumberOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Link } from '@mui/material';
import Grid from '@mui/material/Grid';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useTranslation from 'next-translate/useTranslation';
import useSWR from 'swr';
import { AdminLayout } from '../../components/layouts';
import { ValidGender, ValidSize, ValidType } from '../../database/seed-data';
import { IProduct } from '../../interfaces';
import { format } from '../../utils/currency';
import NextLink from 'next/link';

type RowType = {
  img: string;
  title: string;
  gender: ValidGender;
  type: ValidType;
  inStock: number;
  price: number;
  sizes: ValidSize[];
  slug: string;
};

const ProductsPage = () => {
  const { t } = useTranslation('home');
  const { data, error } = useSWR<IProduct[]>('/api/admin/products');

  if (!data && !error) return <></>;

  const columns: GridColDef[] = [
    {
      field: 'img',
      headerName: 'Imagen',
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <a
            href={`/product/${row.slug}`}
            target="_blank"
            rel="noferrrer noopener nofollow"
          >
            <CardMedia
              alt={row.title}
              component="img"
              className="fadeIn"
              image={row.img}
            />
          </a>
        );
      },
    },
    {
      field: 'title',
      headerName: 'Producto',
      width: 250,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <NextLink href={`/admin/products/${row.slug}`} passHref>
            <Link underline="always">{row.title}</Link>
          </NextLink>
        );
      },
    },
    { field: 'gender', headerName: 'Género', width: 250 },
    { field: 'type', headerName: 'Tipo', width: 200 },
    { field: 'inStock', headerName: 'Inventario', width: 200 },
    {
      field: 'price',
      headerName: 'Precio',
      width: 200,
      renderCell: ({ value }: GridValueGetterParams) => format(value),
    },
    { field: 'sizes', headerName: 'Tallas', width: 250 },
  ];

  const newRows: RowType[] = data!.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes,
    slug: product.slug,
  }));

  return (
    <AdminLayout
      title={`Products (${data?.length})`}
      subtitle="Products management"
      icon={<ConfirmationNumberOutlined />}
    >
      <Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/products/new"
        >
          Crear producto
        </Button>
      </Box>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={newRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};
export default ProductsPage;
