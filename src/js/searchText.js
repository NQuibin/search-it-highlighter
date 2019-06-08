export const SEARCH_TYPES = {
    GOOGLE: 'google',
    BING: 'bing',
    YAHOO: 'yahoo'
};

const getSelectedText = () => {
    const selection = window.getSelection;
    const text = selection && selection().toString();
    const trimmedText = text && text.trim();

    return trimmedText ? trimmedText : '';
};

const buildGoogleURL = text => {
    return `http://www.google.com/search?q=${encodeURIComponent(text)}`;
};

const buildBingURL = text => {
    return `https://www.bing.com/search?q=${encodeURIComponent(text)}`;
};

const buildYahooURL = text => {
    return `https://search.yahoo.com/search;?p=${encodeURIComponent(text)}`;
};

const doSearch = (text, type) => {
    if (!text) {
        return;
    }

    let url = '';

    switch (type) {
        case SEARCH_TYPES.GOOGLE:
            url = buildGoogleURL(text);
            break;
        case SEARCH_TYPES.BING:
            url = buildBingURL(text);
            break;
        case SEARCH_TYPES.YAHOO:
            url = buildYahooURL(text);
            break;
        default:
            return;
    }

    window.open(url);
};

export const searchSelectedText = type => {
    const text = getSelectedText();
    doSearch(text, type);
};
