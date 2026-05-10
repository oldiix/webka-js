const createSlider = (containerId, config) => {
    const defaults = {
        slides: [],
        duration: 500,
        autoplay: false,
        autoplayInterval: 3000,
        showArrows: true,
        showDots: true
    };
    const opts = {...defaults, ...config};

    const container = document.getElementById(containerId);
    if (!container || opts.slides.length === 0) return;

    let currentIndex = 0;
    let autoplayId = null;
    let isHovered = false;

    container.innerHTML = `
        <div class="slider">
            <div class="slider-track" style="transition-duration: ${opts.duration}ms"></div>
            ${opts.showArrows ? `
                <button class="slider-arrow prev" aria-label="Попередній">‹</button>
                <button class="slider-arrow next" aria-label="Наступний">›</button>
            ` : ''}
            ${opts.showDots ? '<div class="slider-dots"></div>' : ''}
        </div>
    `;

    const sliderEl = container.querySelector('.slider');
    const trackEl = container.querySelector('.slider-track');
    const dotsEl = container.querySelector('.slider-dots');

    opts.slides.forEach(slide => {
        const slideEl = document.createElement('div');
        slideEl.className = 'slide';
        slideEl.innerHTML = `
            <img src="${slide.src}" alt="${slide.caption || ''}">
            ${slide.caption ? `<div class="slide-caption">${slide.caption}</div>` : ''}
        `;
        trackEl.appendChild(slideEl);
    });

    if (opts.showDots && dotsEl) {
        opts.slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.dataset.index = i;
            dot.setAttribute('aria-label', `Слайд ${i + 1}`);
            dotsEl.appendChild(dot);
        });
    }

    const updateSlider = () => {
        trackEl.style.transform = `translateX(-${currentIndex * 100}%)`;
        if (dotsEl) {
            dotsEl.querySelectorAll('.slider-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
    };

    const goToNext = () => {
        currentIndex = (currentIndex + 1) % opts.slides.length;
        updateSlider();
    };

    const goToPrev = () => {
        currentIndex = (currentIndex - 1 + opts.slides.length) % opts.slides.length;
        updateSlider();
    };

    const goToIndex = (index) => {
        currentIndex = index;
        updateSlider();
    };

    const startAutoplay = () => {
        if (!opts.autoplay) return;
        stopAutoplay();
        autoplayId = setInterval(() => {
            if (!isHovered) goToNext();
        }, opts.autoplayInterval);
    };

    const stopAutoplay = () => {
        if (autoplayId) {
            clearInterval(autoplayId);
            autoplayId = null;
        }
    };

    if (opts.showArrows) {
        sliderEl.querySelector('.prev').addEventListener('click', goToPrev);
        sliderEl.querySelector('.next').addEventListener('click', goToNext);
    }

    if (opts.showDots && dotsEl) {
        dotsEl.addEventListener('click', (e) => {
            const dot = e.target.closest('.slider-dot');
            if (!dot) return;
            goToIndex(parseInt(dot.dataset.index, 10));
        });
    }

    sliderEl.addEventListener('mouseenter', () => {
        isHovered = true;
    });
    sliderEl.addEventListener('mouseleave', () => {
        isHovered = false;
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToPrev();
        else if (e.key === 'ArrowRight') goToNext();
    });

    updateSlider();
    startAutoplay();
};


const killBillSlides = [
    {
        src: 'img/bride.jpg',
        caption: 'The Bride'
    },
    {
        src: 'img/crazy88.jpg',
        caption: 'Crazy 88'
    },
    {
        src: 'img/blue.jpg',
        caption: 'House of Blue Leaves'
    },
    {
        src: 'img/bill.jpg',
        caption: 'O-Ren Ishii'
    },
    {
        src: 'img/yellow.jpg',
        caption: 'Yellow Tracksuit'
    },
    {
        src: 'img/vol2.jpg',
        caption: 'Vol. 2'
    }
];

createSlider('slider-container', {
    slides: killBillSlides,
    duration: 500,
    autoplay: true,
    autoplayInterval: 3500,
    showArrows: true,
    showDots: true
});