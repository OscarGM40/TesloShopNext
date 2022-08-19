import { Typography } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SHOP_CONSTANTS } from '../../common';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks/useProducts';

const ProductByGenderPage = () => {
  const router = useRouter();
  const { t } = useTranslation('home');

  const gender = (router.query.gender as string) ?? '';

  useEffect(() => {
    if (!SHOP_CONSTANTS.validGenders.includes(gender)) {
      router.push('/404');
    }
  }, [gender]);

  const { products, isLoading } = useProducts(`/products?gender=${gender}`);

  const genderCapitalized =
    gender.charAt(0).toLocaleUpperCase() + gender.slice(1);

  return (
    <ShopLayout
      title={`Teslo-Shop - ${genderCapitalized}`}
      pageDescription={t('pageDescription') + ' - ${genderCapitalized}'}
    >
      <Typography variant="h1">
        {t('pageTitle') + ` - ${genderCapitalized}`}
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        {t('pageSubtitleWithCountry', { gender })}
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};
export default ProductByGenderPage;
