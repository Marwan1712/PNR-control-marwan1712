// --- Availability Logic ---
        function generateAvailability() {
            const input = document.getElementById('availInput').value;
            const cabin = document.getElementById('availCabin').value.trim().toUpperCase() || 'KM';
            const overrideDate = document.getElementById('availNewDate').value.trim().toUpperCase();
            const lines = input.split('\n');
            
            const segments = [];
            lines.forEach(line => {
                const dateMatch = line.match(/(\d{2}[A-Z]{3})/i);
                const routeMatch = line.match(/([A-Z]{3})([A-Z]{3})/i);
                const airlineMatch = line.match(/\s+([A-Z0-9]{2})\s*(\d{1,4})?\s+[A-Z]\s+/i) || line.match(/\s+([A-Z]{2})(\d{1,4})\s+[A-Z]\s+/i);
                
                if (dateMatch && routeMatch && airlineMatch) {
                    segments.push({
                        date: dateMatch[1].toUpperCase(),
                        origin: routeMatch[1].toUpperCase(),
                        dest: routeMatch[2].toUpperCase(),
                        airline: (airlineMatch[1] || "").toUpperCase()
                    });
                }
            });

            if (segments.length === 0) {
                showToast("No valid segments found");
                return;
            }

            const startOrigin = segments[0].origin;
            let lastReturnIdx = -1;

            for (let i = segments.length - 1; i >= 0; i--) {
                if (segments[i].dest === startOrigin) {
                    lastReturnIdx = i;
                    break;
                }
            }

            let outboundSegs = [];
            let inboundSegs = [];

            if (lastReturnIdx === -1) {
                outboundSegs = segments;
            } else {
                let returnStartIdx = lastReturnIdx;
                while (returnStartIdx > 0) {
                    if (segments[returnStartIdx].origin === segments[returnStartIdx - 1].dest) {
                        returnStartIdx--;
                    } else {
                        break;
                    }
                }
                outboundSegs = segments.slice(0, returnStartIdx);
                inboundSegs = segments.slice(returnStartIdx);
                if (outboundSegs.length === 0) {
                   outboundSegs = inboundSegs;
                   inboundSegs = [];
                }
            }

            const resultsDiv = document.getElementById('availResults');
            resultsDiv.innerHTML = '';
            document.getElementById('availOutputContainer').classList.remove('hidden');

            function buildCommand(segs, isReturn = false) {
                if (!segs || segs.length === 0) return null;
                // Use overrideDate ONLY for outbound if provided, otherwise parsed date
                const date = (overrideDate && !isReturn) ? overrideDate : segs[0].date;
                const org = segs[0].origin;
                const dst = segs[segs.length - 1].dest; 
                const airlines = [...new Set(segs.map(s => s.airline))].join(',');
                return `AN${date}${org}${dst}/A${airlines}/${cabin}`;
            }

            const commands = [];
            const cmdOut = buildCommand(outboundSegs, false);
            const cmdIn = buildCommand(inboundSegs, true);

            if (cmdOut) commands.push({ label: lastReturnIdx === -1 ? 'Full Departure' : 'Departure', cmd: cmdOut });
            if (cmdIn) commands.push({ label: 'Return', cmd: cmdIn });

            commands.forEach(item => {
                const el = document.createElement('div');
                el.className = "flex flex-col gap-2 p-3 bg-slate-800 rounded-xl border border-slate-700";
                el.innerHTML = `
                    <div class="flex items-center justify-between">
                        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">${item.label}</span>
                        <button onclick="copyToClipboard('${item.cmd}')" class="text-blue-400 hover:text-white transition-colors">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                        </button>
                    </div>
                    <div class="mono text-white text-sm font-bold uppercase tracking-tight">${item.cmd}</div>
                `;
                resultsDiv.appendChild(el);
            });
        }
