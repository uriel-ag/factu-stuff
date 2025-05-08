
import axios from 'axios';




export async function facturar3(apiKey:string, data:string, keyP:string, cerP:string): Promise<string> {
    const bgURL = 'https://dev.facturaloplus.com/api/rest/servicio/timbrarJSON3';

    try {
        const response = await axios.post(bgURL, { apikey: apiKey, jsonB64: data, keyPEM: keyP, cerPEM: cerP});

        return response.data;
    } catch (error) {
        throw new Error(`External API error: ${error instanceof Error ? error.message : String(error)}`);
    }
}




