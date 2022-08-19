import { Box, Button } from '@mui/material';
import { Dispatch, FC, SetStateAction } from 'react';
import { ValidSize } from '../../database/seed-data';

interface Props {
  selectedSize?: ValidSize;
  sizes: ValidSize[];
  // onSelectedSize: Dispatch<SetStateAction<ValidSize | undefined>>;
  onSelectedSize: (size:ValidSize) => void;
}
export const SizeSelector: FC<Props> = ({ selectedSize, sizes,onSelectedSize }) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button
          key={size}
          size="small"
          color={size === selectedSize ? 'primary' : 'info'}
          onClick={() => onSelectedSize(size)}
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};
