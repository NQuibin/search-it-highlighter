import GoogleItPopover from './googleItPopover';
import { searchSelectedText, SEARCH_TYPES } from './searchText';

import '../styles/popover.scss';

const TRIGGER_KEYS = ['g', 'G'];

let popover = new GoogleItPopover();
let keyPressCount = 0;

const destroyGoogleItHighlighter = () => {
    popover.destroy();
};

const createGoogleItHighlighter = e => {
    if (TRIGGER_KEYS.includes(e.key)) {
        keyPressCount += 1;
    }

    setTimeout(() => {
        if (keyPressCount === 1) {
            popover.create();
        }

        if (keyPressCount > 1) {
            searchSelectedText(SEARCH_TYPES.GOOGLE);
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
