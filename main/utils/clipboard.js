function showToast(msg = "Copied to Clipboard") {
    const toast = document.getElementById('copyToast');
    const msgEl = document.getElementById('toastMessage');
    if(msgEl) msgEl.innerText = msg;
    if(toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
}

function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast();
}

function copyRichText(html) {
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'fixed';
    container.style.opacity = '0';
    document.body.appendChild(container);
    window.getSelection().removeAllRanges();
    const range = document.createRange();
    range.selectNode(container);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    document.body.removeChild(container);
    showToast();
}

// Make globally available for inline HTML onclicks if needed
window.copyToClipboard = copyToClipboard;