import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import api from "../api/api";

const Verify = () => {
    const [contractAddress, setContractAddress] = useState(null);
    const [certificateRegistryABI, setCertificateRegistryABI] = useState(null);
    const [recipientAccount, setRecipientAccount] = useState(null);
    const [contract, setContract] = useState(null);

    const [certID, setCertID] = useState("");
    const [certificates, setCertificates] = useState(null);
    const [certificateIds, setCertificateIds] = useState([]);
    // const [certificates, setCertificates] = useState();

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
            setRecipientAccount(await signer.getAddress());
            setContract(contract);
            toast.success("Wallet Connected!");
        } else {
            toast.error("MetaMask is required!");
        }
    }

    async function verifyCertificate(certIDpara) {
        if (!contract || !certIDpara) return toast.error("Enter Certificate ID");
        try {
            let [certificateID, issuerAddress, recipientAddress, recipientName, issuer, courseName, issueDate, expiryDate, isValid] = await contract.verifyCertificate(certIDpara);
            issueDate = new Date(Number(BigInt(issueDate)) * 1000).toLocaleString().split(",")[0];
            if (Number(BigInt(expiryDate)) !== 0) {
                expiryDate = new Date(Number(BigInt(expiryDate)) * 1000).toLocaleString().split(",")[0];
            } else {
                expiryDate = "N/A"
            }
            setCertificates([{ certificateID, issuerAddress, recipientAddress, recipientName, issuer, courseName, issueDate, expiryDate, isValid }]);
        } catch (error) {

            let errorMessage = "Invalid Certificate ID";

            if (error.reason) {
                errorMessage = error.reason;  // Ethers.js errors
            } else if (error.data && error.data.message) {
                errorMessage = error.data.message; // Solidity revert messages
            } else if (error.message) {
                errorMessage = error.message; // General error message
            }

            toast.error(errorMessage);
        }
    }

    async function verifyCertificatesBulk(certIDArray) {
        if (!contract || !certIDArray || certIDArray.length === 0) {
            toast.error("Enter at least one Certificate ID");
            return;
        }

        try {
            const verificationPromises = certIDArray.map(async (certID) => {
                try {
                    let [
                        certificateID, issuerAddress, recipientAddress,
                        recipientName, issuer, courseName, issueDate, expiryDate, isValid
                    ] = await contract.verifyCertificate(certID);

                    issueDate = new Date(Number(issueDate) * 1000).toLocaleDateString();
                    expiryDate = Number(expiryDate) !== 0
                        ? new Date(Number(expiryDate) * 1000).toLocaleDateString()
                        : "N/A";

                    return {
                        certificateID, issuerAddress, recipientAddress,
                        recipientName, issuer, courseName, issueDate, expiryDate, isValid, error: null
                    };
                } catch (error) {
                    console.error(`Error verifying certificate ${certID}:`, error);

                    let errorMessage = "Invalid Certificate ID";
                    if (error.reason) {
                        errorMessage = `Blockchain Error: ${error.reason}`;
                    } else if (error.data?.message) {
                        errorMessage = `Revert: ${error.data.message}`;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }

                    return { certificateID: certID, error: errorMessage };
                }
            });

            // Execute all verification requests in parallel
            const certificates = await Promise.all(verificationPromises);

            // Store verified certificates
            setCertificates(certificates);

            toast.success("Bulk verification completed!");
            // console.log('setCertificates :>> ', certificates);
        } catch (error) {
            console.error("Bulk Verification Error:", error);
            toast.error("An error occurred during bulk verification.");
        }
    }


    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "text/csv") {
            const reader = new FileReader();
            reader.onload = (e) => {
                let ids = [];
                console.log('e.target.result :>> ', e.target.result);
                const contents = e.target.result.split(/\r?\n/);
                for (let i = 1; i < contents.length - 1; i++) {
                    let a = contents[i].split(",");
                    ids.push({ "CertificateID": a[0], "IsVerifyed": a[1] });
                }
                setCertificateIds(ids);
            };
            reader.readAsText(file);
        } else {
            alert("Please upload a valid CSV file.");
        }
    };

    const handleSubmit = () => {
        console.log("Submitted Certificate IDs:", certificateIds);
        verifyCertificatesBulk(certificateIds.map(cert => cert.CertificateID));
    };

    return (
        <div className="text-center">
            <h3>Verify Certificate</h3>
            <button onClick={connectWallet}>{recipientAccount ? "Connected" : "Connect Wallet"}</button>
            <div>
                <div className="flex justify-evenly">
                    <div>
                        <input type="text" placeholder="Certificate ID" onChange={(e) => setCertID(e.target.value)} />
                        <button onClick={() => verifyCertificate(certID)}>Verify</button>
                    </div>
                    <div>
                        <div className="w-96 text-center p-5 bg-gray-800 shadow-md rounded-lg text-black">
                            <label className="block border-2 border-dashed border-blue-500 p-5 cursor-pointer mb-5 bg-blue-100 hover:bg-blue-200">
                                Upload CSV File Here
                                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                            </label>

                            <button
                                onClick={handleSubmit}
                                disabled={certificateIds.length === 0}
                                className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Verify
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    {certificates && certificates.length > 0 ? (
                        certificates.map((certificate) => (
                            <div key={certificate.certificateID}>
                                <div>
                                    <p>Certificate ID: {certificate.certificateID}</p>
                                    <p>Issuer Address: {certificate.issuerAddress}</p>
                                    <p>Recipient Address: {certificate.recipientAddress}</p>
                                    <p>Recipient Name: {certificate.recipientName}</p>
                                    <p>Issuer Name: {certificate.issuer}</p>
                                    <p>Course Name: {certificate.courseName}</p>
                                    <p>Issue Date: {certificate.issueDate}</p>
                                    <p>Expiry Date: {certificate.expiryDate}</p>
                                    <p>Valid: {certificate.isValid ? "Yes" : "No"}</p>
                                </div>
                                <div>
                                    <div className="bg-white shadow-2xl rounded-xl p-10 border-8 border-blue-500 max-w-2xl text-center">
                                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Certificate of Completion</h1>
                                        <p className="text-lg text-gray-600">This is to certify that</p>
                                        <h2 className="text-3xl font-semibold text-blue-600 my-2">{certificate.recipientName}</h2>
                                        <p className="text-lg text-gray-600">has successfully completed</p>
                                        <h3 className="text-2xl font-medium text-gray-800 my-2">{certificate.courseName}</h3>
                                        <p className="text-gray-600">Issued by</p>
                                        <h3 className="text-lg font-medium text-gray-700">{certificate.issuer}</h3>
                                        <p className="text-gray-500">Issuer Address: {certificate.issuerAddress}</p>
                                        <div className="flex justify-between mt-6 text-gray-700">
                                            <div>
                                                <p className="font-semibold">Issue Date:</p>
                                                <p>{certificate.issueDate}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Expiry Date:</p>
                                                <p>{certificate.expiryDate}</p>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-lg font-bold text-{certificate.isValid ? 'green-600' : 'red-600'}">
                                            {certificate.isValid ? "Valid" : "Expired"}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-4">Certificate ID: {certificate.certificateID}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No certificates found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Verify