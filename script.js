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

});

/* =====================
   6. BLOG VIEW ALL (INTERNAL SCROLL)
===================== */
const viewAllBtn = document.getElementById("viewAllBlog");
const blogGrid = document.querySelector(".blog-grid");

if (viewAllBtn && blogGrid) {
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
   BLOG PREVIEW (3 POSTS)
===================== */
const blogCards = document.querySelectorAll(".blog-card");

blogCards.forEach((card, index) => {
    if (index >= 3) {
        card.style.display = "none";
    }
});