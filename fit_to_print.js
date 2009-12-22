var url = document.location.href;
var to_go = url;

chrome.extension.sendRequest(null, function(response) {
  active = response;
  if (active) redirectTo();
});


var redirectTo = function() {
  if (url.match(/\/\d{4}\//) && !url.match(/pagewanted=print/)) {
    if (url.match(/\?/)) {
      to_go += '&';
    } else {
      to_go += '?';
    }
    to_go += 'pagewanted=print';
    document.location.href = to_go;
  }
};

// chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
//     redirectTo();
//     sendResponse(true);
// });