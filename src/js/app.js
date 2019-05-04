import GoogleItPopover from './googleItPopover';

import '../styles/popover.scss';

const TRIGGER_KEYS = ['g', 'G'];

let popover = null;
let keyPressCount = 0;

const createGoogleItHighlighter = e => {
    if (!popover) {
        popover = new GoogleItPopover();
    }

    if (TRIGGER_KEYS.includes(e.key)) {
        popover.create();
        keyPressCount += 1;
    }

    const doubleKeyPressTimeout = setTimeout(() => {
        keyPressCount = 0;
    }, 300);

    if (keyPressCount === 2) {
        popover.quickSearch();
        keyPressCount = 0;
        clearTimeout(doubleKeyPressTimeout);
    }
};

const destroyGoogleItHighlighter = () => {
    if (popover) {
        popover.destroy();
        popover = null;
    }
};

const init = () => {
    window.addEventListener('keyup', createGoogleItHighlighter);
    document.addEventListener('selectionchange', destroyGoogleItHighlighter);
};

const readyStateCheckInterval = setInterval(() => {
    if (document.readyState === 'complete') {
        clearInterval(readyStateCheckInterval);
        init();
    }
}, 10);