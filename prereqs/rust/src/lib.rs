use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::{Keypair, Signer, read_keypair_file},
    system_program,
    transaction::Transaction,
};
use std::str::FromStr;

const RPC_URL: &str = "https://api.devnet.solana.com";

pub fn enroll() {
    // Connect to devnet
    let rpc_client = RpcClient::new(RPC_URL);

    // Load your signer keypair
    let signer = read_keypair_file("/Users/shrinjoysaha/Documents/My Projects/turbin3/rust/Turbin3-wallet.json")
        .expect("Couldn't find wallet file");

    // Define program and account public keys
    let mint = Keypair::new();
    let turbin3_prereq_program = Pubkey::from_str("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM").unwrap();
    let collection = Pubkey::from_str("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2").unwrap();
    let mpl_core_program = Pubkey::from_str("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d").unwrap();
    let system_program = system_program::id();

    // Get the PDA (Program Derived Address)
    let signer_pubkey = signer.pubkey();
    let seeds = &[b"prereqs", signer_pubkey.as_ref()];
    let (prereq_pda, _bump) = Pubkey::find_program_address(seeds, &turbin3_prereq_program);

    // Instruction discriminator for submit_rs
    let data = vec![77, 124, 82, 163, 21, 133, 181, 206];

    // Define the authority PDA (adjust seed if needed)
    let (authority, _bump) = Pubkey::find_program_address(&[b"collection", signer_pubkey.as_ref()], &turbin3_prereq_program);

    let (authority, _bump2) = Pubkey::find_program_address(
        &[b"collection", collection.as_ref()],
        &turbin3_prereq_program,
    );

    // Then accounts:
    let accounts = vec![
        AccountMeta::new(signer.pubkey(), true), // user signer
        AccountMeta::new(prereq_pda, false),     // PDA account
        AccountMeta::new(mint.pubkey(), true),   // mint keypair
        AccountMeta::new(collection, false),     // collection
        AccountMeta::new_readonly(authority, false), // authority (PDA)
        AccountMeta::new_readonly(mpl_core_program, false), // mpl core program
        AccountMeta::new_readonly(system_program, false), // system program
    ];

    // Get the recent blockhash
    let blockhash = rpc_client
        .get_latest_blockhash()
        .expect("Failed to get recent blockhash");

    // Build the instruction Construct the instruction by specifying the program ID, accounts, and instruction data.
    let instruction = Instruction {
        program_id: turbin3_prereq_program,
        accounts,
        data,
    };

    // Create and sign the transaction
    let transaction = Transaction::new_signed_with_payer(
        &[instruction],
        Some(&signer.pubkey()),
        &[&signer, &mint],
        blockhash,
    );

    // Send and confirm the transaction
    let signature = rpc_client
        .send_and_confirm_transaction(&transaction)
        .expect("Failed to send transaction");

    println!("Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet", signature);
}