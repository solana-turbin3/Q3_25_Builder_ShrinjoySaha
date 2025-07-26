use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token:: {Token, TransferChecked, transfer_checked},
    token_interface::{Mint, TokenAccount}
};

use crate::states::{Marketplace, Listing};

#[derive(Accounts)]
pub struct ListNFT<'info> {
    pub nft: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = seller,
        space = 8 + Listing::INIT_SPACE,
        seeds = [
            b"listing",
            marketplace.key().as_ref(),
            seller.key().as_ref(),
        ],
        bump
    )]
    pub listing: Account<'info, Listing>,

    #[account(
        init,
        payer = seller,
        associated_token::mint = nft,
        associated_token::authority = listing
    )]
    pub listing_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(
        mut,
        associated_token::mint = nft,
        associated_token::authority = seller,
    )]
    pub seller_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        seeds = [b"marketplace"],
        bump= marketplace.bump
    )]
    pub marketplace: Account<'info, Marketplace>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> ListNFT<'info> {
    // Transfer the NFT from seller to listing Vault
    pub fn transfer_nft(&mut self) -> Result<()>{
        let cpi_ctx = CpiContext::new(
            self.token_program.to_account_info(),
            TransferChecked {
                from: self.seller_token_account.to_account_info(),
                to: self.listing_token_account.to_account_info(),
                mint: self.nft.to_account_info(),
                authority: self.seller.to_account_info()
            }
        );

        transfer_checked(cpi_ctx, 1, 0)
    }

    // Initialize the listing
    pub fn initialize_listing(&mut self, price: u64, bumps: ListNFTBumps) -> Result<()> {
        self.listing.set_inner(Listing {
            seller: self.seller.key(),
            mint: self.nft.key(),
            price,
            bump: bumps.listing,
        });
        Ok(())
    }
}
