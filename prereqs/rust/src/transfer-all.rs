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

    // Define Turbin3 recipient address
    let to_pubkey = Pubkey::from_str("6EZGcXM15JiC5EBGA87mLJWUBfbCaDTzKJBcmQRrKW5d")
        .expect("Invalid destination pubkey");

    // Connect to devnet
    let rpc_client = RpcClient::new(RPC_URL);

    // Fetch recent blockhash
    let recent_blockhash = rpc_client
        .get_latest_blockhash()
        .expect("Failed to get recent blockhash");

    // Get current balance
    let balance = rpc_client
        .get_balance(&keypair.pubkey())
        .expect("Failed to get balance");

    // Build a mock transaction to calculate fee
    let message = Message::new_with_blockhash(
        &[transfer(&keypair.pubkey(), &to_pubkey, balance)],
        Some(&keypair.pubkey()),
        &recent_blockhash,
    );

    // Estimate transaction fee
    let fee = rpc_client
        .get_fee_for_message(&message)
        .expect("Failed to get fee calculator");

    // Create final transaction with balance minus fee
        let transaction = Transaction::new_signed_with_payer(
        &[transfer(&keypair.pubkey(), &to_pubkey, balance - fee)],
        Some(&keypair.pubkey()),
        &vec![&keypair],
        recent_blockhash,
    );

    // Send transaction and verify
    let signature = rpc_client
        .send_and_confirm_transaction(&transaction)
        .expect("Failed to send final transaction");


    println!("Success! Entire balance transferred: https://explorer.solana.com/tx/{}/?cluster=devnet", signature);

    
}
