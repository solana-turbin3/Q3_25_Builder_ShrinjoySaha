use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Marketplace {
    pub admin: Pubkey, // who manage the marketplace
    pub fee_percentage: u8, // marketplace fees
    pub bump: u8, // derived ump for the market place
    pub treasury_bump: u8 // where the fee goes
}
