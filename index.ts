import express from 'express';
import cors from 'cors';
import invoicesRouter from './src/api/invoices';

const app = express();
const port = 55501;

app.use(cors());
app.use(express.json());


// Routes
app.use('/api/invoices', invoicesRouter); 



app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});