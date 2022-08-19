import {
  ClearOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import NextLink from 'next/link';
import setLanguage from 'next-translate/setLanguage';
import { useRouter } from 'next/router';
import { CartContext, UIContext } from '../../context';
import { KeyboardEvent, useContext, useState } from 'react';

export const Navbar = () => {
  const { t } = useTranslation('home');
  const { asPath, push } = useRouter();
  const { toggleSideMenu } = useContext(UIContext);
  const { numberOfItems } = useContext(CartContext)
  const activeLink = (href: string) => (href === asPath ? 'primary' : 'info');

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
  };

  const onKeyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearchTerm();
    }
  };

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

        <Box
          sx={{
            display: isSearchVisible ? 'none' : { xs: 'none', md: 'block' },
          }}
          className="fadeIn"
        >
          <NextLink href="/category/men" passHref>
            <Link>
              <Button color={activeLink('/category/men')}>
                {t('navbarMen')}
              </Button>
            </Link>
          </NextLink>

          <NextLink href="/category/women" passHref>
            <Link>
              <Button color={activeLink('/category/women')}>
                {t('navbarWomen')}
              </Button>
            </Link>
          </NextLink>

          <NextLink href="/category/kid" passHref>
            <Link>
              <Button color={activeLink('/category/kid')}>
                {t('navbarKids')}
              </Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />

        {/* Desktop */}
        {isSearchVisible ? (
          <Input
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            className="fadeIn"
            autoFocus
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={onKeyUpHandler}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setIsSearchVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            onClick={() => setIsSearchVisible(true)}
            className="fadeIn"
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            <SearchOutlined />
          </IconButton>
        )}

        {/* small devices */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={numberOfItems} max={9} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>
        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
