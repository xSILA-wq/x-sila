const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 'xSILA-wq'; // Zamijeni s tvojim GitHub korisničkim imenom
const REPO_NAME = 'x-sila'; // Zamijeni s nazivom tvog repozitorija
const FILE_PATH = '../scrims.json'; // Put do scrims.json datoteke
const BRANCH = 'main';
const TOKEN = 'YOUR_PERSONAL_ACCESS_TOKEN'; // Zamijeni s tvojim GitHub personal access tokenom

async function fetchScrims() {
    const response = await fetch(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`, {
        headers: {
            'Authorization': `token ${TOKEN}`
        }
    });
    const data = await response.json();
    const content = atob(data.content);
    return JSON.parse(content);
}

async function saveScrims(scrims) {
    const content = btoa(JSON.stringify(scrims, null, 2));
    const shaResponse = await fetch(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`, {
        headers: {
            'Authorization': `token ${TOKEN}`
        }
    });
    const shaData = await shaResponse.json();
    const response = await fetch(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update scrims',
            content: content,
            sha: shaData.sha
        })
    });
    return response.json();
}

async function addScrim() {
    const team1 = document.getElementById('team1').value;
    const team2 = document.getElementById('team2').value;
    const format = document.getElementById('format').value;
    const match = document.getElementById('match').value;
    const region = document.getElementById('region').value;
    const mode = document.getElementById('mode').value;
    const result = document.getElementById('result').value;
    const wins = document.getElementById('wins').value;
    const losses = document.getElementById('losses').value;
    const password = document.getElementById('password').value;

    if (password !== "YOUR_PASSWORD") { // Zamijeni s lozinkom koju želiš koristiti
        alert("Incorrect password!");
        return;
    }

    const newScrim = { team1, team2, format, match, region, mode, result, wins, losses };

    const scrims = await fetchScrims();
    scrims.push(newScrim);

    await saveScrims(scrims);
    displayScrims(scrims);
}

function displayScrims(scrims) {
    const scrimContainer = document.getElementById('scrim-container');
    scrimContainer.innerHTML = '';
    scrims.forEach(scrim => {
        const scrimBox = document.createElement('div');
        scrimBox.classList.add('scrim-box');
        scrimBox.innerHTML = `
            <h3>${scrim.team1} vs ${scrim.team2}</h3>
            <p>Format: ${scrim.format}</p>
            <p>Match: ${scrim.match}</p>
            <p>Region: ${scrim.region}</p>
            <p>Mode: ${scrim.mode}</p>
            <p>Result: ${scrim.result}</p>
            <p>Wins: ${scrim.wins}</p>
            <p>Losses: ${scrim.losses}</p>
        `;
        scrimContainer.appendChild(scrimBox);
    });
}

window.onload = async function() {
    const scrims = await fetchScrims();
    displayScrims(scrims);
}
