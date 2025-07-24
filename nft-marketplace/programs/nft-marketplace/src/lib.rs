use anchor_lang::prelude::*;

declare_id!("CPjxsBYJZjVmYXo51tVHKuvZmAjgwS9doRFtB8rRXZ8v");

pub mod instructions;
pub mod states;

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
}
