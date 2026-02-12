

function generateBreakReschedule() {
    const n = document.getElementById('breakName').value.trim() || 'N/A';
    const t = document.getElementById('breakType').value;
    const tm = document.getElementById('breakTime').value.trim() || 'N/A';
    const r = document.getElementById('breakReason').value.trim() || 'long interaction';
    
    const html = `<table style="border-collapse: collapse; width: 400px; font-family: sans-serif; border: 1px solid #4472c4;"><thead><tr style="background-color: #2f5597; color: #fff;"><th colspan="2" style="padding: 10px; border: 1px solid #4472c4;">Reschedule Break/Lunch</th></tr></thead><tbody><tr><td style="background-color: #8ea9db; padding: 10px; border: 1px solid #4472c4; font-weight: bold; width: 40%;">Agent Name</td><td style="background-color: #d9e1f2; padding: 10px; border: 1px solid #4472c4;">${n}</td></tr><tr><td style="background-color: #8ea9db; padding: 10px; border: 1px solid #4472c4; font-weight: bold;">Break / Lunch</td><td style="background-color: #d9e1f2; padding: 10px; border: 1px solid #4472c4;">${t}</td></tr><tr><td style="background-color: #8ea9db; padding: 10px; border: 1px solid #4472c4; font-weight: bold;">Scheduled Time</td><td style="background-color: #d9e1f2; padding: 10px; border: 1px solid #4472c4;">${tm}</td></tr><tr><td style="background-color: #8ea9db; padding: 10px; border: 1px solid #4472c4; font-weight: bold;">Reason</td><td style="background-color: #d9e1f2; padding: 10px; border: 1px solid #4472c4;">${r}</td></tr></tbody></table>`;
    
    copyRichText(html);
    closeModal('breakModal');
}

function initBreaks() {
    document.getElementById('btnGenerateBreak')?.addEventListener('click', generateBreakReschedule);
}