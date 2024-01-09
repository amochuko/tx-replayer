import 'dotenv/config';
import { ethers } from 'ethers';
import { ENV, provider } from './utils/config';

// Collect data via form
const addressToMonitor = '0x32466Aa64E0525E731b41b884DAB8fff3B9c5448'; // Replace with address to be monitored
const eventTopics = ['AdminChanged', 'Upgraded']; // Replace with event topic from user (multiple select)

///////////////////////
// TODO: Form for user to input contractAddress
/// Contract info /////
///////////////////////
const contractAddress = {
  usdc: {
    goerli: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    mumbai: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  },
};

type FilteredEventArrType = {
  address: string;
  topics: string[];
};

async function main(argv: string[]) {
  const wallet = new ethers.Wallet(ENV.WALLET_PRIVATE_KEY, provider);

  // Filter to watch for transactions for
  const filteredEventArr: FilteredEventArrType[] = [];

  // etherscan to get contract's abi (for only verified contract)
  const etherscan = new ethers.EtherscanProvider(
    'goerli',
    ENV.ETHERSCAN_API_KEY
  );

  try {
    // get abi
    const contractABI = await etherscan.fetch('contract', {
      action: 'getabi',
      address: contractAddress.usdc.goerli,
    });

    let eventName = '';

    const filteredEvents = new ethers.Interface(contractABI).fragments.filter(
      (f) => f.type == 'event'
    );

    filteredEvents.some((fe, i) => {
      eventName = fe.format().split('(')[0]; // extract eventName only
      if (eventName == eventTopics[i]) {
        filteredEventArr.push({
          address: addressToMonitor,
          topics: [ethers.id(fe.format())],
        });
      }
    });

    // Event listener function
    const handleEvent = async (log: any) => {
      console.log('Event received:', log);

      // Extract relevant information from the event log
      const txHash = log.transactionHash;
      const originalTransaction = await provider.getTransaction(txHash);

      // Get a copy of the transaction parameters as needed
      const modifiedTransaction = { ...originalTransaction };
      // // Modify tx data (replace the 'data' field with a new value)
      modifiedTransaction.data = '0xNewDataValueHere';

      // // Sign and send the modified transaction
      // const txResponse = await wallet.sendTransaction(modifiedTransaction);

      console.log('modifiedTransaction:', modifiedTransaction);
      // console.log('Replicated Transaction:', txResponse);
    };

    console.log('Monitoring for events on address:', addressToMonitor);
    // Subscribe to events

    for (let i = 0; i < filteredEventArr.length; i++) {
      await provider.on(filteredEventArr[i], handleEvent);
    }
  } catch (err: any) {
    throw err.info;
  }

  process.stdin.resume(); // Keep the program running
}

main(process.argv).catch((err) => {
  if (err) {
    console.log('Error 101: ', err);
    process.exitCode = 1;
  }
});

process
  .on('unhandledRejection', (why) => {
    console.error(why ?? {}, `Unhandled rejection: ${(why as Error)?.message}`);
  })
  .on('SIGTERM', () => {
    console.error('SIGTERM signal received: closing HTTP server');
  })
  .on('uncaughtException', (err) => {
    console.error(err);
    process.exitCode = 1;
  });
