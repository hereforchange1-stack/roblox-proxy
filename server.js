const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/gamepasses/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        // First get the user's games
        const gamesRes = await fetch(
            `https://games.roblox.com/v2/users/${userId}/games?limit=10&sortOrder=Asc`
        );
        const gamesData = await gamesRes.json();

        if (!gamesData.data || gamesData.data.length === 0) {
            return res.json({ gamepasses: [] });
        }

        // Get the first game's universe ID
        const universeId = gamesData.data[0].id;

        // Fetch gamepasses for that game
        const passRes = await fetch(
            `https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100&sortOrder=Asc`
        );
        const passData = await passRes.json();

        const gamepasses = (passData.data || []).map(pass => ({
            id: pass.id,
            name: pass.name,
            price: pass.price || 0,
            imageUrl: `https://www.roblox.com/asset-thumbnail/image?assetId=${pass.id}&width=150&height=150&format=png`
        }));

        res.json({ gamepasses });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch gamepasses" });
    }
});

app.listen(PORT, () => console.log("Proxy running on port " + PORT));
