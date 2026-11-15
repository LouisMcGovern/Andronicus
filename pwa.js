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
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .then(function (reg) {
          reg.update().catch(function () {});
        })
        .catch(function () {});
    });
  }

  /* Keep the website and the home-screen app on the newest version.
   * A home-screen app resumes from memory instead of reloading, so when it comes
   * back to the front we ask the server whether the site has changed, and if it has
   * we reload: straight away on the home page, otherwise next time it's reopened
   * (never in the middle of a game). */
  (function keepFresh() {
    if (!window.fetch || location.protocol !== "https:") return;
    var FILES = ["/index.html", "/app.js", "/styles.css", "/i18n.js"];
    var known = null;
    var hiddenAt = 0;
    var pending = false;

    function fingerprint() {
      return Promise.all(
        FILES.map(function (f) {
          return fetch(f, { method: "HEAD", cache: "no-store" }).then(function (r) {
            return r.ok ? r.headers.get("etag") || r.headers.get("last-modified") || "" : "";
          });
        })
      ).then(function (tags) {
        return tags.join("|");
      });
    }
    function onHome() {
      return !location.hash || location.hash === "#home";
    }
    function check() {
      fingerprint()
        .then(function (fp) {
          if (!fp) return;
          if (known === null) {
            known = fp;
            return;
          }
          if (fp !== known) pending = true;
          if (pending && (onHome() || document.visibilityState === "hidden")) location.reload();
        })
        .catch(function () {});
    }

    window.addEventListener("load", function () {
      setTimeout(check, 1500);
    });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        hiddenAt = Date.now();
        return;
      }
      if (pending) {
        location.reload();
        return;
      }
      if (Date.now() - hiddenAt > 60 * 1000) {
        if ("serviceWorker" in navigator && navigator.serviceWorker.getRegistration) {
          navigator.serviceWorker.getRegistration().then(function (reg) {
            if (reg) reg.update().catch(function () {});
          });
        }
        check();
      }
    });
    function reloadIfHome() {
      if (pending && onHome()) location.reload();
    }
    window.addEventListener("hashchange", reloadIfHome);
    window.addEventListener("popstate", reloadIfHome);
  })();
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
