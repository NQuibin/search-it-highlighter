const getSelectedText = () => {
    const selection = window.getSelection;
    const text = selection && selection().toString();
    const trimmedText = text && text.trim();

    return trimmedText ? trimmedText : '';
};

const searchText = (text, fileType = '') => {
    if (!text) {
        return;
    }

    const url = `http://www.google.com/search?q=${encodeURIComponent(text)}${
        fileType ? `&as_filetype=${fileType}` : ''
    }`;

    window.open(url);
};

export const searchSelectedText = (fileType = '') => {
    const text = getSelectedText();
    searchText(text, fileType);
};
