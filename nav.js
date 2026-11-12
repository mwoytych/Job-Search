(function () {
    'use strict';

    var path = window.location.pathname;
    var page = path.split('/').pop() || 'index.html';
    if (page === '') page = 'index.html';

    var NAV_ROWS = [
        [
            { href: 'index.html',          label: 'Home' },
            { href: 'interview-prep.html', label: 'Interview Prep' }
        ],
        [
            { href: '#efficiency-heading', label: 'Efficiency Dashboard' },
            { href: '#table-heading',      label: 'All Entries' }
        ]
    ];

    function isActive(href) {
        if (href.startsWith('#')) return false;
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
