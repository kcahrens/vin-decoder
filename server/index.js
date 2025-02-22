const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: 'sa',     // Replace with your SQL Server username
  password: 'YourStrong@Passw0rd', // Replace with your SQL Server password
  server: 'localhost',       // Adjust if needed (e.g., 'localhost\\SQLEXPRESS')
  database: 'vPIC',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

app.post('/decode', async (req, res) => {
  const { vin } = req.body;
  console.log('Received VIN:', vin);

  if (!vin || vin.length !== 17) {
    console.log('Invalid VIN length');
    return res.status(400).json([{ Variable: 'Error', Value: 'VIN must be 17 characters' }]);
  }

  try {
    let pool = await sql.connect(config);
    console.log('Connected to SQL Server');
    let result = await pool.request()
      .input('v', sql.VarChar(50), vin)
      .input('includePrivate', sql.Bit, 0)
      .input('year', sql.Int, null)
      .input('includeAll', sql.Bit, 1)
      .input('NoOutput', sql.Bit, 0)
      .execute('spVinDecode');

    console.log('Procedure executed, recordsets:', result.recordsets);
    const decodedData = result.recordsets[0].map(row => ({
      Variable: row.Variable,
      Value: row.Value
    }));

    if (decodedData.length === 0) {
      console.log('No data returned from spVinDecode');
      res.json([{ Variable: 'Error', Value: 'No data decoded from database' }]);
    } else {
      console.log('Sending decoded data:', decodedData);
      res.json(decodedData);
    }
  } catch (err) {
    console.error('SQL Error:', err);
    res.status(500).json([{ Variable: 'Error', Value: err.message }]);
  } finally {
    sql.close();
  }
});

app.listen(5010, () => {
  console.log('Server running on http://localhost:5010');
});