import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Marketplace } from "../target/types/marketplace";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, generateSigner, keypairIdentity, percentAmount, publicKey } from "@metaplex-foundation/umi";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BN } from "bn.js";

describe("marketplace", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.marketplace as Program<Marketplace>;

  const connection = provider.connection;
  const umi = createUmi(connection);
  const payer = provider.wallet;

  let nftMint = generateSigner(umi);
  let seller = Keypair.generate();
  let buyer = Keypair.generate();

  let seller_ata: anchor.web3.PublicKey;
  let buyer_ata: anchor.web3.PublicKey;
  let listing_ata: anchor.web3.PublicKey;

  let createWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(payer.payer.secretKey));
  const creator = createSignerFromKeypair(umi, createWallet);

  const [marketplace] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("marketplace")],
    program.programId
  )

  const [treasury] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("treasury"), marketplace.toBuffer()],
    program.programId
  )

  const [listing] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("listing"), marketplace.toBuffer(), seller.publicKey.toBuffer()],
    program.programId
  )

  before(async () => {
    umi.use(keypairIdentity(creator));
    umi.use(mplTokenMetadata());

    const balance = await connection.getBalance(payer.publicKey);
    console.log("Payer address:", payer.publicKey);
    console.log("Payer balance (SOL):", balance / LAMPORTS_PER_SOL);

    const transferSOL = async (to: anchor.web3.PublicKey, amount: number) => {
      const tx = new anchor.web3.Transaction().add(anchor.web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: to,
        lamports: LAMPORTS_PER_SOL * amount
      }));

      await provider.sendAndConfirm(tx, [provider.wallet.payer]);
    }

    await transferSOL(seller.publicKey, 1);
    await transferSOL(buyer.publicKey, 1);

    await createNft(umi, {
      mint: nftMint,
      name: "Test NFT",
      symbol: "TEST",
      uri: "https://example.com/test.json",
      sellerFeeBasisPoints: percentAmount(10),
      collection: null,
      tokenOwner: publicKey(seller.publicKey)
    }).sendAndConfirm(umi);

    seller_ata = (await getOrCreateAssociatedTokenAccount(
      connection,
      seller,
      new anchor.web3.PublicKey(nftMint.publicKey),
      seller.publicKey,      
    )).address;

    buyer_ata = (await getOrCreateAssociatedTokenAccount(
      connection,
      buyer,
      new anchor.web3.PublicKey(nftMint.publicKey),
      buyer.publicKey,      
    )).address;

    // listing_ata = (await getOrCreateAssociatedTokenAccount(
    //   connection,
    //   seller,
    //   new anchor.web3.PublicKey(nftMint.publicKey),
    //   listing,      
    // )).address;

    listing_ata = await anchor.utils.token.associatedAddress({
      mint: new anchor.web3.PublicKey(nftMint.publicKey),
      owner: listing
    })
  })

  it.skip("Initialize Marketplace!", async () => {
    const tx = await program.methods
    .initializeMarketplace(1)
    .accountsPartial({
      admin: payer.publicKey,
      marketplace,
      treasury,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .rpc();

    console.log("Your transaction signature", tx);
  });

  it("List NFT!", async () => {
    const tx = await program.methods
    .listNft(new BN(1))
    .accountsPartial({
      seller: seller.publicKey,
      sellerTokenAccount: seller_ata,
      nft: nftMint.publicKey,
      marketplace,
      systemProgram: anchor.web3.SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      listing,
      listingTokenAccount: listing_ata
    })
    .signers([seller])
    .rpc();

    console.log("Your transaction signature", tx);
  });

  it.skip("Delist NFT!", async () => {
    const tx = await program.methods
    .delistNft()
    .accountsPartial({
      seller: seller.publicKey,
      sellerTokenAccount: seller_ata,
      nft: nftMint.publicKey,
      marketplace,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      listing,
      listingTokenAccount: listing_ata
    })
    .signers([seller])
    .rpc();

    console.log("Your transaction signature", tx);
  });

  it("Purchase NFT!", async () => {
    const tx = await program.methods
    .purchaseNft()
    .accountsPartial({
      seller: seller.publicKey,
      buyer: buyer.publicKey,
      buyerTokenAccount: buyer_ata,
      nft: nftMint.publicKey,
      marketplace,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      listing,
      listingTokenAccount: listing_ata,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      treasury
    })
    .signers([buyer])
    .rpc();

    console.log("Your transaction signature", tx);
  });
});
