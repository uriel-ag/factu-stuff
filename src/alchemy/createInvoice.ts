import { invoiceInput, invoiceOutput } from '@interfaces/index';
import axios from 'axios';
import { profile } from 'console';
import { parseStringPromise } from 'xml2js';
import { promises as fs } from 'fs';

const xml2js = require('xml2js');
const path = require('path');

const testApiKey = '93edc4af66b84c938f66a56ca0596205';

const testKeyPEM = '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC2Z5w7qfYZLTMv\nTbmBscZBXHOc8MgKhfNHa5SeDPgOrFVQL/D1wToXFKJebZqnwZyODvCZxl+bzkQF\nrELH/Qna7kKqeHMigYJ2EE+6FZCciHlMuCP9fq42q7BmQoKFs171p4WKtT8lvI3s\nSCJr2gof0plSyh2Iz+lYAfTQ8K2gon04FxIcyrxGprcoqgFx+SDVmuC559/BEvCz\n3I5xFYtvTawM4/MYib+MQWJxVi3YfDWp1ETnGZNnsAYbRQez66eQaOkJV4n4EQGf\nQk8tZW8ModkBAyPqzkGS7fn538zIBOSk4+wZP9VOeyi7F6QN+KQkPV/sDVmkluoO\nmQmeyze9AgMBAAECggEAM8vEL6UZvxh4umwFy3Bh7dmE8wHkrChRZuyDrUXdgr0p\nFLYoZIDUMA2p9cqF6jEudaCEbgZIzAOMiVfbNtMB42tY/vNpLlk8ZK5JFXxeLjUK\nzOBVR/ybF+c1FjS4v6KpynQhlbvWDK84Veo97AZkbZjt9PZz4I+5oUYc8OAHTd+b\nNgL6r7SnudH/2p7rI9kMFp3h9oov+H91IguFn4SF0aVMPiLMUVUYA3QpvIA03c7A\ncY8tloFArpPkpa1yyZ7ToFx3mPsYNxyn4Ud3lx0PHJ0ulUjPBVoi+ewFLHG0Z8HS\n2CdBe+7ptS0u1e58+RsX5tlf61xGwlHzMbfqyrBrQQKBgQDp/VO5GmFSzvIlrCJg\nX3R6f+YWraYqqL4uND56Y5q+MaPE2lAEzYKkGdHotiYu3Ta6picBo8BamMQBC93r\nmiwJYBHZWih56Xb/lSdV1GGHUbNCCqhR78EabVgbNj8vWYaCRezXFjMdnG5dTYsn\nNsMtvV6/dBXxoLpJWi7YCM6QlQKBgQDHkBNQ1DNUvpSMeICd7OgUTiQKSGViMRKE\nBoARNGE5f6ZbCACY69gSDs/OdZUqq6gboCu4VNWrl0/mOZrhkVJEicDKcahDuM6R\n5q3EPcv/XhonAlvAXueDCVEaNh7iPyt0XTsDsMFsAi4xs9n6DcOvp8DLDBa9rfWW\ngJghwhJ4iQKBgQCdZR5QQQJ+ZV5VIPjuwsbjL+1iC+TehSuIgPQV97I7hcCXxhJV\naLgcEpI0a3I7y+nom6NZYwEc7+3Ilmbs+IPuuoTHI/JeL0EwovAWuAnysG5YWjrn\nAtNuJ2dAxrix7RKhxs+Nzw0LOhKzCFo2Qov/1IZLWpb4NhmZBeTExQfOEQKBgQCp\nmkbwQQhHE5mIMLmOflNXPnney1xusSn9TtD0zkF67oPhhdGMJZSC9FekLcZSd4Tt\nxZiilmbp6DUdgwOghTMX0MMqyqGovJ3C3fv8dlCzfbRYRubXfVDgysBEuI5S1kEG\nKl4HaudX9hpwX1v36k7PMJDngCSrm/bGrA+fUSMFkQKBgQDnHnYRit6FIr1IgLoA\nuWEYY/R1cVv5tWtDbHqa/I4+oS+qDA8HNNKVvm8HO8JLRU5f+ZhBQfJVhWbEybOj\nKpTeg0L+wtXEw8Qfb2we1GFJ/LaiXTzeJVttnARJXce+G0U/Ei8EthOCh4PTNawU\nYTt70e4jJwOsG6DZFT8EnM7O7Q==\n-----END PRIVATE KEY-----';

