import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

// umi.use(irysUploader());
umi.use(irysUploader({address: "https://devnet.irys.xyz/"}));
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        const imagePath = await readFile('/Users/shrinjoysaha/Documents/My Projects/turbin3/Q3_25_Builder_ShrinjoySaha/solana-starter/ts/cluster1/assets/jeff.png');
        
        //2. Convert image to generic file.
        const imageGenericPath = createGenericFile(imagePath, "jeff.png", {contentType: "image/png"});

        //3. Upload image
        const [myUri] = await umi.uploader.upload([imageGenericPath]);

        console.log("Your image URI: ", myUri);
        // https://gateway.irys.xyz/HBVDjCrkeTWMhVVbztTiPqVZwE919mQ8XjTSkttiA9cB
        // https://gateway.irys.xyz/FE8RXgjYZaHchFFHnkCvB7ZcrhcjoUEwrdxrUwY57VyR
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
