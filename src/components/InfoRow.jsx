import { Typography, Box } from '@mui/material';

function InfoRow({ label, value }) {
  return (
    <Box mb={1}>
      <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
        <span style={{ fontWeight: 600 }}>{label}:</span> {value}
      </Typography>
    </Box>
  );
}

export default InfoRow;
