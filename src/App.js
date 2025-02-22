import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import axios from 'axios';

// Define light and dark themes (unchanged)
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
  typography: {
    h4: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    h4: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
  },
});

function App() {
  const [vin, setVin] = useState('');
  const [vehicleData, setVehicleData] = useState(null);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Detect system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleVinChange = (event) => {
    setVin(event.target.value);
  };

  const decodeVin = async () => {
    setError(null);
    try {
      console.log('Decoding VIN:', vin);
      const response = await axios.post('http://localhost:5010/decode', { vin });
      console.log('API Response:', response.data);
      setVehicleData(response.data);
    } catch (error) {
      console.error('Error decoding VIN:', error);
      setError('Failed to decode VIN. Please check the VIN and try again.');
      setVehicleData(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    decodeVin();
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    console.log('Vehicle Data:', vehicleData);
  }, [vehicleData]);

  // Updated key variables with display names and their corresponding API field names
  const keyVariables = [
    { display: 'Make', apiField: 'Make' },
    { display: 'Model', apiField: 'Model' },
    { display: 'Year', apiField: 'Year' },
    { display: 'Trim', apiField: 'Trim' },
    { display: 'Drive Type', apiField: 'Drive Type' },
    { display: 'Fuel:', apiField: 'Fuel Type - Primary' }, // Changed to match API field
    { display: 'Transmission Speeds', apiField: 'Transmission Speeds' },
    { display: 'Transmission Style', apiField: 'Transmission Style' },
    { display: 'Engine Model', apiField: 'Engine Model' },
  ];

  const keyFields = vehicleData
    ? keyVariables.map((variable) => {
        const row = vehicleData.find((row) => row.Variable === variable.apiField);
        return {
          Variable: variable.display, // Use display name
          Value: row ? row.Value : 'N/A',
        };
      })
    : [];

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="lg" style={{ padding: '2rem' }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h4" gutterBottom>
              VIN Decoder
            </Typography>
          </Grid>
          <Grid item xs={1} style={{ textAlign: 'right' }}>
            <IconButton onClick={toggleTheme} color="primary">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Grid>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} style={{ marginBottom: '1rem' }}>
            <Grid item xs={9}>
              <TextField
                label="Enter VIN"
                variant="outlined"
                value={vin}
                onChange={handleVinChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Decode VIN
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && (
          <Typography color="error" style={{ marginTop: '1rem' }}>
            {error}
          </Typography>
        )}
        {vehicleData && vehicleData.length === 0 && (
          <Typography style={{ marginTop: '1rem' }}>
            No data found for this VIN.
          </Typography>
        )}
        {vehicleData && vehicleData.length > 0 && (
          <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
            <Typography variant="h5" gutterBottom>
              Vehicle Information
            </Typography>
            <Grid container spacing={2}>
              {keyFields.map((field) => (
                <Grid item xs={6} key={field.Variable}>
                  <Typography>
                    <strong>{field.Variable}</strong> {field.Value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowFullDetails(!showFullDetails)}
              style={{ marginTop: '10px' }}
            >
              {showFullDetails ? 'Hide Full Details' : 'Show Full Details'}
            </Button>
            {showFullDetails && (
              <div style={{ marginTop: '1rem' }}>
                <Typography variant="h6">Full Details</Typography>
                <Grid container spacing={2}>
                  {vehicleData.map((row, index) => (
                    <Grid item xs={6} key={index}>
                      <Typography>
                        <strong>{row.Variable}:</strong> {row.Value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;