use anchor_lang::prelude::*;
use anchor_spl::{
    token:: {Token, TransferChecked, transfer_checked},
    token_interface::{Mint, TokenAccount}
};

use crate::states::{Marketplace, Listing};

#[derive(Accounts)]
pub struct DelistNFT<'info> {
    pub nft: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        seeds = [
            b"listing",
            marketplace.key().as_ref(),
            seller.key().as_ref(),
        ],
        bump = listing.bump,
        close = seller,
    )]
    pub listing: Account<'info, Listing>,

    #[account(
        mut,
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
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl<'info> DelistNFT<'info> {
    // Transfer the NFT from seller to listing Vault
    pub fn transfer_back_nft(&mut self) -> Result<()>{
        let marketplace = self.marketplace.key();
        let seller = self.seller.key();

        let listing_seeds: &[&[u8]] = &[
            b"listing",
            marketplace.as_ref(),
            seller.as_ref(),
            &[self.listing.bump],
        ];
        let signer = &[listing_seeds];

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            TransferChecked {
                from: self.listing_token_account.to_account_info(),
                to: self.seller_token_account.to_account_info(),
                mint: self.listing.to_account_info(),
                authority: self.nft.to_account_info()
            },
            signer
        );

        transfer_checked(cpi_ctx, 1, 0)
    }
}
