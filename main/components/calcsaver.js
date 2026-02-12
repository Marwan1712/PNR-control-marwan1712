
        let calcHistory = [];

        function renderHistory() {
            const container = document.getElementById('calcHistory');
            if (!container) return;

            if (calcHistory.length === 0) {
                container.classList.add('hidden');
                return;
            }

            container.classList.remove('hidden');
            container.innerHTML = calcHistory.map(item => `
        <div class="flex justify-between items-center text-[10px] mono group/item cursor-pointer hover:bg-slate-700/50 p-1.5 rounded-lg transition-colors select-none" 
             onclick="copyToClipboard('${item.result}'); showToast('Result ${item.result} Copied!')"
             title="Click to copy result">
            <span class="text-slate-500 truncate max-w-[60%]">${item.equation}</span>
            <span class="text-blue-400 font-bold">= ${item.result}</span>
        </div>
    `).join('');
        }

        function calculateQuick() {
            const input = document.getElementById('quickCalcInput');
            const display = document.getElementById('quickCalcResult');
            const value = input.value.trim();

            if (!value) {
                display.innerText = "Result: -";
                display.classList.add('text-slate-500');
                display.removeAttribute('data-res');
                return;
            }
            try {
                const result = Function('"use strict";return (' + value.replace(/[^-+*/(). \d]/g, '') + ')')();
                if (result !== undefined && !isNaN(result)) {
                    // Optional: limit decimal places for display if needed, but keeping raw result for accuracy
                    const displayResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));

                    display.innerText = `Result: ${displayResult}`;
                    display.classList.add('text-blue-400');
                    display.setAttribute('data-res', displayResult);
                } else {
                    display.innerText = "Result: Error";
                    display.removeAttribute('data-res');
                }
            } catch (e) {
                display.innerText = "Result: ...";
                display.removeAttribute('data-res');
            }
        }

        function initCalculator() {
            const input = document.getElementById('quickCalcInput');
            if (input) {
                input.removeEventListener('input', calculateQuick); // Prevent duplicates
                input.addEventListener('input', calculateQuick);
                
                // Remove old keydown listeners by cloning (simple way without reference) or just ensure logic is idempotent
                // For simplicity here, we assume standard behavior. 
                // A better approach for keydown is checking if we already attached, but let's just attach one specific handler.
                input.onkeydown = (e) => {
                    if (e.key === 'Enter') {
                        const display = document.getElementById('quickCalcResult');
                        const res = display.getAttribute('data-res');
                        const eq = input.value.trim();

                        if (res && eq) {
                            copyToClipboard(res);
                            // Assuming showToast is global from utils or main.js, if not, we skip
                            if (typeof showToast === 'function') showToast(`Result ${res} Copied!`);

                            // Add to history
                            calcHistory.unshift({ equation: eq, result: res });

                            // Keep only last 5
                            if (calcHistory.length > 5) {
                                calcHistory.pop();
                            }

                            renderHistory();

                            input.value = '';
                            calculateQuick();
                        }
                    }
                };
            }
        }
        
        // Auto-init
        document.addEventListener('DOMContentLoaded', initCalculator);
        // Fallback if DOM is already loaded
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            initCalculator();
        }