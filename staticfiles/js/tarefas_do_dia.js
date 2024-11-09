document.addEventListener('DOMContentLoaded', function () {
	// Função para exibir os dias da semana e destacar o dia atual
	function carregarDiasSemana() {
		const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
		const hoje = new Date();
		const diaAtual = hoje.getDate();
		const diaSemanaAtual = hoje.getDay();

		const diasSemanaDiv = document.getElementById('dias-semana');

		// Verificar se o elemento existe antes de tentar manipulá-lo
		if (!diasSemanaDiv) {
			console.error('Elemento #dias-semana não encontrado.');
			return;
		}

		diasSemanaDiv.innerHTML = ''; // Limpar o conteúdo atual da div

		// Criar os dias da semana dinamicamente
		for (let i = 0; i < 7; i++) {
			const dia = document.createElement('div');
			const data = new Date();
			data.setDate(diaAtual - diaSemanaAtual + i); // Calcula a data para cada dia

			dia.textContent = `${data.getDate()} ${diasSemana[i]}`; // Exibe a data e o dia da semana
			dia.classList.add('px-2');

			// Destacar o dia atual
			if (i === diaSemanaAtual) {
				dia.classList.add('dia-ativo');
			}

			console.log(`Adicionando dia: ${dia.textContent}`); // Adiciona log para cada dia
			diasSemanaDiv.appendChild(dia); // Adiciona o dia à div
		}
	}

	// Chamar a função para carregar o calendário
	carregarDiasSemana();
});

// Função para exibir detalhes da tarefa no modal
function showTaskDetails(tipoAcao, descricao, planta) {
	document.getElementById('taskDetails').innerText = `${descricao}`;
	$('#taskModal').modal('show');
}

// Função para alternar a conclusão das tarefas
function toggleTaskCompletion(checkbox) {
	const taskItem = checkbox.closest('.tarefa'); // Obtém o item da tarefa
	const targetList = checkbox.checked ? 'concluidas-list' : 'pendentes-section';

	// Mover o item da tarefa para a lista apropriada
	if (checkbox.checked) {
		document.getElementById('concluidas-list').appendChild(taskItem);
	} else {
		document.getElementById('pendentes-section').appendChild(taskItem);
	}
}

// Alternar visibilidade da seção de tarefas concluídas
document
	.getElementById('toggle-concluidas-btn')
	.addEventListener('click', function () {
		const concluidasList = document.getElementById('concluidas-list');
		const isVisible = concluidasList.style.display !== 'none';

		// Alternar visibilidade
		concluidasList.style.display = isVisible ? 'none' : 'block';

		// Girar a seta
		this.classList.toggle('closed', isVisible);
	});
