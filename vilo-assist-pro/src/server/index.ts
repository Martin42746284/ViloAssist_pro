import express from 'express';
import { json, urlencoded } from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use(urlencoded({ extended: true }));

// Define API routes here
app.get('/api', (req, res) => {
    res.send('Hello from the Express server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});