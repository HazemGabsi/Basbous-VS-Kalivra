const API_KEY = 'RGAPI-3f1dda05-adf5-4772-8d68-de864b539d47';
const playerNames = ["Lord Basbous#EUW", "Kalivra#NA1"]; // Replace with your friends' summoner names

async function fetchPlayerData(name) {
    try {
        // Get player data from Summoner API
        const summonerResponse = await fetch(
            `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${API_KEY}`
        );
        const summonerData = await summonerResponse.json();

        // Get ranked stats using the encrypted summoner ID
        const leagueResponse = await fetch(
            `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${API_KEY}`
        );
        const leagueData = await leagueResponse.json();

        return {
            name: name,
            rank: leagueData[0].tier + " " + leagueData[0].rank,
            lp: leagueData[0].leaguePoints,
            wins: leagueData[0].wins,
            losses: leagueData[0].losses,
        };
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

async function displayPlayerStats() {
    const container = document.getElementById("player-stats");
    container.innerHTML = "";

    for (const name of playerNames) {
        const data = await fetchPlayerData(name);
        if (data) {
            const playerDiv = document.createElement("div");
            playerDiv.innerHTML = `
                <h2>${data.name}</h2>
                <p>Rank: ${data.rank}</p>
                <p>LP: ${data.lp}</p>
                <p>Wins: ${data.wins}, Losses: ${data.losses}</p>
            `;
            container.appendChild(playerDiv);
        }
    }
}

// Run the function when the page loads
window.onload = displayPlayerStats;
