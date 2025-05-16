import { Router } from 'express';
import { TestRequest, ReceiverInvoice, userInput } from '../interfaces';
import { facturar, facturar1, facturarDef } from '../alchemy/createInvoice';

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
        payment_processor: pp,
        name: name,
        rfc: rfc,
        email: email,
        postalCode: pc,
        cfdi: cfdi,
        folio: folio,
        invoiceData: result
    });

});

router.post('/facturar1', async (req:any, res:any) => {
    const {pp, input} = req.body as userInput;


    let result = await facturar1(pp, input);


    res.json({
        payment_processor: pp,
        invoiceData: result
    });

});



router.post('/facturar-def', async (req:any, res:any) => {
    
    const imProfile = req.headers['x-im-profile-id'] as string; // Invoice Manager Profile
    const {input} = req.body as userInput;

    let result = await facturarDef(imProfile, input);

    res.json({
        payment_processor: imProfile,
        invoiceData: result
    });

});






export default router;