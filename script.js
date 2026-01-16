const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
    navToggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
}

const yearSpan = document.getElementById("year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxBackdrop = document.querySelector(".lightbox-backdrop");

let lastFocusedElement = null;

let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

function applyTransform() {
    if (!lightboxImg) return;
    lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function resetZoom() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    lightbox?.classList.remove("is-zoomed");
    lightbox?.classList.remove("is-dragging");
    applyTransform();
}

function setZoom(newScale, cx = null, cy = null) {
    if (!lightboxImg) return;

    const prev = scale;
    scale = clamp(newScale, 1, 4);

    if (scale > 1) lightbox.classList.add("is-zoomed");
    else lightbox.classList.remove("is-zoomed");

    if (cx !== null && cy !== null && prev !== scale) {
        const rect = lightboxImg.getBoundingClientRect();
        const ox = cx - (rect.left + rect.width / 2);
        const oy = cy - (rect.top + rect.height / 2);

        const factor = scale / prev;
        translateX = translateX * factor + ox * (1 - factor);
        translateY = translateY * factor + oy * (1 - factor);
    }

    applyTransform();
}

function openLightbox(src, captionText) {
    if (!lightbox || !lightboxImg) return;

    lastFocusedElement = document.activeElement;
    resetZoom();

    lightboxImg.onerror = () => {
        if (lightboxCaption) {
            lightboxCaption.textContent = (captionText || "") + " (afbeelding niet gevonden: check pad/bestandsnaam)";
        }
    };

    lightboxImg.src = src;
    lightboxImg.alt = captionText || "Vergrote afbeelding";
    if (lightboxCaption) lightboxCaption.textContent = captionText || "";

    lightbox.classList.add("is-visible");
    lightbox.setAttribute("aria-hidden", "false");

    if (lightboxClose) lightboxClose.focus();
}

function closeLightbox() {
    if (!lightbox || !lightboxImg) return;

    lightbox.classList.remove("is-visible", "is-zoomed", "is-dragging");
    lightbox.setAttribute("aria-hidden", "true");

    lightboxImg.src = "";
    lightboxImg.onerror = null;

    resetZoom();

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
    }
}

document.querySelectorAll(".lightbox-trigger").forEach((el) => {
    el.addEventListener("click", () => {
        const img = el.querySelector("img");
        const src = el.getAttribute("data-full") || (img ? (img.currentSrc || img.src) : "");
        const caption = img ? img.alt : "";
        if (src) openLightbox(src, caption);
    });
});

document.querySelectorAll(".project-media").forEach((media) => {
    // Als het al een lightbox-trigger is, overslaan (anders dubbel)
    if (media.classList.contains("lightbox-trigger")) return;

    const img = media.querySelector("img");
    if (!img) return;

    media.style.cursor = "zoom-in";
    media.addEventListener("click", () => {
        const src = media.getAttribute("data-full") || (img.currentSrc || img.src);
        const caption = img.alt || "";
        if (src) openLightbox(src, caption);
    });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox?.classList.contains("is-visible")) closeLightbox();
});

if (lightboxImg) {
    lightboxImg.addEventListener("click", (e) => {
        if (!lightbox?.classList.contains("is-visible")) return;
        if (scale === 1) setZoom(2, e.clientX, e.clientY);
        else resetZoom();
    });

    lightboxImg.addEventListener("dblclick", () => {
        if (!lightbox?.classList.contains("is-visible")) return;
        resetZoom();
    });

    lightboxImg.addEventListener("wheel", (e) => {
        if (!lightbox?.classList.contains("is-visible")) return;
        e.preventDefault();
        const step = e.deltaY < 0 ? 0.15 : -0.15;
        setZoom(scale + step, e.clientX, e.clientY);
    }, { passive: false });

    lightboxImg.addEventListener("mousedown", (e) => {
        if (!lightbox?.classList.contains("is-visible")) return;
        if (scale <= 1) return;
        isDragging = true;
        lightbox.classList.add("is-dragging");
        dragStartX = e.clientX - translateX;
        dragStartY = e.clientY - translateY;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        translateX = e.clientX - dragStartX;
        translateY = e.clientY - dragStartY;
        applyTransform();
    });

    document.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        lightbox?.classList.remove("is-dragging");
    });
}

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
    navToggle.addEventListener("click", () => nav.classList.toggle("open"));

    nav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => nav.classList.remove("open"));
    });
}

const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

