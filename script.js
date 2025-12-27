document.addEventListener("DOMContentLoaded", () => {
    const NAV_HEIGHT = document.querySelector('.navbar')?.offsetHeight || 80;
    const sections = document.querySelectorAll('.section');

    /* =====================
       1. HERO
    ===================== */
    const hero = document.querySelector('#home.section');
    if (hero) hero.classList.add('section-visible');

    /* =====================
       2. INTERSECTION OBSERVER
    ===================== */
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px"
    });

    sections.forEach(section => {
        if (section !== hero) observer.observe(section);
    });

    /* =====================
       3. SMOOTH SCROLL
    ===================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const targetEl = document.querySelector(anchor.getAttribute('href'));
            if (!targetEl) return;

            e.preventDefault();
            window.scrollTo({
                top: targetEl.offsetTop - NAV_HEIGHT,
                behavior: 'smooth'
            });
        });
    });

    /* =====================
       4. CERTIFICATES FILTER
    ===================== */
    const timeline = document.querySelector('.cert-timeline');
    const buttons = document.querySelectorAll('.filter-btn');
    const yearBlocks = document.querySelectorAll('.cert-year');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const year = btn.dataset.year;

            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (year === 'all') {
                timeline.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetYear = document.querySelector(
                `.cert-year[data-year="${year}"]`
            );

            if (!targetYear) return;

            timeline.scrollTo({
                top: targetYear.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    /* =====================
       5. LIGHTBOX CHỨNG CHỈ
    ===================== */
    // tạo overlay lightbox
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.cssText = `
        display: none;
        position: fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background: rgba(0,0,0,0.8);
        justify-content:center;
        align-items:center;
        z-index:9999;
    `;
    const lbImg = document.createElement('img');
    lbImg.style.cssText = `
        max-width:90%;
        max-height:90%;
        border-radius:8px;
    `;
    lightbox.appendChild(lbImg);
    document.body.appendChild(lightbox);

    // click thumbnail mở lightbox
    document.querySelectorAll('.cert-image img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const fullSrc = img.dataset.full || img.src; // ưu tiên ảnh gốc nếu có
            lbImg.src = fullSrc;
            lightbox.style.display = 'flex';
        });
    });

    // click overlay đóng lightbox
    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    /* =====================
    6. BLOG VIEW ALL (LAZY INIT)
    ===================== */
    const blogCards = document.querySelectorAll(".blog-card");
    const viewAllBtn = document.getElementById("viewAllBlog");
    const blogGrid = document.querySelector(".blog-grid");

    if (blogCards.length && blogGrid && viewAllBtn) {

    // ===== PREVIEW: chỉ hiện 3 bài =====
    if (blogCards.length > 3) {
        blogCards.forEach((card, index) => {
        if (index >= 3) card.style.display = "none";
        });
        viewAllBtn.style.display = "inline-block";
    } else {
        viewAllBtn.style.display = "none";
    }

    // ===== VIEW ALL =====
    viewAllBtn.addEventListener("click", (e) => {
        e.preventDefault();

        blogCards.forEach(card => {
        card.style.display = "block";
        });

        blogGrid.classList.add("expanded");
        viewAllBtn.style.display = "none";
    });
    }

    /* =====================
7. PROJECT MODAL (IMAGE + TEXT SYNC)
===================== */

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalMainImage = document.getElementById("modalMainImage");
const modalImages = document.getElementById("modalImages");
const modalImageCaption = document.getElementById("modalImageCaption");
const modalGithub = document.getElementById("modalGithub");
const modalClose = document.querySelector(".modal-close");

/* ===== OPEN MODAL ===== */
document.querySelectorAll(".project-detail-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // set main content
    modalTitle.textContent = btn.dataset.title;
    modalDesc.textContent = btn.dataset.desc;
    modalGithub.href = btn.dataset.github;

    // reset
    modalMainImage.src = "";
    modalImageCaption.textContent = "";
    modalImages.innerHTML = "";

    // parse images + caption
    const images = btn.dataset.images
      .split(",")
      .map(item => {
        const [src, caption] = item.split("|");
        return {
          src: src.trim(),
          caption: caption?.trim() || ""
        };
      })
      .filter(item => item.src);

    // render thumbs
    images.forEach((imgData, index) => {
      const thumb = document.createElement("img");
      thumb.src = imgData.src;
      thumb.loading = "lazy";

      // default image
      if (index === 0) {
        modalMainImage.src = imgData.src;
        modalImageCaption.textContent = imgData.caption;
        thumb.classList.add("active");
      }

      // click thumb
      thumb.addEventListener("click", () => {
  modalImageCaption.classList.add("hide");

  setTimeout(() => {
    modalMainImage.src = imgData.src;
    modalImageCaption.textContent = imgData.caption;
    modalImageCaption.classList.remove("hide");
  }, 150);

  document
    .querySelectorAll(".modal-thumbs img")
    .forEach(i => i.classList.remove("active"));
  thumb.classList.add("active");
});


      modalImages.appendChild(thumb);
    });

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

/* ===== CLOSE MODAL ===== */
const closeModal = () => {
  modal.classList.remove("active");
  document.body.style.overflow = "";
};

// click X
modalClose.addEventListener("click", closeModal);

// click overlay
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});


});



