import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import api from "../api/api";
import { toast } from 'react-toastify';

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

function UserDashboard() {

  const [contractAddress, setContractAddress] = useState(null);
  const [certificateRegistryABI, setCertificateRegistryABI] = useState(null);
  const [myAddress, setMyAddress] = useState(null);

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
      setMyAddress(await signer.getAddress());
      toast.success("Wallet Connected!");
    } else {
      toast.error("MetaMask is required!");
    }
  }

  const [certificates, setCertificates] = useState([]);

  async function fetchCertificates() {
    try {
      if (!myAddress) return toast.error("Connect wallet first");
      const contract = new ethers.Contract(contractAddress, certificateRegistryABI, provider);

      const filterIssued = contract.filters.CertificateIssued();
      const issuedEvents = await contract.queryFilter(filterIssued, 0, "latest");

      const filterRevoked = contract.filters.CertificateRevoked();
      const revokedEvents = await contract.queryFilter(filterRevoked, 0, "latest");

      let allRevokedEventsBlocks = []
      revokedEvents.forEach((event) => {
        allRevokedEventsBlocks.push(event.args[0]);
      })

      let allBlocks = []

      issuedEvents.forEach((event) => {
        let a = {}
        for (let i = 0; i < event.args.length; i++) {
          a[event.fragment.inputs[i].name] = event.args[i]
        }
        if (allRevokedEventsBlocks.includes(a["certificateID"])) {
          a["isValid"] = false
        }

        if (a["recipientAddress"] === myAddress) {
          allBlocks.push(a);
        }

      })

      setCertificates(allBlocks);

    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  return (
    <div>
      <h3>All Issued Certificates</h3>
      <button onClick={fetchCertificates}>fetch</button>
      <button onClick={connectWallet}>{myAddress ? "Connected" : "Connect Wallet"}</button>
      <div>

        {certificates.length === 0 ? (
          <p>No certificates found.</p>
        ) : (
          <ul>
            {certificates.map((cert, index) => (
              <li key={index}>
                <strong>Certificate ID:</strong> {cert.certificateID} <br />
                <strong>Issuer Address:</strong> {cert.issuerAddress}<br />
                <strong>Recipient Address:</strong> {cert.recipientAddress}<br />
                <strong>Recipient Name:</strong> {cert.recipientName}<br />
                <strong>Issuer Name:</strong> {cert.issuer}<br />
                <strong>Course Name:</strong> {cert.courseName} <br />
                <strong>Issue Date:</strong> {new Date(Number(BigInt(cert.issueDate)) * 1000).toLocaleString().split(",")[0]} <br />
                <strong>Expiry Date:</strong> {new Date(Number(BigInt(cert.expiryDate)) * 1000).toLocaleString().split(",")[0]} <br />
                <strong>Valid:</strong> {cert.isValid ? "Yes" : "No"}<br />
                <hr />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;