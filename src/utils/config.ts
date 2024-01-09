import 'dotenv/config';
import { ethers } from 'ethers';

export const ENV = {
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
  MAINNET_RPC_URL: process.env.MAINNET_RPC_URL,
  GOERLI_RPC_URL: process.env.GOERLI_RPC_URL,
  POLYGON_RPC_URL: process.env.POLYGON_RPC_URL,
  MUMBAI_RPC_URL: process.env.MUMBAI_RPC_URL,
  WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  COINMARKETCAP_LASTEST_LISTINGS_URL:
    process.env.COINMARKETCAP_LASTEST_LISTINGS_URL,
  COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY,
};

// RPC node URL
export const RPC_URL = {
  mumbai: ENV.MUMBAI_RPC_URL,
  goerli: ENV.GOERLI_RPC_URL,
  mainnet: ENV.MAINNET_RPC_URL,
  polygon: ENV.POLYGON_RPC_URL,
};

export const provider = new ethers.JsonRpcProvider(RPC_URL.goerli);
