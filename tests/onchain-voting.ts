import * as anchor from "@project-serum/anchor";
import { OnchainVoting, OnchainVotingProgram, VoteBank } from "../target/types/onchain_voting";
import { VoteType } from "../target/types/onchain_voting";

describe("onchain-voting", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.OnchainVoting as anchor.Program<OnchainVoting>;
  let voteBank = anchor.web3.Keypair.generate();

  it("Creating vote bank for public to vote", async () => {
    //... (no changes here)
  });

  it("Vote for GM", async () => {
    const tx = await program.rpc.gibVote(VoteType.GM, {
      accounts: {
        voteAccount: voteBank.publicKey,
        signer: program.provider.wallet.publicKey,
      },
    });
    console.log("TxHash ::", tx);

    let voteBankAccount = await program.account.voteBank.fetch(voteBank.publicKey);
    let voteBankData = voteBankAccount as unknown as VoteBank;
    console.log('voteBankData', voteBankData);
    console.log(`Total GMs :: ${voteBankData.gm}`);
    console.log(`Total GNs :: ${voteBankData.gn}`);
  });

  it("Vote for GN", async () => {
    const tx = await program.rpc.gibVote(VoteType.GN, {
      accounts: {
        voteAccount: voteBank.publicKey,
        signer: program.provider.wallet.publicKey,
      },
    });
    console.log("TxHash ::", tx);

    let voteBankAccount = await program.account.voteBank.fetch(voteBank.publicKey);
    let voteBankData = voteBankAccount as unknown as VoteBank;
    console.log('voteBankData', voteBankData);
    console.log(`Total GMs :: ${voteBankData.gm}`);
    console.log(`Total GNs :: ${voteBankData.gn}`);
  });

});
