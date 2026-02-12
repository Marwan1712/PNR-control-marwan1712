/**
 * Hardcoded library of templates
 */
const systemTemplates = {
    general: {
        title: "General Inquiry",
        color: "slate",
        subs: [
            { label: "Baggage Rules", s: "Guest inquiring about baggage allowance/fees.", a: "Verified fare rules in GDS. Advised pax of weight/piece limits.", o: "Pax informed. No further action." },
            { label: "Seat Selection", s: "Guest requesting specific seat assignment.", a: "Checked seat map. Assigned available seat/advised guest of paid options.", o: "Seat updated or guest advised of cost." }
        ]
    },
    change: {
        title: "Ticket Changes",
        color: "emerald",
        subs: [
            { label: "Voluntary Change", s: "Guest requested to change travel dates (voluntary).", a: "Quoted change fee + fare difference. Collected payment and reissued.", o: "Ticket reissued. New itinerary sent." },
            { label: "Involuntary Change", s: "Schedule change on file.", a: "Found alternative flights per airline policy.", o: "Flights updated." }
        ]
    },
    refund: {
        title: "Refund Requests",
        color: "blue",
        subs: [
            { label: "Voluntary Refund", s: "Guest requesting cancellation and refund.", a: "Calculated refund per fare rules. Processed in BSP/GDS.", o: "Refund submitted." },
            { label: "Medical Waiver", s: "Medical emergency refund request.", a: "Advised guest of documentation. Sent request to carrier.", o: "Pending airline approval." }
        ]
    }
};

/**
 * Loads and renders templates including user-saved ones
 */
function renderTemplates(category = null) {
    const container = document.getElementById('templateContainer');
    if (!container) return;

    container.innerHTML = '';
    
    // Load custom templates from LocalStorage
    const userSaved = JSON.parse(localStorage.getItem('user_case_templates') || '[]');

    if (!category) {
        // 1. Render System Categories
        Object.keys(systemTemplates).forEach(key => {
            const cat = systemTemplates[key];
            addCategoryButton(container, key, cat.title, cat.color, cat.subs.length);
        });

        // 2. Render Custom Category if it has items
        if (userSaved.length > 0) {
            addCategoryButton(container, 'custom', 'User Saved', 'purple', userSaved.length);
        }
    } else {
        // Render Sub-templates
        const backBtn = document.createElement('button');
        backBtn.className = "flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 hover:text-slate-900 transition-colors";
        backBtn.onclick = () => renderTemplates(null);
        backBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M15 18l-6-6 6-6"/></svg> Back to Main`;
        container.appendChild(backBtn);

        const list = (category === 'custom') ? userSaved : systemTemplates[category].subs;
        const color = (category === 'custom') ? 'purple' : systemTemplates[category].color;

        list.forEach((sub, index) => {
            const btn = document.createElement('button');
            btn.className = `text-left p-4 bg-white border border-slate-200 rounded-2xl hover:border-${color}-500 transition-all shadow-sm hover:shadow-md relative group`;
            btn.onclick = () => fillTemplate(category, index);
            
            // Add delete button for custom templates
            let deleteHtml = '';
            if (category === 'custom') {
                deleteHtml = `
                    <div onclick="event.stopPropagation(); deleteCustomTemplate(${index})" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 transition-opacity">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </div>`;
            }

            btn.innerHTML = `
                <p class="text-[10px] font-black text-slate-900 uppercase tracking-tighter mb-1">${sub.label}</p>
                <p class="text-[11px] text-slate-500 leading-snug line-clamp-2">${sub.s}</p>
                ${deleteHtml}
            `;
            container.appendChild(btn);
        });
    }
}

function addCategoryButton(container, key, title, color, count) {
    const btn = document.createElement('button');
    btn.className = `text-left p-4 bg-white border border-slate-200 rounded-2xl hover:border-${color}-500 transition-all shadow-sm hover:shadow-md`;
    btn.onclick = () => renderTemplates(key);
    btn.innerHTML = `
        <div class="flex justify-between items-center mb-1">
            <p class="text-[10px] font-black text-${color}-600 uppercase tracking-tighter">${title}</p>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-slate-300"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <p class="text-[11px] text-slate-500 leading-snug">${count} templates</p>
    `;
    container.appendChild(btn);
}

function fillTemplate(category, index) {
    const list = (category === 'custom') ? JSON.parse(localStorage.getItem('user_case_templates') || '[]') : systemTemplates[category].subs;
    const sub = list[index];
    document.getElementById('noteS').value = sub.s;
    document.getElementById('noteA').value = sub.a;
    document.getElementById('noteO').value = sub.o;
}

/**
 * Saves current form values as a new template
 */
function saveCurrentAsTemplate() {
    const s = document.getElementById('noteS').value.trim();
    const a = document.getElementById('noteA').value.trim();
    const o = document.getElementById('noteO').value.trim();

    if (!s || !a || !o) {
        showToast("Please fill all fields to save a template", "error");
        return;
    }

    const label = prompt("Enter a label for this template:", "New Template");
    if (!label) return;

    const userSaved = JSON.parse(localStorage.getItem('user_case_templates') || '[]');
    userSaved.push({ label, s, a, o });
    localStorage.setItem('user_case_templates', JSON.stringify(userSaved));
    
    renderTemplates(); // Refresh sidebar
    showToast("Template saved to 'User Saved' category");
}

function deleteCustomTemplate(index) {
    const userSaved = JSON.parse(localStorage.getItem('user_case_templates') || '[]');
    userSaved.splice(index, 1);
    localStorage.setItem('user_case_templates', JSON.stringify(userSaved));
    renderTemplates('custom');
}

function generateAndCopyNote() {
    const t = document.getElementById('noteTicket').value.trim();
    const s = document.getElementById('noteS').value.trim();
    const a = document.getElementById('noteA').value.trim();
    const o = document.getElementById('noteO').value.trim();
    const note = `**NEW CASE** | ${new Date().toLocaleString()}\nCAC ZD ID: ${t || 'N/A'}\n\n**S:** ${s || 'N/A'}\n\n**A:** ${a || 'N/A'}\n\n**O:** ${o || 'N/A'}`;
    copyToClipboard(note);
}

function clearNoteFields() { 
    ['noteS', 'noteA', 'noteO'].forEach(id => document.getElementById(id).value = ''); 
}

function initCaseNotes() {
    renderTemplates();
}