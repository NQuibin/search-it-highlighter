/**
 * Google, Bing, and Yahoo icon provided by Freepik: https://www.freepik.com/
 */

import { searchSelectedText, SEARCH_TYPES } from './searchText';

export default class GoogleItPopover {
    constructor() {
        this.popover = null;
    }

    _handleOptionClick = e => {
        const searchType = e.currentTarget.getAttribute('data-searchType');
        searchSelectedText(searchType);
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

        const googleIconURL = chrome.runtime.getURL('assets/google.svg');
        const bingIconURL = chrome.runtime.getURL('assets/bing.svg');
        const yahooIconURL = chrome.runtime.getURL('assets/yahoo.svg');

        this.popover.innerHTML = `
                <div>
                    <span></span>
                    <img 
                        class="search-nq" 
                        src="${googleIconURL}" 
                        alt="Google search" 
                        data-searchType="${SEARCH_TYPES.GOOGLE}" 
                    />
                    <img 
                        class="search-nq" 
                        src="${bingIconURL}" 
                        alt="Bing search" 
                        data-searchType="${SEARCH_TYPES.BING}" 
                    />
                    <img 
                        class="search-nq" 
                        src="${yahooIconURL}" 
                        alt="Yahoo search" 
                        data-searchType="${SEARCH_TYPES.YAHOO}" 
                    />
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
