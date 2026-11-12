(function () {
    'use strict';

    var path = window.location.pathname;
    var page = path.split('/').pop() || 'index.html';
    if (page === '') page = 'index.html';

    var NAV_ROWS = [
        [
            { href: 'index.html',          label: 'Home' },
            { href: 'interview-prep.html', label: 'Interview Prep' }
        ]
    ];

    function isActive(href) {
        if (href.charAt(0) === '#') return false;
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

    container.innerHTML = buildRow(NAV_ROWS[0]);
})();
