// script.js for Smart Portfolios Cap. 2: Costes y fricción de trading

document.getElementById('calculateBtn').addEventListener('click', calculateCosts);
document.getElementById('initialCapital').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calculateCosts();
});
document.getElementById('tradesPerMonth').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calculateCosts();
});
document.getElementById('fixedCommission').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calculateCosts();
});
document.getElementById('percentCommission').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calculateCosts();
});
document.getElementById('avgSpread').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calculateCosts();
});
document.getElementById('slippage').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calculateCosts();
});
document.getElementById('grossReturn').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calculateCosts();
});

// Escenarios predefinidos
const scenarios = {
    buyhold: {
        initialCapital: 10000,
        tradesPerMonth: 1, // una operación al mes (compra y mantenimiento, venta rara)
        fixedCommission: 0,
        percentCommission: 0.1,
        avgSpread: 0.05,
        slippage: 0.01,
        grossReturn: 0.5 // 0.5% mensual bruto
    },
    monthly: {
        initialCapital: 10000,
        tradesPerMonth: 2, // una entrada y una salida al mes
        fixedCommission: 0,
        percentCommission: 0.1,
        avgSpread: 0.05,
        slippage: 0.02,
        grossReturn: 2 // 2% mensual bruto
    },
    frequent: {
        initialCapital: 10000,
        tradesPerMonth: 20, // muchas operaciones
        fixedCommission: 0,
        percentCommission: 0.1,
        avgSpread: 0.05,
        slippage: 0.05,
        grossReturn: 3 // 3% mensual bruto (asumiendo skill para justificar frecuencia)
    }
};

