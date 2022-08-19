import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { ShopLayout } from '../components/layouts';
import { ProductList } from '../components/products';
import { FullScreenLoading } from '../components/ui';
import { useProducts } from '../hooks';

const Home: NextPage = () => {
  const { t } = useTranslation('home');
  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout
      title={'Teslo-Shop - Home'}
      pageDescription={t('pageDescription')}
    >
      <Typography variant="h1">{t('pageTitle')}</Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        {t('pageSubtitle')}
      </Typography>
      {isLoading 
        ? <FullScreenLoading />
        : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default Home;
