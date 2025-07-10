use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked}
};

use crate::state::Escrow; // Refers to the current program/package

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Make<'info> {

    #[account(mut)]
    pub maker: Signer<'info>, // Signer is a type in Anchor.

    #[account(
        mint::token_program = token_program // mint::token_program = token_program. This is a constraint specific to a Mint account.
    )]
    pub mint_a: InterfaceAccount<'info, Mint>,

    #[account(
        mint::token_program = token_program
    )]
    pub mint_b: InterfaceAccount<'info, Mint>,

    #[account(
        mut, // since, maker is depositing it, he already have the ata for these token
        associated_token::mint = mint_a,
        associated_token::authority = maker,
        associated_token::token_program = token_program
    )]
    pub maker_ata_a: InterfaceAccount<'info, TokenAccount>, // The source account from which Token A will be withdrawn.


    // b"escrow" => fixed size array of raw bytes &[u8; 6]
    // .as_ref() converts it to a byte slice (&[u8]) for use in PDA seeds
    // seed is a u64 passed in by the user
    // .to_le_bytes() converts it to a [u8; 8] array in little-endian
    #[account(
        init,
        payer = maker,
        seeds = [b"escrow", maker.key().as_ref(), seed.to_le_bytes().as_ref()], // for safty, we are associating with maker key | seed will get from client side
        space = 8 + Escrow::INIT_SPACE,
        bump,
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        init,
        payer = maker,
        associated_token::mint = mint_a,
        associated_token::authority = escrow,
        associated_token::token_program = token_program
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,// The Interface<'info, TokenInterface> line tells Anchor: This is a token program we will use for all token logic.
    /*
        Why use Interface instead of Program?
        Interface<'info, TokenInterface>
        
        Allows support for both:
        ✅ Original SPL Token Program
        ✅ Newer Token-2022 Program (more features)
     */
    pub system_program: Program<'info, System>,
    /* When you use #[account(init)], Anchor automatically looks for a field named system_program and associated_token_program to perform the necessary lamport allocations and rent exemption steps via the system program. */
}

impl<'info> Make<'info> {
    // self refers to the Make struct. That struct holds all your accounts (like maker, mint_a, escrow, etc.), so you can access them as self.maker, self.escrow, and so on.

    pub fn init_escrow(&mut self, seed: u64, receive: u64, bumps: &MakeBumps) -> Result<()> { // MakeBumps beacuse we are inside Make

        // set_inner(...) replaces the uninitialized state with the actual data.
        self.escrow.set_inner(Escrow{
            seed,
            maker: self.maker.key(),
            mint_a: self.mint_a.key(),
            mint_b: self.mint_b.key(),
            receive,
            bump: bumps.escrow,
        });

        Ok(())
    }

    pub fn deposit(&mut self, deposit: u64) -> Result<()> {

        // TransferChecked is a struct
        // maker’s token account into the vault
        // to_account_info returns AccountInfo struct
        let transfer_accounts = TransferChecked {
            from: self.maker_ata_a.to_account_info(),
            mint: self.mint_a.to_account_info(),
            to: self.vault.to_account_info(),
            authority: self.maker.to_account_info(),
        };

        // You’re creating a CPI context that tells Anchor: “I want to call the SPL Token Program with these accounts and settings.”
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), transfer_accounts);

        transfer_checked(cpi_ctx, deposit, self.mint_a.decimals)?;

        Ok(())
    }

}
