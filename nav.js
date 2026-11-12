(function () {
    'use strict';

    // Determine current page from filename
    var path = window.location.pathname;
    var page = path.split('/').pop() || 'index.html';
    if (page === '') page = 'index.html';

    // Define nav items — first array = row 1, second array = row 2
    var NAV_ROWS = [
        [
            { href: 'index.html',         label: 'Home' },
            { href: 'what-to-know.html',  label: 'What Should I Know?' },
            { href: 'algebraic-mechanics.html', label: 'Algebraic Mechanics' },
            { href: 'worked-examples.html',     label: 'Worked Examples' },
            { href: 'exam-practice.html',       label: 'Exam Practice' },
            { href: 'random-practice.html',     label: 'Random Practice' },
            { href: 'challenge-exam.html',      label: 'Challenge Exam' },
            { href: 'confidence-check.html',    label: 'Confidence Check' },
            { href: 'calculators.html',         label: 'Calculators' }
        ],
        [
            { href: 'formula-reference.html',   label: 'Formula Reference' },
            { href: 'graph-explorer.html',      label: 'Graph Explorer' },
            { href: 'study-resources.html',     label: 'Study Resources' },
            { href: 'math-lab-companion.html',  label: 'Math Lab Companion' },
            { href: 'common-mistakes.html',     label: 'Common Mistakes' },
            { href: 'cheat-sheet.html',         label: 'Cheat Sheet' }
        ]
    ];

    function isActive(href) {
        // Normalize: strip leading ./ or /
        var clean = href.replace(/^\.?\//, '');
        return page === clean;
    }

    function buildRow(items) {
        var html = '<ul>';
        items.forEach(function (item) {
            var current = isActive(item.href) ? ' aria-current="page"' : '';
            html += '<li><a href="' + item.href + '"' + current + '>' + item.label + '</a></li>';
        });
        html += '</ul>';
        return html;
    }

    var container = document.getElementById('site-nav');
    if (!container) return;

    var output = '';
    NAV_ROWS.forEach(function (row, i) {
        if (i > 0) output += '<div class="nav-separator" role="separator"></div>';
        output += buildRow(row);
    });

    container.innerHTML = output;
})();