// Asignar evento a los botones de escenario
document.querySelectorAll('.scenario-btn').forEach(button => {
    button.addEventListener('click', () => {
        const scenario = button.dataset.scenario;
        loadScenario(scenario);
        // Actualizar estado activo
        document.querySelectorAll('.scenario-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

function loadScenario(scenarioKey) {
    const scen = scenarios[scenarioKey];
    document.getElementById('initialCapital').value = scen.initialCapital;
    document.getElementById('tradesPerMonth').value = scen.tradesPerMonth;
    document.getElementById('fixedCommission').value = scen.fixedCommission;
    document.getElementById('percentCommission').value = scen.percentCommission;
    document.getElementById('avgSpread').value = scen.avgSpread;
    document.getElementById('slippage').value = scen.slippage;
    document.getElementById('grossReturn').value = scen.grossReturn;
}

function calculateCosts() {
    const initialCapital = parseFloat(document.getElementById('initialCapital').value);
    const tradesPerMonth = parseFloat(document.getElementById('tradesPerMonth').value);
    const fixedCommission = parseFloat(document.getElementById('fixedCommission').value);
    const percentCommission = parseFloat(document.getElementById('percentCommission').value);
    const avgSpread = parseFloat(document.getElementById('avgSpread').value);
    const slippage = parseFloat(document.getElementById('slippage').value);
    const grossReturn = parseFloat(document.getElementById('grossReturn').value);

    // Validación
    if (isNaN(initialCapital) || initialCapital <= 0) {
        showError('Por favor ingresa un capital inicial válido');
        return;
    }
    if (isNaN(tradesPerMonth) || tradesPerMonth < 0) {
        showError('Por favor ingresa un número de operaciones al mes válido');
        return;
    }
    if (isNaN(fixedCommission) || fixedCommission < 0) {
        showError('Por favor ingresa una comisión fija válida');
        return;
    }
    if (isNaN(percentCommission) || percentCommission < 0) {
        showError('Por favor ingresa una comisión porcentual válida');
        return;
    }
    if (isNaN(avgSpread) || avgSpread < 0) {
        showError('Por favor ingresa un spread medio válido');
        return;
    }
    if (isNaN(slippage) || slippage < 0) {
        showError('Por favor ingresa un slippage estimado válido');
        return;
    }
    if (isNaN(grossReturn)) {
        showError('Por favor ingresa una rentabilidad bruta mensual esperada válida');
        return;
    }

    // Ocultar error y mostrar resultados
    hideError();
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';

    // Cálculo del coste por operación
    // capital_por_operacion: asumimos que cada operación implica el capital total (simplificación)
    // En realidad, podría ser menos si no se opera todo el capital, pero para el modelo asumimos total.
    const capitalPerOperation = initialCapital;
    const costPerOperation =
        fixedCommission +
        capitalPerOperation * (percentCommission / 100) +
        capitalPerOperation * (avgSpread / 100) +
        capitalPerOperation * (slippage / 100);

    const monthlyCost = costPerOperation * tradesPerMonth;
    const annualCost = monthlyCost * 12;

    // Rentabilidad neta mensual y anual
    // rentabilidad_bruta_mensual es un porcentaje (ej: 1 para 1%)
    const grossReturnDecimal = grossReturn / 100;
    const costRatio = monthlyCost / initialCapital; // ya es decimal (ej: 0.01 para 1%)
    const netReturnDecimal = grossReturnDecimal - costRatio;
    const netReturnMonthlyPercent = netReturnDecimal * 100;

    // Anualizado: (1 + net_return_monthly)^12 - 1
    const netReturnAnnualized = Math.pow(1 + netReturnDecimal, 12) - 1;
    const netReturnAnnualizedPercent = netReturnAnnualized * 100;

    // Punto muerto: rentabilidad bruta mínima para cubrir costes
    // Bruta necesaria mensual = coste_mensual / capital_inicial (en decimal) -> luego a porcentaje
    const breakevenMonthlyPercent = (monthlyCost / initialCapital) * 100;

    // Determinar nivel de alerta
    const alertBox = document.getElementById('alertBox');
    alertBox.innerHTML = ''; // limpiar

    let alertMessage = '';
    let alertClass = '';

    if (netReturnMonthlyPercent < 0) {
        alertMessage = `Costes destructivos: pierdes ${Math.abs(netReturnMonthlyPercent).toFixed(2)}% mensual sólo por comisiones.`;
        alertClass = 'alert-destructive';
    } else if (netReturnMonthlyPercent < grossReturn * 0.5) { // menos del 50% de la bruta esperada
        alertMessage = `Costes moderados: pierdes más del 50% de tu rentabilidad bruta esperada.`;
        alertClass = 'alert-moderate';
    } else {
        alertMessage = `Costes bajos: conservas al menos el 50% de tu rentabilidad bruta esperada.`;
        alertClass = 'alert-low';
    }

    alertBox.className = `alert-box ${alertClass}`;
    alertBox.textContent = alertMessage;

    // Mostrar métricas
    const metricsGrid = document.getElementById('metricsGrid');
    metricsGrid.innerHTML = ''; // limpiar

    const metrics = [
        { label: 'Capital inicial', value: initialCapital, format: 'currency', explanation: '€' },
        { label: 'Operaciones al mes', value: tradesPerMonth, format: 'number', explanation: '' },
        { label: 'Coste por operación', value: costPerOperation, format: 'currency', explanation: '€' },
        { label: 'Coste mensual total', value: monthlyCost, format: 'currency', explanation: '€' },
        { label: 'Coste anualizado', value: annualCost, format: 'currency', explanation: '€' },
        { label: 'Rentabilidad bruta mensual', value: grossReturn, format: 'percent', explanation: '' },
        { label: 'Rentabilidad neta mensual', value: netReturnMonthlyPercent, format: 'percent', explanation: '' },
        { label: 'Rentabilidad neta anualizada', value: netReturnAnnualizedPercent, format: 'percent', explanation: '' },
        { label: 'Punto muerto mensual', value: breakevenMonthlyPercent, format: 'percent', explanation: 'Rentabilidad bruta mínima para cubrir costes' }
    ];

    metrics.forEach(metric => {
        const card = document.createElement('div');
        card.className = 'metric-card';

        const label = document.createElement('div');
        label.className = 'metric-label';
        label.textContent = metric.label;

        const value = document.createElement('div');
        value.className = 'metric-value';

        let formattedValue;
        switch (metric.format) {
            case 'currency':
                formattedValue = '€' + metric.value.toFixed(2);
                break;
            case 'percent':
                formattedValue = metric.value.toFixed(2);
                break;
            case 'number':
                formattedValue = metric.value.toFixed(2);
                break;
            default:
                formattedValue = metric.value.toFixed(2);
        }
        value.textContent = formattedValue;

        const explanation = document.createElement('div');
        explanation.className = 'metric-explanation';
        explanation.textContent = metric.explanation;

        card.appendChild(label);
        card.appendChild(value);
        card.appendChild(explanation);

        metricsGrid.appendChild(card);
    });
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
}

// Cargar escenario por defecto al inicio (Buy & Hold)
window.addEventListener('load', () => {
    loadScenario('buyhold');
    document.querySelector('[data-scenario="buyhold"]').classList.add('active');
});