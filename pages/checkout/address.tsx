import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import Cookies from 'js-cookie';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ShopLayout } from '../../components/layouts';
import { CartContext } from '../../context';
import { COUNTRIES } from '../../utils';

let schema = yup.object().shape({
  firstName: yup.string().required('the field is required'),
  lastName: yup.string().required('the field is required'),
  address: yup.string().required('the field is required'),
  zip: yup.string().required('the field is required'),
  city: yup.string().required('the field is required'),
  country: yup.string().required('the field is required'),
  phone: yup.string().required('the field is required'),
});

type FormModel = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};

export const getAddressFromCookies = (): FormModel => {
  return {
    firstName: Cookies.get('firstName') || '',
    lastName: Cookies.get('lastName') || '',
    address: Cookies.get('address') || '',
    address2: Cookies.get('address2') || '',
    zip: Cookies.get('zip') || '',
    city: Cookies.get('city') || '',
    country: Cookies.get('country') || '',
    phone: Cookies.get('phone') || '',
  };
};

const AddressPage = () => {
  const { t } = useTranslation('home');

  const router = useRouter();
  const { updateAddress } = useContext(CartContext);

  const [hidrated, setHidrated] = useState(false);
  useEffect(() => {
    setHidrated(true);
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormModel>({
    resolver: yupResolver(schema),
    defaultValues: { ...getAddressFromCookies() },
  });

  const onCheckCart: SubmitHandler<FormModel> = async (data) => {
    updateAddress(data);
    router.push('/checkout/summary');
  };

  return (
    <>
      {hidrated && (
        <ShopLayout title="Address" pageDescription="confirm shipping address">
          <form onSubmit={handleSubmit(onCheckCart)} noValidate>
            <Typography variant="h1" component="h1">
              {t('adressPageTitle')}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('adressPageName')}
                  variant="filled"
                  fullWidth
                  {...register('firstName', {
                    required: 'Field name required',
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('adressPageSurname')}
                  variant="filled"
                  fullWidth
                  {...register('lastName', {
                    required: 'Field surname required',
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('adressPageAddress01')}
                  variant="filled"
                  fullWidth
                  {...register('address', {
                    required: 'Field address required',
                  })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('adressPageAddress02')}
                  variant="filled"
                  fullWidth
                  {...register('address2', {})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('adressPagePostalCode')}
                  variant="filled"
                  fullWidth
                  {...register('zip', {
                    required: 'Field zip required',
                  })}
                  error={!!errors.zip}
                  helperText={errors.zip?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('adressPageCity')}
                  variant="filled"
                  fullWidth
                  {...register('city', {
                    required: 'Field city required',
                  })}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="country"
                  control={control}
                  defaultValue={''}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.country}>
                      <InputLabel>Country</InputLabel>
                      <Select {...field} label="Country">
                        {COUNTRIES.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.country?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('adressPagePhone')}
                  variant="filled"
                  fullWidth
                  {...register('phone', {
                    required: 'Field phone required',
                  })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
              >
                {t('adressPageCheckButton')}
              </Button>
            </Box>
          </form>
        </ShopLayout>
      )}
    </>
  );
};
export default AddressPage;
