#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;

mod state;
mod instructions;

use instruction::*;

declare_id!("H9jeCtJaWeqtpCeFcoXwAfkbtkoPYpFRw64PvHreyVwZ");

#[program]
pub mod escrow_contract_with_tests {
    use super::*;

    pub fn make(ctx: Context<Make>, seed: u64, receive: u64, deposit: u64) -> Result<()> {
        ctx.accounts.init_escrow(seed, receive, &ctx.bumps)?;
        ctx.accounts.deposit(deposit)?;
        Ok(())
    }

    pub fn take(ctx: Context<Take>) -> Result<()> {
        ctx.accounts.deposit()?;
        ctx.accounts.withdraw_and_close_vault()?;
        Ok(())
    }


}

#[derive(Accounts)]
pub struct Initialize {}
