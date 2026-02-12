let fxdSegments = [];

function addFXDSegment() {
    const id = Date.now();
    fxdSegments.push({ id: id });
    const list = document.getElementById('fxdSegmentsList');
    const el = document.createElement('div');
    el.id = `fxd-seg-${id}`;
    el.className = "p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative group";
    el.innerHTML = `
        <div class="flex items-center justify-between mb-1">
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Segment ${fxdSegments.length}</span>
            <button onclick="removeFXDSegment(${id})" class="text-slate-300 hover:text-red-500 transition-colors">✕</button>
        </div>
        <div class="grid grid-cols-3 gap-2">
            <input type="text" placeholder="Date (22FEB)" class="seg-date w-full px-2 py-2 bg-white border border-slate-200 rounded-lg mono text-[11px] outline-none focus:border-blue-600 uppercase">
            <input type="text" placeholder="AL (AT)" class="seg-airline w-full px-2 py-2 bg-white border border-slate-200 rounded-lg mono text-[11px] outline-none focus:border-blue-600 uppercase">
            <input type="text" placeholder="Dest (CMN)" class="seg-dest w-full px-2 py-2 bg-white border border-slate-200 rounded-lg mono text-[11px] outline-none focus:border-blue-600 uppercase">
        </div>
    `;
    list.appendChild(el);
}

// Expose removal to global scope
window.removeFXDSegment = (id) => {
    fxdSegments = fxdSegments.filter(s => s.id !== id);
    const el = document.getElementById(`fxd-seg-${id}`);
    if (el) el.remove();
};

function generateFXD() {
    const carrier = document.getElementById('fxdCarrier').value.trim().toUpperCase();
    const fareType = document.getElementById('fxdFareType').value;
    const hasBags = document.getElementById('fxdBags').checked;
    const isAdv = document.getElementById('fxdAdvancedToggle').checked;
    
    let command = "FXD";
    
    if (!isAdv) {
        const origin = document.getElementById('fxdOrigin').value.trim().toUpperCase();
        const dest = document.getElementById('fxdDest').value.trim().toUpperCase();
        const dep = document.getElementById('fxdDepDate').value.trim().toUpperCase();
        const ret = document.getElementById('fxdRetDate').value.trim().toUpperCase();
        
        if (!origin || !dest || !dep || !carrier) {
            document.getElementById('fxdOutput').innerText = "ERROR: Missing required fields";
            return;
        }
        command += origin + `/D${dep}/A${carrier}${dest}`;
        if (ret) command += `/D${ret}/A${carrier}${origin}`;
    } else {
        const origin = document.getElementById('fxdAdvOrigin').value.trim().toUpperCase();
        if (!origin) {
            document.getElementById('fxdOutput').innerText = "ERROR: Missing Advanced Origin";
            return;
        }
        command += origin;
        const segEls = document.querySelectorAll('#fxdSegmentsList > div');
        segEls.forEach(el => {
            const d = el.querySelector('.seg-date').value.trim().toUpperCase();
            const a = el.querySelector('.seg-airline').value.trim().toUpperCase() || carrier;
            const dest = el.querySelector('.seg-dest').value.trim().toUpperCase();
            if (d && dest) command += `/D${d}/A${a}${dest}`;
        });
    }
    
    if (carrier) command += `//A${carrier}`;
    if (fareType === 'private') command += `/r,u`;
    if (hasBags) command += `/sbf-1`;
    
    document.getElementById('fxdOutput').innerText = command;
}

function initFXD() {
    document.getElementById('fxdAdvancedToggle')?.addEventListener('change', (e) => {
        const isAdv = e.target.checked;
        document.getElementById('fxdBasicMode').classList.toggle('hidden', isAdv);
        document.getElementById('fxdAdvancedMode').classList.toggle('hidden', !isAdv);
        if (isAdv && fxdSegments.length === 0) {
            addFXDSegment();
            addFXDSegment();
        }
    });

    document.getElementById('btnAddFXDSegment')?.addEventListener('click', addFXDSegment);
    document.getElementById('btnGenerateFXD')?.addEventListener('click', generateFXD);
}