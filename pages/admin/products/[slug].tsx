import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { AdminLayout } from '../../../components/layouts';
import { IProduct } from '../../../interfaces';
import {
  DriveFileRenameOutline,
  SaveOutlined,
  UploadOutlined,
} from '@mui/icons-material';
import { dbProducts } from '../../../database';
import * as yup from 'yup';
import {
  Box,
  Button,
  capitalize,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  ListItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ValidGender, ValidSize, ValidType } from '../../../database/seed-data';
import { tesloApi } from '../../../api';
import { ProductModel } from '../../../models';
import { useRouter } from 'next/router';

const validTypes: ValidType[] = ['shirts', 'pants', 'hoodies', 'hats'];
const validGender: ValidGender[] = ['men', 'women', 'kid', 'unisex'];
const validSizes: ValidSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

let schema = yup.object().shape({
  _id: yup.string(),
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  inStock: yup
    .number()
    .required('InStock is required')
    .positive('Must be positive')
    .integer('Must be an integer'),
  images: yup.array().of(yup.string()).required('Images are required'),
  price: yup
    .number()
    .required('Price is required')
    .positive('Must be positive'),
  sizes: yup
    .array()
    .min(1)
    .of(yup.string().required())
    .required('At least one size is required'),
  slug: yup
    .string()
    .matches(/^\S*$/, 'Slug must go without spaces')
    .required('Slug is required'),
  tags: yup.array().min(1).of(yup.string()).required('One tag is required'),
  type: yup.string().oneOf(validTypes).required('Type is required'),
  gender: yup.string().oneOf(validGender).required('Gender is required'),
});

