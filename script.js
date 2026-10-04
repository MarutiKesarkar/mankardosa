let currentLanguage = 'en';
let activeGalleryButton = null;

function translate(key) {
    return translations[key][currentLanguage];
}

function updateLightbox() {
    if (!activeGalleryButton) return;
    dialog.querySelector('img').src = activeGalleryButton.dataset.image;
    dialog.querySelector('img').alt = activeGalleryButton.querySelector('img').alt;
    dialog.querySelector('p').textContent = activeGalleryButton.dataset.title;
}

function setLanguage(language) {
    currentLanguage = language === 'mr' ? 'mr' : 'en';
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        element.textContent = translate(element.dataset.i18n);
    });
    ['alt', 'aria-label', 'data-title', 'content'].forEach(attribute => {
        document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
            element.setAttribute(attribute, translate(element.getAttribute(`data-i18n-${attribute}`)));
        });
    });
    document.querySelectorAll('[data-language]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.language === currentLanguage));
    });
    toggle.setAttribute('aria-label', translate(toggle.getAttribute('aria-expanded') === 'true' ? 'navClose' : 'navOpen'));
    document.querySelectorAll('[data-menu-enquiry]').forEach(link => {
        const url = new URL(link.href);
        url.searchParams.set('text', translate('menuMessage'));
        link.href = url.href;
    });
    document.querySelector('#year').textContent = new Intl.NumberFormat(currentLanguage, {
        useGrouping: false
    }).format(new Date().getFullYear());
    updateLightbox();
    try {
        localStorage.setItem('mankar-dosa-language', currentLanguage);
    } catch {
        // Switching still works when browser storage is unavailable.
    }
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealElements = document.querySelectorAll('[data-reveal]');

function showElement(element) {
    element.classList.remove('opacity-0', 'translate-y-[25px]');
}

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                showElement(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    revealElements.forEach(element => {
        element.classList.add('opacity-0', 'translate-y-[25px]');
        observer.observe(element);
    });

    reducedMotion.addEventListener('change', event => {
        if (event.matches) {
            observer.disconnect();
            revealElements.forEach(showElement);
        }
    });
}

const nav = document.querySelector('#main-navigation');
const toggle = document.querySelector('[data-nav-toggle]');

function setMenuOpen(open) {
    nav.classList.toggle('hidden', !open);
    nav.classList.toggle('flex', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', translate(open ? 'navClose' : 'navOpen'));
}

toggle.addEventListener('click', () => {
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
});
nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        toggle.focus();
    }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', () => setMenuOpen(false));

const filterButtons = document.querySelectorAll('[data-filter]');
const foodCards = document.querySelectorAll('[data-category]');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(filter => {
            filter.setAttribute('aria-pressed', String(filter === button));
        });
        foodCards.forEach(card => {
            card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
            showElement(card);
        });
    });
});

const dialog = document.querySelector('#lightbox');
document.querySelectorAll('[data-image]').forEach(button => {
    button.addEventListener('click', () => {
        activeGalleryButton = button;
        updateLightbox();
        dialog.showModal();
    });
});
dialog.querySelector('[data-close-lightbox]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
    if (event.target === dialog) {
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) {
            dialog.close();
        }
    }
});
document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.language));
});
let savedLanguage = 'en';
try {
    savedLanguage = localStorage.getItem('mankar-dosa-language') || 'en';
} catch {
    // Use English initially when browser storage is unavailable.
}
setLanguage(savedLanguage);
