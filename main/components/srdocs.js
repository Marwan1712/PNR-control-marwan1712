// Configuration and field mapping
const fields = [
    'srAirline', 'srPaxRef', 'srDob', 'srGender', 
    'srSurname', 'srGiven', 'srIssue', 'srPassNum', 
    'srNat', 'srExpiry'
];

function generateSRDOCS() {
    // 1. Get values from the DOM
    const airline = document.getElementById('srAirline').value.toUpperCase() || 'YY';
    const paxRef = document.getElementById('srPaxRef').value.toUpperCase() || 'P1';
    
    // Basic Info
    const dob = document.getElementById('srDob').value.toUpperCase();
    const gender = document.getElementById('srGender').value.toUpperCase();
    const surname = document.getElementById('srSurname').value.toUpperCase();
    const given = document.getElementById('srGiven').value.toUpperCase();
    
    // Advanced / Passport Info
    const rawIssue = document.getElementById('srIssue').value.toUpperCase();
    const rawPassNum = document.getElementById('srPassNum').value.toUpperCase();
    const rawNat = document.getElementById('srNat').value.toUpperCase();
    const rawExpiry = document.getElementById('srExpiry').value.toUpperCase();

    // Check if any "Advanced" passport field has data
    const hasAdvanced = (rawIssue || rawPassNum || rawNat || rawExpiry);

    let command = `SRDOCS${airline}HK1`;

    if (hasAdvanced) {
        // Advanced Format: Includes Type(P), Issue, Num, Nat, Expiry
        // User Example: SRDOCSYYHK1-P-GBR-123456789-GBR-30JUN73-M-14APR27-JOHNSON-SIMON-JEAN PAUL/P1
        
        const issue = rawIssue || 'XXX'; // Default to XXX if other passport fields are present but this one is missing
        const passNum = rawPassNum || ''; 
        const nat = rawNat || 'XXX';
        const expiry = rawExpiry || '';
        
        // Note: Advanced format uses hyphens for names and ends with /PaxRef
        command += `-P-${issue}-${passNum}-${nat}-${dob}-${gender}-${expiry}-${surname}-${given}/${paxRef}`;
    } else {
        // Default Format: Skips passport details with hyphens
        // User Example: SRDOCSYYHK1-----17DEC98-M--MARWAN/DARWISH/P1
        // Note: Default format uses slashes for names and ends with /PaxRef
        
        command += `-----${dob}-${gender}--${surname}/${given}/${paxRef}`;
    }
    
    // 3. Update the Output UI
    const outputDiv = document.getElementById('srOutput');
    if (outputDiv) {
        outputDiv.innerText = command;
    }
}

// Add event listeners to all inputs to update in real-time
fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', generateSRDOCS);
        el.addEventListener('change', generateSRDOCS);
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', generateSRDOCS);
// Also run immediately in case script loads late
generateSRDOCS();