const globalscore = document.getElementById("globalScore");
const userscore = document.getElementById("userScore"); 
let activeUser = getLocalStorage("activeUser");
let allGame = getLocalStorage("allGames") || [];

if (!activeUser || activeUser.length === 0) {
    alert("No active user found, redirecting to login...");
    window.location.href = "login.html";
}

function userScore() {
    let userGames = allGame.filter(game => game.userId === activeUser[0].id);
    
    let bestScores = [...userGames]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    
    userscore.innerHTML = `
    <h1>Your Best Scores</h1>
    <table>
        <tr><strong><th></th><th>Score</th><th>Mode</th><th>Date</th></tr>
        ${bestScores.map((game, index) => `
            <tr>
                <td><strong>${index + 1}.</td>
                <td><strong>${game.score}</strong></td>
                <td>${game.gameMode}</td>
                <td>${new Date(game.date).toLocaleDateString()}</td>
            </tr>
        `).join('')}
    </table>`;
}

function globalScore() {
    if (allGame.length === 0) {
        globalscore.innerHTML = `
            <h2>Global Top Scores</h2>
            <p>No games recorded yet.</p>
        `;
        return;
    }
    
    let topGames = [...allGame]
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 10);
    
    globalscore.innerHTML = `
    <h1>Global Top Scores</h1>     
    <table>
        <thead>
            <tr><strong>
                <th></th>
                <th>Player</th>   
                <th>Score</th>
                <th>Mode</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            ${topGames.map((game, index) => `    
                <tr>
                    <td><strong>${index + 1}.</td>
                    <td>${game.userName || 'Unknown'}</td> 
                 <td><strong>${game.score}</strong></td>
                <td>${game.gameMode}</td>
                <td>${new Date(game.date).toLocaleDateString()}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', function() {
    globalScore();
    userScore();
});     

const back = document.getElementById("back");
back.addEventListener("click", function () {

    localStorage.removeItem("gameMod");
  localStorage.removeItem("countryLists");
  localStorage.removeItem("currentGame");
  window.location.href = "/main.html";  
  
  
});