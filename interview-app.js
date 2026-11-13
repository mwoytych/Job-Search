document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* ---------- Copyright Year ---------- */
    var yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Text Size Controls ---------- */
    var LEVELS = [0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];
    var MIN_INDEX = 0, MAX_INDEX = LEVELS.length - 1, DEFAULT_INDEX = 2;
    var STORE_KEY_SIZE = 'vital-font-scale-index';
    var STORE_KEY_THEME = 'vital-theme';
    var btnIncrease = document.getElementById('font-increase');
    var btnDecrease = document.getElementById('font-decrease');
    var btnReset = document.getElementById('font-reset');
    var display = document.getElementById('font-level-display');
    var root = document.documentElement;

    function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }
    function getStoredIndex() {
        try {
            var raw = localStorage.getItem(STORE_KEY_SIZE);
            if (raw === null) return DEFAULT_INDEX;
            var n = parseInt(raw, 10);
            return isNaN(n) ? DEFAULT_INDEX : clamp(n, MIN_INDEX, MAX_INDEX);
        } catch (e) { return DEFAULT_INDEX; }
    }
    function applyScale(index) {
        index = clamp(index, MIN_INDEX, MAX_INDEX);
        var scale = LEVELS[index];
        root.style.setProperty('--font-scale', String(scale));
        display.textContent = Math.round(scale * 100) + '%';
        btnDecrease.disabled = (index === MIN_INDEX);
        btnIncrease.disabled = (index === MAX_INDEX);
        try { localStorage.setItem(STORE_KEY_SIZE, String(index)); } catch (e) {}
    }

    var currentIndex = getStoredIndex();
    applyScale(currentIndex);
    btnIncrease.addEventListener('click', function () { currentIndex = clamp(currentIndex + 1, MIN_INDEX, MAX_INDEX); applyScale(currentIndex); });
    btnDecrease.addEventListener('click', function () { currentIndex = clamp(currentIndex - 1, MIN_INDEX, MAX_INDEX); applyScale(currentIndex); });
    btnReset.addEventListener('click', function () { currentIndex = DEFAULT_INDEX; applyScale(currentIndex); });

    /* ---------- Dark Mode Toggle ---------- */
    var themeToggle = document.getElementById('theme-toggle');
    function getPreferredTheme() {
        try {
            var stored = localStorage.getItem(STORE_KEY_THEME);
            if (stored === 'dark' || stored === 'light') return stored;
        } catch (e) {}
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light';
    }
    function applyTheme(theme, persist) {
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            themeToggle.setAttribute('aria-pressed', 'true');
            themeToggle.textContent = '☀️ Light Mode';
        } else {
            root.removeAttribute('data-theme');
            themeToggle.setAttribute('aria-pressed', 'false');
            themeToggle.textContent = '🌙 Dark Mode';
        }
        if (persist) { try { localStorage.setItem(STORE_KEY_THEME, theme); } catch (e) {} }
    }
    var currentTheme = getPreferredTheme();
    applyTheme(currentTheme, false);
    themeToggle.addEventListener('click', function () {
        currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
        applyTheme(currentTheme, true);
    });

    /* ===== VAULT LOGIC ===== */
    var STORAGE_KEY = 'vital-interview-answers';
    var TAG_LABELS = {
        leadership: 'Leadership', conflict: 'Conflict Resolution',
        failure: 'Failure / Mistake', success: 'Success / Achievement', other: 'Other'
    };
    var TAG_CLASSES = {
        leadership: 'tag-leadership', conflict: 'tag-conflict',
        failure: 'tag-failure', success: 'tag-success', other: 'tag-other'
    };

    function getAnswers() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            var d = raw ? JSON.parse(raw) : [];
            return Array.isArray(d) ? d : [];
        } catch (e) { return []; }
    }
    function saveAnswers(d) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }
        catch (e) { alert('Could not save — storage may be full or blocked.'); }
    }

    var answers = getAnswers();

    function esc(s) {
        var d = document.createElement('div');
        d.textContent = s == null ? '' : s;
        return d.innerHTML;
    }

    function renderVault() {
        var grid = document.getElementById('answer-grid');
        if (!grid) return;
        if (answers.length === 0) {
            grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">No answers yet. Add your first STAR story above.</div>';
            return;
        }
        grid.innerHTML = answers.map(function (a, idx) {
            return '<div class="answer-card">' +
                '<span class="tag-badge ' + (TAG_CLASSES[a.tag] || 'tag-other') + '">' + (TAG_LABELS[a.tag] || 'Other') + '</span>' +
                '<h3>' + esc(a.question) + '</h3>' +
                '<div class="star-section"><span class="star-label">Situation / Task</span><div class="star-text">' + esc(a.st) + '</div></div>' +
                '<div class="star-section"><span class="star-label">Action</span><div class="star-text">' + esc(a.a) + '</div></div>' +
                '<div class="star-section"><span class="star-label">Result</span><div class="star-text">' + esc(a.r) + '</div></div>' +
                '<div class="card-actions">' +
                    '<button type="button" class="practice-btn" data-idx="' + idx + '">🎙 Practice</button>' +
                    '<button type="button" class="delete-btn" data-idx="' + idx + '">✕</button>' +
                '</div>' +
            '</div>';
        }).join('');

        document.querySelectorAll('.practice-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                openPracticeModal(parseInt(this.getAttribute('data-idx'), 10));
            });
        });
        document.querySelectorAll('.delete-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var idx = parseInt(this.getAttribute('data-idx'), 10);
                if (confirm('Delete this answer?')) {
                    answers.splice(idx, 1);
                    saveAnswers(answers);
                    renderVault();
                }
            });
        });
    }

    var modal = document.getElementById('practice-modal');
    var modalQ = document.getElementById('modal-q');
    var revealBtn = document.getElementById('reveal-btn');
    var closeModalBtn = document.getElementById('close-modal');
    var answerView = document.getElementById('modal-answer-view');
    var mSt = document.getElementById('m-st');
    var mA = document.getElementById('m-a');
    var mR = document.getElementById('m-r');

    function openPracticeModal(idx) {
        var a = answers[idx];
        if (!a) return;
        modalQ.textContent = a.question;
        answerView.style.display = 'none';
        revealBtn.style.display = 'inline-block';
        modal.setAttribute('data-idx', String(idx));
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closePracticeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        answerView.style.display = 'none';
        revealBtn.style.display = 'inline-block';
    }

    revealBtn.addEventListener('click', function () {
        var a = answers[parseInt(modal.getAttribute('data-idx'), 10)];
        if (!a) return;
        mSt.textContent = a.st;
        mA.textContent = a.a;
        mR.textContent = a.r;
        answerView.style.display = 'block';
        revealBtn.style.display = 'none';
    });
    closeModalBtn.addEventListener('click', closePracticeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closePracticeModal(); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) closePracticeModal();
    });

    document.getElementById('add-form').addEventListener('submit', function (e) {
        e.preventDefault();
        var question = document.getElementById('f-question').value.trim();
        var tag = document.getElementById('f-tag').value;
        var st = document.getElementById('f-st').value.trim();
        var a = document.getElementById('f-a').value.trim();
        var r = document.getElementById('f-r').value.trim();
        if (!question || !st || !a || !r) return;
        answers.push({ question: question, tag: tag, st: st, a: a, r: r, createdAt: new Date().toISOString() });
        saveAnswers(answers);
        renderVault();
        this.reset();
    });

    renderVault();
});
