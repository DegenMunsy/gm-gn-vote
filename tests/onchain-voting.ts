import * as anchor from "@project-serum/anchor";
import { OnchainVoting, OnchainVotingProgram, VoteBank } from "../target/types/onchain_voting";
import { VoteType } from "../target/types/onchain_voting";

describe("onchain-voting", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.OnchainVoting as anchor.Program<OnchainVoting>;
  let voteBank = anchor.web3.Keypair.generate();

  it("Creating vote bank for public to vote", async () => {
    const seed = new Date().getTime(); 
    const prompt = "Vote for your favorite option!";

    await program.rpc.initVoteBank(prompt, seed, {
      accounts: {
        voteAccount: voteBank.publicKey,
        signer: program.provider.wallet.publicKey,
        system_program: anchor.web3.SystemProgram.programId,
      },
      instructions: [
        await program.account.voteBank.createInstruction(voteBank),
      ],
      signers: [voteBank],
    });

    let voteBankAccount = await program.account.voteBank.fetch(voteBank.publicKey);
    let voteBankData = voteBankAccount as unknown as VoteBank;
    console.log('Initialized voteBankData', voteBankData);
    console.log(`Prompt: ${voteBankData.prompt}`);
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
    console.log('voteBankData after GM vote', voteBankData);
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
    console.log('voteBankData after GN vote', voteBankData);
    console.log(`Total GMs :: ${voteBankData.gm}`);
    console.log(`Total GNs :: ${voteBankData.gn}`);
  });

});

