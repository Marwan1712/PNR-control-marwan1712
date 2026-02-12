function openModal(id) { 
    const el = document.getElementById(id);
    if(el) el.classList.add('active'); 
}

function closeModal(id) { 
    const el = document.getElementById(id);
    if(el) el.classList.remove('active'); 
}

function initModals() {
    window.openModal = openModal; // Expose for HTML onclicks
    window.closeModal = closeModal;

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal-overlay')) {
            event.target.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key.toLowerCase() === 'r') {
            document.getElementById('notepadModal')?.classList.toggle('active');
        }
        if (e.shiftKey && e.key.toLowerCase() === 'e') {
            document.getElementById('noteModal')?.classList.toggle('active');
        }
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        }
    });
}