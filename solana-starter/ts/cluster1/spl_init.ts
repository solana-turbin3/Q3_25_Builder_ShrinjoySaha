import { Keypair, Connection, Commitment, SystemProgram } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        const mint = await createMint(connection, keypair, keypair.publicKey, null, 6);
        console.log(`Mint address: ${mint}`);
        // Mint address: 476TFcXmPZZQ1jjz7W4hsmhvcg8pwFMBPeWPeXfxt2cD
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
