var url = document.location.href;
var host = document.location.host;
var to_go = url;

var sites = {
  'nytimes.com': {
    'host': 'nytimes.com',
    'url_pattern': /\/\d{4}\/\d{2}\/\d{2}/i,
    'print_pattern': /pagewanted=print/i,
    'url_formatter': function() {
      to_go = prepareURL(to_go);
      return to_go += this.params;
    },
    'params': 'pagewanted=print&pagemode=print'
  },
  'thenation.com': {
    'host': 'thenation.com',
    'url_pattern': /\/doc\/\d+\//i,
    'print_pattern': /\/print/i,
    'url_formatter': function() {
      return to_go += this.params;
    },
    'params': '/print'
  },
  'washingtonpost.com': {
    'host': 'washingtonpost.com',
    'url_pattern': /\/wp-dyn\/content\/article\//i,
    'print_pattern': /_pf\.html/i,
    'url_formatter': function() {
      return to_go.replace(/\.html.*$/i, this.params)
    },
    'params': '_pf.html'
  },
  'nypost.com': {
    'host': 'nypost.com',
    'url_pattern': /\/p\/news\//i,
    'print_pattern': /\/f\/print\/news\//i,
    'url_formatter': function() {
      return to_go.replace(this.url_pattern, this.params)
    },
    'params': '/f/print/news/'
  },
  'boston.com': {
    'host': 'boston.com',
    'url_pattern': /\/articles\//i,
    'print_pattern': /mode=PF/i,
    'url_formatter': function() {
      to_go = prepareURL(to_go);
      return to_go += this.params;
    },
    'params': 'mode=PF'
  },
  'alternet.org': {
    'host': 'www.alternet.org',
    'url_pattern': /\/.*?\/\d+/i,
    'print_pattern': /module\/printversion\//i,
    'url_formatter': function() {
      article_id = to_go.match(/\/\d+\//);
      to_go = 'http://' + this.host + this.params + article_id;
      return to_go;
    },
    'params': '/module/printversion/'
  },
  'crainsnewyork.com': {
    'host': 'crainsnewyork.com',
    'url_pattern': /\/article\//i,
    'print_pattern': /template=printart/i,
    'url_formatter': function() {
      to_go = prepareURL(to_go);
      return to_go += this.params;
    },
    'params': 'template=printart'
  },
  'newyorker.com': {
    'host': 'www.newyorker.com',
    'url_pattern': /\/\d{4}\/\d{2}\//i,
    'print_pattern': /printable=true/i,
    'url_formatter': function() {
      to_go = prepareURL(to_go);
      return to_go += this.params;
    },
    'params': 'printable=true&currentPage=all'
  },
  'technologyreview.com': {
    'host': 'technologyreview.com',
    'url_pattern': /\/\d+\//i,
    'print_pattern': /printer_friendly_article.aspx/i,
    'url_formatter': function() {
      article_id = to_go.match(/\d+/);
      to_go = 'http://' + this.host + this.params + article_id;
      return to_go;
    },
    'params': '/printer_friendly_article.aspx?id='
  },
  'slate.com': {
    'host': 'slate.com',
    'url_pattern': /id\/\d+\//i,
    'print_pattern': /action=print/i,
    'url_formatter': function() {
      article_id = to_go.match(/\d+/);
      to_go = 'http://' + this.host + this.params + article_id;
      return to_go;
    },
    'params': '/toolbar.aspx?action=print&id='
  },
  'abcnews.go.com': {
    'host': 'abcnews.go.com',
    'url_pattern': /story\?id=\d+/i,
    'print_pattern': /\/print/i,
    'url_formatter': function() {
      article_id = to_go.match(/\d+/);
      to_go = 'http://' + this.host + this.params + article_id;
      return to_go;
    },
    'params': '/print?id='
  }
};

chrome.extension.sendRequest(null, function(response) {
  active = response;
  if (active) redirectTo();
});


var redirectTo = function() {
  for (s in sites) {
    site = sites[s];
    if (host.match(site.host) && url.match(site.url_pattern) && 
        !url.match(site.print_pattern)) {

      to_go = site.url_formatter(site.params);
      document.location.href = to_go;
    }
  }
};

var prepareURL = function(u) {
  return hasParams(u) ? (u += '&') : (u += '?');
};

var hasParams = function(u)  {
  return u.match(/\?/);
};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    redirectTo();
    sendResponse({});
});