/**
 * Google icon provided by Freepik: https://www.freepik.com/
 * PDF and DOC icon provided by Dimitry Miroliubov: https://www.flaticon.com/authors/dimitry-miroliubov
 */

import { searchSelectedText } from './searchText';

export default class GoogleItPopover {
    constructor() {
        this.popover = null;
    }

    _handleOptionClick = e => {
        const fileType = e.currentTarget.getAttribute('data-filetype');
        searchSelectedText(fileType);
    };

    _toggleOptionListeners = add => {
        const action = add ? 'addEventListener' : 'removeEventListener';
        const options = this.popover.querySelectorAll(
            '#google-it-highlighter-popover .search-nq'
        );

        for (const option of options) {
            option[action]('click', this._handleOptionClick);
        }
    };

    _getCoordinates = () => {
        const selection = window.getSelection();

        if (selection && selection.type === 'Range' && !selection.isCollapsed) {
            try {
                const range =
                    selection &&
                    selection.rangeCount &&
                    selection.getRangeAt(0).cloneRange();
                const rect = range.getBoundingClientRect();
                const scrollPos = document.documentElement.scrollTop;

                let xPos = rect.left + rect.width / 2 - 55;
                let yPos = rect.top - 45 + scrollPos;
                let searchOptionsClass = 'search-options-nq';
                let tailClass = 'tail';

                if (xPos < 0) {
                    xPos = rect.right + 10;
                    yPos = rect.top + scrollPos - 36;
                    tailClass += '-left';
                    searchOptionsClass += '-horizontal';
                } else if (xPos + 110 >= document.documentElement.clientWidth) {
                    xPos = rect.left - 46;
                    yPos = rect.top + scrollPos - 36;
                    tailClass += '-right';
                    searchOptionsClass += '-horizontal';
                } else if (yPos < 0) {
                    yPos = rect.bottom + 10 + scrollPos;
                    tailClass += '-top';
                }

                return [xPos, yPos, tailClass, searchOptionsClass];
            } catch (e) {
                return [];
            }
        } else {
            return [];
        }
    };

    _createPopover = () => {
        const coordinates = this._getCoordinates();

        if (!coordinates.length) {
            return;
        }

        const [xPos, yPos, tailClass, searchOptionsClass] = coordinates;

        this.popover = document.createElement('div');
        this.popover.id = 'google-it-highlighter-popover';

        const googleIconURL = chrome.runtime.getURL('assets/google.png');
        const pdfIconURL = chrome.runtime.getURL('assets/pdf.png');
        const docIconURL = chrome.runtime.getURL('assets/doc.png');

        this.popover.innerHTML = `
                <div>
                    <span></span>
                    <img class="search-nq" src="${googleIconURL}" alt="Google search" />
                    <img class="search-nq" src="${pdfIconURL}" alt="search PDF files" data-filetype="pdf" />
                    <img class="search-nq" src="${docIconURL}" alt="search doc files" data-filetype="doc" />
                </div>
            `;

        this.popover.style.left = `${xPos}px`;
        this.popover.style.top = `${yPos}px`;
        this.popover.querySelector('span').classList.add(tailClass);
        this.popover.querySelector('div').classList.add(searchOptionsClass);

        this._toggleOptionListeners(true);

        document.body.appendChild(this.popover);
    };

    _destroyPopover = () => {
        if (this.popover) {
            this.popover.style.animation = 'google-it-highlighter-outro 0.25s';
            this.popover.style.animationFillMode = 'forwards';

            this._toggleOptionListeners(false);

            this.popover.addEventListener('animationend', () => {
                if (this.popover) {
                    this.popover.parentNode.removeChild(this.popover);
                }

                this.popover = null;
            });
        }
    };

    create = () => {
        if (this.popover) {
            return false;
        }

        this._createPopover();
        return true;
    };

    destroy = () => {
        if (!this.popover) {
            return false;
        }

        this._destroyPopover();
        return true;
    };
}
