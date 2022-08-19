import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import { AuthLayout } from '../../components/layouts';
import NextLink from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { ErrorOutline } from '@mui/icons-material';
import { validations } from '../../utils';
import { tesloApi } from '../../api';
import { AuthContext } from '../../context';
import { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';


type FormRegisterModel = {
  name: string;
  email: string;
  password: string;
};
const RegisterPage = () => {
  const { t } = useTranslation('home');
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormRegisterModel>();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onRegisterUser: SubmitHandler<FormRegisterModel> = async ({
    email,
    password,
    name,
  }) => {
    setShowError(false);

    const { hasError, message } = await registerUser(name, email, password);

    if (hasError) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setErrorMessage(message!);
      }, 3000);
      return;
    }
    // redirigir al home
/*       const destination = router.query.p?.toString() || '/'
    router.replace(destination);  */
    await signIn('credentials', { email, password });
  };

  return (
    <AuthLayout title="Register">
      <form onSubmit={handleSubmit(onRegisterUser)} noValidate>
        <Box sx={{ width: '350px', padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                {t('registerPageTitle')}
              </Typography>
              <Chip
                label="No se pudo registrar al usuario"
                color="error"
                icon={<ErrorOutline />}
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Fullname"
                variant="filled"
                fullWidth
                {...register('name', {
                  required: 'Field name required',
                  minLength: { value: 3, message: 'minimum 3 chars' },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
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
                Register
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink
                href={
                  router.query.p
                    ? `/auth/login?p=${router.query.p}`
                    : '/auth/login'
                }
                passHref
              >
                <Link underline="always"> {t('registerPageRedirect')}</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};
export default RegisterPage;

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
