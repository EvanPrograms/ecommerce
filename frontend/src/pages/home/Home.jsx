import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import './home.css';

const Home = () => {
  return (
    <Container maxWidth="lg" className="container">
      <Box className="background-video">
        <video
          src="/assets/videoplayback.mp4"
          autoPlay
          loop
          muted
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
          }}
        />
        <Box className="background-overlay" />
      </Box>

      <Typography variant="h2" gutterBottom className="heading">
        Passion Chocolates
      </Typography>
      <Typography variant="h5" color="inherit" className="subheading">
        Discover the best chocolate
      </Typography>
      <Button variant="contained" className="button" size="large" href="/shop">
        Shop Now
      </Button>
    </Container>
  );
};

export default Home;