const testCerPEM = '-----BEGIN CERTIFICATE-----\nMIIFsDCCA5igAwIBAgIUMzAwMDEwMDAwMDA1MDAwMDM0MTYwDQYJKoZIhvcNAQEL\nBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFE\nTUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9y\naXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0w\nGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWxpejEOMAwGA1UEEQwFMDYzNzAxCzAJ\nBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhD\nT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3Bv\nbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMjMwNTE4MTE0MzUxWhcNMjcwNTE4MTE0MzUx\nWjCB1zEnMCUGA1UEAxMeRVNDVUVMQSBLRU1QRVIgVVJHQVRFIFNBIERFIENWMScw\nJQYDVQQpEx5FU0NVRUxBIEtFTVBFUiBVUkdBVEUgU0EgREUgQ1YxJzAlBgNVBAoT\nHkVTQ1VFTEEgS0VNUEVSIFVSR0FURSBTQSBERSBDVjElMCMGA1UELRMcRUtVOTAw\nMzE3M0M5IC8gVkFEQTgwMDkyN0RKMzEeMBwGA1UEBRMVIC8gVkFEQTgwMDkyN0hT\nUlNSTDA1MRMwEQYDVQQLEwpTdWN1cnNhbCAxMIIBIjANBgkqhkiG9w0BAQEFAAOC\nAQ8AMIIBCgKCAQEAtmecO6n2GS0zL025gbHGQVxznPDICoXzR2uUngz4DqxVUC/w\n9cE6FxSiXm2ap8Gcjg7wmcZfm85EBaxCx/0J2u5CqnhzIoGCdhBPuhWQnIh5TLgj\n/X6uNquwZkKChbNe9aeFirU/JbyN7Egia9oKH9KZUsodiM/pWAH00PCtoKJ9OBcS\nHMq8Rqa3KKoBcfkg1ZrgueffwRLws9yOcRWLb02sDOPzGIm/jEFicVYt2Hw1qdRE\n5xmTZ7AGG0UHs+unkGjpCVeJ+BEBn0JPLWVvDKHZAQMj6s5Bku35+d/MyATkpOPs\nGT/VTnsouxekDfikJD1f7A1ZpJbqDpkJnss3vQIDAQABox0wGzAMBgNVHRMBAf8E\nAjAAMAsGA1UdDwQEAwIGwDANBgkqhkiG9w0BAQsFAAOCAgEAFaUgj5PqgvJigNMg\ntrdXZnbPfVBbukAbW4OGnUhNrA7SRAAfv2BSGk16PI0nBOr7qF2mItmBnjgEwk+D\nTv8Zr7w5qp7vleC6dIsZFNJoa6ZndrE/f7KO1CYruLXr5gwEkIyGfJ9NwyIagvHH\nMszzyHiSZIA850fWtbqtythpAliJ2jF35M5pNS+YTkRB+T6L/c6m00ymN3q9lT1r\nB03YywxrLreRSFZOSrbwWfg34EJbHfbFXpCSVYdJRfiVdvHnewN0r5fUlPtR9stQ\nHyuqewzdkyb5jTTw02D2cUfL57vlPStBj7SEi3uOWvLrsiDnnCIxRMYJ2UA2ktDK\nHk+zWnsDmaeleSzonv2CHW42yXYPCvWi88oE1DJNYLNkIjua7MxAnkNZbScNw01A\n6zbLsZ3y8G6eEYnxSTRfwjd8EP4kdiHNJftm7Z4iRU7HOVh79/lRWB+gd171s3d/\nmI9kte3MRy6V8MMEMCAnMboGpaooYwgAmwclI2XZCczNWXfhaWe0ZS5PmytD/GDp\nXzkX0oEgY9K/uYo5V77NdZbGAjmyi8cE2B2ogvyaN2XfIInrZPgEffJ4AB7kFA2m\nwesdLOCh0BLD9itmCve3A1FGR4+stO2ANUoiI3w3Tv2yQSg4bjeDlJ08lXaaFCLW\n2peEXMXjQUk7fmpb5MNuOUTW6BE=\n-----END CERTIFICATE-----';

