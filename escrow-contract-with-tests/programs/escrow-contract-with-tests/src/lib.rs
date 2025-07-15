#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;

pub mod constants;
pub mod state;
pub mod instructions;

use constants::*;
use instructions::*;
use state::*;

declare_id!("H9jeCtJaWeqtpCeFcoXwAfkbtkoPYpFRw64PvHreyVwZ");
