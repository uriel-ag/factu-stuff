import { Router } from 'express';
import { TestRequest, ReceiverInvoice } from '../interfaces';
import { facturar } from '../alchemy/createInvoice';

const router = Router();

const epsPath = '../alchemy/';



// GET /api/invoices/test
router.get('/test', (_, res: any) => {
    res.json({ 
        message: 'Johnny B. Goode !!!'
    });
});



// POST /api/invoices/test
router.post('/test', (req: any, res: any) => {
    const { text, value } = req.body as TestRequest;
    
    if (!text || typeof value !== 'number') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    res.json({ 
        message: `The text is: ${text} and it's value is: ${value}`
    });
});


router.post('/facturar', async (req:any, res:any) => {
    const { name, rfc, pc, email, cfdi, folio, pp} = req.body as ReceiverInvoice;


    let result = await facturar(name, rfc, pc, email, cfdi, folio, pp);


    res.json({
        name: name,
        rfc: rfc,
        email: email,
        finalData: result
    });

});










export default router;