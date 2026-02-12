
function renderList(data) {
    const container = document.getElementById('listContainer');
    if(!container) return;
    
    container.innerHTML = '';
    document.getElementById('resultCount').innerText = data.length.toString().padStart(2, '0');
    
    data.sort((a,b) => a.name.localeCompare(b.name)).forEach((item) => {
        const card = document.createElement('div');
        card.className = "airline-card p-6 rounded-2xl flex items-center justify-between group bg-white shadow-sm hover:shadow-md";
        card.innerHTML = `<div class="flex items-center gap-6"><div class="mono text-[10px] font-black text-slate-400 bg-slate-100 w-12 h-12 flex items-center justify-center rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">${item.code.split('/')[0]}</div><div><h3 class="font-bold text-base text-slate-800 leading-none mb-2">${item.name}</h3><div class="flex gap-2">${(item.links || []).map(l => `<a href="${l.url}" target="_blank" class="text-[9px] font-bold text-slate-400 hover:text-blue-600 px-2 py-1 bg-slate-50 rounded-md transition-all uppercase">${l.label}</a>`).join('')}</div></div></div><div class="flex flex-col items-end gap-2"><button onclick="copyToClipboard('${item.phone}')" class="mono text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all border border-blue-100 bg-blue-50/30">${item.phone}</button>${item.notes !== "—" ? `<p class="text-[9px] text-slate-400 font-bold uppercase tracking-tighter text-right max-w-[200px] leading-tight">${item.notes}</p>` : ''}</div>`;
        container.appendChild(card);
    });
}

function initList() {
    // Initial Render
    renderList(airlineData);
    
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        renderList(airlineData.filter(i => i.name.toLowerCase().includes(val) || i.code.toLowerCase().includes(val)));
    });
}