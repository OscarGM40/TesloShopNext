import {
  AppBar, Box,
  Button, Link,
  Toolbar,
  Typography
} from '@mui/material';
import setLanguage from 'next-translate/setLanguage';
import useTranslation from 'next-translate/useTranslation';
import NextLink from 'next/link';
import { useContext } from 'react';
import { UIContext } from '../../context';

export const AdminNavbar = () => {
  const { t } = useTranslation('home');

  const { toggleSideMenu } = useContext(UIContext);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display="flex" alignItems="center">
            <Typography variant="h6">Teslo |</Typography>
            <Typography variant="h6" fontWeight={200} sx={{ ml: 0.5 }}>
              Shop
            </Typography>
          </Link>
        </NextLink>
        <Button
          sx={{ ml: 3 }}
          variant="outlined"
          color="secondary"
          onClick={async () => await setLanguage('en')}
        >
          ENG
        </Button>
        <Button
          sx={{ ml: 1 }}
          variant="outlined"
          color="error"
          onClick={async () => await setLanguage('es')}
        >
          ESP
        </Button>
        <Box flex={1} />

        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
