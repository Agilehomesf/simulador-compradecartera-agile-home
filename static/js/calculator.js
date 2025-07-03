// Global variables
let calculationResults = null;

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format percentage
function formatPercentage(rate) {
    return new Intl.NumberFormat('es-CO', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(rate / 100);
}

// Select all banks
function selectAllBanks() {
    const checkboxes = document.querySelectorAll('input[name="selected_banks"]');
    const allSelected = Array.from(checkboxes).every(cb => cb.checked);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = !allSelected;
        updateBankOption(checkbox);
    });
}

// Update bank option visual state
function updateBankOption(checkbox) {
    const bankOption = checkbox.closest('.bank-option');
    if (checkbox.checked) {
        bankOption.classList.add('selected');
    } else {
        bankOption.classList.remove('selected');
    }
}

// Calculate portfolio purchase
async function calculatePortfolio() {
    const form = document.getElementById('calculatorForm');
    const formData = new FormData(form);
    
    const selectedBanks = document.querySelectorAll('input[name="selected_banks"]:checked');
    selectedBanks.forEach(checkbox => {
        formData.append('selected_banks', checkbox.value);
    });
    
    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResults(data);
        } else {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Display results
function displayResults(data) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsSection = document.getElementById('resultsSection');
    
    if (!data.results || data.results.length === 0) {
        return;
    }
    
    let html = '<div class="row">';
    
    data.results.forEach((result, index) => {
        html += `
            <div class="col-lg-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5>${result.bank}</h5>
                        <p>Mejor tasa: ${formatPercentage(result.best_rate)}</p>
                        <p>Cuota mensual: ${formatCurrency(result.new_payment_best)}</p>
                        <p>Ahorro mensual: ${formatCurrency(result.monthly_savings_best)}</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    resultsContainer.innerHTML = html;
    resultsSection.classList.remove('d-none');
}

// Contact bank via WhatsApp
async function contactBankWhatsApp(bankKey) {
    try {
        const response = await fetch(`/whatsapp/${bankKey}`);
        const data = await response.json();
        
        if (data.url) {
            window.open(data.url, '_blank');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const bankCheckboxes = document.querySelectorAll('input[name="selected_banks"]');
    bankCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateBankOption(this);
        });
        updateBankOption(checkbox);
    });
    
    document.querySelectorAll('.bank-option').forEach(option => {
        option.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox') {
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                updateBankOption(checkbox);
            }
        });
    });
});
