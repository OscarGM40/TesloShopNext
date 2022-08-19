import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import { ShopLayout } from '../../components/layouts';
import NextLink from 'next/link';

const EmptyPage = () => {
  const { t } = useTranslation('home');
  return (
    <ShopLayout title="Empty Cart" pageDescription="No articles in Cart">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography>{t('cartEmptyDesc')}</Typography>
          <NextLink href="/" passHref >
            <Link typography="h4" color="secondary">{t('cartEmptyReturn')}</Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  );
};
export default EmptyPage;
