import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [vin, setVin] = useState('');
  const [results, setResults] = useState([]);

  const handleDecode = async () => {
    try {
      const response = await axios.post('http://localhost:5010/decode', { vin });
      setResults(response.data);
    } catch (error) {
      console.error('Error decoding VIN:', error);
      setResults([{ Variable: 'Error', Value: 'Failed to decode VIN' }]);
    }
  };

  return (
    <div className="App">
      <h1>VIN Decoder</h1>
      <div>
        <input
          type="text"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Enter VIN (e.g., 5TFMA5EC7PX011688)"
          style={{ width: '300px', padding: '5px' }}
        />
        <button onClick={handleDecode} style={{ marginLeft: '10px', padding: '5px 10px' }}>
          Decode VIN
        </button>
      </div>
      {results.length > 0 && (
        <table style={{ marginTop: '20px', borderCollapse: 'collapse', width: '80%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>Variable</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '5px' }}>{row.Variable}</td>
                <td style={{ border: '1px solid black', padding: '5px' }}>{row.Value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;