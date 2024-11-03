const players = [
    { name: "kalivra-na1", region: "na1" },  // Replace with real summoner name
    { name: "lord%20basbous-euw", region: "euw1" } // Replace with real summoner name
];

async function fetchPlayerStats(player) {
    const url = `https://u.gg/lol/summoners/${player.region}/${player.name}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const text = await response.text();
        
        // Extract stats using regex or DOM parsing
        const winsLossesMatch = text.match(/<div class="WinLose__StyledWinLose.*?">(\d+) W \| (\d+) L<\/div>/);
        const rankMatch = text.match(/<div class="TierRank.*?">([\w\s]+)<\/div>/);
        
        if (winsLossesMatch && rankMatch) {
            return {
                name: player.name,
                rank: rankMatch[1], // Extract rank information
                wins: parseInt(winsLossesMatch[1]), // Extract wins
                losses: parseInt(winsLossesMatch[2]), // Extract losses
            };
        } else {
            throw new Error("Could not extract player stats");
        }
    } catch (error) {
        console.error("Error fetching player stats:", error);
        return null;
    }
}

async function displayPlayerStats() {
    const container = document.getElementById("player-stats");
    container.innerHTML = ""; // Clear previous data

    for (const player of players) {
        const data = await fetchPlayerStats(player);
        if (data) {
            const playerDiv = document.createElement("div");
            playerDiv.innerHTML = `
                <h2>${data.name}</h2>
                <p>Rank: ${data.rank}</p>
                <p>Wins: ${data.wins}, Losses: ${data.losses}</p>
            `;
            container.appendChild(playerDiv);
        } else {
            const errorDiv = document.createElement("div");
            errorDiv.innerHTML = `<p>Error loading data for ${player.name}</p>`;
            container.appendChild(errorDiv);
        }
    }
}

// Run displayPlayerStats on page load
window.onload = displayPlayerStats;
