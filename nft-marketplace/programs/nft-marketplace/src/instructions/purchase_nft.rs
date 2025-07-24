use anchor_lang::{prelude::*, system_program::{Transfer, transfer}};
use anchor_spl::{
    associated_token::AssociatedToken,
    token:: {Token, TransferChecked, transfer_checked},
    token_interface::{Mint, TokenAccount}
};

use crate::{errors::MarketplaceError, states::{Marketplace, Listing}};

#[derive(Accounts)]
pub struct PurchaseNFT<'info> {
    pub nft: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        seeds = [
            b"listing",
            marketplace.key().as_ref(),
            seller.key().as_ref(),
        ],
        bump,
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
    pub buyer: Signer<'info>,

    #[account(
        mut,
        associated_token::mint = nft,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: InterfaceAccount<'info, TokenAccount>,

    /// CHECK: Selller Account if validated in the handler
    pub seller: AccountInfo<'info>,

    #[account(
        seeds = [b"marketplace"],
        bump= marketplace.bump
    )]
    pub marketplace: Account<'info, Marketplace>,

    #[account(
        mut,
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump
    )]
    pub treasury: SystemAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> PurchaseNFT<'info> {
    // Transfer the NFT from seller to listing Vault
    pub fn transfer_nft(&mut self) -> Result<()>{
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
                to: self.buyer_token_account.to_account_info(),
                mint: self.listing.to_account_info(),
                authority: self.nft.to_account_info()
            },
            signer
        );

        transfer_checked(cpi_ctx, 1, 0)
    }

    // Initialize SOL
    pub fn transfer_sol(&mut self) -> Result<()> {
        // Calculate the Fees
        let fees_lamports = (self.marketplace.fee_percentage as u64)
            .checked_mul(self.listing.price)
            .ok_or(MarketplaceError::MathOverFlow)?
            .checked_div(100)
            .ok_or(MarketplaceError::MathOverFlow)?;

        // Calculate the seller lamports
        let seller_lamports = self.listing.price
            .checked_sub(fees_lamports)
            .ok_or(MarketplaceError::MathOverFlow)?;

        // transfer to treasury
        let cpi_ctx = CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.buyer.to_account_info(),
                to: self.treasury.to_account_info()
            },
        );

        transfer(cpi_ctx, fees_lamports);
        
        // transfer to seller
        let cpi_ctx = CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.buyer.to_account_info(),
                to: self.seller.to_account_info()
            },
        );

        transfer(cpi_ctx, seller_lamports);

        Ok(())
    }
}
