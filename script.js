document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxBackdrop = document.querySelector(".lightbox-backdrop");

function openLightbox(source, caption) {
    if (!lightbox || !lightboxImage || !lightboxCaption) {
        return;
    }

    lightboxImage.src = source;
    lightboxImage.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
    if (!lightbox || !lightboxImage || !lightboxCaption) {
        return;
    }

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
    lightboxCaption.textContent = "";
}

document.querySelectorAll(".image-button").forEach((button) => {
    button.addEventListener("click", () => {
        const image = button.querySelector(".project-image");

        if (!image) {
            return;
        }

        openLightbox(image.src, image.alt);
    });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxBackdrop?.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
        closeLightbox();
    }
});
