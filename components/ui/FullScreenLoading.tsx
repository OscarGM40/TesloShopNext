import { Box, CircularProgress, Typography } from '@mui/material';

export const FullScreenLoading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 200px)"
      sx={{ flexDirection: 'column', sm: 'row'  }}
    >
      <Typography sx={{ mb: 2 }} variant="h2" fontWeight={200} fontSize={22}>Loading...</Typography>
      <CircularProgress thickness={3} sx={{position:'relative',left: '-5px'}}/>
    </Box>
  );
};