const testData64 = 'ewoJIkNvbXByb2JhbnRlIjogewoJICAgICJWZXJzaW9uIjogIjQuMCIsCgkgICAgIlNlcmllIjogIkxDLUoiLAoJICAgICJGb2xpbyI6ICJMQy0xMDAwNSIsCgkgICAgIkZlY2hhIjogIjIwMjUtMDUtMDZUMjI6MzE6MTciLAoJICAgICJOb0NlcnRpZmljYWRvIjogIjMwMDAxMDAwMDAwNTAwMDAzNDE2IiwKCSAgICAiU3ViVG90YWwiOiAiNDUwMC4wMCIsCiAgICAJIkRlc2N1ZW50byI6ICIwLjAwIiwKCSAgICAiTW9uZWRhIjogIk1YTiIsCgkgICAgIlRvdGFsIjogIjUyMjAuMDAiLAoJICAgICJUaXBvRGVDb21wcm9iYW50ZSI6ICJFIiwKCQkiRm9ybWFQYWdvIjogIjAxIiwKCSAgICAiTWV0b2RvUGFnbyI6ICJQVUUiLAoJICAgICJFeHBvcnRhY2lvbiI6IjAxIiwKCSAgICAiTHVnYXJFeHBlZGljaW9uIjogIjI2MDE1IiwKCSAgICAiQ2ZkaVJlbGFjaW9uYWRvcyI6IHsKCSAgICAgICJUaXBvUmVsYWNpb24iOiAiMDciLAoJICAgICAgIkNmZGlSZWxhY2lvbmFkbyI6IFsKCSAgICAgICAgIkZGRkZGRkZGLTA1NTktNDE5RS1COUZELUQwNkZGNEVGOUNBQiIKCSAgICAgICAgXQoJICAgIH0sCgkgICAgIkVtaXNvciI6CgkgICAgewoJICAgICAgICAiUmZjIjogIkVLVTkwMDMxNzNDOSIsCgkgICAgICAgICJOb21icmUiOiAiRVNDVUVMQSBLRU1QRVIgVVJHQVRFIiwKCSAgICAgICAgIlJlZ2ltZW5GaXNjYWwiOiAiNjAxIgoJICAgIH0sCgkgICAgIlJlY2VwdG9yIjoKCSAgICB7CgkgICAgICAgICJSZmMiOiAiWEFYWDAxMDEwMTAwMCIsCgkgICAgICAgICJOb21icmUiOiAiWEVOT04gSU5EVVNUUklBTCBBUlRJQ0xFUyIsCgkgICAgICAgICJVc29DRkRJIjogIkcwMyIsCgkgICAgICAgICJEb21pY2lsaW9GaXNjYWxSZWNlcHRvciI6IjI2MDE1IiwKCSAgICAgICAgIlJlZ2ltZW5GaXNjYWxSZWNlcHRvciI6IjYxNiIsCgkgICAgICAgICJVc29DRkRJIjogIlMwMSIKCSAgICB9LAoJICAgICJDb25jZXB0b3MiOgoJICAgIFsKCSAgICAgICAgewoJICAgICAgICAgICAgIkNsYXZlUHJvZFNlcnYiOiAiODQxMTE1MDYiLAoJICAgICAgICAgICAgIkNhbnRpZGFkIjogIjEuMCIsCgkgICAgICAgICAgICAiQ2xhdmVVbmlkYWQiOiAiQUNUIiwKICAgICAgICAJCSJVbmlkYWQiOiAiQWN0aXZpZGFkIiwKCSAgICAgICAgICAgICJEZXNjcmlwY2lvbiI6ICJOT1RBIERFIENSRURJVE8gUE9SIEFQTElDQUNJT04gREUgQU5USUNJUE8gRkFDVDogNjc5MTUxIiwKCSAgICAgICAgICAgICJWYWxvclVuaXRhcmlvIjogIjQ1MDAuMDAiLAoJICAgICAgICAgICAgIkltcG9ydGUiOiAiNDUwMC4wMCIsCgkgICAgICAgICAgICAiRGVzY3VlbnRvIjogIjAuMDAiLAoJICAgICAgICAgICAgIk9iamV0b0ltcCI6IjAyIiwKCSAgICAgICAgICAgICJJbXB1ZXN0b3MiOgoJICAgICAgICAgICAgewoJICAgICAgICAgICAgICAgICJUcmFzbGFkb3MiOgoJICAgICAgICAgICAgICAgIFsKCSAgICAgICAgICAgICAgICAgICAgewoJICAgICAgICAgICAgICAgICAgICAgICAgIkJhc2UiOiAiNDUwMC4wMCIsCgkgICAgICAgICAgICAgICAgICAgICAgICAiSW1wdWVzdG8iOiAiMDAyIiwKCSAgICAgICAgICAgICAgICAgICAgICAgICJUaXBvRmFjdG9yIjogIlRhc2EiLAoJICAgICAgICAgICAgICAgICAgICAgICAgIlRhc2FPQ3VvdGEiOiAiMC4xNjAwMDAiLAoJICAgICAgICAgICAgICAgICAgICAgICAgIkltcG9ydGUiOiAiNzIwLjAwIgoJICAgICAgICAgICAgICAgICAgICB9CgkgICAgICAgICAgICAgICAgXQoJICAgICAgICAgICAgfQoJICAgICAgICB9CgkgICAgXSwKCSAgICAiSW1wdWVzdG9zIjoKCSAgICB7CgkgICAgICAgICJUb3RhbEltcHVlc3Rvc1RyYXNsYWRhZG9zIjogIjcyMC4wMCIsCgkgICAgICAgICJUcmFzbGFkb3MiOgoJICAgICAgICBbCgkgICAgICAgICAgICB7CgkgICAgICAgICAgICAJIkJhc2UiOiI0NTAwLjAwIiwKCSAgICAgICAgICAgICAgICAiSW1wdWVzdG8iOiAiMDAyIiwKCSAgICAgICAgICAgICAgICAiVGlwb0ZhY3RvciI6ICJUYXNhIiwKCSAgICAgICAgICAgICAgICAiVGFzYU9DdW90YSI6ICIwLjE2MDAwMCIsCgkgICAgICAgICAgICAgICAgIkltcG9ydGUiOiAiNzIwLjAwIgoJICAgICAgICAgICAgfQoJICAgICAgICBdCgkgICAgfQoJfSwKCSJDYW1wb3NQREYiOiB7CiAgICAidGlwb0NvbXByb2JhbnRlIjogIk5PVEEgREUgQ1LDiURJVE8iLAogICAgIkNvbWVudGFyaW9zIjogIk5pbmd1bm8iCiAgfSwKICAibG9nbyIgOiAiIgp9';




