import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("476TFcXmPZZQ1jjz7W4hsmhvcg8pwFMBPeWPeXfxt2cD");

// Recipient address
const to = new PublicKey("22keTst3LXughQwcv7orXChRFhUwiQ3uQQH2V17T8d4t");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        let fromWallet = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);

        // Get the token account of the toWallet address, and if it does not exist, create it
        let toWallet = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);

        // Transfer the new token to the "toTokenAccount" we just created
        let signature = await transfer(connection, keypair, fromWallet.address, toWallet.address, keypair, 100);
        console.log(signature);
        
        // 5Ks3JK1BJsXUNmBQpicqyRkVQ9TfwerHgjqbWyHkE3yR5SmYtgqRfQxjYc3LKVcNqtKpYRnRSdhYi6aWFXA6qAyZ
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();