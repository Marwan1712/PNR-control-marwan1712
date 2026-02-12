const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        showToast("Copied to Clipboard");
    });
};

const copyRichText = (html) => {
    const blob = new Blob([html], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blob })];
    navigator.clipboard.write(data);
};