/* ============================================================
    Takes a JSON obj and converts it to a b64 string.
   ========================================================= */
function obj2B64(baseObj: object){
    let objJSON = JSON.stringify(baseObj, null, 4);

    objJSON = objJSON
    .replace(/Á/g, 'Á')
    .replace(/á/g, 'á')
    .replace(/É/g, 'É')
    .replace(/é/g, 'é')
    .replace(/Í/g, 'Í')
    .replace(/í/g, 'í')
    .replace(/Ó/g, 'Ó')
    .replace(/ó/g, 'ó')
    .replace(/Ú/g, 'Ú')
    .replace(/ú/g, 'ú')
    .replace(/Ñ/g, 'Ñ')
    .replace(/ñ/g, 'ñ')
    .replace(/Ü/g, 'Ü')
    .replace(/ü/g, 'ü')
    .replace(/"/g, '"') 
    .replace(/\//g, '\\/');

    //let objB64 = Buffer.from(objJSON).toString('base64');
    let objB64 = Buffer.from(objJSON.replace(/\r\n/g, '\n'), 'utf8').toString('base64');

    //console.log(`---------- Original Obj:\n     ${baseObj}\n---------- JSON Obj:\n     ${objJSON}\n---------- Obj. in Base64:\n     ${objB64}`);
    return objB64;
}


function str2XML(baseStr: string) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(baseStr, 'text/xml');
        const parseError = xmlDoc.getElementsByTagName('parsererror');
        if (parseError.length > 0) {
            throw new Error ('Invalid XML');
        }
        return xmlDoc;
    } catch (e) {
        console.log(`Message: ${e}`);
        return ({
            error: "There was a problem trying to parse the XML",
            message: e
        });
    } 
}




