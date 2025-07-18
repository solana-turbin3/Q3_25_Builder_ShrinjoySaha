use anchor_lang::prelude::*;


declare_id!("8X9ion7wCT5iJDtT7GEmEr6UrkJ6Ewi66tkJzVXXnMZZ");


#[program]
pub mod nft_staking {
   use super::*;


   pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
       msg!("Greetings from: {:?}", ctx.program_id);
       Ok(())
   }
}


#[derive(Accounts)]
pub struct Initialize {}
