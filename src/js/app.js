import GoogleItPopover from './googleItPopover';
import { searchSelectedText } from './searchText';

import '../styles/popover.scss';

const TRIGGER_KEYS = ['g', 'G'];

let popover = null;
let keyPressCount = 0;

const destroyGoogleItHighlighter = () => {
    if (popover) {
        popover.destroy();
        popover = null;
    }
};

const createGoogleItHighlighter = e => {
    if (TRIGGER_KEYS.includes(e.key)) {
        if (!popover) {
            popover = new GoogleItPopover();
        }

        keyPressCount += 1;
    }

    setTimeout(() => {
        if (keyPressCount === 1) {
            popover.create();
        }

        if (keyPressCount > 1) {
            searchSelectedText();
        }

        keyPressCount = 0;
    }, 200);
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
