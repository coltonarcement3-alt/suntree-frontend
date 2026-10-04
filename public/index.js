if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/uv/uv.sw.js", { scope: "/uv/" })
    .then(() => console.log("UV service worker registered"))
    .catch((error) => console.error("UV service worker failed to register:", error));
}

const form = document.getElementById("uv-form");
const addressInput = document.getElementById("uv-address");
const errorBox = document.getElementById("uv-error");
const loadingEl = document.getElementById("loading");

if (form && addressInput) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const raw = addressInput.value.trim();
    if (!raw) return;

    errorBox?.classList.remove("show");
    loadingEl?.classList.add("show");

    let target = raw;

    if (!/^https?:\/\//i.test(raw) && !raw.includes(".")) {
      target = `https://www.google.com/search?q=${encodeURIComponent(raw)}`;
    } else if (!/^https?:\/\//i.test(raw)) {
      target = `https://${raw}`;
    }

    const uvPrefix = "/uv/service/";
    window.location.href = `${uvPrefix}${encodeURIComponent(target)}`;
  });
}

window.addEventListener("load", () => {
  addressInput?.focus();
});
