
export interface TestRequest {
    text: string;
    value: string;
}



export interface ReceiverInvoice {
    name: string;
    rfc: string;
    pc: string;
    email: string;
    cfdi: string;
    folio: string;
    pp: string;
}



export interface invoiceInput {
    version?: string;
    serie: string;
    folio: string;
    fecha: string;
    noCertificado: string;
    subTotal: string;
    descuento: string;
    moneda: string;
    total: string;
    tipoComprobante: string;
    formaPago: string;
    metodoPago: string;
    exportacion: string;
    lugarExpedicion: string;
    emisor: {
        rfc: string;
        nombre: string;
        regimenFiscal: string;
    };
    receptor: {
        rfc: string;
        nombre: string;
        usoCFDI: string;
        domicilioFiscal: string;
        regimenFiscal: string;
    };
    cfdiRelacionados: {
        tipoRelacion: string;
        cfdis: string[];
    };
    conceptos: {
        claveProdServ: string;
        descripcion: string;
        claveUnidad: string;
        unidad: string;
        cantidad: string;
        valorUnitario: string;
        importe: string;
        descuento: string;
        objetoImp: string;
        impuestos: {
            traslados: {
                base: string;
                impuesto: string;
                tipoFactor: string;
                tasaOCuota: string;
                importe: string;
            }[];
        };
    }[];
    impuestos?: {
        totalImpuestosTrasladados: string;
        traslados?: {
            base: string;
            impuesto: string;
            tipoFactor: string;
            tasaOCuota: string;
            importe: string;
        }[];
    };
    camposPDF?:{
        tipoComprobante: string;
        comentarios: string;
    };
    logo?: string;
}



export interface invoiceOutput {
    version?: string;
    xmlsn_xsi?: string;
    serie: string;
    folio: string;
    fecha: string;
    formaPago: string;
    noCertificado: string;
    certificado: string;
    subTotal: string;
    descuento: string;
    moneda: string;
    total: string;
    tipoComprobante: string;
    exportacion: string;
    metodoPago: string;
    lugarExpedicion: string;
    xsi_schemaLocation?: string;
    sello: string;
    cfdiRelacionados: {
        tipoRelacion: string;
        uuid: string[];
    };
    emisor: {
        rfc: string;
        nombre: string;
        regimenFiscal: string;
    };
    receptor: {
        rfc: string;
        nombre: string;
        domicilioFiscal: string;
        regimenFiscal: string;
        usoCFDI: string;
    };
    conceptos: {
        claveProdServ: string;
        descripcion: string;
        claveUnidad: string;
        unidad: string;
        cantidad: string;
        valorUnitario: string;
        importe: string;
        descuento: string;
        objetoImp: string;
        impuestos: {
            traslados: {
                base: string;
                impuesto: string;
                tipoFactor: string;
                tasaOCuota: string;
                importe: string;
            }[];
        };
    }[];
    impuestos?: {
        totalImpuestosTrasladados: string;
        traslados?: {
            base: string;
            impuesto: string;
            tipoFactor: string;
            tasaOCuota: string;
            importe: string;
        }[];
    };
    complemento: {
        timbreFiscalDigital: {
            xsi_schemaLocation?: string;
            version: string;
            uuid: string;
            fechaTimbrado: string;
            rfcProvCertifc: string;
            selloCFD: string;
            noCertificadoSAT: string;
            selloSAT: string;
            xmlns_tfd?: string;
            xmlns_xsi?: string;
        };
    };
}