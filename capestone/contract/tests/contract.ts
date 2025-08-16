import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NftProgram } from "../target/types/nft_program";
import {
  getAssociatedTokenAddressSync,
  getAccount,
} from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("nft_program", () => {
  // Configure the client
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NftProgram as Program<NftProgram>;
  const payer = provider.wallet as anchor.Wallet;

  it("creates a single NFT", async () => {
    const id = new anchor.BN(1);
    const [mint] = PublicKey.findProgramAddressSync(
      [Buffer.from("mint"), id.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const tokenAccount = getAssociatedTokenAddressSync(
      mint,
      payer.publicKey
    );

    // Metadata PDA
    const [metadata] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        anchor.utils.token.METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      anchor.utils.token.METADATA_PROGRAM_ID
    );

    const [masterEdition] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        anchor.utils.token.METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      anchor.utils.token.METADATA_PROGRAM_ID
    );

    await program.methods
      .createSingleNft(
        id,
        "TestNFT",
        "TST",
        "https://example.com/nft.json",
        0.1,
        new anchor.BN(1)
      )
      .accounts({
        authority: payer.publicKey,
        payer: payer.publicKey,
        mint,
        tokenAccount,
        associatedTokenProgram:
          anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        metadataProgram: anchor.utils.token.METADATA_PROGRAM_ID,
        masterEditionAccount: masterEdition,
        nftMetadata: metadata,
      })
      .rpc();

    // Confirm token account exists and has 1 token
    const tokenAcc = await getAccount(provider.connection, tokenAccount);
    expect(Number(tokenAcc.amount)).to.equal(1);
  });

  it("mints NFT into a collection", async () => {
    const idCollection = new anchor.BN(99);
    const idNft = new anchor.BN(1);

    const [mint] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("mint"),
        idCollection.toArrayLike(Buffer, "le", 8),
        idNft.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const tokenAccount = getAssociatedTokenAddressSync(
      mint,
      payer.publicKey
    );

    const [metadata] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        anchor.utils.token.METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      anchor.utils.token.METADATA_PROGRAM_ID
    );

    const [masterEdition] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        anchor.utils.token.METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      anchor.utils.token.METADATA_PROGRAM_ID
    );

    // Mock collection PDA (in real case you’d create a collection NFT first)
    const collection = anchor.web3.Keypair.generate();

    await program.methods
      .mintToCollection(
        idCollection,
        idNft,
        "CollectionNFT",
        "COLL",
        "https://example.com/collection.json",
        0.5,
        new anchor.BN(1)
      )
      .accounts({
        authority: payer.publicKey,
        payer: payer.publicKey,
        mint,
        tokenAccount,
        associatedTokenProgram:
          anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        metadataProgram: anchor.utils.token.METADATA_PROGRAM_ID,
        masterEditionAccount: masterEdition,
        nftMetadata: metadata,
        collection: collection.publicKey, // just passing random key for test
      })
      .rpc();

    // Confirm token account exists and has 1 token
    const tokenAcc = await getAccount(provider.connection, tokenAccount);
    expect(Number(tokenAcc.amount)).to.equal(1);
  });
});
