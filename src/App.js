import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [vin, setVin] = useState('');
  const [results, setResults] = useState([]);
  const [keyFields, setKeyFields] = useState([]);
  const [showFullDetails, setShowFullDetails] = useState(false);

  const handleDecode = async () => {
    try {
      const response = await axios.post('http://localhost:5010/decode', { vin });
      const data = response.data;

      if (data.length > 0 && data[0].Variable === 'Error') {
        setResults(data);
        setKeyFields([]);
      } else {
        const keyVariables = [
          'Model Year',
          'Make',
          'Model',
          'Trim',
          'Drive Type',
          'Engine Model',
          'Fuel Type - Primary'
        ];
        const keyFields = keyVariables.map(variable => ({
          Variable: variable,
          Value: data.find(row => row.Variable === variable)?.Value || 'N/A'
        }));
        setKeyFields(keyFields);
        setResults(data);
        setShowFullDetails(false);
      }
    } catch (error) {
      console.error('Error decoding VIN:', error.response ? error.response.data : error.message);
      setResults([{ Variable: 'Error', Value: error.response ? error.response.data[0].Value : 'Failed to connect to server' }]);
      setKeyFields([]);
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
      {results.length > 0 && results[0].Variable === 'Error' ? (
        <div className="error">
          <p>{results[0].Value}</p>
        </div>
      ) : (
        <>
          {keyFields.length > 0 && (
            <div className="key-fields">
              <h2>Key Details</h2>
              <ul>
                {keyFields.map(field => (
                  <li key={field.Variable}>{field.Variable}: {field.Value}</li>
                ))}
              </ul>
            </div>
          )}
          {results.length > 0 && (
            <>
              <button onClick={() => setShowFullDetails(!showFullDetails)}>
                {showFullDetails ? 'Hide Full Details' : 'Show Full Details'}
              </button>
              {showFullDetails && (
                <table>
                  <thead>
                    <tr>
                      <th>Variable</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, index) => (
                      <tr key={index}>
                        <td>{row.Variable}</td>
                        <td>{row.Value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;