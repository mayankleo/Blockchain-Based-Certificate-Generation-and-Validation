const express = require('express');
const cors = require('cors');
const { insertUser, getUser, getSuperUser, getAllInstitute } = require("./db");
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Blockchain Certificate API is running!');
});

app.get('/getABI', (req, res) => {
    const artifactPath = path.join(__dirname, process.env.CONTRACT_ABI_PATH);

    fs.readFile(artifactPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading artifact file:", err);
            return res.status(500).json({ message: "Error reading contract artifact" });
        }
        try {
            const artifact = JSON.parse(data);
            if (!artifact.abi) {
                console.error("ABI not found in artifact file:", artifactPath);
                return res.status(500).json({ message: "ABI not found in contract artifact" });
            }
            res.json(artifact.abi);
        } catch (parseErr) {
            console.error("Error parsing artifact file:", parseErr);
            res.status(500).json({ message: "Error parsing contract artifact" });
        }
    });
});

app.get('/getContractAddress', (req, res) => {
    res.json({ contractAddress: process.env.CONTRACT_ADDRESS });
});

app.get('/get-all-institute', async (req, res) => {
    try {
        try {
            const result = await getAllInstitute();
            console.log("all institute:", result);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching institute:", error);
            res.status(500).json({ ServerError: error });
        }

    } catch (error) {
        console.error("institute error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, password, accountId, isuser } = req.body;
        try {
            const result = await insertUser(username, password, accountId, isuser);
            console.log("User inserted successfully:", result);
            res.status(201).json(result);
        } catch (error) {
            console.error("Error inserting user:", error);
            res.status(500).json({ ServerError: error });
        }

    } catch (error) {
        console.error("register error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        try {
            const user = await getUser(username, password);
            console.log("User login successfully:", user);
            res.status(200).json(user);
        } catch (error) {
            console.error("Error login user:", error);
            res.status(500).json({ ServerError: error });
        }

    } catch (error) {
        console.error("login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/login-superuser', async (req, res) => {
    try {
        const { username, password } = req.body;

        try {
            const user = await getSuperUser(username, password);
            console.log("User login superuser successfully:", user);
            res.status(200).json({ issuperuser: true });
        } catch (error) {
            console.error("Error login superuser user:", error);
            res.status(500).json({ ServerError: error });
        }

    } catch (error) {
        console.error("login superuser error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT} : http://localhost:${PORT}`));