# Simulador de Costes y Fricción de Trading - Smart Portfolios Cap. 2

## Descripción
Esta herramienta interactiva permite calcular el impacto de los costes de trading (comisiones fijas, porcentuales, spread y slippage) sobre la rentabilidad de una estrategia de inversión. Está diseñada para ayudar a inversores y traders a entender cuánto de su rentabilidad esperada se pierde por fricciones del mercado y cuál es el punto muerto necesario para ser rentable después de costes.

## Cómo usar
1. Abre el archivo `index.html` en cualquier navegador moderno (Chrome, Firefox, Safari, Edge).
2. Ajusta los parámetros según tu situación:
   - **Capital inicial**: El dinero con el que empiezas.
   - **Número de operaciones al mes**: Frecuencia media de operaciones (compra y venta cuentan como operaciones separadas).
   - **Comisión fija por operación**: Comisión plana que cobra tu broker por cada operación (en euros).
   - **Comisión porcentual**: % del valor de la operación que cobra tu broker.
   - **Spread medio**: Diferencia típica entre precio de compra y venta (en %).
   - **Slippage estimado**: Deslizamiento esperado entre el precio esperado y el precio de ejecución (en %).
   - **Rentabilidad bruta mensual esperada**: El retorno que esperas obtener ANTES de descontar costes (en %).
3. Haz clic en "Calcular impacto de costes" o presiona Enter en cualquier campo.
4. Revisa los resultados:
   - Coste por operación, mensual y anualizado.
   - Rentabilidad neta mensual y anualizada (después de costes).
   - Punto muerto: rentabilidad bruta mínima necesaria para cubrir costes.
   - Alerta de nivel de costes (bajos, moderados o destructivos).
5. Utiliza los botones de escenarios predefinidos para ver ejemplos típicos:
   - **Inversor Buy & Hold**: Pocas operaciones, foco en largo plazo.
   - **Trader Mensual**: Operaciones regulares, ejemplo de swing trading.
   - **Trader Frecuente**: Alta frecuencia, requiere skill para justificar los costes.

## Fórmulas utilizadas
- **Coste por operación** = comisión_fija + (capital_por_operación × comisión_porcentual/100) + (capital_por_operación × spread/100) + (capital_por_operación × slippage/100)
- **Coste mensual** = coste_por_operación × operaciones_al_mes
- **Rentabilidad neta mensual** = rentabilidad_bruta_mensual - (coste_mensual / capital_inicial)
- **Rentabilidad neta anualizada** = (1 + rentabilidad_neta_mensual/100)^12 - 1
- **Punto muerto mensual** = (coste_mensual / capital_inicial) × 100

## Limitaciones y supuestos
- Asume que cada operación implica el capital total (simplificación). En la práctica, podrías operar solo una parte de tu capital.
- No considera el impacto de las operaciones en el precio de mercado (market impact) más allá del slippage estimado.
- Los costes se aplican de forma lineal y constante; no considera comisiones escalonadas o reembolsos.
- La rentabilidad bruta es un promedio mensual esperado; no modela la variabilidad o distribución de retornos.
- Todo el cálculo es determinístico y no incluye simulación de Monte Carlo ni análisis de escenarios.

## Licencia
MIT License - Sígueme en [MasDividendos.com](https://masdividendos.com) para más herramientas educativas sobre finanzas y trading.
