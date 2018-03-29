(function () {
    window.onload = function() {
        $("#list-button").on("click", getAnimeList);
    }

    // THIS IS NOT WORKING
    var getAnimeList = function() {
        var url = "https://crossorigin.me/https://myanimelist.net/malappinfo.php?u=hiepcan&status=all&type=anime";
        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }
        console.log(xhr);

        // Response handlers.
        xhr.onload = function() {
            var text = xhr.responseText;
            // document.getElementById("demo").innerHTML = xhr.responseText;
            console.log(text);
        };

        xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
        };

        xhr.withCredentials = true;
        xhr.send();
    }

    var createCORSRequest = function (method, url) {
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
})()