//Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}
var app_id = "5e802351";
var app_key = "13bf29d458997ee7632f5d5a606996a3";
// Make the actual CORS request.
function makeCorsRequest() {
  let recipe = document.getElementById("recipe").value;
  let pre = document.getElementById("response");

  var url =
    "https://api.edamam.com/api/nutrition-details?app_id=" +
    app_id +
    "&app_key=" +
    app_key;

  var xhr = createCORSRequest("POST", url);
  if (!xhr) {
    alert("CORS not supported");
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    pre.innerHTML = text;
  };

  xhr.onerror = function() {
    alert("Woops, there was an error making the request.");
  };

  pre.innerHTML = "Loading...";
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(recipe);
}
