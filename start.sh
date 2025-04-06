#!/bin/bash

# Navigate to blockchain folder and start Hardhat node
cd blockchain
# npx hardhat clean
npx hardhat node &
HARDHAT_PID=$!

# Wait a few seconds for the node to spin up
sleep 5

# Deploy contracts to local node
npx hardhat run scripts/deploy.js --network localhost

sleep 2

# Copy ABI to backend
echo "Copying artifact to backend/assets..."
mkdir -p ../backend/assets
cp artifacts/contracts/CertificateRegistry.sol/CertificateRegistry.json ../backend/assets/CertificateRegistry.json
echo "Artifact copied."

# Go to backend and start server
cd ../backend
npm start &
BACKEND_PID=$!

# Go to frontend and start dev server
cd ../frontend
npm run dev -- --host &
FRONTEND_PID=$!

# Wait for all processes
wait $HARDHAT_PID $BACKEND_PID $FRONTEND_PID
