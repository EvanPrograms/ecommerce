import React, { useEffect, useRef } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import './home.css';

const Home = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Lock playback speed so the hero video feels consistent across browsers/builds.
    if (videoRef.current) {
      const HERO_VIDEO_PLAYBACK_RATE = 0.8;
      videoRef.current.playbackRate = HERO_VIDEO_PLAYBACK_RATE;
    }
  }, []);

  return (
    <Container maxWidth="lg" className="container">
      <Box className="background-video">
        <video
          ref={videoRef}
          src="/assets/videoplayback.mp4"
          autoPlay
          loop
          muted
          playsInline
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
