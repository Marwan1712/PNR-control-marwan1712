function toggleRequestFields() {
    const type = document.getElementById('reqType').value;
    const fields = ['fieldNoShow', 'fieldRefundType', 'fieldAffectedFlights', 'fieldNewDates', 'fieldOtherNature', 'fieldCorrectName', 'fieldDocSubmitted'];
    fields.forEach(f => document.getElementById(f).classList.add('hidden'));
    
    const mapping = {
        'sch_change_exchange': ['fieldNoShow', 'fieldAffectedFlights', 'fieldNewDates'],
        'sch_change_refund': ['fieldNoShow', 'fieldAffectedFlights'],
        'medical': ['fieldNoShow', 'fieldRefundType'],
        'death': ['fieldNoShow', 'fieldRefundType'],
        'name_correction': ['fieldCorrectName', 'fieldDocSubmitted'],
        'reopen': ['fieldAffectedFlights', 'fieldNewDates'],
        'other': ['fieldOtherNature']
    };
    
    if(mapping[type]) mapping[type].forEach(id => document.getElementById(id).classList.remove('hidden'));
}

function parseMulti(input) { return input.split(/\s{2,}/).filter(x => x.trim() !== "").map(x => x.trim()); }

function generateRequestTable() {
    const type = document.getElementById('reqType').value;
    const pnr = document.getElementById('reqPnr').value.trim() || 'N/A';
    const travelDate = document.getElementById('reqTravelDate').value.trim() || 'N/A';
    const paxes = parseMulti(document.getElementById('reqPaxNames').value);
    const tkts = parseMulti(document.getElementById('reqTkts').value);
    
    const noShow = document.getElementById('reqNoShow').value.trim() || 'N/A';
    const refundType = document.getElementById('reqRefundType').value;
    const affected = document.getElementById('reqAffectedFlights').value.trim() || 'N/A';
    const newDates = document.getElementById('reqNewDates').value.trim() || 'N/A';
    const otherText = document.getElementById('reqOtherText').value.trim() || 'N/A';
    const correctName = document.getElementById('reqCorrectName').value.trim() || 'N/A';
    const docSubmitted = document.getElementById('reqDocSubmitted').value.trim() || 'N/A';

    const paxList = paxes.length > 0 ? paxes.join('<br>') : 'N/A';
    const tktList = tkts.length > 0 ? tkts.join('<br>') : 'N/A';
    
    let html = "";
    
    if (type === 'name_correction') {
        html = `<div style="font-family: Arial, sans-serif; color: #333;"><p>Dear Travel Partner,</p><p>We are seeking your assistance in Changing/Correcting this passenger name.</p><p>Please see details below:</p><table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left; border-color: #e2e8f0;"><tr><th style="padding: 8px; background-color: #f2f2f2; width: 35%;">PNR:</th><td style="padding: 8px; font-family: monospace;">${pnr}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">Ticket Number:</th><td style="padding: 8px; font-family: monospace;">${tktList}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">Travel Date:</th><td style="padding: 8px;">${travelDate}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">PAX Name:</th><td style="padding: 8px;">${paxList}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">Correct Name:</th><td style="padding: 8px; font-weight: bold; color: #059669;">${correctName}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">Document Submitted:</th><td style="padding: 8px;">${docSubmitted}</td></tr></table><p style="margin-top: 20px;">Best Regards,</p></div>`;
    } else {
        let typeLabel = "Request", boldReason = "", specificRows = "";
        if (type === 'medical') { typeLabel = "medical reason change/refund"; boldReason = "Medical Condition"; specificRows = `<tr><th style="padding: 8px; background-color: #f2f2f2;">No Show:</th><td style="padding: 8px;">${noShow}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">Type of Refund:</th><td style="padding: 8px;">${refundType}</td></tr>`; }
        else if (type === 'death') { typeLabel = "Death related change/refund"; boldReason = "Death of the family member"; specificRows = `<tr><th style="padding: 8px; background-color: #f2f2f2;">No Show:</th><td style="padding: 8px;">${noShow}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">Type of Refund:</th><td style="padding: 8px;">${refundType}</td></tr>`; }
        else if (type === 'sch_change_exchange') { typeLabel = "Involuntary Exchange"; boldReason = "Schedule Change / Flight Cancellation"; specificRows = `<tr><th style="padding: 8px; background-color: #f2f2f2;">No Show:</th><td style="padding: 8px;">${noShow}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">Affected Flight Number/s:</th><td style="padding: 8px;">${affected}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">New Travel Dates:</th><td style="padding: 8px;">${newDates}</td></tr>`; }
        else if (type === 'sch_change_refund') { typeLabel = "Involuntary Refund"; boldReason = "Schedule Change / Flight Cancellation"; specificRows = `<tr><th style="padding: 8px; background-color: #f2f2f2;">No Show:</th><td style="padding: 8px;">${noShow}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">Affected Flight Number/s:</th><td style="padding: 8px;">${affected}</td></tr>`; }
        else if (type === 'reopen') { typeLabel = "Reopen Ticket Status"; boldReason = "Exchange or Refund"; specificRows = `<tr><th style="padding: 8px; background-color: #f2f2f2;">Flights Affected:</th><td style="padding: 8px;">${affected}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">New Travel Date/Route:</th><td style="padding: 8px;">${newDates}</td></tr>`; }
        else { typeLabel = "Support Request"; boldReason = otherText; specificRows = `<tr><th style="padding: 8px; background-color: #f2f2f2;">Request Nature:</th><td style="padding: 8px;">${otherText}</td></tr>`; }
        
        html = `<div style="font-family: Arial, sans-serif; color: #333;"><p>Dear Travel Partner,</p><p>We are seeking your assistance in obtaining a waiver code / processing this request regarding <b>(${boldReason})</b>.</p><p>Please see details below:</p><table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left; border-color: #e2e8f0;"><tr><th style="width: 35%; padding: 8px; background-color: #f2f2f2;">Request Type:</th><td style="padding: 8px;">${typeLabel}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">PNR:</th><td style="padding: 8px; font-family: monospace;">${pnr}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">Ticket Number(s):</th><td style="padding: 8px; font-family: monospace;">${tktList}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">Travel Date:</th><td style="padding: 8px;">${travelDate}</td></tr><tr><th style="padding: 8px; background-color: #f2f2f2;">PAX Name(s):</th><td style="padding: 8px;">${paxList}</td></tr>${specificRows}</table><p style="margin-top: 20px;">Best Regards,</p></div>`;
    }

    document.getElementById('previewContent').innerHTML = html;
    
    // Toggle UI
    document.getElementById('requestForm').classList.add('hidden');
    document.getElementById('requestPreview').classList.remove('hidden');
    document.getElementById('btnGenerate').classList.add('hidden');
    document.getElementById('btnResetReq').classList.add('hidden');
    document.getElementById('btnCopyRequest').classList.remove('hidden');
    document.getElementById('btnCopyRequestHtml').classList.remove('hidden'); // Show Copy HTML button
    document.getElementById('btnBack').classList.remove('hidden');
}

