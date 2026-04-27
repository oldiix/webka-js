'use strict';

const TOTAL_LEVELS = 5;
const BASE_SHOOT_TIME = 0.80;
const MIN_DELAY = 1500;
const MAX_DELAY = 4000;
const SPRITE_SCALE = 3;
const FIELD_WIDTH = 800;

const makeSound = path => new Audio(path);

const sfx = {
    intro: makeSound('sfx/intro.m4a'),
    wait: makeSound('sfx/wait.m4a'),
    fire: makeSound('sfx/fire.m4a'),
    shot: makeSound('sfx/shot.m4a'),
    shotFall: makeSound('sfx/shot-fall.m4a'),
    death: makeSound('sfx/death.m4a'),
    win: makeSound('sfx/win.m4a'),
    foul: makeSound('sfx/foul.m4a'),
};
sfx.intro.loop = true;
sfx.wait.loop = true;

const playSound = sound => {
    sound.currentTime = 0;
    sound.play().catch(() => {
    });
};
const stopSound = sound => {
    sound.pause();
    sound.currentTime = 0;
};
const muteAll = () => Object.values(sfx).forEach(stopSound);

const ROSTER = [
    {id: 1, cls: 'char-1', label: 'The Bandit', speed: 5000},
    {id: 2, cls: 'char-2', label: 'The Deputy', speed: 4500},
    {id: 3, cls: 'char-3', label: 'Quick Draw', speed: 3500},
    {id: 4, cls: 'char-4', label: 'El Sombrero', speed: 5500},
    {id: 5, cls: 'char-5', label: 'The Sheriff', speed: 4000},
];

const STAND_WIDTH = {
    'char-1': 34,
    'char-2': 31,
    'char-3': 31,
    'char-4': 33,
    'char-5': 31,
};

const pickCharacter = currentId => {
    const pool = ROSTER.filter(c => c.id !== currentId);
    return pool[Math.floor(Math.random() * pool.length)];
};

const calcShootTime = level => parseFloat(Math.max(0.30, BASE_SHOOT_TIME - (level - 1) * 0.10).toFixed(2));
const calcPoints = (level, secs) => Math.max(50, Math.round((1 / secs) * level * 100));
const randomDelay = () => Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY);
const calcCenterLeft = cls => (FIELD_WIDTH - STAND_WIDTH[cls] * SPRITE_SCALE) / 2;
const appendTimer = (list, t) => [...list, t];
const fmt = n => Number(n).toFixed(2);

let gs = {
    level: 1,
    score: 0,
    phase: 'menu',
    character: ROSTER[0],
    shootTime: BASE_SHOOT_TIME,
    fireAt: null,
    timers: [],
};

const getEl = id => document.getElementById(id);
const ui = {
    menu: getEl('game-menu'),
    wrapper: getEl('wrapper'),
    panels: getEl('game-panels'),
    screen: getEl('game-screen'),
    winScreen: getEl('win-screen'),
    gunmanWrap: getEl('gunman-wrap'),
    gunman: getEl('gunman'),
    msg: getEl('message'),
    timeYou: getEl('time-you'),
    timeGunman: getEl('time-gunman'),
    scoreNum: getEl('score-num'),
    levelDisplay: getEl('level-display'),
    finalScore: getEl('final-score'),
    btnStart: getEl('btn-start'),
    btnRestart: getEl('btn-restart'),
    btnNextLevel: getEl('btn-next-level'),
    btnPlayAgain: getEl('btn-play-again'),
};

const show = el => {
    el.style.display = 'block';
};
const hide = el => {
    el.style.display = 'none';
};

const showMsg = (text, mod = '') => {
    ui.msg.className = 'message' + (mod ? ' ' + mod : '');
    ui.msg.textContent = mod === 'message--fire' ? '' : text;
};
const clearMsg = () => {
    ui.msg.className = 'message';
    ui.msg.textContent = '';
};

const refreshHUD = () => {
    ui.scoreNum.textContent = gs.score;
    ui.levelDisplay.textContent = `Level ${gs.level}`;
    ui.timeGunman.textContent = fmt(gs.shootTime);
};

const setPose = pose => {
    const cls = gs.character.cls;
    ui.gunmanWrap.className = `gunman-wrap ${cls} ${pose}`;
    ui.gunman.className = `gunman ${cls} ${pose}`;
};

const schedule = (fn, delay) => {
    const t = setTimeout(fn, delay);
    gs = {...gs, timers: appendTimer(gs.timers, t)};
    return t;
};
const cancelAll = () => {
    gs.timers.forEach(clearTimeout);
    gs = {...gs, timers: []};
};

function startGame() {
    cancelAll();
    muteAll();
    gs = {
        level: 1,
        score: 0,
        phase: 'walking',
        character: ROSTER[0],
        shootTime: calcShootTime(1),
        fireAt: null,
        timers: [],
    };

    hide(ui.menu);
    hide(ui.winScreen);
    ui.btnRestart.style.display = 'none';
    ui.btnNextLevel.style.display = 'none';
    ui.screen.classList.remove('game-screen--death');
    show(ui.wrapper);
    show(ui.panels);
    show(ui.screen);

    clearMsg();
    ui.timeYou.textContent = '0.00';
    refreshHUD();

    moveGunman();
}

