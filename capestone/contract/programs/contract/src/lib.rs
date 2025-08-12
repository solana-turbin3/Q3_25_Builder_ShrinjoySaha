use anchor_lang::prelude::*;

declare_id!("A54ckRvmajXhuzYRfP7zgv1QKiCycV15q3e3DQswVCSx");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
