export default class GoogleItPopover {
    constructor() {
        this.popover = null;
        this.text = '';
    }

    _doSearch = fileType => {
        let url = `http://www.google.com/search?q=${encodeURIComponent(this.text)}`;

        if (fileType) {
            url += `&as_filetype=${fileType}`;
        }

        window.open(url);
    };

    _handleOptionClick = e => {
        const fileType = e.currentTarget.getAttribute('data-filetype');
        this._doSearch(fileType);
    };

    _toggleOptionListeners = add => {
        const action = add ? 'addEventListener' : 'removeEventListener';
        const options = this.popover.querySelectorAll(
            '.google-it-highlighter-popover .search-nq'
        );

        for (const option of options) {
            option[action]('click', this._handleOptionClick);
        }
    };

    _getCoordinates = () => {
        const selection = window.getSelection();

        if (selection && selection.type === 'Range' && !selection.isCollapsed) {
            const range =
                selection &&
                selection.rangeCount &&
                selection.getRangeAt(0).cloneRange();
            const rects = range && range.getClientRects && range.getClientRects();
            const box = rects && rects.length > 0 && rects[0];

            const scrollPos = document.documentElement.scrollTop;

            let xPos = box.left + box.width / 2 - 55;
            let yPos = box.top - 45 + scrollPos;
            let tailClass = 'tail';

            if (xPos < 0) {
                xPos = box.right + 10;
                yPos = box.top;
                tailClass = 'tail-left';
            } else if (xPos + 110 >= document.documentElement.clientWidth) {
                xPos = box.left - 120;
                yPos = box.top;
                tailClass = 'tail-right';
            } else if (yPos < 0) {
                yPos = box.bottom + 10 + scrollPos;
                tailClass = 'tail-top';
            }

            const text = box && window.getSelection().toString();
            this.text = text && text.trim();

            return [ xPos, yPos, tailClass ];
        } else {
            return [];
        }
    };

    _createPopover = () => {
        const coordinates = this._getCoordinates();

        if (coordinates.length) {
            this.popover = document.createElement('div');
            this.popover.classList.add('google-it-highlighter-popover');

            const googleIconURL = chrome.runtime.getURL('assets/google.png');
            const pdfIconURL = chrome.runtime.getURL('assets/pdf.png');
            const docIconURL = chrome.runtime.getURL('assets/doc.png');

            this.popover.innerHTML = `
                <div class="search-options-nq">
                    <span class="tail"></span>
                    <img class="search-nq" src="${googleIconURL}" alt="Google search" />
                    <img class="search-nq" src="${pdfIconURL}" alt="search PDF files" data-filetype="pdf" />
                    <img class="search-nq" src="${docIconURL}" alt="search doc files" data-filetype="doc" />
                </div>
            `;

            this.popover.style.left = `${coordinates[0]}px`;
            this.popover.style.top = `${coordinates[1]}px`;
            this.popover.querySelector('.tail').classList.replace('tail', coordinates[2]);

            this._toggleOptionListeners(true);

            document.body.appendChild(this.popover);
        }
    };

    _destroyPopover = () => {
        if (this.popover) {
            this.popover.style.animation = 'google-it-highlighter-outro 0.2s';
            this.popover.style.animationFillMode = 'forwards';

            this._toggleOptionListeners(false);

            this.popover.addEventListener('animationend', () => {
                if (this.popover) {
                    this.popover.parentNode.removeChild(this.popover);
                }

                this.popover = null;
                this.text = '';
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

    quickSearch = () => {
        this._doSearch('');
    };
}
