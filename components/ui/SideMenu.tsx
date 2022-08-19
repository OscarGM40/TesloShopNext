import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import {
  AccountCircleOutlined,
  AdminPanelSettings,
  CategoryOutlined,
  ConfirmationNumberOutlined,
  DashboardOutlined,
  EscalatorWarningOutlined,
  FemaleOutlined,
  LoginOutlined,
  MaleOutlined,
  SearchOutlined,
  VpnKeyOutlined,
} from '@mui/icons-material';
import useTranslation from 'next-translate/useTranslation';
import { KeyboardEvent, useContext, useMemo, useState } from 'react';
import { AuthContext, UIContext } from '../../context';
import { useRouter } from 'next/router';

export const SideMenu = () => {
  const router = useRouter();
  const { t } = useTranslation('home');
  const { isMenuOpen, toggleSideMenu } = useContext(UIContext);

  const { isLoggedIn, user, logoutUser } = useContext(AuthContext);
  const isAdmin = useMemo(() => user && user.role === 'admin', [user]);

  const [searchTerm, setSearchTerm] = useState('');

  const navigateTo = (url: string) => {
    router.push(url);
    toggleSideMenu();
  };

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    navigateTo(`/search/${searchTerm}`);
  };

  const onKeyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearchTerm();
    }
  };

  return (
    <Drawer
      open={isMenuOpen}
      onClose={toggleSideMenu}
      anchor="right"
      sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              autoFocus
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={onKeyUpHandler}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={onSearchTerm}>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          {isLoggedIn && (
            <>
              <ListItem button>
                <ListItemIcon>
                  <AccountCircleOutlined />
                </ListItemIcon>
                <ListItemText primary={t('sideMenuProfile')} />
              </ListItem>
              <ListItem button onClick={() => navigateTo('/orders/history')}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={t('sideMenuMyOrders')} />
              </ListItem>
            </>
          )}

          <ListItem
            button
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/men')}
          >
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={t('navbarMen')} />
          </ListItem>

          <ListItem
            button
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/women')}
          >
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={t('navbarWomen')} />
          </ListItem>

          <ListItem
            button
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/kid')}
          >
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={t('navbarKids')} />
          </ListItem>
          {isLoggedIn ? (
            <ListItem button onClick={logoutUser}>
              <ListItemIcon>
                <LoginOutlined />
              </ListItemIcon>
              <ListItemText primary={t('sideMenuGoOut')} />
            </ListItem>
          ) : (
            <ListItem
              button
              onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}
            >
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText primary={t('sideMenuSignIn')} />
            </ListItem>
          )}

          {/* Admin */}
          {isAdmin && (
            <>
              <Divider />
              <ListSubheader>Admin Panel</ListSubheader>

              <ListItem button onClick={() => navigateTo('/admin')}>
                <ListItemIcon>
                  <DashboardOutlined />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem button onClick={() => navigateTo('/admin/products')}>
                <ListItemIcon>
                  <CategoryOutlined />
                </ListItemIcon>
                <ListItemText primary={t('sideMenuProducts')} />
              </ListItem>

              <ListItem button onClick={() => navigateTo('/admin/orders')}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={t('sideMenuOrders')} />
              </ListItem>

              <ListItem button onClick={() => navigateTo('/admin/users')}>
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={t('sideMenuUsers')} />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};
