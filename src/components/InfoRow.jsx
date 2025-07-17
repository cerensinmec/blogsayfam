import { Typography, Box } from '@mui/material';

function InfoRow({ label, value }) {
  return (
    <Box mb={1}>
      <Typography variant="body1">
        <span style={{ fontWeight: 600 }}>{label}:</span> {value}
      </Typography>
    </Box>
  );
}

export default InfoRow;
