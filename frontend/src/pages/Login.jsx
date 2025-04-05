import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/login", { username, password });
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
            <h2>Login</h2>
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

    );
}

export default Login;
