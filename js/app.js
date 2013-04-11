(function () {

    function $(id) { return window.document.getElementById(id); }
    function $$(selector) { return window.document.querySelectorAll(selector); }
    function getHash() { return parseInt(window.location.hash.replace("#",""), 10); }

    function main() {

        var slides = $$("section.slide"),
            hash = getHash(),
            nbr = isNaN(hash) ? 1 : hash,
            current = $$("section.slide")[nbr-1],
            status = $("status"),
            lock = false;

        window.change = function (nid) {
            if (lock) { return; }
            lock = true;
            Zanimo(current).then(function (elt) {
                Zanimo.transition($(nid), "opacity", "1", 200, "ease-in");
                return Zanimo.transition(elt, "opacity", "0", 200, "ease-out");
            }).then(function (elt) {
                for(var i=0; i< slides.length; i++) {
                    slides[i].style.zIndex = 0;
                }
                current = $(nid);
                current.style.zIndex = 1;
                displaySlideNbr(nid);
                lock = false;
            });
        }

        function displaySlideNbr() {
            status.innerHTML = current.id;
        }

        function setHash(id) {
            if (!lock) {
                window.location.hash = "#" + id;
            }
        }

        function onKeyUp(evt) {
            switch(evt.keyCode) {
                case 13:
                    document.body.webkitRequestFullScreen();
                    break;
                case 39:
                    (+current.id >= slides.length) || setHash(+current.id + 1);
                    break;
                case 37:
                    (+current.id <= 1) || setHash(+current.id - 1);
                    break;
            }
        }

        window.addEventListener("hashchange", function(evt) {
            evt.preventDefault();
            var newHash = getHash();
            if (newHash <= slides.length && newHash >= 1) {
                change(newHash);
                displaySlideNbr(newHash);
            }
        }, false);

        Zanimo.transition(current, "opacity", "1", 200, "ease-in")
              .then(function () {
                    current.style.zIndex = 1;
                    displaySlideNbr(nbr);
                    window.document.addEventListener("keyup", onKeyUp, false);
        });
    }

    window.document.addEventListener(
        "DOMContentLoaded",
        main,
        false
    );
})();
