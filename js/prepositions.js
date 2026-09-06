(function () {
  'use strict';

  var words = [
    'без', 'в', 'во', 'для', 'до', 'за', 'из', 'из-за', 'к', 'ко',
    'на', 'над', 'о', 'об', 'от', 'по', 'под', 'при', 'с', 'со',
    'у', 'через', 'а', 'и', 'но', 'же', 'ли', 'бы', 'не', 'ни'
  ];

  words.sort(function (a, b) {
    return b.length - a.length;
  });

  var NBSP = '\u00A0';

  var pattern = new RegExp(
    '(?<![\\p{L}\\p{N}])(' + words.join('|') + ')(?![\\p{L}\\p{N}])([ \\t]+)',
    'giu'
  );

  function processRoot(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        var tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' ||
            tag === 'CODE' || tag === 'PRE' || tag === 'TEXTAREA') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(function (node) {
      node.nodeValue = node.nodeValue.replace(pattern, function (match, word) {
        return word + NBSP;
      });
    });
  }

  function run() {
    processRoot(document.body);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();