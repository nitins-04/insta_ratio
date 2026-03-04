const followingInput = document.querySelector('#followingFile');
const followersInput = document.querySelector('#followersFile');
const analyzeBtn = document.querySelector('#analyzeBtn');
const downloadBtn = document.querySelector('#downloadBtn');
const statusEl = document.querySelector('#status');
const resultsCard = document.querySelector('#resultsCard');
const resultsList = document.querySelector('#resultsList');
const countEl = document.querySelector('#count');

let latestResults = [];

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

function parseFollowing(data) {
  const relationships = data.relationships_following;
  if (!Array.isArray(relationships)) {
    throw new Error('Could not find relationships_following in following file.');
  }

  return relationships
    .map((entry) => entry?.string_list_data?.[0]?.value || entry?.title)
    .filter(Boolean);
}

function parseFollowers(data) {
  if (!Array.isArray(data)) {
    throw new Error('Followers file should be an array.');
  }

  return data.map((entry) => entry?.string_list_data?.[0]?.value).filter(Boolean);
}

async function readJson(file) {
  if (!file) {
    throw new Error('Please choose both files before analyzing.');
  }

  const text = await file.text();
  return JSON.parse(text);
}

function renderResults(usernames) {
  resultsList.innerHTML = '';

  usernames.forEach((username) => {
    const row = document.createElement('li');
    row.textContent = username;
    resultsList.append(row);
  });

  countEl.textContent = usernames.length;
  resultsCard.hidden = false;
  downloadBtn.disabled = usernames.length === 0;
}

function downloadResults() {
  if (latestResults.length === 0) return;

  const blob = new Blob([latestResults.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'not_following_back.txt';
  link.click();
  URL.revokeObjectURL(url);
}

analyzeBtn.addEventListener('click', async () => {
  setStatus('Analyzing files...');
  resultsCard.hidden = true;

  try {
    const [followingData, followersData] = await Promise.all([
      readJson(followingInput.files[0]),
      readJson(followersInput.files[0]),
    ]);

    const following = parseFollowing(followingData);
    const followers = parseFollowers(followersData);
    const followersSet = new Set(followers);
    const notFollowingBack = [...new Set(following.filter((u) => !followersSet.has(u)))].sort((a, b) =>
      a.localeCompare(b)
    );

    latestResults = notFollowingBack;
    renderResults(notFollowingBack);
    setStatus(`Done. Found ${notFollowingBack.length} account(s) not following you back.`);
  } catch (error) {
    latestResults = [];
    downloadBtn.disabled = true;
    setStatus(error.message || 'Something went wrong while processing your files.', true);
  }
});

downloadBtn.addEventListener('click', downloadResults);
