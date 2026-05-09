const EMOJI_POOL = [
    '🐶', '🐱', '🦊', '🐻', '🐼', '🐯', '🦁', '🐸',
    '🐵', '🐔', '🦄', '🐙', '🦋', '🐝', '🐞', '🦀',
    '🌸', '🌻', '🍕', '🍔'
];

const DIFFICULTY_TIMES = {
    easy: 180,
    normal: 120,
    hard: 60
};

const DEFAULT_SETTINGS = {
    playersCount: 1,
    player1Name: 'Гравець 1',
    player2Name: 'Гравець 2',
    boardSize: '4x4',
    difficulty: 'easy',
    roundsCount: 1
};

const shuffleArray = (array) => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

const parseBoardSize = (sizeStr) => {
    const [rows, cols] = sizeStr.split('x').map(Number);
    return {rows, cols};
};

const createCards = (rows, cols) => {
    const totalCards = rows * cols;
    const pairsCount = totalCards / 2;
    const selectedEmojis = EMOJI_POOL.slice(0, pairsCount);
    const pairs = [...selectedEmojis, ...selectedEmojis];
    const shuffled = shuffleArray(pairs);
    return shuffled.map((emoji, index) => ({
        id: index,
        emoji: emoji,
        isFlipped: false,
        isMatched: false
    }));
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const flipCard = (cards, cardId) =>
    cards.map(card =>
        card.id === cardId ? {...card, isFlipped: true} : card
    );

const isPair = (card1, card2) => card1.emoji === card2.emoji;

const markAsMatched = (cards, id1, id2) =>
    cards.map(card =>
        card.id === id1 || card.id === id2
            ? {...card, isMatched: true, isFlipped: true}
            : card
    );

const unflipCards = (cards, id1, id2) =>
    cards.map(card =>
        (card.id === id1 || card.id === id2) && !card.isMatched
            ? {...card, isFlipped: false}
            : card
    );

const areAllMatched = (cards) => cards.every(card => card.isMatched);

const createRoundStats = (playerIndex, moves, timeSpent) => ({
    playerIndex,
    moves,
    timeSpent
});

const determineWinner = (roundsHistory, playersCount, playerNames) => {
    if (playersCount === 1) {
        return playerNames[0];
    }
    const totals = [0, 0];
    roundsHistory.forEach(round => {
        totals[round.playerIndex] += round.moves;
    });
    if (totals[0] === totals[1]) return 'Нічия';
    return totals[0] < totals[1] ? playerNames[0] : playerNames[1];
};

const switchPlayer = (currentIndex, playersCount) =>
    playersCount === 2 ? (currentIndex === 0 ? 1 : 0) : 0;


const gameState = {
    settings: {...DEFAULT_SETTINGS},
    cards: [],
    flippedIds: [],
    moves: 0,
    timeLeft: 0,
    timerId: null,
    isLocked: false,
    currentPlayerIndex: 0,
    currentRound: 1,
    roundsHistory: [],
    roundStartTime: 0
};


const renderCards = (cards, cols) => {
    const board = document.getElementById('game-board');
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.innerHTML = '';
    cards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        if (card.isFlipped) cardEl.classList.add('flipped');
        if (card.isMatched) cardEl.classList.add('matched');
        cardEl.dataset.id = card.id;
        cardEl.innerHTML = `
            <div class="card-face card-back">?</div>
            <div class="card-face card-front">${card.emoji}</div>
        `;
        board.appendChild(cardEl);
    });
};

const updateInfoPanel = () => {
    document.getElementById('moves-count').textContent = gameState.moves;
    document.getElementById('timer').textContent = formatTime(gameState.timeLeft);
    document.getElementById('current-round').textContent = gameState.currentRound;
    document.getElementById('total-rounds').textContent = gameState.settings.roundsCount;
    const playerName = gameState.currentPlayerIndex === 0
        ? gameState.settings.player1Name
        : gameState.settings.player2Name;
    document.getElementById('current-player').textContent = playerName;

    const timerEl = document.getElementById('timer');
    if (gameState.timeLeft <= 10) {
        timerEl.classList.add('timer-warning');
    } else {
        timerEl.classList.remove('timer-warning');
    }
};

