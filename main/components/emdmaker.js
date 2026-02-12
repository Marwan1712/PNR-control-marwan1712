function generateEMD() {
    // 1. Get Values
    const airlineCode = document.getElementById('emdAirlineCode').value.toUpperCase().trim() || 'XX';
    const serviceCode = document.getElementById('emdServiceCode').value.toUpperCase().trim() || 'PENF';
    const origin = document.getElementById('emdOrigin').value.toUpperCase().trim() || 'YUL';
    const date = document.getElementById('emdDate').value.toUpperCase().trim();
    const lineNum = document.getElementById('emdLineNum').value.trim() || '1';
    const emdNum = document.getElementById('emdNum').value.trim() || '1';
    const amount = document.getElementById('emdAmount').value.trim() || '0.00';
    const fop = document.getElementById('emdFop').value.toUpperCase().trim();
    const airlineName = document.getElementById('emdAirlineName').value.trim() || 'AIRLINE';
    const location = document.getElementById('emdLocation').value.toUpperCase().trim() || origin;
    
    // Ticket: Strip dashes if user added them
    let tkt = document.getElementById('emdTkt').value.trim();
    tkt = tkt.replace(/-/g, '');
    
    const indicator = document.getElementById('emdIndicator').value; // YI or YD
    const paxNum = document.getElementById('emdPaxNum').value.trim() || '1';

    // 2. Build Commands
    const commands = [];

    // Step 1: Check service (EGSD/V..)
    commands.push(`EGSD/V${airlineCode}`);

    // Step 2: Create Segment (IU ..)
    // IU DL NN1 PENF YUL/20SEP
    commands.push(`IU ${airlineCode} NN1 ${serviceCode} ${origin}/${date}`);

    // Step 3: Create TSM (TMC/V../L..)
    commands.push(`TMC/V${airlineCode}/L${lineNum}`);

    // Step 4: Fare and Coupon Value
    // TMI/M1/F281.00/CV-281.00
    commands.push(`TMI/M${emdNum}/F${amount}/CV-${amount}`);

    // Step 5: FOP
    // TMI/M1/FP-CCVI...
    if (fop) {
        commands.push(`TMI/M${emdNum}/FP-${fop}`);
    } else {
        commands.push(`TMI/M${emdNum}/FP-CASH`); // Fallback
    }

    // Step 6: Airline Name
    // TMI/M1/D air Canada
    commands.push(`TMI/M${emdNum}/D ${airlineName}`);

    // Step 7: Terminal Location
    // TMI/M1/AYUL
    commands.push(`TMI/M${emdNum}/A${location}`);

    // Step 8: Associate Ticket
    // TMI/IC-TKT
    if (tkt) {
        commands.push(`TMI/IC-${tkt}`);
    }

    // Step 9: Dom/Int Indicator
    // TMI/YI or TMI/YD
    commands.push(`TMI/${indicator}`);

    // Step 10: Issue
    // TTM/P1/RT
    commands.push(`TTM/P${paxNum}/RT`);

    // 3. Render Output
    const outputContainer = document.getElementById('emdOutput');
    if (outputContainer) {
        outputContainer.innerHTML = commands.map(cmd => `
            <div class="flex items-center justify-between p-2 bg-slate-800 rounded mb-2 border border-slate-700">
                <span class="mono text-green-400 text-sm font-bold select-all">${cmd}</span>
                <button onclick="copyToClipboard('${cmd}')" class="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded transition-colors uppercase font-bold tracking-wider">Copy</button>
            </div>
        `).join('');
    }
}

function initEMD() {
    // Attach listeners
    const inputs = document.querySelectorAll('#emdModal input, #emdModal select');
    inputs.forEach(input => {
        input.addEventListener('input', generateEMD);
        input.addEventListener('change', generateEMD);
    });

    // Reset button
    document.getElementById('btnResetEmd')?.addEventListener('click', () => {
        inputs.forEach(input => {
            if (input.type === 'text' || input.type === 'number') input.value = '';
        });
        // Reset defaults
        document.getElementById('emdIndicator').value = 'YI';
        document.getElementById('emdPaxNum').value = '1';
        document.getElementById('emdLineNum').value = '1';
        document.getElementById('emdNum').value = '1';
        
        generateEMD();
        showToast("EMD Form Reset");
    });
}

// Expose init
window.initEMD = initEMD;