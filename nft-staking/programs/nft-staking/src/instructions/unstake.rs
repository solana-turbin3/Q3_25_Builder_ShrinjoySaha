use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata:: {self, mpl_token_metadata::instructions::{FreezeDelegatedAccountCpi, FreezeDelegatedAccountCpiAccounts}}
};

use crate::error::StakeError;
use crate::{StackAccount, StakeConfig, UserConfig};

#[derive(Accounts)]
pub struct UnStake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    pub user_mint_ata: Account<'info, TokenAccount>,

    #[account(
        seeds = [
            b"metadata",
            metadata_program.key().as_ref(),
            mint.key().as_ref(),
            b"edition"
        ],
        seeds::program = metadata_program.key(),
        bump,
    )]
    pub edition: Account<'info, MetadataAccount>,

    #[account(
        seeds = [b"config"],
        bump = config.bump,
    )]
    pub config: Account<'info, StakeConfig>,

    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump = user_account.bump,
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(
        mut,
        close = user,
        seeds = [b"stake", mint.key().as_ref(), config.key().as_ref()],
        bump
    )]
    pub stake_account: Account<'info, StackAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub metadata_program: Program<'info, Metadata>,
}

impl<'info>UnStake<'info> {
    pub fn unstake(&mut self)->Result<()> {
        let time_elapsed = ((Clock::get()?.unix_timestamp-self.stake_account.staked_at)/86400) as u32;
        require!(time_elapsed>self.stake_config.freeze_period, StakeError::TimeElapsedError);
        self.user_config.points += (self.stake_config.points_per_stake as u32) * time_elapsed;

        let program = self.token_program.to_account_info();
        let accounts = ThawDelegatedAccountCpiAccounts {
            mint: &self.mint.to_account_info(),
            delegate: &self.stake_account.to_account_info(),
            edition: &self.edition.to_account_info(),
            token_account: &self.user_mint_ata.to_account_info,
            token_account: &self.token_program.to_account_info()
        };
        let seeds = &[
            b"stake",
            self.mint.to_account_info().key.as_ref(),
            seeds.stake_config.to_account_info().key.as_ref(),
            &[self.stake_account.bump],
        ];
        let signer_seeds = &[&seeds[..]];
        ThawDelegatedAccountCpi::new(&self.metadata_program.to_account_info(), accounts).invoke_signed(signer_seeds);

        let account = Revoke{
            source: self.user_mint_ata.to_account_info(),
            authority: self.user.to_account_info()
        };
        let ctx = CpiContext::new(program, account);
        revoke(ctx);
        Ok(())
    }
}
