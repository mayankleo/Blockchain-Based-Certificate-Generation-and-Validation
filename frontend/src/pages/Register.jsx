import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../api/api";
import { ethers } from "ethers";
import { toast } from 'react-toastify';

function Register() {
    const [recipientAccount, setRecipientAccount] = useState(null);

    async function connectWallet() {
        if (window.ethereum) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setRecipientAccount(await signer.getAddress());
            setAccountId(await signer.getAddress());
            toast.success("Wallet Connected!");
        } else {
            toast.error("MetaMask is required!");
        }
    }

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [accountId, setAccountId] = useState("");
    const [error, setError] = useState("");
    const [isuser, setIsuser] = useState(1);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/register", { username, password, accountId, isuser });
            console.log('data :>> ', response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
            if (response.data.isuser === 1) {
                navigate("/user-dashboard");
            } else {
                navigate("/admin-dashboard");
            }
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="flex">
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
                <div className="p-2 border min-w-min">
                    <input
                        type="text"
                        placeholder="Account ID"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        required
                    />
                    or
                    <button type="button" onClick={connectWallet}>{recipientAccount ? "Connected" : "Connect Wallet"}</button>
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="isuser"
                            value={1}
                            checked={isuser === 1}
                            onChange={() => setIsuser(1)}
                        />
                        User
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="isuser"
                            value={0}
                            checked={isuser === 0}
                            onChange={() => setIsuser(0)}
                        />
                        Institut/University
                    </label>
                </div>
                <button type="submit">Signup</button>
            </form>
            {error && <p style={{ color: "red" }}>{String(error)}</p>}
        </div>
    );
}

export default Register;