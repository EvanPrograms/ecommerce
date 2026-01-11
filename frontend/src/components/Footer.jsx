import React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 3,
        px: 2,
        borderTop: '1px solid rgba(0,0,0,0.08)',
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        Portfolio project. Built with React (Vite) + MUI, Node/Express, Apollo GraphQL, PostgreSQL,
        and Stripe.
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
        <Link href="https://evanprograms.com" target="_blank" rel="noreferrer">
          EvanPrograms.com
        </Link>
        {' • '}
        <Link href="https://github.com/EvanPrograms" target="_blank" rel="noreferrer">
          GitHub
        </Link>
        {' • '}
        <Link href="https://linkedin.com/in/EvanPrograms" target="_blank" rel="noreferrer">
          LinkedIn
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
