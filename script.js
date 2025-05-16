document.getElementById('simuladorForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const f = e.target;

  // Condiciones actuales
  const plazoInicial = parseInt(f.plazoInicial.value);
  const cuotaActual = parseFloat(f.cuotaActual.value);
  const valorTotalPagado = plazoInicial * 12 * cuotaActual;

  // Oferta compra de cartera
  const nuevoCredito = parseFloat(f.nuevoCredito.value);
  const nuevoPlazo = parseInt(f.nuevoPlazo.value);
  const nuevaTasa = parseFloat(f.nuevaTasa.value) / 100;
  const nuevosSeguros = parseFloat(f.nuevosSeguros.value || f.segurosMensuales.value);

  const tasaMensual = Math.pow(1 + nuevaTasa, 1 / 12) - 1;
  const cuotaSinSeguros = (nuevoCredito * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -nuevoPlazo * 12));
  const nuevaCuotaTotal = cuotaSinSeguros + nuevosSeguros;
  const valorPagadoNuevo = nuevaCuotaTotal * nuevoPlazo * 12;

  const ahorroTotal = valorTotalPagado - valorPagadoNuevo;
  const ahorroMensual = cuotaActual - nuevaCuotaTotal;

  document.getElementById('resultado').innerHTML = `
    <h3>📊 Resultado de la Simulación</h3>
    <p><strong>Valor total pagado con el crédito actual:</strong> $${valorTotalPagado.toFixed(0)}</p>
    <p><strong>Nueva cuota mensual con seguros:</strong> $${nuevaCuotaTotal.toFixed(0)}</p>
    <p><strong>Valor total con compra de cartera:</strong> $${valorPagadoNuevo.toFixed(0)}</p>
    <p><strong>Ahorro mensual:</strong> $${ahorroMensual.toFixed(0)}</p>
    <p><strong>Ahorro total:</strong> $${ahorroTotal.toFixed(0)}</p>
  `;
});