function initRequests() {
    window.toggleRequestFields = toggleRequestFields; 

    document.getElementById('reqType')?.addEventListener('change', toggleRequestFields);
    document.getElementById('btnGenerate')?.addEventListener('click', generateRequestTable);
    
    document.getElementById('btnResetReq')?.addEventListener('click', () => {
        const inputs = document.querySelectorAll('#airlineRequestModal input, #airlineRequestModal textarea');
        inputs.forEach(input => input.value = '');
        document.getElementById('reqType').selectedIndex = 0;
        toggleRequestFields();
        showToast("Form Cleared");
    });

    document.getElementById('btnCopyRequest')?.addEventListener('click', () => {
        copyRichText(document.getElementById('previewContent').innerHTML);
        showToast("Table Copied!");
    });

    document.getElementById('btnCopyRequestHtml')?.addEventListener('click', () => {
        copyToClipboard(document.getElementById('previewContent').innerHTML);
        showToast("HTML Source Copied!");
    });

    document.getElementById('btnBack')?.addEventListener('click', () => {
        document.getElementById('requestForm').classList.remove('hidden');
        document.getElementById('requestPreview').classList.add('hidden');
        document.getElementById('btnGenerate').classList.remove('hidden');
        document.getElementById('btnResetReq').classList.remove('hidden');
        document.getElementById('btnCopyRequest').classList.add('hidden');
        document.getElementById('btnCopyRequestHtml').classList.add('hidden'); // Hide Copy HTML button
        document.getElementById('btnBack').classList.add('hidden');
    });
}