use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    signature::{Signer, read_keypair_file},
};

const RPC_URL: &str = "https://api.devnet.solana.com";

pub fn claim_airdrop() {
    // Load your wallet keypair from file
    let keypair = read_keypair_file("/Users/shrinjoysaha/Documents/My Projects/turbin3/rust/dev-wallet.json").expect("Couldn't find wallet file");
    
    // Connect to Solana devnet RPC
    let client = RpcClient::new(RPC_URL.to_string());
    
    // Request 2 SOL airdrop (2 billion lamports)
    match client.request_airdrop(&keypair.pubkey(), 2_000_000_000) {
        Ok(signature) => {
            println!("Airdrop requested successfully!");
            println!("Check the transaction here:");
            println!("https://explorer.solana.com/tx/{}?cluster=devnet", signature);
        }
        Err(err) => {
            println!("Airdrop failed: {}", err);
        }
    }
}
