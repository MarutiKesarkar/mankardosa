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
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
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
        dialog.querySelector('img').src = button.dataset.image;
        dialog.querySelector('img').alt = button.querySelector('img').alt;
        dialog.querySelector('p').textContent = button.dataset.title;
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
document.querySelector('#year').textContent = new Date().getFullYear();
