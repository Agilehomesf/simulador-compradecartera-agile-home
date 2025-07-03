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

// Add event listeners to bank checkboxes
document.addEventListener('DOMContentLoaded', function() {
    const bankCheckboxes = document.querySelectorAll('input[name="selected_banks"]');
    bankCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateBankOption(this);
        });
        
        // Initialize visual state
        updateBankOption(checkbox);
    });
    
    // Add click handlers to bank options
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

// Validate form
function validateForm() {
    const form = document.getElementById('calculatorForm');
    const formData = new FormData(form);
    const errors = [];
    
    // Required fields
    const requiredFields = [
        'property_value', 'portfolio_balance', 'initial_term', 
        'remaining_term', 'current_rate', 'insurance_value', 'new_term'
    ];
    
    requiredFields.forEach(field => {
        const value = formData.get(field);
        if (!value || parseFloat(value) <= 0) {
            errors.push(`El campo ${field.replace('_', ' ')} es requerido y debe ser mayor que 0`);
        }
    });
    
    // Check if at least one bank is selected
    const selectedBanks = document.querySelectorAll('input[name="selected_banks"]:checked');
    if (selectedBanks.length === 0) {
        errors.push('Debe seleccionar al menos un banco para comparar');
    }
    
    // Business logic validations
    const portfolioBalance = parseFloat(formData.get('portfolio_balance'));
    const propertyValue = parseFloat(formData.get('property_value'));
    const remainingTerm = parseInt(formData.get('remaining_term'));
    const initialTerm = parseInt(formData.get('initial_term'));
    const newTerm = parseInt(formData.get('new_term'));
    
    if (portfolioBalance > propertyValue) {
        errors.push('El saldo de la cartera no puede ser mayor al valor del inmueble');
    }
    
    if (remainingTerm > initialTerm) {
        errors.push('El plazo restante no puede ser mayor al plazo inicial');
    }
    
    if (newTerm > 360) {
        errors.push('El plazo máximo para la compra de cartera es de 360 meses (30 años)');
    }
    
    return errors;
}

// Show loading state
function showLoading() {
    const button = document.querySelector('button[onclick="calculatePortfolio()"]');
    button.disabled = true;
    button.innerHTML = '<i class="bi bi-arrow-clockwise me-2"></i>Calculando...';
    button.classList.add('btn-secondary');
    button.classList.remove('btn-primary');
}

// Hide loading state
function hideLoading() {
    const button = document.querySelector('button[onclick="calculatePortfolio()"]');
    button.disabled = false;
    button.innerHTML = '<i class="bi bi-calculator me-2"></i>Calcular Ahorro Potencial';
    button.classList.add('btn-primary');
    button.classList.remove('btn-secondary');
}

// Show error message
function showError(message) {
    const errorHtml = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Error:</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.innerHTML = errorHtml;
    resultsSection.classList.remove('d-none');
}

// Calculate portfolio purchase
async function calculatePortfolio() {
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
        showError(errors.join('<br>'));
        return;
    }
    
    showLoading();
    
    try {
        const form = document.getElementById('calculatorForm');
        const formData = new FormData(form);
        
        // Add selected banks to form data
        const selectedBanks = document.querySelectorAll('input[name="selected_banks"]:checked');
        selectedBanks.forEach(checkbox => {
            formData.append('selected_banks', checkbox.value);
        });
        
        const response = await fetch('/calculate', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            calculationResults = data;
            displayResults(data);
        } else {
            showError(data.error || 'Error en el cálculo');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError('Error de conexión. Por favor, inténtelo nuevamente.');
    } finally {
        hideLoading();
    }
}

