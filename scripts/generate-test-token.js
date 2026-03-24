import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateToken() {
    const keyPath = path.resolve(__dirname, '../.keys/test-sa.json');
    try {
        const auth = new GoogleAuth({
            keyFile: keyPath,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        
        console.log('\n✅ Successfully generated test token!\n');
        console.log('To bypass UI login, navigate to:');
        console.log(`http://localhost:5175/?test_token=${tokenResponse.token}\n`);
    } catch (err) {
        console.error('❌ Failed to generate token:');
        console.error(err.message);
        console.error('\nPlease ensure you have placed a valid Service Account JSON key at:');
        console.error('.keys/test-sa.json');
    }
}

generateToken();
