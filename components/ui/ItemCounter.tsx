import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { FC } from 'react';

interface Props {
  handleQuantity: (quantity: number) => void;
  currentValue: number;
}
export const ItemCounter: FC<Props> = ({ handleQuantity, currentValue }) => {
  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={() => handleQuantity(-1)}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}>
        {currentValue}
      </Typography>
      <IconButton onClick={() => handleQuantity(+1)}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
