import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateToken() {
    // Priority: 1. Env Var, 2. Default local path
    const keyPath = process.env.TEST_SA_KEY_PATH || path.resolve(__dirname, '../.keys/test-sa.json');
    const port = process.env.VITE_PORT || 5175;

    try {
        const auth = new GoogleAuth({
            keyFile: keyPath,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        
        console.log('\n✅ Successfully generated test token!\n');
        console.log('To bypass UI login, navigate to:');
        console.log(`http://localhost:${port}/?test_token=${tokenResponse.token}\n`);
    } catch (err) {
        console.error('❌ Failed to generate token:');
        console.error(err.message);
        console.error('\nPlease ensure you have placed a valid Service Account JSON key at:');
        console.error('.keys/test-sa.json');
    }
}

generateToken();
