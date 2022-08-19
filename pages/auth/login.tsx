import { ErrorOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { getSession, signIn, getProviders } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';

type FormModel = {
  email: string;
  password: string;
};
const LoginPage = () => {
  const { t } = useTranslation('home');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormModel>();
  const [showError, setShowError] = useState(false);

  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  const onLoginUser: SubmitHandler<FormModel> = async ({ email, password }) => {
    setShowError(false);

    /*     const isValidLogin = await loginUser(email, password);

    if (!isValidLogin) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }
    // redirigir al home
    const destination = router.query.p?.toString() || '/'
    router.replace(destination); */
    await signIn('credentials', { email, password });
  };

  return (
    <AuthLayout title="Login">
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: '350px', padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                {t('loginPageTitle')}
              </Typography>
              <Chip
                label="Usuario/contraseña no válidos"
                color="error"
                icon={<ErrorOutline />}
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="filled"
                fullWidth
                {...register('email', {
                  required: 'Field email required',
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="filled"
                fullWidth
                {...register('password', {
                  required: 'Field password required',
                  minLength: { value: 6, message: 'minimum 6 chars' },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
                disabled={showError}
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink
                href={
                  router.query.p
                    ? `/auth/register?p=${router.query.p}`
                    : '/auth/register'
                }
                passHref
              >
                <Link underline="always"> {t('loginPageRedirect')}</Link>
              </NextLink>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              flexDirection="column"
              justifyContent="end"
            >
              <Divider sx={{ width: '100%', mb: 2 }} />
              {Object.values(providers)
                .filter((p: any) => p.id !== 'credentials')
                .map((provider: any) => {
                  return (
                    <Button
                      key={provider.id}
                      variant="outlined"
                      color="primary"
                      sx={{ mb: 1 }}
                      onClick={() => signIn(provider.id)}
                      fullWidth
                    >
                      {provider.name}
                    </Button>
                  );
                })}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};
export default LoginPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ req: ctx.req });
  // console.log({session});
  const { p = '/' } = ctx.query as { p: string };

  if (session) {
    return {
      redirect: {
        destination: p,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
