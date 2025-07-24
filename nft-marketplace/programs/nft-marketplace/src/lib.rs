use anchor_lang::prelude::*;

declare_id!("CPjxsBYJZjVmYXo51tVHKuvZmAjgwS9doRFtB8rRXZ8v");

pub mod instructions;
pub mod states;
pub mod errors;

pub use instructions::*;

#[program]
pub mod marketplace {
    use super::*;

    pub fn initialize_marketplace(
        ctx: Context<InitializeMarketplace>,
        fee_percentage: u8
    ) -> Result<()> {
        ctx.accounts.initialize_marketplace(fee_percentage, ctx.bumps)
    }

    pub fn list_nft(
        ctx: Context<ListNFT>,
        price: u64,
    ) -> Result<()> {
        ctx.accounts.transfer_nft()?;
        ctx.accounts.initialize_listing(price, ctx.bumps)
    }

    pub fn delist_nft(
        ctx: Context<DelistNFT>,
    ) -> Result<()> {
        ctx.accounts.transfer_back_nft()
    }

    pub fn purchase_nft(
        ctx: Context<PurchaseNFT>,
    ) -> Result<()> {
        ctx.accounts.transfer_nft()?;
        ctx.accounts.transfer_sol()
    }
}
