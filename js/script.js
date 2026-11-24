(() => {
    'use strict';

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function createSvgElement(tag, attrs) {
        const el = document.createElementNS(SVG_NS, tag);
        Object.entries(attrs).forEach(([key, value]) => {
            el.setAttribute(key, value);
        });
        return el;
    }

    function createDotsIcon() {
        const svg = createSvgElement('svg', {
            viewBox: '0 0 24 24',
            fill: 'currentColor',
            'aria-hidden': 'true',
        });
        [5, 12, 19].forEach((cy) => {
            svg.appendChild(createSvgElement('circle', {
                cx: '12',
                cy: String(cy),
                r: '1.75',
            }));
        });
        return svg;
    }

    function createCheckIcon() {
        const svg = createSvgElement('svg', {
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'aria-hidden': 'true',
        });
        svg.appendChild(createSvgElement('polyline', {
            points: '20 6 9 17 4 12',
        }));
        return svg;
    }

    function isSafeCopyValue(rawValue) {
        if (typeof rawValue !== 'string') return false;
        const value = rawValue.trim();
        if (!value || value.length > 2048 || /[\r\n\u0000-\u001F\u007F]/.test(value)) {
            return false;
        }
        if (EMAIL_PATTERN.test(value)) {
            return true;
        }
        try {
            const parsed = new URL(value);
            return parsed.protocol === 'https:';
        } catch {
            return false;
        }
    }

    function getCanonicalShareUrl() {
        if (window.location.protocol === 'https:' || window.location.protocol === 'http:') {
            return `${window.location.origin}${window.location.pathname}`;
        }
        return window.location.href;
    }

    async function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return;
        }

        const input = document.createElement('textarea');
        input.value = text;
        input.className = 'copy-fallback-input';
        input.setAttribute('readonly', '');
        input.setAttribute('aria-hidden', 'true');
        input.tabIndex = -1;
        document.body.appendChild(input);

        try {
            input.select();
            input.setSelectionRange(0, text.length);
            document.execCommand('copy');
        } finally {
            input.remove();
        }
    }

    // Share page button (canonical URL only, stripping arbitrary query/hash)
    const shareBtn = document.getElementById('sharePageBtn');
    const shareLabel = document.getElementById('sharePageLabel');
    let shareTimer = null;

    if (shareBtn && shareLabel) {
        shareBtn.addEventListener('click', async () => {
            try {
                await copyToClipboard(getCanonicalShareUrl());
                shareLabel.textContent = 'Tersalin!';
                clearTimeout(shareTimer);
                shareTimer = setTimeout(() => {
                    shareLabel.textContent = 'Bagikan';
                }, 1800);
            } catch {
                // Ignore clipboard errors
            }
        });
    }

    // Copy individual link/email buttons (DOM-safe SVG node creation)
    document.querySelectorAll('.copy-btn').forEach((btn) => {
        btn.replaceChildren(createDotsIcon());
        let timer = null;

        btn.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();

            const rawUrl = btn.getAttribute('data-copy-url');
            if (!isSafeCopyValue(rawUrl)) return;

            try {
                await copyToClipboard(rawUrl.trim());
                btn.replaceChildren(createCheckIcon());
                btn.classList.add('copied');
                clearTimeout(timer);
                timer = setTimeout(() => {
                    btn.replaceChildren(createDotsIcon());
                    btn.classList.remove('copied');
                }, 1800);
            } catch {
                // Ignore clipboard errors
            }
        });
    });

    // Brochure Lightbox Modal
    const brochureModal = document.getElementById('brochureModal');
    const openBrochureBtn = document.getElementById('openBrochureModalBtn');
    const closeBrochureBtn = document.getElementById('closeBrochureModalBtn');
    const closeBrochureBackdrop = document.getElementById('closeBrochureBackdrop');
    let lastFocusedElement = null;

    function openBrochureModal() {
        if (!brochureModal) return;
        lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        brochureModal.classList.add('open');
        brochureModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        if (closeBrochureBtn) closeBrochureBtn.focus();
    }

    function closeBrochureModal() {
        if (!brochureModal) return;
        brochureModal.classList.remove('open');
        brochureModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }

    if (openBrochureBtn) openBrochureBtn.addEventListener('click', openBrochureModal);
    if (closeBrochureBtn) closeBrochureBtn.addEventListener('click', closeBrochureModal);
    if (closeBrochureBackdrop) closeBrochureBackdrop.addEventListener('click', closeBrochureModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && brochureModal && brochureModal.classList.contains('open')) {
            closeBrochureModal();
        }
    });
})();
