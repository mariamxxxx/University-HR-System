const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const useIntegratedAuth =
	(process.env.DB_INTEGRATED_AUTH || 'true').toLowerCase() === 'true';

const dbConfig = {
	server: process.env.DB_SERVER || 'mariam',
	database: process.env.DB_NAME || 'University_HR_ManagementSystem',
	options: {
		encrypt: true,
		trustServerCertificate: true,
	},
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	},
};

if (useIntegratedAuth) {
	dbConfig.driver = 'msnodesqlv8';
	dbConfig.options.trustedConnection = true;
} else {
	dbConfig.user = process.env.DB_USER;
	dbConfig.password = process.env.DB_PASSWORD;
}

const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool
	.connect()
	.then(() => console.log('Connected to SQL Server at mariam'))
	.catch((err) => {
		console.error('Failed to connect to SQL Server', err);
		process.exit(1);
	});

app.get('/api/health', async (req, res) => {
	try {
		await poolConnect;
		const result = await pool.request().query('SELECT GETDATE() AS currentTime');
		res.json({ status: 'ok', dbTime: result.recordset[0].currentTime });
	} catch (error) {
		console.error('Health check failed', error);
		res.status(500).json({ error: 'Database connection failed' });
	}
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});