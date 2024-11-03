const API_KEY = 'RGAPI-d7231e67-f9eb-41ba-871d-b6cce7109d0e';  // Replace with your actual Riot Games API key

// Define players with their summoner names and regions
const players = [
    { name: "Kalivra", region: "na1" },  // Replace "NAPlayerName" with an actual NA player's summoner name
    { name: "Kapriano", region: "euw1" } // Replace "EUWPlayerName" with an actual EUW player's summoner name
];

async function fetchPlayerData(player) {
    try {
        // Fetch player data from the Summoner API, using the player’s region
        const summonerResponse = await fetch(
            `https://${player.region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${player.name}?api_key=${API_KEY}`
        );

        if (!summonerResponse.ok) {
            throw new Error(`Failed to fetch summoner data for ${player.name}`);
        }

        const summonerData = await summonerResponse.json();

        // Fetch ranked data using the encrypted summoner ID
        const leagueResponse = await fetch(
            `https://${player.region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${API_KEY}`
        );

        if (!leagueResponse.ok) {
            throw new Error(`Failed to fetch league data for ${player.name}`);
        }

        const leagueData = await leagueResponse.json();

        // Return player's ranked information, or "Unranked" if no ranked data found
        if (leagueData.length > 0) {
            return {
                name: player.name,
                rank: leagueData[0].tier + " " + leagueData[0].rank,
                lp: leagueData[0].leaguePoints,
                wins: leagueData[0].wins,
                losses: leagueData[0].losses,
            };
        } else {
            return {
                name: player.name,
                rank: "Unranked",
                lp: 0,
                wins: 0,
                losses: 0,
            };
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // Return null if an error occurs
    }
}

async function displayPlayerStats() {
    const container = document.getElementById("player-stats");
    container.innerHTML = ""; // Clear previous data

    for (const player of players) {
        const data = await fetchPlayerData(player);
        if (data) {
            const playerDiv = document.createElement("div");
            playerDiv.innerHTML = `
                <h2>${data.name}</h2>
                <p>Rank: ${data.rank}</p>
                <p>LP: ${data.lp}</p>
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

// Run displayPlayerStats when the page loads
window.onload = displayPlayerStats;
