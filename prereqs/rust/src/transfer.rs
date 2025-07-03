use solana_client::rpc_client::RpcClient;
use solana_program::{pubkey::Pubkey, system_instruction::transfer};
use std::str::FromStr;
use solana_sdk::{
    message::Message,
    signature::{Keypair, Signer, read_keypair_file},
    transaction::Transaction,
};

const RPC_URL: &str = "https://api.devnet.solana.com";

pub fn send_sol_to_turbin3() {
    // Load your devnet keypair from file
    let keypair = read_keypair_file("/Users/shrinjoysaha/Documents/My Projects/turbin3/rust/dev-wallet.json")
        .expect("Couldn't find wallet file");

    // Sign a message with the keypair
    let message_bytes = b"I verify my Solana Keypair!";
    let signature = keypair.sign_message(message_bytes);
    println!("Message signed successfully: {:?}", signature);

    // Define Turbin3 recipient address
    let to_pubkey = Pubkey::from_str("6EZGcXM15JiC5EBGA87mLJWUBfbCaDTzKJBcmQRrKW5d")
        .expect("Invalid destination pubkey");

    // Connect to devnet
    let rpc_client = RpcClient::new(RPC_URL);

    // Fetch recent blockhash
    let recent_blockhash = rpc_client
        .get_latest_blockhash()
        .expect("Failed to get recent blockhash");

    // Create transfer transaction (sending 0.001 SOL = 1_000_000 lamports)
    let transaction = Transaction::new_signed_with_payer(
        &[transfer(&keypair.pubkey(), &to_pubkey, 1_000_000)],
        Some(&keypair.pubkey()),
        &[&keypair],
        recent_blockhash,
    );

    // Send and confirm the transaction
    let signature = rpc_client
        .send_and_confirm_transaction(&transaction)
        .expect("Failed to send transaction");

    println!("Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet", signature);
}
