import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_BLOCKCHAIN_URL);

export default provider;
