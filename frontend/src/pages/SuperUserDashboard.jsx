import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import api from "../api/api";

function SuperUserDashboard() {

    const [contractAddress, setContractAddress] = useState(null);
    const [certificateRegistryABI, setCertificateRegistryABI] = useState(null);
    const [myAddress, setMyAddress] = useState(null);
    const [contract, setContract] = useState(null);
    const [showDashboard, setShowDashboard] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [allInstitute, setAllInstitute] = useState("");

    useEffect(() => {
        const fetchContractAddress = async () => {
            try {
                const response = await api.get("/getContractAddress");
                setContractAddress(response.data.contractAddress);
            } catch (error) {
                console.error("Error fetching contract address:", error);
                toast.error("Error fetching contract address");
            }
            try {
                const response = await api.get("/getABI");
                setCertificateRegistryABI(response.data);
            } catch (error) {
                console.error("Error fetching CertificateRegistry ABI:", error);
                toast.error("Error fetching CertificateRegistry ABI");
            }
        };
        fetchContractAddress();
    }, []);

    async function connectWallet() {
        if (window.ethereum) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, certificateRegistryABI, signer);
            setMyAddress(await signer.getAddress());
            setContract(contract);
            toast.success("Wallet Connected!");
        } else {
            toast.error("MetaMask is required!");
        }
    }

    async function addIssuerid(accountid) {
        if (!contract) return toast.error("Connect wallet first");
        try {
            const tx = await contract.addIssuer(accountid);
            toast.info("Transaction sent! Waiting for confirmation...");
            const receipt = await tx.wait();
            const event = receipt.logs.find(log => log.fragment?.name === "IssuerAdded");
            if (!event) {
                console.error("Issuer Added event not found in receipt!");
                return toast.error("Issuer Added, but event missing!");
            }
            console.log("Issuer Added succefully:", event.args[0]);
            toast.success(`Issuer Added succefully!`);

        } catch (error) {
            toast.error("Error Adding Issuer");
            console.error("Error:", error);
        }
    }
    async function removeIssuerid(accountid) {
        if (!contract) return toast.error("Connect wallet first");
        try {
            const tx = await contract.removeIssuer(accountid);
            toast.info("Transaction sent! Waiting for confirmation...");
            const receipt = await tx.wait();
            const event = receipt.logs.find(log => log.fragment?.name === "IssuerRemoved");
            if (!event) {
                console.error("Issuer Removed event not found in receipt!");
                return toast.error("Issuer Removed, but event missing!");
            }
            console.log("Issuer Removed succefully:", event.args[0]);
            toast.success(`Issuer Removed succefully!`);

        } catch (error) {
            toast.error("Error Removing Issuer");
            console.error("Error:", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await api.post("/login-superuser", { username, password });
            if (response.data.issuperuser) {
                setShowDashboard(true);
            } else {
                setShowDashboard(false);
                toast.error("You are not a superuser!");
            }
        } catch (err) {
            setError(err);
        }
    };

    const fetchAllInstitut = async () => {
        try {
            const response = await api.get("/get-all-institute");
            setAllInstitute(response.data)
        } catch (err) {
            setError(err);
        }
    }


    return (
        <>
            {showDashboard ?
                <div>
                    <h2>SuperUser Dashboard</h2>
                    <button onClick={connectWallet}>{myAddress ? "Connected" : "Connect Wallet"}</button>
                    <button onClick={() => toast.info(myAddress)}>check myAddress</button>
                    <button onClick={() => fetchAllInstitut()}>fetch all intitut ID's</button>

                    {allInstitute.length === 0 ? (
                        <p>No ID's found.</p>
                    ) : (
                        <ul>
                            {allInstitute.map((account, index) => (
                                <li key={index}>
                                    <strong>Account ID:</strong> {account.accountid} <br />
                                    <strong>Username:</strong> {account.username}<br />
                                    <button onClick={() => addIssuerid(account.accountid)}>Autherized ID</button>
                                    <button onClick={() => removeIssuerid(account.accountid)}>Revoke Autherized ID</button>
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    )}

                </div>
                :
                <div>
                    <h2>Login SuperUser</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                    {error && <p style={{ color: "red" }}>{String(error)}</p>}
                </div>
            }
        </>
    );
}

export default SuperUserDashboard;