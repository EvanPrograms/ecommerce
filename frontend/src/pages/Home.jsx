import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

const Home = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        color: '#fff',
      }}
    >
      {/* Background Video */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: -1,
        }}
      >
        <video
          src="./src/assets/videoplayback.mp4" // Adjust the path as necessary
          autoPlay
          loop
          muted
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Main Content */}
      <Typography variant="h2" gutterBottom>
        Welcome to Our E-Commerce Store
      </Typography>
      <Typography variant="h5" color="inherit" paragraph>
        Discover the best products curated just for you.
      </Typography>
      <Button variant="contained" color="primary" size="large" href="/products">
        Shop Now
      </Button>
    </Container>
  );
};

export default Home;
