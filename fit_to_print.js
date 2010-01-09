var url = document.location.href;
var host = document.location.host;
var to_go = url;

var sites = {
  'nytimes.com': {
	'host': 'nytimes.com',
    'url_pattern': /\/\d{4}\/\d{2}\/\d{2}/i,
    'print_pattern': /pagewanted=print/i,
    'method': function() {
      if (hasParams(url)) {
        to_go += '&';
      } else {
        to_go += '?';
      }
      return to_go += this.params;
    },
    'params': 'pagewanted=print'
  },
  'thenation.com': {
	'host': 'thenation.com',
    'url_pattern': /\/doc\/\d+\//i,
    'print_pattern': /\/print/i,
    'method': function() {
		return to_go += this.params;
	},
    'params': '/print'
  },
  'washingtonpost.com': {
	'host': 'washingtonpost.com',
    'url_pattern': /\/wp-dyn\/content\/article\//i,
    'print_pattern': /_pf\.html/i,
    'method': function() {
		return to_go.replace(/\.html.*$/i, this.params)
	},
    'params': '_pf.html'
  },
  'nypost.com': {
	'host': 'nypost.com',
    'url_pattern': /\/p\/news\//i,
    'print_pattern': /\/f\/print\/news\//i,
    'method': function() {
		return to_go.replace(this.url_pattern, this.params)
	},
    'params': '/f/print/news/'
  },
  'boston.com': {
	'host': 'boston.com',
    'url_pattern': /\/articles\//i,
    'print_pattern': /mode=PF/i,
    'method': function() {
      if (hasParams(url)) {
        to_go += '&';
      } else {
        to_go += '?';
      }
      return to_go += this.params;
	},
    'params': 'mode=PF'
  }
};

chrome.extension.sendRequest(null, function(response) {
  active = response;
  if (active) redirectTo();
});


var redirectTo = function() {
  for (s in sites) {
	site = sites[s];
    if (host.match(site["host"]) && url.match(site["url_pattern"]) && !url.match(site["print_pattern"])) {
      to_go = site["method"](site["params"]);
      document.location.href = to_go;
    }
  }
};

var hasParams = function(u)  {
  return u.match(/\?/);
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    redirectTo();
    sendResponse({});
});