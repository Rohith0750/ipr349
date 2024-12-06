const mockDatabase = {};
let historyStack = [];
let redoStack = [];

function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

document.getElementById('loginFormElement').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('loginMilitaryID').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (mockDatabase[id] && mockDatabase[id].password === password) {
        document.getElementById('authPage').classList.add('hidden');
        document.getElementById('trainingPage').classList.remove('hidden');
        saveHistory();
    } else {
        document.getElementById('loginMessage').textContent = "Invalid ID or Password.";
    }
});

document.getElementById('registrationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('registerMilitaryID').value.trim();
    const name = document.getElementById('registerName').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!mockDatabase[id]) {
        mockDatabase[id] = { name, password };
        document.getElementById('registerMessage').textContent = "Registration successful! Please login.";
        showLogin();
    } else {
        document.getElementById('registerMessage').textContent = "ID already exists.";
    }
});


// Updated videoSources with Streamable embed links
const videoSources = {
    defence: 'one_123.mp4',
    shooting: 'https://streamable.com/e/yuea49',
    fitness: 'https://streamable.com/e/jg5fdp'
};

function showVideo(option) {
    const videoContainer = document.getElementById('videoContainer');
    
    // Clear the existing videoContainer content
    videoContainer.innerHTML = `
        <iframe
            src="${videoSources[option]}"
            frameborder="0"
            allowfullscreen
            style="width: 100%; height: 300px; border-radius: 5px; border: 2px solid #4ca1af;">
        </iframe>
    `;
    
    videoContainer.style.display = 'block';
    document.getElementById('backButton').classList.remove('hidden');
    document.querySelector('.options-container').style.display = 'none';

    saveHistory();
}

function goBack() {
    const videoContainer = document.getElementById('videoContainer');

    videoContainer.style.display = 'none';
    videoContainer.innerHTML = ''; // Clear the iframe
    document.querySelector('.options-container').style.display = 'flex';
    document.getElementById('backButton').classList.add('hidden');

    saveHistory();
}

function saveHistory() {
    const state = document.body.innerHTML;
    historyStack.push(state);
    redoStack = [];
}

function undo() {
    if (historyStack.length > 1) {
        redoStack.push(historyStack.pop());
        const previousState = historyStack[historyStack.length - 1];
        document.body.innerHTML = previousState;
        restoreScript();
    }
}

function redo() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        historyStack.push(nextState);
        document.body.innerHTML = nextState;
        restoreScript();
    }
}

function restoreScript() {
    const script = document.createElement('script');
    script.textContent = `
        (${showLogin.toString()})();
        (${showRegister.toString()})();
        (${saveHistory.toString()})();
        (${undo.toString()})();
        (${redo.toString()})();
        (${showVideo.toString()})();
        (${goBack.toString()})();
        document.getElementById('loginFormElement').addEventListener('submit', ${document.getElementById('loginFormElement').addEventListener.toString()});
        document.getElementById('registrationForm').addEventListener('submit', ${document.getElementById('registrationForm').addEventListener.toString()});
    `;
    document.body.appendChild(script);
}
