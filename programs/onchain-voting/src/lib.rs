// Import the required prelude from the anchor_lang crate
use anchor_lang::prelude::*;
// Declare a unique identifier for this program
declare_id!("");

// Define the main module for the on-chain voting program
#[program]
pub mod onchain_voting {
    // Import items from the parent module
    use super::*;

    // Function to initialize the vote bank
    pub fn init_vote_bank(ctx: Context<InitVote>) -> Result<()> {
        // Set the vote account to be open for public voting
        ctx.accounts.vote_account.is_open_to_vote = true;
        // Return an empty result
        Ok(())
    }

    // Function to handle a user's vote
    pub fn gib_vote(ctx: Context<GibVote>, vote_type: VoteType) -> Result<()> {
        // Match the vote type (GM or GN) and increment the corresponding counter
        match vote_type {
            VoteType::GM => {
                // Log a message indicating a vote for GM
                msg!("Voted for GM 🤝");
                // Increment the GM vote counter by 1
                ctx.accounts.vote_account.gm += 1;
            }
            VoteType::GN => {
                // Log a message indicating a vote for GN
                msg!("Voted for GN 🤞");
                // Increment the GN vote counter by 1
                ctx.accounts.vote_account.gn += 1;
            }
        };
        // Return an empty result
        Ok(())
    }
}

// Define the accounts struct for initializing the vote bank
#[derive(Accounts)]
pub struct InitVote<'info> {
    // Define the vote account with the necessary attributes
    #[account(
        init, 
        payer = signer, 
        space = 8 + 1 + 8 + 8, 
    )] 
    pub vote_account: Account<'info, VoteBank>,
    // Define the signer account with mutable attribute
    #[account(mut)]
    pub signer: Signer<'info>,
    // Define the system program account
    pub system_program: Program<'info, System>,
}

// Define the VoteBank account struct
#[account]
pub struct VoteBank {
    // Flag to indicate if the account is open for voting
    pub is_open_to_vote: bool,
    // Counter for GM votes
    pub gm: u64,
    // Counter for GN votes
    pub gn: u64,
}

// Define the accounts struct for handling a user's vote
#[derive(Accounts)]
pub struct GibVote<'info> {
    // Define the mutable vote account
    #[account(mut)] 
    pub vote_account: Account<'info, VoteBank>,
    // Define the signer account
    pub signer: Signer<'info>,
}

// Define an enumeration for the two vote types (GM and GN)
#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum VoteType {
    GM,
    GN,
}