/* ============================================================
    Sometimes the data is returned into a string that contains 
    a XML; this function takes that string and works it returning
    a JSON object with the data. 
   ========================================================= */
async function strXML2JSON(baseStr: string) {
    try {
        const jsonData = JSON.parse(baseStr);
        const xmlString = jsonData.XML.replace(/\\"/g, '"').replace(/\\\//g, '/');

        const parser = new xml2js.Parser({
            explicitArray: false,
            ignoreAttrs: false,
            tagNameProcessors: [(name: string) => name.replace('cfdi:', '')]
        });
        
        const xmlJson = await parser.parseStringPromise(xmlString);

        const result = {
            comprobante: xmlJson.Comprobante,
            metadata: {
                UUID: jsonData.UUID,
                FechaTimbrado: jsonData.FechaTimbrado,
                NoCertificado: jsonData.NoCertificado,
                NoCertificadoSAT: jsonData.NoCertificadoSAT,
                Sello: jsonData.Sello,
                SelloSAT: jsonData.SelloSAT,
                CodigoQR: jsonData.CodigoQR,
                CadenaOriginal: jsonData.CadenaOriginal,
                CadenaOriginalSAT: jsonData.CadenaOriginalSAT
            }
        };

        return result;
    } catch (e) {
        console.error(`Error in strXML2JSON:`, e);
        return {
            error: "Failed to process invoice data",
            message: e instanceof Error ? e.message : String(e)
        };
    }
}










async function facturaloTimbrarJSON30(apiKey:string, data:string, keyP:string, cerP:string): Promise<any> {
    const bgURL = 'https://dev.facturaloplus.com/api/rest/servicio/timbrarJSON3';

    try {
        const response = await axios.post(bgURL, { apikey: apiKey, jsonB64: data, keyPEM: keyP, cerPEM: cerP});
        console.log('I got this:\n' + response.data);
        return response.data;
    } catch (error) {
        throw new Error(`External API error: ${error instanceof Error ? error.message : String(error)}`);
    }
}


async function facturaloTimbrarJSON3HC(apiKey:string, data:string, keyP:string, cerP:string): Promise<any> {
    const bgURL = 'https://dev.facturaloplus.com/api/rest/servicio/timbrarJSON3';

    try {
        const response = await axios.post(bgURL, { apikey: apiKey, jsonB64: data, keyPEM: keyP, cerPEM: cerP});
        console.log(`I got this ${response.status}`);

        let rawData = response.data.data;
        console.log(`rawData: ${rawData}`);
        let jsonData = JSON.parse(rawData);
        console.log(`jsonData: ${jsonData}`);
        let finalData = await parseStringPromise(jsonData.XML, {
            explicitArray: false,
            ignoreAttrs: false,
            mergeAttrs: true,
            
            tagNameProcessors: [
                name => name.replace(/^(cfdi:|tfd:)/, '')
            ]
        });

        let finalJSON: invoiceOutput = {
            version: finalData.Comprobante.Version,
            xmlsn_xsi: finalData.Comprobante['xmlns:xsi'],
            serie: finalData.Comprobante.Serie,
            folio: finalData.Comprobante.Folio,
            fecha: finalData.Comprobante.Fecha,
            formaPago: finalData.Comprobante.FormaPago,
            noCertificado: finalData.Comprobante.NoCertificado,
            certificado: finalData.Comprobante.Certificado,
            subTotal: finalData.Comprobante.Subtotal,
            descuento: finalData.Comprobante.Descuento,
            moneda: finalData.Comprobante.Moneda,
            total: finalData.Comprobante.Total,
            tipoComprobante: finalData.Comprobante.TipoComprobante,
            exportacion: finalData.Comprobante.Exportacion,
            metodoPago: finalData.Comprobante.MetodoPago,
            lugarExpedicion: finalData.Comprobante.LugarExpedicion,
            xsi_schemaLocation: finalData.Comprobante['xsi:schemaLocation'],
            sello: finalData.Comprobante.Sello,
            cfdiRelacionados: finalData.Comprobante.CfdiRelacionados,
            emisor: finalData.Comprobante.Emisor,
            receptor: finalData.Comprobante.Receptor,
            conceptos: finalData.Comprobante.Conceptos,
            impuestos: finalData.Comprobante.Impuestos,
            complemento: finalData.Comprobante.Complemento
        }



        return finalJSON;
    } catch (error) {
        throw new Error(`External API error: ${error instanceof Error ? error.message : String(error)}`);
    }
}




/* ============================================================
    Inner function that takes the Invoice Manager profile
    and extracts the data.
   ========================================================= */
async function breakDownIMProfile(imProfile: string) {

    // Status:
    //  -1 = error
    //  0 = Success but nothing found
    //  1 = Success, something found

    // Change this to red the DB instead of a local file:

    try { 
        const fullPath = path.join(__dirname, '../data/imProfile.json');
        const data = await fs.readFile(fullPath, 'utf8');
        const profileList = JSON.parse(data).profiles;
        const userFound = profileList.find( (imp: any) => imp.name === imProfile );
        
        return( userFound? {
                    status: 1,
                    id: userFound.id,
                    name: userFound.name,
                    im: userFound.im,
                    apiKey: userFound.apiKey,
                    keyPEM: userFound.keyPEM,
                    cerPEM: userFound.cerPEM
                } : {
                    status: 0,
                    profileList: JSON.stringify(JSON.parse(data).profiles[0]),
                    error: "User not found"
                }
        );

    } catch (e: any) {
        return ({
            status: -1,
            error: "Error procesing the data of IMProfile",
            message: e.message
        })
    }

    return ({
        status: -1,
        error: "you shouldn't get this"
    })
}



/* ============================================================
    This function takes the introduced data and runs it by the
    Facturalo endpoint to get the correct data.
   ========================================================= */
async function facturaloTimbrarJSONFull(apiKey: string, keyP: string, cerP: string, fullInput: any): Promise <any> {

    const bgURL = 'https://dev.facturaloplus.com/api/rest/servicio/timbrarJSON3';
    const facturaloInput = {
        Version: fullInput.version,
                Serie: fullInput.serie,
                Folio: fullInput.folio,
                Fecha: fullInput.fecha,
                NoCertificado: fullInput.noCertificado,
                SubTotal: fullInput.subTotal,
                Descuento: fullInput.descuento,
                Moneda: fullInput.moneda,
                Total: fullInput.total,
                TipoDeComprobante: fullInput.tipoDeComprobante,
                FormaPago: fullInput.formaPago,
                MetodoPago: fullInput.metodoPago,
                Exportacion: fullInput.exportacion,
                LugarExpedicion: fullInput.lugarExpedicion,
                Emisor: fullInput.emisor,
                Receptor: fullInput.receptor,
                CfdiRelacionados: fullInput.cfdiRelacionados,
                Conceptos: fullInput.conceptos,
                Impuestos: fullInput.impuestos,
                CamposPDF: fullInput.camposPDF,
                Logo: fullInput.logo
    };
    const facturaloInputB64 = obj2B64({ Comprobante: facturaloInput});

    try {
        const response = await axios.post(bgURL, { apikey: apiKey, jsonB64: facturaloInputB64, keyPEM: keyP, cerPEM: cerP});
        console.log('Data found:\n' + JSON.stringify(response.data));
        return response.data;
    } catch (e) {
        return ({
            error: "Error calling the base endpoint",
            message: e
        });
    }
}



/* ============================================================
    Takes a JSON obj and converts it to a b64 string.
   ========================================================= */
export async function facturarDef(imProfile: string, input: invoiceInput) {

    // Validate the token is valid
    console.log(`imProfile = ${imProfile}`);
    let profileFound: any = await breakDownIMProfile(imProfile);
    console.log(`profile = ${JSON.stringify(profileFound)}`);
    if (profileFound.status == 1) {
            switch(profileFound.im) {
                case 'facturalo':
                    console.log('Using Facturalo system');

                    console.log(`\n Object Found: \n ${JSON.stringify(profileFound)} \n\n`);

                    let factura: any = await facturaloTimbrarJSONFull(profileFound.apiKey, profileFound.keyPEM, profileFound.cerPEM, input);

                    if (!("error" in factura)) {
                        console.log(' NO ERROR -----------------------');
                        if (("data" in factura)) {
                            factura.dataJSON = await strXML2JSON(factura.data);
                            
                            switch(factura.code) {
                                case('307'):
                                    factura.condicion = '02';
                                    break;
                                case('200'):
                                    factura.condicion = '01';
                                    break;
                                default:
                                    factura.condicion = '00';
                            }

                        }
                    }

                    return factura;
                    break;
                case 'codi':
                    console.log('Using Codi system');
                    return ({message: "You're using Codi"});
                    break;
                case '...':
                    console.log('...');
                    return ({message: "You're using ..."});
                    break;
                default:
                    console.log('Unknown invoice managing system');
                    return ({message: "You're using an unknown invoice manager"});
            }

    } else {
        return ({message: 'Invalid user', details: profileFound});
    }

    return ("Something weird happened, you shouldn´t get this message");
}










//export async function facturar1( {pp, input}: {pp:string, input:invoiceInput}) {
export async function facturar1( pp: string, input: invoiceInput) {
    
    
    switch (pp) {
        case 'facturalo':
            console.log(`\n U're using Facturalo`);

            /*let facturaloInput: invoiceInput = {
                serie: input.serie,
                folio: input.folio,
                fecha: input.fecha,
                noCertificado: input.noCertificado,
                subTotal: input.subTotal,
                descuento: input.descuento,
                moneda: input.moneda,
                total: input.total,
                tipoComprobante: input.tipoComprobante,
                formaPago: input.formaPago,
                metodoPago: input.metodoPago,
                exportacion: input.exportacion,
                lugarExpedicion: input.lugarExpedicion,
                emisor: input.emisor,
                receptor: input.receptor,
                cfdiRelacionados: input.cfdiRelacionados,
                conceptos: input.conceptos,
                impuestos: input.impuestos
            }*/

            let facturaloInput = {
                Version: input.version,
                Serie: input.serie,
                Folio: input.folio,
                Fecha: input.fecha,
                NoCertificado: input.noCertificado,
                SubTotal: input.subTotal,
                Descuento: input.descuento,
                Moneda: input.moneda,
                Total: input.total,
                TipoDeComprobante: input.tipoDeComprobante,
                FormaPago: input.formaPago,
                MetodoPago: input.metodoPago,
                Exportacion: input.exportacion,
                LugarExpedicion: input.lugarExpedicion,
                Emisor: input.emisor,
                Receptor: input.receptor,
                CfdiRelacionados: input.cfdiRelacionados,
                Conceptos: input.conceptos,
                Impuestos: input.impuestos,
                CamposPDF: input.camposPDF,
                Logo: input.logo
            };

            let data64 = obj2B64({ Comprobante: facturaloInput});
            console.log(`This is the JSON obj: \n   ${JSON.stringify({Comprobante: facturaloInput})}`);
            console.log(`This is the base64 code: \n   ${data64}`);
            return data64;
            //facturaloTimbrarJSON3(testApiKey, data64, testKeyPEM, testCerPEM);


            break;
        case 'codi':
            console.log(`\n U're using Codi`);
            break;
        default:
            console.log(`\n U're using a unknown value`);
            break;
    }

}










export async function facturar( name:string, rfc:string, pc:string, email:string, cfdi:string, folio:string, pp:string){
    switch (pp) {
        case 'facturalo':
            //return facturaloTimbrarJSON3(testApiKey, testData64, testKeyPEM, testCerPEM);
            break;
        case 'codi':
            return ('This is for Codi');
            break;
        case 'facturalohc':
            return facturaloTimbrarJSON30(testApiKey, testData64, testKeyPEM, testCerPEM);
            break;
        default:
            return ('This is an unknown value');
    }
}