// Display results
function displayResults(data) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsSection = document.getElementById('resultsSection');
    
    if (!data.results || data.results.length === 0) {
        showError('No se encontraron resultados para los bancos seleccionados');
        return;
    }
    
    // Summary information
    let summaryHtml = `
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="alert alert-info">
                    <h5><i class="bi bi-info-circle me-2"></i>Información Actual</h5>
                    <p><strong>Saldo a Comprar:</strong> ${formatCurrency(data.portfolio_balance)}</p>
                    <p><strong>Cuota Actual:</strong> ${formatCurrency(data.current_payment)}</p>
                    <p><strong>Seguros:</strong> ${formatCurrency(data.insurance_value)}</p>
                    <p class="mb-0"><strong>Nuevo Plazo:</strong> ${data.new_term} meses</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="alert alert-success">
                    <h5><i class="bi bi-graph-up me-2"></i>Resumen de Ahorros</h5>
                    <p><strong>Mejor Ahorro Mensual:</strong> ${formatCurrency(Math.max(...data.results.map(r => r.monthly_savings_best)))}</p>
                    <p><strong>Mejor Ahorro Total:</strong> ${formatCurrency(Math.max(...data.results.map(r => r.total_savings_best)))}</p>
                    <p class="mb-0"><strong>Bancos Comparados:</strong> ${data.results.length}</p>
                </div>
            </div>
        </div>
    `;
    
    // Bank results
    let banksHtml = '<div class="row">';
    
    data.results.forEach((result, index) => {
        const isBest = index === 0 && result.monthly_savings_best > 0;
        const hasSavings = result.monthly_savings_best > 0;
        
        banksHtml += `
            <div class="col-lg-6 mb-4">
                <div class="card bank-card ${isBest ? 'best-option' : ''}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div class="d-flex align-items-center">
                                <i class="${result.icon} me-2" style="font-size: 1.5rem; color: var(--secondary-color);"></i>
                                <h5 class="mb-0">${result.bank}</h5>
                            </div>
                            ${isBest ? '<span class="badge badge-best">MEJOR OPCIÓN</span>' : ''}
                        </div>
                        
                        <div class="rate-comparison">
                            <div class="rate-option best-rate">
                                <div class="rate-title">Mejor Tasa</div>
                                <div class="rate-value">${formatPercentage(result.best_rate)}</div>
                                <div class="monthly-value">${formatCurrency(result.new_payment_best)}</div>
                                <div class="small text-muted">Cuota mensual</div>
                            </div>
                            <div class="rate-option worst-rate">
                                <div class="rate-title">Tasa Máxima</div>
                                <div class="rate-value">${formatPercentage(result.worst_rate)}</div>
                                <div class="monthly-value">${formatCurrency(result.new_payment_worst)}</div>
                                <div class="small text-muted">Cuota mensual</div>
                            </div>
                        </div>
                        
                        ${result.campaign_rate ? `
                            <div class="mt-3">
                                <div class="rate-option" style="background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%); border: 2px solid #28a745;">
                                    <div class="rate-title">🎯 Campaña Especial</div>
                                    <div class="rate-value">${formatPercentage(result.campaign_rate)}</div>
                                    <div class="monthly-value">${formatCurrency(result.campaign_payment)}</div>
                                    <div class="small text-muted">Cuota mensual con campaña</div>
                                </div>
                            </div>
                        ` : ''}
                        
                        <hr>
                        
                        <div class="row">
                            <div class="col-6">
                                <div class="text-center">
                                    <div class="small text-muted">Ahorro Mensual</div>
                                    <div class="savings-value ${hasSavings ? '' : 'negative-savings'}">
                                        ${formatCurrency(result.monthly_savings_best)}
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="text-center">
                                    <div class="small text-muted">Ahorro Total</div>
                                    <div class="savings-value ${hasSavings ? '' : 'negative-savings'}">
                                        ${formatCurrency(result.total_savings_best)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        ${result.campaign_rate ? `
                            <hr>
                            <div class="text-center">
                                <div class="small text-muted mb-1">🎯 Ahorro con Campaña Especial</div>
                                <div class="row">
                                    <div class="col-6">
                                        <div class="text-center">
                                            <div class="small text-muted">Mensual</div>
                                            <div class="savings-value" style="color: #28a745; font-weight: bold;">
                                                ${formatCurrency(result.campaign_monthly_savings)}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="text-center">
                                            <div class="small text-muted">Total</div>
                                            <div class="savings-value" style="color: #28a745; font-weight: bold;">
                                                ${formatCurrency(result.campaign_total_savings)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="text-center mt-3">
                            <button class="btn btn-success btn-sm" onclick="contactBankWhatsApp('${result.bank_key}')">
                                <i class="bi bi-whatsapp me-1"></i>
                                Contactar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    banksHtml += '</div>';
    
    // Legal disclaimer
    const legalHtml = `
        <div class="alert alert-warning mt-4">
            <h6><i class="bi bi-exclamation-triangle me-2"></i>Información Importante</h6>
            <p class="small mb-0">
                Esta simulación es referencial. Los resultados pueden variar según las condiciones específicas de cada banco, 
                evaluación crediticia del cliente y políticas vigentes. Las tasas de interés están sujetas a cambios sin previo aviso.
                Las tarifas de los seguros pueden cambiar según la entidad financiera seleccionada.
                Para obtener información exacta y actualizada, consulta a tu asesor Agile Home.
            </p>
        </div>
    `;
    
    resultsContainer.innerHTML = summaryHtml + banksHtml + legalHtml;
    resultsSection.classList.remove('d-none');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
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
        console.error('Error generating WhatsApp link:', error);
    }
}

// General WhatsApp contact
function contactWhatsApp() {
    const message = "Hola! Estoy interesado en obtener asesoría sobre compra de cartera hipotecaria. ¿Podrían ayudarme con información personalizada?";
    const whatsappNumber = "573001234567"; // This should be configured
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Input formatting
document.addEventListener('DOMContentLoaded', function() {
    // Format currency inputs
    const currencyInputs = document.querySelectorAll('input[type="number"][name$="_value"], input[name="property_value"], input[name="portfolio_balance"]');
    currencyInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove non-numeric characters except decimal point
            let value = this.value.replace(/[^\d.]/g, '');
            
            // Ensure only one decimal point
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            
            this.value = value;
        });
    });
    
    // Format percentage inputs
    const percentageInputs = document.querySelectorAll('input[name="current_rate"]');
    percentageInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = parseFloat(this.value);
            if (value > 100) {
                this.value = 100;
            } else if (value < 0) {
                this.value = 0;
            }
        });
    });
});
