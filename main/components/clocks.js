
let selectedTz = null;

function updateAirportTime() {
    const code = document.getElementById('airportCodeInput').value.toUpperCase().trim();
    const match = airportTimezones[code] || Object.values(airportTimezones).find(a => a.name.toUpperCase().includes(code) && code.length > 2);
    
    if (match) {
        selectedTz = match.tz; 
        document.getElementById('airportTimeDisplay').classList.remove('hidden');
        document.getElementById('displayAirportName').innerText = match.name;
        document.getElementById('displayAirportCode').innerText = code.length === 3 ? code : "AIRPORT";
        document.getElementById('displayAirportTz').innerText = match.tz; 
        refreshClocks();
    } else { 
        selectedTz = null; 
        document.getElementById('airportTimeDisplay').classList.add('hidden'); 
    }
}

function refreshClocks() {
    const now = new Date();
    const zuluEl = document.getElementById('zuluLiveClock');
    if(zuluEl) zuluEl.innerText = now.toLocaleString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    
    if (selectedTz) {
        document.getElementById('displayAirportLocalTime').innerText = now.toLocaleString('en-GB', { timeZone: selectedTz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        document.getElementById('displayAirportLocalDate').innerText = now.toLocaleString('en-US', { timeZone: selectedTz, weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    }
}

function initClocks() {
    setInterval(refreshClocks, 1000);
    
    document.getElementById('airportCodeInput')?.addEventListener('input', updateAirportTime);
    
    document.getElementById('btnConvertZulu')?.addEventListener('click', () => {
        const d = document.getElementById('convZuluDate').value;
        const t = document.getElementById('convZuluTime').value;
        if (!d || !t || !selectedTz) return;
        const z = new Date(`${d}T${t}:00Z`);
        document.getElementById('convResultTime').innerText = z.toLocaleString('en-GB', { timeZone: selectedTz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        document.getElementById('convResultDate').innerText = z.toLocaleString('en-US', { timeZone: selectedTz, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
        document.getElementById('convResult').classList.remove('hidden');
    });
}