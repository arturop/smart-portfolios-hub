// script.js - Capítulo 1: Calculadora de Métricas
console.log('script.js cargado correctamente');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando eventos...');
    
    const calculateBtn = document.getElementById('calculateBtn');
    const returnsTextarea = document.getElementById('returns');
    const riskFreeInput = document.getElementById('riskFree');
    const resultsSection = document.getElementById('resultsSection');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const metricsGrid = document.getElementById('metricsGrid');
    
    console.log('Elementos encontrados:', {
        calculateBtn: !!calculateBtn,
        returnsTextarea: !!returnsTextarea,
        riskFreeInput: !!riskFreeInput,
        resultsSection: !!resultsSection,
        errorMessage: !!errorMessage,
        errorText: !!errorText,
        metricsGrid: !!metricsGrid
    });
    
    if (!calculateBtn) {
        console.error('ERROR: No se encontró el botón calculateBtn');
        return;
    }
    
    calculateBtn.addEventListener('click', function() {
        console.log('Botón Calcular presionado');
        calculateMetrics();
    });
    
    // Permitir calcular con Enter en el textarea (Ctrl+Enter)
    if (returnsTextarea) {
        returnsTextarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                calculateMetrics();
            }
        });
    }
    
    function calculateMetrics() {
        console.log('Iniciando cálculo de métricas...');
        
        const returnsInput = returnsTextarea.value.trim();
        const riskFreeInputValue = parseFloat(riskFreeInput.value);
        
        // Reset UI
        if (errorMessage) errorMessage.style.display = 'none';
        if (resultsSection) resultsSection.style.display = 'none';
        if (metricsGrid) metricsGrid.innerHTML = '';
        
        // Validar entrada
        if (!returnsInput) {
            if (errorText) errorText.textContent = 'Por favor ingresa algunos retornos';
            if (errorMessage) errorMessage.style.display = 'block';
            console.warn('Error: No hay retornos');
            return;
        }
        
        // Parsear retornos (soporta decimales y porcentajes)
        const returns = returnsInput.split(/\s+/)
            .map(s => {
                // Elimina cualquier carácter no numérico excepto punto, coma y signo
                const cleaned = s.replace(/[^\\d.-]/g, '');
                // Si estaba en porcentaje, convertir a decimal
                if (s.includes('%')) {
                    return parseFloat(cleaned) / 100;
                }
                return parseFloat(cleaned);
            })
            .filter(s => !isNaN(s));
        
        console.log('Retornos parseados:', returns.length, 'valores');
        
        if (returns.length === 0) {
            if (errorText) errorText.textContent = 'No se pudieron leer retornos válidos. Verifica el formato.';
            if (errorMessage) errorMessage.style.display = 'block';
            console.warn('Error: No hay retornos válidos');
            return;
        }
        
        if (isNaN(riskFreeInputValue) || riskFreeInputValue < 0) {
            if (errorText) errorText.textContent = 'Por favor ingresa una tasa libre de riesgo válida';
            if (errorMessage) errorMessage.style.display = 'block';
            console.warn('Error: Tasa libre de riesgo inválida');
            return;
        }
        
        // Convertir tasa libre de riesgo anual a mensual para cálculos
        const riskFreeAnnual = riskFreeInputValue / 100; // a decimal
        const riskFreeMonthly = Math.pow(1 + riskFreeAnnual, 1/12) - 1;
        
        console.log('Calculando métricas con', returns.length, 'retornos...');
        
        // Calcular métricas
        const metrics = calculateAllMetrics(returns, riskFreeMonthly);
        
        console.log('Métricas calculadas:', metrics);
        
        // Mostrar resultados
        if (metricsGrid && resultsSection) {
            displayMetrics(metrics, metricsGrid);
            resultsSection.style.display = 'block';
            console.log('Resultados mostrados');
        }
    }
    
    function calculateAllMetrics(returns, riskFreeMonthly) {
        const n = returns.length;
        
        // 1. Retorno total y CAGR
        let totalReturn = 1;
        for (let i = 0; i < n; i++) {
            totalReturn *= (1 + returns[i]);
        }
        totalReturn = totalReturn - 1; // retorno neto del período
        
        const years = n / 12;
        const cagr = years > 0 ? Math.pow(1 + totalReturn, 1/years) - 1 : 0;
        
        // 2. Volatilidad (desviación estándar anualizada)
        const mean = returns.reduce((sum, r) => sum + r, 0) / n;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / n;
        const volatility = Math.sqrt(variance) * Math.sqrt(12); // anualizada
        
        // 3. Ratio de Sharpe
        const excessReturn = cagr - riskFreeInputValue/100; // ambos anuales
        const sharpe = volatility !== 0 ? excessReturn / volatility : 0;
        
        // 4. Ratio de Sortino (solo desviación negativa)
        const downsideReturns = returns.map(r => Math.min(0, r - riskFreeMonthly));
        const downsideVariance = downsideReturns.reduce((sum, d) => sum + Math.pow(d, 2), 0) / n;
        const downsideDeviation = Math.sqrt(downsideVariance) * Math.sqrt(12);
        const sortino = downsideDeviation !== 0 ? excessReturn / downsideDeviation : 0;
        
        // 5. Máximo drawdown y ratio de Calmar
        let peak = 1;
        let maxDrawdown = 0;
        let current = 1;
        
        for (let i = 0; i < n; i++) {
            current *= (1 + returns[i]);
            if (current > peak) {
                peak = current;
            }
            const drawdown = (peak - current) / peak;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }
        
        const calmar = maxDrawdown !== 0 ? cagr / maxDrawdown : 0;
        
        // 6. Tasa de aciertos, promedio de ganancias/pérdidas
        const winningReturns = returns.filter(r => r > 0);
        const losingReturns = returns.filter(r => r < 0);
        
        const winRate = winningReturns.length / n;
        const avgWin = winningReturns.length > 0 ? winningReturns.reduce((sum, r) => sum + r, 0) / winningReturns.length : 0;
        const avgLoss = losingReturns.length > 0 ? Math.abs(losingReturns.reduce((sum, r) => sum + r, 0) / losingReturns.length) : 0;
        const profitFactor = avgLoss !== 0 ? (winningReturns.reduce((sum, r) => sum + r, 0) / Math.abs(losingReturns.reduce((sum, r) => sum + r, 0))) : 0;
        
        // 7. Asimetría y curtosis (excesos)
        const m3 = returns.reduce((sum, r) => sum + Math.pow(r - mean, 3), 0) / n;
        const m4 = returns.reduce((sum, r) => sum + Math.pow(r - mean, 4), 0) / n;
        const skewness = Math.pow(variance, 3/2) !== 0 ? m3 / Math.pow(variance, 3/2) : 0;
        const kurtosis = variance !== 0 ? (m4 / Math.pow(variance, 2)) - 3 : 0; // exceso de curtosis
        
        return {
            cagr: cagr * 100, // a porcentaje
            volatility: volatility * 100, // a porcentaje
            sharpe: sharpe,
            sortino: sortino,
            calmar: calmar,
            maxDrawdown: maxDrawdown * 100, // a porcentaje
            winRate: winRate * 100, // a porcentaje
            avgWin: avgWin * 100, // a porcentaje
            avgLoss: avgLoss * 100, // a porcentaje
            profitFactor: profitFactor,
            skewness: skewness,
            kurtosis: kurtosis
        };
    }
    
    function displayMetrics(metrics, container) {
        console.log('Mostrando métricas...');
        const metricsToDisplay = [
            { label: 'CAGR anual', value: metrics.cagr, format: 'percent', positive: true, explanation: 'Tasa de crecimiento anual compuesta' },
            { label: 'Volatilidad anual', value: metrics.volatility, format: 'percent', positive: false, explanation: 'Desviación estándar de los retornos anualizada' },
            { label: 'Ratio de Sharpe', value: metrics.sharpe, format: 'ratio', positive: metrics.sharpe > 0, explanation: 'Retorno exceso por unidad de volatilidad (mayor es mejor)' },
            { label: 'Ratio de Sortino', value: metrics.sortino, format: 'ratio', positive: metrics.sortino > 0, explanation: 'Similar a Sharpe pero solo considera volatilidad a la baja' },
            { label: 'Ratio de Calmar', value: metrics.calmar, format: 'ratio', positive: metrics.calmar > 0, explanation: 'CAGR dividido por máximo drawdown (mayor es mejor)' },
            { label: 'Máximo drawdown', value: metrics.maxDrawdown, format: 'percent', positive: false, explanation: 'Pico a valle máximo en el período' },
            { label: 'Tasa de aciertos', value: metrics.winRate, format: 'percent', positive: true, explanation: 'Porcentaje de meses con retornos positivos' },
            { label: 'Promedio de ganancia', value: metrics.avgWin, format: 'percent', positive: true, explanation: 'Retorno promedio en meses ganadores' },
            { label: 'Promedio de pérdida', value: metrics.avgLoss, format: 'percent', positive: false, explanation: 'Retorno promedio (absoluto) en meses perdedores' },
            { label: 'Factor de beneficio', value: metrics.profitFactor, format: 'ratio', positive: metrics.profitFactor > 1, explanation: 'Ratio entre ganancias totales y pérdidas totales' },
            { label: 'Asimetría', value: metrics.skewness, format: 'number', positive: metrics.skewness > 0, explanation: 'Medida de simetría de la distribución de retornos' },
            { label: 'Curtosis (exceso)', value: metrics.kurtosis, format: 'number', positive: metrics.kurtosis > 0, explanation: 'Medida de "colas pesadas" respecto a distribución normal' }
        ];
        
        metricsToDisplay.forEach(metric => {
            const card = document.createElement('div');
            card.className = `metric-card ${metric.positive ? 'positive' : !metric.positive && metric.label.includes('pérdida') ? 'negative' : 'neutral'}`;
            
            const label = document.createElement('div');
            label.className = 'metric-label';
            label.textContent = metric.label;
            
            const value = document.createElement('div');
            value.className = 'metric-value';
            
            // Formatear valor según tipo
            let formattedValue;
            switch (metric.format) {
                case 'percent':
                    formattedValue = metric.value.toFixed(2);
                    break;
                case 'ratio':
                    formattedValue = metric.value.toFixed(3);
                    break;
                case 'number':
                    formattedValue = metric.value.toFixed(3);
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
            
            container.appendChild(card);
        });
    }
});