const showScreen = (screenId) => {
    ['settings-screen', 'game-screen', 'result-screen'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
};


const stopTimer = () => {
    if (gameState.timerId) {
        clearInterval(gameState.timerId);
        gameState.timerId = null;
    }
};

const startTimer = () => {
    stopTimer();
    gameState.timerId = setInterval(() => {
        gameState.timeLeft -= 1;
        updateInfoPanel();
        if (gameState.timeLeft <= 0) {
            stopTimer();
            finishRound(false);
        }
    }, 1000);
};

const handleCardClick = (cardId) => {
    if (gameState.isLocked) return;
    const card = gameState.cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    gameState.cards = flipCard(gameState.cards, cardId);
    gameState.flippedIds.push(cardId);
    renderCards(gameState.cards, parseBoardSize(gameState.settings.boardSize).cols);

    if (gameState.flippedIds.length === 2) {
        gameState.moves += 1;
        updateInfoPanel();
        gameState.isLocked = true;

        const [id1, id2] = gameState.flippedIds;
        const card1 = gameState.cards.find(c => c.id === id1);
        const card2 = gameState.cards.find(c => c.id === id2);

        if (isPair(card1, card2)) {
            gameState.cards = markAsMatched(gameState.cards, id1, id2);
            gameState.flippedIds = [];
            gameState.isLocked = false;
            renderCards(gameState.cards, parseBoardSize(gameState.settings.boardSize).cols);

            if (areAllMatched(gameState.cards)) {
                setTimeout(() => finishRound(true), 600);
            }
        } else {
            setTimeout(() => {
                gameState.cards = unflipCards(gameState.cards, id1, id2);
                gameState.flippedIds = [];
                gameState.currentPlayerIndex = switchPlayer(
                    gameState.currentPlayerIndex,
                    gameState.settings.playersCount
                );
                gameState.isLocked = false;
                renderCards(gameState.cards, parseBoardSize(gameState.settings.boardSize).cols);
                updateInfoPanel();
            }, 1000);
        }
    }
};

const finishRound = (isWin) => {
    stopTimer();
    const timeSpent = DIFFICULTY_TIMES[gameState.settings.difficulty] - gameState.timeLeft;
    const stats = createRoundStats(
        gameState.currentPlayerIndex,
        gameState.moves,
        timeSpent
    );
    gameState.roundsHistory.push(stats);

    if (gameState.currentRound < gameState.settings.roundsCount) {
        setTimeout(() => {
            gameState.currentRound += 1;
            startNewRound();
        }, 1500);
    } else {
        setTimeout(() => showResults(isWin), 800);
    }
};

const startNewRound = () => {
    const {rows, cols} = parseBoardSize(gameState.settings.boardSize);
    gameState.cards = createCards(rows, cols);
    gameState.flippedIds = [];
    gameState.moves = 0;
    gameState.timeLeft = DIFFICULTY_TIMES[gameState.settings.difficulty];
    gameState.isLocked = false;
    gameState.currentPlayerIndex = 0;
    renderCards(gameState.cards, cols);
    updateInfoPanel();
    startTimer();
};

const startGame = () => {
    gameState.currentRound = 1;
    gameState.roundsHistory = [];
    showScreen('game-screen');
    startNewRound();
};

const showResults = (isWin) => {
    stopTimer();
    showScreen('result-screen');
    const titleEl = document.getElementById('result-title');
    const contentEl = document.getElementById('result-content');

    titleEl.textContent = isWin ? 'Гру завершено!' : 'Час вийшов!';

    const playerNames = [gameState.settings.player1Name, gameState.settings.player2Name];
    const winner = determineWinner(
        gameState.roundsHistory,
        gameState.settings.playersCount,
        playerNames
    );

    let html = `<div class="winner-banner">Переможець: ${winner}</div>`;
    html += '<div class="round-stats">';
    gameState.roundsHistory.forEach((round, idx) => {
        const name = playerNames[round.playerIndex];
        html += `
            <div class="round-row">
                <span><strong>Раунд ${idx + 1}</strong> — ${name}</span>
                <span>Ходи: ${round.moves} | Час: ${formatTime(round.timeSpent)}</span>
            </div>
        `;
    });
    html += '</div>';
    contentEl.innerHTML = html;
};


const readSettingsFromForm = () => ({
    playersCount: parseInt(document.getElementById('players-count').value, 10),
    player1Name: document.getElementById('player1-name').value || 'Гравець 1',
    player2Name: document.getElementById('player2-name').value || 'Гравець 2',
    boardSize: document.getElementById('board-size').value,
    difficulty: document.getElementById('difficulty').value,
    roundsCount: parseInt(document.getElementById('rounds-count').value, 10) || 1
});

const applySettingsToForm = (settings) => {
    document.getElementById('players-count').value = settings.playersCount;
    document.getElementById('player1-name').value = settings.player1Name;
    document.getElementById('player2-name').value = settings.player2Name;
    document.getElementById('board-size').value = settings.boardSize;
    document.getElementById('difficulty').value = settings.difficulty;
    document.getElementById('rounds-count').value = settings.roundsCount;
    togglePlayer2Name(settings.playersCount);
};

const togglePlayer2Name = (count) => {
    const wrap = document.getElementById('player2-name-wrap');
    if (count === 2) wrap.classList.remove('hidden');
    else wrap.classList.add('hidden');
};


document.getElementById('players-count').addEventListener('change', (e) => {
    togglePlayer2Name(parseInt(e.target.value, 10));
});

document.getElementById('reset-settings-btn').addEventListener('click', () => {
    applySettingsToForm(DEFAULT_SETTINGS);
});

document.getElementById('start-game-btn').addEventListener('click', () => {
    gameState.settings = readSettingsFromForm();
    startGame();
});

document.getElementById('restart-btn').addEventListener('click', () => {
    gameState.currentRound = 1;
    gameState.roundsHistory = [];
    startNewRound();
});

document.getElementById('back-to-settings-btn').addEventListener('click', () => {
    stopTimer();
    showScreen('settings-screen');
});

document.getElementById('play-again-btn').addEventListener('click', () => {
    showScreen('settings-screen');
});

document.getElementById('game-board').addEventListener('click', (e) => {
    const cardEl = e.target.closest('.card');
    if (!cardEl) return;
    const cardId = parseInt(cardEl.dataset.id, 10);
    handleCardClick(cardId);
});

applySettingsToForm(DEFAULT_SETTINGS);