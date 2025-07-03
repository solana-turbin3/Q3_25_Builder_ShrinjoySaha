import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../turbin3-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {

    let tx = createNft(umi, {
        mint,
        name: "Jeff Rug - Lets Go",
        uri: "https://devnet.irys.xyz/FqXcDR9qrUSDD7MM5wJLXPwWMwQnA7GoyFFtNgbvufA4",
        sellerFeeBasisPoints: percentAmount(5),
        symbol: "JR",
    });

    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)
    console.log("Mint Address: ", mint.publicKey);

    // https://explorer.solana.com/tx/5wVrtLMWDagUjwE9U4gjYgRX1KWsX1f9MPM66pryztfguV1uQfji2X6GSdW3appJgqgFmKa3nt3GfgjRYmCFUBPn?cluster=devnet
    // Mint Address:  6PQJWf2UWCz1WQH2foc2Nc7JK58FTumByh6by7tdfP3t
})();