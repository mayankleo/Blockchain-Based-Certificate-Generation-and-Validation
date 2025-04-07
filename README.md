# Blockchain-Based Certificate Generation and Validation

This project aims to eliminate credential fraud, streamline verification processes, and empower individuals with ownership of their digital certificates. Employers and institutions can save time while ensuring the authenticity of credentials in a trustless, transparent system built on blockchain technology.

## Prerequisites

*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
*   [MetaMask](https://metamask.io/download/) browser extension installed.

## Getting Started

Follow these steps to set up and run the application locally using Docker:

1.  **Build the Docker Image:**
    Open your terminal in the project's root directory and run:
    ```bash
    docker build -t genvely .
    ```

2.  **Run the Docker Container:**
    Execute the following command to start the application stack (backend, blockchain node, frontend):
    ```bash
    docker run -p 5000:5000 -p 8545:8545 -p 5173:5173 genvely
    ```
    *   Hardhat local blockchain node will run on port `8545`.
    *   ExpressJs backend will be accessible on port `5000`.
    *   React frontend will be available on port `5173`.

3.  **Configure MetaMask:**
    *   Open the MetaMask extension in your browser.
    *   **Import Account:**
        *   Go to Docker Desktop -> Containers -> Our running container -> Logs tab.
        *   Scroll up to find the list of accounts and their private keys provided by Hardhat.
        *   Copy the `Private key` for `Account #0`.
        *   In MetaMask, click the account icon -> Add account or hardware wallet -> Import account, and paste the copied private key.
    *   **Add Hardhat Network:**
        *   Click the network dropdown (usually says "Ethereum Mainnet") -> Add network -> Add a network manually.
        *   Enter the following details:
            *   **Network Name:** `Hardhat Network`
            *   **New RPC URL:** `http://127.0.0.1:8545`
            *   **Chain ID:** `31337`
            *   **Currency Symbol:** `ETH`
        *   Click **Save**.
    *   Ensure the "Hardhat Network" is selected in MetaMask.

4.  **Access the Application:**
    Open your web browser and navigate to `http://localhost:5173`.

You should now be able to interact with the certificate generation and validation application.
