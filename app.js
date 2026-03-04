const state = {
  followingFile: null,
  followersFile: null,
};

const followingInput = document.getElementById('following-input');
const followersInput = document.getElementById('followers-input');
const followingLabel = document.getElementById('following-file');
const followersLabel = document.getElementById('followers-file');
const runBtn = document.getElementById('run-btn');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');
const countEl = document.getElementById('count');
const resultList = document.getElementById('result-list');
const copyBtn = document.getElementById('copy-btn');

function updateRunButton() {
  runBtn.disabled = !(state.followingFile && state.followersFile);
}

function setFile(kind, file) {
  if (!file) return;
  if (kind === 'following') {
    state.followingFile = file;
    followingLabel.textContent = file.name;
  } else {
    state.followersFile = file;
    followersLabel.textContent = file.name;
  }
  statusEl.textContent = '';
  updateRunButton();
}

function setupDropZone(zoneId, input, kind) {
  const zone = document.getElementById(zoneId);

  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', (event) => {
    setFile(kind, event.target.files[0]);
  });

  ['dragenter', 'dragover'].forEach((evtName) => {
    zone.addEventListener(evtName, (event) => {
      event.preventDefault();
      zone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((evtName) => {
    zone.addEventListener(evtName, (event) => {
      event.preventDefault();
      zone.classList.remove('dragover');
    });
  });

  zone.addEventListener('drop', (event) => {
    const file = event.dataTransfer.files[0];
    setFile(kind, file);
  });
}

function extractFollowing(data) {
  return (data.relationships_following || []).map((entry) => entry.title);
}

function extractFollowers(data) {
  return (data || []).map((entry) => entry.string_list_data?.[0]?.value).filter(Boolean);
}

function compare(following, followers) {
  const followerSet = new Set(followers);
  return [...new Set(following)].filter((username) => !followerSet.has(username)).sort();
}

async function readJson(file) {
  const text = await file.text();
  return JSON.parse(text);
}

function renderResults(list) {
  resultList.innerHTML = '';
  list.forEach((name) => {
    const li = document.createElement('li');
    li.textContent = name;
    resultList.appendChild(li);
  });

  countEl.textContent = String(list.length);
  resultsEl.hidden = false;
}

runBtn.addEventListener('click', async () => {
  try {
    statusEl.textContent = 'Processing files...';
    const [followingData, followersData] = await Promise.all([
      readJson(state.followingFile),
      readJson(state.followersFile),
    ]);

    const finalList = compare(extractFollowing(followingData), extractFollowers(followersData));

    renderResults(finalList);
    statusEl.textContent = 'Done.';
  } catch (error) {
    statusEl.textContent = `Could not parse files: ${error.message}`;
    resultsEl.hidden = true;
  }
});

copyBtn.addEventListener('click', async () => {
  const text = [...resultList.querySelectorAll('li')].map((li) => li.textContent).join('\n');
  if (!text) return;
  await navigator.clipboard.writeText(text);
  statusEl.textContent = 'Copied list to clipboard.';
});

setupDropZone('following-zone', followingInput, 'following');
setupDropZone('followers-zone', followersInput, 'followers');