type FormData = {
  _id?: string;
  title: string;
  description: string;
  inStock: number;
  images: string[];
  price: number;
  sizes: ValidSize[];
  slug: string;
  tags: string[];
  type: ValidType;
  gender: ValidGender;
};
interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: product,
  });

  /*   const onChangeSize = (size: ValidSize) => {
    const currentSizes = getValues('sizes');

    if (currentSizes.includes(size)) {
      setValue(
        'sizes',
        currentSizes.filter((s) => s !== size),
        { shouldValidate: true }
        );
      } else {
        setValue('sizes', [...currentSizes, size], { shouldValidate: true });
      }
    }; */
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tagInputValue, setTagInputValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      //  console.log({value, name, type})
      if (name === 'title') {
        const newSlug = value.title
          ?.trim()
          .replaceAll(' ', '_')
          .replaceAll("'", '');
        setValue('slug', newSlug ?? '', { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const onAddTag = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    const currentValue = (
      evt.target as unknown as { value: string }
    ).value.trim();

    if (!currentValue) {
      return;
    }
    if (evt.keyCode === 32) {
      if (product.tags.includes(currentValue)) {
        setTagInputValue('');
        return;
      }
      product.tags.push(currentValue);
      setValue('tags', product.tags, { shouldValidate: true });
      setTagInputValue('');
    }
  };

  const onDeleteTag = (tag: string) => {
    product.tags = product.tags.filter((t) => t !== tag);
    setValue('tags', product.tags, { shouldValidate: true });
  };

  const onFilesSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }

    try {
      for (const file of target.files) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await tesloApi.post('/admin/upload', formData);
        setValue('images', [...getValues('images'), data.message], {
          shouldValidate: true,
        });
      }
    } catch (error) {}
  };

  const onDeleteImage = (image: string) => {
    setValue(
      'images',
      getValues('images').filter((img) => img !== image),
      { shouldValidate: true }
    );
  };

  const onSubmit: SubmitHandler<FormData> = async (form) => {
    // console.log({ form });
    if (form.images.length < 2) {
      return alert('Minimo dos imágenes');
    }
    setIsSaving(true);
    try {
      const { data } = await tesloApi({
        url: '/admin/products',
        // si tengo un _id es PUT si no lo tengo es un POST
        method: form._id ? 'PUT' : 'POST',
        data: form,
      });
      if (!form._id) {
        // TODO recargar el navegador
        router.replace(`/admin/products/${form.slug}`);
      } else {
        setIsSaving(false);
      }
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title={'Producto'}
      subtitle={`Editando: ${product.title}`}
      icon={<DriveFileRenameOutline />}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: '150px' }}
            type="submit"
            disabled={isSaving}
          >
            Guardar
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Título"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  variant="filled"
                  fullWidth
                  multiline
                  sx={{ mb: 1 }}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            <TextField
              label="Inventario"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('inStock')}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />
            <TextField
              label="Precio"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('price')}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            <Divider sx={{ my: 1 }} />

            {/* Type */}
            <Controller
              name="type"
              control={control}
              // defaultValue={undefined}
              render={({ field }) => (
                <FormControl sx={{ mb: 1 }} error={!!errors.type}>
                  <FormLabel>Tipo</FormLabel>
                  <RadioGroup
                    row
                    {...field}
                    /* value={getValues('type')}
                    onChange={({ target }) =>
                      setValue('type', target.value as ValidType, {
                        shouldValidate: true,
                      })
                    } */
                  >
                    {validTypes.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio color="secondary" />}
                        label={capitalize(option)}
                      />
                    ))}
                  </RadioGroup>
                  <FormHelperText>
                    {capitalize(`${(errors.type as any)?.message || ''}`)}
                  </FormHelperText>
                </FormControl>
              )}
            />
            {/* Genero */}
            <FormControl sx={{ mb: 1 }} error={!!errors.gender}>
              <FormLabel>Género</FormLabel>
              <RadioGroup
                row
                value={getValues('gender')}
                onChange={(evt) =>
                  setValue('gender', evt.target.value as ValidGender, {
                    shouldValidate: true,
                  })
                }
              >
                {validGender.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color="secondary" />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
              <FormHelperText>
                {capitalize(`${(errors.gender as any)?.message || ''}`)}
              </FormHelperText>
            </FormControl>

            {/* Tallas */}
            {/*          <FormGroup>
              <FormLabel>Tallas</FormLabel>
              {validSizes.map((size) => (
                <FormControlLabel
                  key={size}
                  control={
                    <Checkbox checked={getValues('sizes').includes(size)} />
                  }
                  label={size}
                  onChange={() => onChangeSize(size)}
                />
              ))}
            </FormGroup> */}
            {/* Tallas con Controller */}
            <Controller
              name="sizes"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="dense" error={!!errors.sizes}>
                  <FormLabel>Sizes</FormLabel>
                  <FormGroup>
                    {validSizes.map((size) => (
                      <FormControlLabel
                        key={size}
                        label={size}
                        control={
                          <Checkbox
                            value={size}
                            checked={field.value.some((val) => val === size)}
                            onChange={({ target: { value } }, checked) => {
                              checked
                                ? field.onChange([...field.value, value])
                                : field.onChange(
                                    field.value.filter((val) => val !== value)
                                  );
                            }}
                          />
                        }
                      />
                    ))}
                  </FormGroup>
                  <FormHelperText>
                    {capitalize(`${(errors.sizes as any)?.message || ''}`)}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          {/* Tags */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Slug - URL"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('slug')}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <TextField
              label="Etiquetas"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              helperText="Presiona [spacebar] para agregar"
              value={tagInputValue}
              onChange={({ target }) => setTagInputValue(target.value)}
              onKeyDown={(event) => onAddTag(event)}
            />

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0,
                m: 0,
              }}
              component="ul"
            >
              {product.tags.map((tag) => {
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => onDeleteTag(tag)}
                    color="primary"
                    size="small"
                    sx={{ ml: 1, mt: 1 }}
                  />
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />
            {/* Imagenes */}
            <Box display="flex" flexDirection="column">
              <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
              <Button
                color="secondary"
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={() => fileInputRef.current?.click()}
              >
                Cargar imagen
              </Button>
              <input
                type="file"
                multiple
                accept="image/png,image/jpg,image/jpeg,image/gif"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={onFilesSelected}
              />

              <Chip
                label="Es necesario al 2 imagenes"
                color="error"
                variant="outlined"
                sx={{
                  mb: 3,
                  display: getValues('images').length < 2 ? 'flex' : 'none',
                }}
              />

              <Grid container spacing={2}>
                {getValues('images').map((img) => (
                  <Grid item xs={4} sm={3} key={img}>
                    <Card>
                      <CardMedia
                        component="img"
                        className="fadeIn"
                        // determinar si es una url o una ruta relativa
                        image={img}
                        alt={img}
                      />
                      <CardActions>
                        <Button
                          fullWidth
                          color="error"
                          onClick={() => onDeleteImage(img)}
                        >
                          Borrar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = '' } = query;
  let product: IProduct | null;
  if (slug === 'new') {
    const tempProduct = JSON.parse(JSON.stringify(new ProductModel()));
    delete tempProduct._id;
    tempProduct.images = ['img1.jpg', 'img2.jpg'];
    product = tempProduct;
  } else {
    product = await dbProducts.getProductBySlug(slug.toString());
  }

  if (!product) {
    return {
      redirect: {
        destination: '/admin/products',
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductAdminPage;
