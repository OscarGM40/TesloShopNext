import { Box, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { FC } from 'react';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { getAllProducts, getProductsByTerm } from '../../database/dbProducts';
import { IProduct } from '../../interfaces';

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}
const SearchByQueryPage: FC<Props> = ({ products, foundProducts, query }) => {
  const { t } = useTranslation('home');

  return (
    <ShopLayout
      title={'Teslo-Shop - Search'}
      pageDescription={t('searchPageDescription')}
    >
      <Typography variant="h1">{t('searchPageTitle')}</Typography>
      {foundProducts ? (
        <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">
          {t('searchPageSubtitle', { query })}
        </Typography>
      ) : (
        <Box display="flex">
          <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">
            {t('searchPageSubtitleStandard', { query })}
          </Typography>
        </Box>
      )}
      <ProductList products={products} />
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.params?.query as string;

  if (!query) {
    return {
      redirect: {
        destination: '/',
        permanent: true, // true ??
      },
    };
  }

  let products = await getProductsByTerm(query);
  const foundProducts = products.length > 0;

  if (!foundProducts) {
    products = await getAllProducts();
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};
export default SearchByQueryPage;
