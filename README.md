# Final project ~ aka PostIt

## Description
This project was inspired as a kind of Reddit clone (called PostIt), which allows you to make a post (sans category), up vote, or down vote a post, and/or reward the author. The economics of this application isn't based on real use, but more reflects the connection of the appliation to the blockchain and your account address. This application utilizes MetaMask for identity based on your blockchain account address and your email. This application has one smart contract named PostIt.sol with the following functionality:
- User Profiles, minimal captured user identifiers
- PostIt posts, mapped by postId
- Up Voting of a Post (affects trending), limit 1 vote by a user per post, and not by the author
- Down Voting of a Post (affects trending), limit 1 vote by a user per post, and not by the author
- Tip/Reward an author with some eth
- Comments to a post - **UI Work in Progress, but functionality exists in smart contrat tests and smart contract**
- Post/comment event logging and reading by UI.

## Environement
- Developed on a Mac OS, I tried but had issues with the Ubuntu VM - it should work though.
- nodejs v9.2.1
- Truffle v5.0.0
- Ganache-CLI v6.2.5
- npm v5.5.1
- gulp and gulp-cli v2.0.1
- MetaMask v5.3.1
- React [react-create-app](https://github.com/facebook/create-react-app)

## Getting started
1. Assuming you have dependencies installed listed above in the `Environment` section. 
2. Clone application and go into the cloned project directory.
    - Run `npm install` in project root directory and in the `ui` directory.
    - You should have 4 terminal windows ready and have 2 terminal windows opened resolving to the project root directory.
    - Then have 1 terminal window opened and resolving to the `ui` directory within the project root directory.
    - And have 1 terminal to run `truffle console`.
3. In 1 of the 2 windows, you should have `ganache-cli` running by using the command `npm run ganache` in the project root directory, which will auto populate accounts with 1000 ether - you should see the below:

```
> ganache-cli --defaultBalanceEther 10000

Ganache CLI v6.2.5 (ganache-core: 2.3.3)

Available Accounts
==================
(0) 0xaa3e6ace319339eea5289490f9acf1f6b32bb7ef (~10000 ETH)
(1) 0x145034d317081d0d5ee217a51287112099c46eb0 (~10000 ETH)
(2) 0xb97e0069624f14b43d14987e4b9fa231f27ae5a2 (~10000 ETH)
(3) 0x81125a2c7613d11a349e4b818861a7661a586dbf (~10000 ETH)
(4) 0xf25229a11192c91341cd363558a4c1cb1eb694c5 (~10000 ETH)
(5) 0xd0e5769163bd409e3d54d812ff919be6a1be2da0 (~10000 ETH)
(6) 0x9987cc041c7169da9843919c0eea43b17a1c30de (~10000 ETH)
(7) 0xbaf2bf3e6ffef957df5d32d465062ec51e339c14 (~10000 ETH)
(8) 0x9a2f74e70e28a43bf87b146d77c4820c54910497 (~10000 ETH)
(9) 0x87792132f40feb80d723c8ade0c908eebf76b902 (~10000 ETH)

Private Keys
==================
(0) 0x7580c2fffc4ad04abdd6d1bd60cf1a8aca35ad3f1505bdc1cc53efb0638e92f8
(1) 0xfb97af8147c940d4d2e50d7deeef19f773b1efa43e2f056a3b2d9767d5df3503
(2) 0xd57fd5acc60d9bdbaa4bba828893ca8ccc15f99d3cf327be5657129eb9fd9a3f
(3) 0xe4d2433d1366ace051fb2792f64759dfab59a78e97a824d8b0f842f40b477c50
(4) 0x1c2c3c7ab6df8fcaa8aeaa244c7d30f8464bd07b9c36f61d8abb7f76c3c2b6ae
(5) 0xdf95429c2bba9d68e76cac79c8e5a6924b7d7c729be5b2ab74b7a09695adb0de
(6) 0xb3781cd74118e89b1d1e62ad0fc2cc28f50f8f7874be1ef7572039f4071e220b
(7) 0xe6d31ffad31c42579500e0e9ffc56db7b2aae64246800769af871437b5395e8d
(8) 0xe6d0e559729d72cc433396534316fcf2dcff570754830ad71e6472a909281f65
(9) 0x5e4a82477acb76b4aa4539d682979aa43880f5fd8d17249c7b4abd0a9458885f

HD Wallet
==================
Mnemonic:      evil inquiry favorite lesson velvet divert normal moral frown puzzle planet dilemma
Base HD Path:  m/44'/60'/0'/0/{account_index}

Gas Price
==================
20000000000

Gas Limit
==================
6721975

Listening on 127.0.0.1:8545
eth_blockNumber
eth_blockNumber
eth_blockNumber
...

```
4. In the 2nd window of 2 windows pointing to the project root directory, you can then run `truffle test` to test the smart contract(s) and verify successful tests - my output below.

```
Using network 'development'.

Compiling ./contracts/PostIt.sol...


  Contract: PostIt
    ✓ mark addresses as enrolled (243ms)
    ✓ match stored user profile (97ms)
    ✓ should be able to add a post (306ms)
    ✓ should be able to up vote a post (119ms)
    ✓ should be able to down vote a post (182ms)
    ✓ should get a post by id (122ms)
    ✓ should get all posts (51ms)
    ✓ should get all up voters (41ms)
    ✓ should get all down voters (46ms)
    ✓ should make a comment to a post (122ms)


  10 passing (1s)

```
5. Transfer some ether from a pre-funded `ganache-cli` account to your new MetaMask account pointing to your local `ganache-cli` at `http://localhost:8545` using the below command in `truffle console` add replace the `from:` and `to:` in the command:

```
web3.eth.sendTransaction({from:  "GANACHE_ACCOUNT", to: "YOUR_METAMASK_ACCOUNT", value: web3.utils.toWei("10", "ether")})

```
6. After running the smart contract tests, your `ganache` blockhain is successfully running and your MetaMask account is funded, you then can deploy the smart contracts and I have written a little `gulp` script to help.
    - This script will deploy the application's smart contracts and to copy them to the appropriate directory to the application `ui/src/contractBuilds`.
    - Run `gulp` in the project root directory to view the successful deployment and copying of the JSON files to `ui/src/contractBuilds` - example below.
    ```
    $ gulp
    [22:37:35] Using gulpfile ~/Sites/consensys-projects/final-project-partofthecollective/gulpfile.js
    [22:37:35] Starting 'default'...
    [22:37:35] Starting 'truffle-migrate'...
    [22:37:35] == Running truffle migrate command ==
    [22:37:45] Finished 'truffle-migrate' after 9.84 s
    [22:37:45] Starting 'copy-truffle-build'...
    [22:37:45] == Copying contract build files to dApp application ==
    $ truffle migrate --reset
    Compiling ./contracts/PostIt.sol...
    Writing artifacts to ./build/contracts
    
    ⚠️  Important ⚠️
    If you're using an HDWalletProvider, it must be Web3 1.0 enabled or your migration will hang.
    Try: npm install --save truffle-hdwallet-provider@web3-one
    
    
    Starting migrations...
    ======================
    > Network name:    'development'
    > Network id:      1548288992439
    > Block gas limit: 6721975
    
    
    1_initial_migration.js
    ======================
    
       Replacing 'Migrations'
       ----------------------
       > transaction hash:    0x369f2cd71ad75129c3eb7f9aa6bbe37bb074dbe22bb7392671c59587d49c9a22
    - Blocks: 0            Seconds: 0
       > Blocks: 0            Seconds: 0
       > contract address:    0x9505E02a725D703CB88DBF92e759a8d528FA5288
       > account:             0x2aF87Ec7702748D7A2F0AAc4fFAa38cc41D9bCC0
       > balance:             9999.54499194
       > gas used:            284908
       > gas price:           20 gwei
       > value sent:          0 ETH
       > total cost:          0.00569816 ETH
    
    
    - Saving migration to chain.
       > Saving migration to chain.
       > Saving artifacts
       -------------------------------------
       > Total cost:          0.00569816 ETH
    
    
    2_deploy_contracts.js
    =====================
    
       Replacing 'PostIt'
       ------------------
       > transaction hash:    0x1456dfa16918fd104b6ae08964a1107feeac0445c4375110538d595ea484c8d7
    - Blocks: 0            Seconds: 0
       > Blocks: 0            Seconds: 0
       > contract address:    0xC7fbbF5C1eb1F451a0047bf6B1b017F331816AD4
       > account:             0x2aF87Ec7702748D7A2F0AAc4fFAa38cc41D9bCC0
       > balance:             9999.4613688
       > gas used:            4139123
       > gas price:           20 gwei
       > value sent:          0 ETH
       > total cost:          0.08278246 ETH
    
    
    - Saving migration to chain.
       > Saving migration to chain.
       > Saving artifacts
       -------------------------------------
       > Total cost:          0.08278246 ETH
    
    
    Summary
    =======
    > Total deployments:   2
    > Final cost:          0.08848062 ETH
    
    [22:37:45] Finished 'copy-truffle-build' after 35 ms
    [22:37:45] Finished 'default' after 9.87 s

    ```
7. You can now start the application with the 3rd terminal window from the `ui` directory by running the command `npm start`.
8. When the dev server starts, your browser should open and be redirected to `http://localhost:3000/login`.
9. You should have a MetaMask account connected to a custom RPC pointing to `http://localhost:8545`.
10. You should be able to see your MetaMask account address displayed the login form.
    - Without a created user profile and you try to login, you should receive an error `Error: User Profle not found`.
11. First time logging in, you should now create a user profile, by clicking on the `Create an account` link in the login form.
12. Fill out the registration form and submit, then agree to the MetaMask prompt to pay the transaction fees and complete the registration.
13. You should then be redirected to the dashboard/feed to see all the posts submitted.
14. Create a post by going to `http://localhost:3000/add`.
    - Accept the transaction fees.
    - You should be redirected to the dashboard and you should see your post.
15. You should have a 2nd MetaMask account connected to `http://localhost:8545` and funds transferred, so you can test full functionality as mark up and mark down of a post you are not the author of and reward/tip an author for their post.
    - Posts are sorted by vote up votes to make it trend, there are smart contract rules that restrict an author to vote for his post.
16. Rinse and repeat post functionality.
    



## TODO
- ~~Update README.md~~
  - ~~Add steps to set up dApp~~
- ~~Document and add comment to code~~
- Post details and UI comment functionality