function restartGame() {
    cancelAll();
    muteAll();
    gs = {...gs, phase: 'walking', fireAt: null, timers: []};
    ui.btnRestart.style.display = 'none';
    ui.btnNextLevel.style.display = 'none';
    ui.screen.classList.remove('game-screen--death');
    clearMsg();
    ui.timeYou.textContent = '0.00';
    refreshHUD();
    moveGunman();
}

function nextLevel() {
    cancelAll();
    muteAll();
    const newLevel = gs.level + 1;
    if (newLevel > TOTAL_LEVELS) {
        showWinScreen();
        return;
    }
    gs = {
        ...gs,
        level: newLevel,
        phase: 'walking',
        shootTime: calcShootTime(newLevel),
        fireAt: null,
        timers: [],
    };
    ui.btnNextLevel.style.display = 'none';
    ui.screen.classList.remove('game-screen--death');
    clearMsg();
    ui.timeYou.textContent = '0.00';
    refreshHUD();
    moveGunman();
}

function moveGunman() {
    const chosen = pickCharacter(gs.character.id);
    gs = {...gs, character: chosen};

    showMsg(chosen.label, 'message--win');
    schedule(clearMsg, 1500);

    ui.gunmanWrap.style.transition = 'none';
    ui.gunmanWrap.style.left = '900px';
    setPose('walk');

    void ui.gunmanWrap.offsetLeft;

    const dest = calcCenterLeft(chosen.cls);
    ui.gunmanWrap.style.transition = `left ${chosen.speed}ms linear`;
    ui.gunmanWrap.style.left = dest + 'px';

    playSound(sfx.wait);
    schedule(prepareForDuel, chosen.speed);
}

function prepareForDuel() {
    stopSound(sfx.wait);
    setPose('stand');
    gs = {...gs, phase: 'waiting'};
    schedule(startDuel, randomDelay());
}

function startDuel() {
    gs = {...gs, phase: 'duel', fireAt: Date.now()};
    setPose('ready');
    showMsg('', 'message--fire');
    playSound(sfx.fire);
    ui.timeGunman.textContent = fmt(gs.shootTime);
    schedule(gunmanShootsPlayer, gs.shootTime * 1000);
}

function gunmanShootsPlayer() {
    if (gs.phase !== 'duel') return;
    cancelAll();
    gs = {...gs, phase: 'result'};
    setPose('shoot');
    playSound(sfx.shot);
    schedule(() => {
        clearMsg();
        showMsg('YOU LOSE', 'message--dead');
        ui.screen.classList.add('game-screen--death');
        stopSound(sfx.shot);
        playSound(sfx.death);
        ui.btnRestart.style.display = 'block';
    }, 400);
}

function playerShootsGunman() {
    if (gs.phase !== 'duel') return;
    cancelAll();
    const elapsed = Date.now() - gs.fireAt;
    const secs = parseFloat((elapsed / 1000).toFixed(2));
    const pts = calcPoints(gs.level, secs);
    gs = {...gs, phase: 'result', score: gs.score + pts};

    setPose('death');
    muteAll();
    playSound(sfx.shotFall);
    clearMsg();

    ui.timeYou.textContent = fmt(secs);
    refreshHUD();

    schedule(() => {
        showMsg(`+$${pts}`, 'message--win');
        playSound(sfx.win);
        if (gs.level >= TOTAL_LEVELS) {
            schedule(showWinScreen, 2500);
        } else {
            ui.btnNextLevel.style.display = 'block';
        }
    }, 3500);
}

function handleEarlyShot() {
    if (gs.phase !== 'waiting') return;
    cancelAll();
    muteAll();
    gs = {...gs, phase: 'result'};
    showMsg('TOO EARLY!', 'message--dead');
    playSound(sfx.foul);
    ui.btnRestart.style.display = 'block';
}

function showWinScreen() {
    muteAll();
    hide(ui.wrapper);
    ui.finalScore.textContent = gs.score;
    show(ui.winScreen);
    playSound(sfx.win);
}

function scoreCount(level, secs) {
    return calcPoints(level, secs);
}

function timeCounter(startMs) {
    return parseFloat(((Date.now() - startMs) / 1000).toFixed(2));
}


ui.btnStart.addEventListener('click', () => {
    muteAll();
    startGame();
});
ui.btnRestart.addEventListener('click', restartGame);
ui.btnNextLevel.addEventListener('click', nextLevel);
ui.btnPlayAgain.addEventListener('click', startGame);

ui.gunman.addEventListener('click', e => {
    e.stopPropagation();
    if (gs.phase === 'waiting') {
        handleEarlyShot();
    } else {
        playerShootsGunman();
    }
});

ui.screen.addEventListener('click', () => {
    if (gs.phase === 'waiting') {
        handleEarlyShot();
    }
});

const startIntro = () => {
    if (gs.phase === 'menu' && sfx.intro.paused) {
        sfx.intro.play().catch(() => {
        });
    }
    document.removeEventListener('click', startIntro);
    document.removeEventListener('keydown', startIntro);
};
document.addEventListener('click', startIntro);
document.addEventListener('keydown', startIntro);