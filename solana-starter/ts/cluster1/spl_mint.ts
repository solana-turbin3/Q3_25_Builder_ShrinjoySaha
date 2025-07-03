import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("476TFcXmPZZQ1jjz7W4hsmhvcg8pwFMBPeWPeXfxt2cD");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(connection, keypair, mint, ata.address, keypair.publicKey, 1n * token_decimals); // n suffix: “This is a BigInt, not a regular Number.”
        console.log(`Your mint txid: ${mintTx}`);

        // Your ata is: 6zwRb7DgHp73UheGjw3iKUnEdAxzHWz7BEiVBVhDqV6t
        // Your mint txid: 2uiVV96zHv8BdmGyzJUCS4M3EPBpXD3voaybB9S4jH1ZPkVZqBHFYMoCnMb1hRa9eJA1hLPgfpL9YL5VM3TnFWmz
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
