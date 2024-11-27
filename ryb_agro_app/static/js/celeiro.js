// Atualiza o peso total com base na seleção de plantas
function atualizarPesoTotal(plantasSelecionadas, plantasData) {
    let pesoTotal = 0;

    // Soma os pesos das plantas selecionadas
    plantasSelecionadas.forEach(id => {
        const planta = plantasData.find(p => p.id == id);
        if (planta) {
            pesoTotal += planta.peso_previsto;
        }
    });

    // Atualiza o valor no HTML
    document.getElementById('peso-total').textContent = pesoTotal.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
    const seletorPlantas = document.getElementById('selecionar-plantas');

    // Escuta mudanças no seletor
    seletorPlantas.addEventListener('change', () => {
        const plantasSelecionadas = Array.from(seletorPlantas.selectedOptions).map(option => option.value);
        atualizarPesoTotal(plantasSelecionadas, window.plantasData);
    });
});
