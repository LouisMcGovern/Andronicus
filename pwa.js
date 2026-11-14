/* Andronicus web app: registers the offline helper and shows "Install the app"
 * where the device can install it (Chrome / Edge / Android directly; iPhone & iPad
 * via Share → Add to Home Screen). Hidden once the app is installed. */
(function () {
  "use strict";

  var isStandalone =
    (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
    window.navigator.standalone === true;
  var ua = navigator.userAgent || "";
  var isIos = /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && "ontouchend" in document);
  var deferredPrompt = null;

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    });
  }
  if (isStandalone) document.documentElement.classList.add("is-installed-app");

  function buttons() {
    return document.querySelectorAll(".install-app-btn");
  }
  function showButtons(show) {
    buttons().forEach(function (b) {
      b.classList.toggle("hidden", !show);
    });
  }

  var tip = document.getElementById("install-ios-tip");
  function showIosTip(show) {
    if (tip) tip.classList.toggle("hidden", !show);
  }
  if (tip) {
    var close = tip.querySelector(".install-ios-tip__close");
    if (close)
      close.addEventListener("click", function () {
        showIosTip(false);
      });
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); // keep it for our own button
    deferredPrompt = e;
    if (!isStandalone) showButtons(true);
  });
  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;
    showButtons(false);
    showIosTip(false);
  });

  // iPhone / iPad Safari never fires beforeinstallprompt: offer the instructions instead
  if (isIos && !isStandalone) showButtons(true);

  document.addEventListener("click", function (e) {
    var btn = e.target && e.target.closest ? e.target.closest(".install-app-btn") : null;
    if (!btn) return;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () {
        deferredPrompt = null;
        showButtons(false);
      });
    } else if (isIos) {
      showIosTip(true);
    }
  });
})();
