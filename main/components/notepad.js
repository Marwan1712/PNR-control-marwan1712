let notes = JSON.parse(localStorage.getItem('agent_support_notes')) || [];
let lastSnippetKey = {};

// --- Core Actions (Exposed Globally for HTML onclick) ---

window.addNote = function() {
    if (notes.length < 5) {
        notes.push({ header: `Note ${notes.length + 1}`, text: "", type: 'regular' });
        saveNotes();
        renderNotes();
    } else {
        showToast("Max 5 notes reached"); // Optional feedback
    }
};

window.addSnippetNote = function() {
    if (notes.length < 5) {
        notes.push({ header: `Copiable List ${notes.length + 1}`, items: [], type: 'snippet' });
        saveNotes();
        renderNotes();
    } else {
        showToast("Max 5 notes reached");
    }
};

window.removeNote = function(index) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
};

window.updateNoteHeader = function(index, val) {
    notes[index].header = val;
    saveNotes();
};

window.updateNoteText = function(index, val) {
    notes[index].text = val;
    saveNotes();
};

window.removeSnippetItem = function(noteIndex, itemIndex) {
    notes[noteIndex].items.splice(itemIndex, 1);
    saveNotes();
    renderNotes();
};

window.handleSnippetKeydown = function(event, index) {
    if (event.key === 'Enter') {
        const now = Date.now();
        // Check for double enter (within 500ms)
        if (lastSnippetKey[index] && (now - lastSnippetKey[index] < 500)) {
            event.preventDefault();
            const text = event.target.value.trim();
            if (text) {
                if (!notes[index].items) notes[index].items = [];
                notes[index].items.push(text);
                saveNotes();
                renderNotes();
                // Refocus and clear input
                setTimeout(() => {
                    const input = document.getElementById(`snippetInput-${index}`);
                    if (input) {
                        input.focus();
                        input.value = ''; 
                    }
                }, 50);
            }
            delete lastSnippetKey[index];
        } else {
            lastSnippetKey[index] = now;
        }
    } else {
        delete lastSnippetKey[index];
    }
};

// --- Internal Functions ---

function saveNotes() {
    localStorage.setItem('agent_support_notes', JSON.stringify(notes));
}

function renderNotes() {
    const grid = document.getElementById('notesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    notes.forEach((note, index) => {
        const noteEl = document.createElement('div');
        noteEl.className = "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col space-y-3 relative group overflow-hidden";

        if (note.type === 'snippet') {
            const itemsHtml = (note.items || []).map((item, iIdx) => `
                <div class="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 group/item relative">
                    <span class="flex-1 text-[11px] text-slate-700 mono truncate" title="${item}">${item}</span>
                    <button onclick="copyToClipboard('${item.replace(/'/g, "\\'")}')" class="p-1.5 hover:bg-emerald-100 text-emerald-600 rounded transition-colors" title="Copy">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    </button>
                    <button onclick="removeSnippetItem(${index}, ${iIdx})" class="p-1.5 hover:bg-red-100 text-red-600 rounded opacity-0 group-hover/item:opacity-100 transition-all" title="Delete">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            `).join('');

            noteEl.innerHTML = `
                <div class="flex items-center justify-between gap-2 border-b pb-2">
                    <input type="text" value="${note.header}" onchange="updateNoteHeader(${index}, this.value)" class="bg-transparent font-black text-[10px] uppercase tracking-widest text-emerald-600 outline-none flex-1" placeholder="Copiable List...">
                    <button onclick="removeNote(${index})" class="text-slate-300 hover:text-red-500 transition-colors">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                <div class="flex-1 flex flex-col gap-2 overflow-y-auto custom-scroll max-h-[360px] py-1">
                    ${itemsHtml}
                </div>
                <div class="pt-2 border-t">
                    <textarea id="snippetInput-${index}" onkeydown="handleSnippetKeydown(event, ${index})" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none  resize-none h-[40px]" placeholder="Type and press Enter twice..."></textarea>
                </div>
            `;
        } else {
            noteEl.innerHTML = `
                <div class="flex items-center justify-between gap-2 border-b pb-2">
                    <input type="text" value="${note.header}" onchange="updateNoteHeader(${index}, this.value)" class="bg-transparent font-black text-[10px] uppercase tracking-widest text-slate-400 outline-none focus:text-blue-600 flex-1" placeholder="Note Name...">
                    <button onclick="removeNote(${index})" class="text-slate-300 hover:text-red-500 transition-colors">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                <textarea onchange="updateNoteText(${index}, this.value)" class="flex-1 w-full p-0 bg-transparent border-none outline-none text-xs text-slate-700 leading-relaxed resize-none custom-scroll min-h-[150px]" placeholder="Type your notes here...">${note.text}</textarea>
                <div class="flex justify-between items-center pt-2">
                    <button onclick="copyToClipboard(notes[${index}].text)" class="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800">Copy Text</button>
                </div>
            `;
        }
        grid.appendChild(noteEl);
    });

    // Update Add Button State
    const addBtn = document.getElementById('addNoteBtn');
    if (addBtn) {
        if (notes.length >= 5) {
            addBtn.style.opacity = '0.5';
            addBtn.style.cursor = 'not-allowed';
        } else {
            addBtn.style.opacity = '1';
            addBtn.style.cursor = 'pointer';
        }
    }
}

// --- Initialization ---

function initNotepad() {
    if (notes.length === 0) {
        notes.push({ header: `Note 1`, text: "", type: 'regular' });
        saveNotes();
    }
    renderNotes();
}

// Make init available globally
window.initNotepad = initNotepad;