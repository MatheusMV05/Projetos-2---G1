document.addEventListener('DOMContentLoaded', function () {
	// Load calendar with the current week
	carregarDiasSemana();

	// Event for toggling completed tasks visibility
	document
		.getElementById('toggle-concluidas-btn')
		.addEventListener('click', function () {
			const concluidasSection = document.getElementById('concluidas-list');
			const isVisible = concluidasSection.style.display !== 'none';
			concluidasSection.style.display = isVisible ? 'none' : 'block';
			this.classList.toggle('closed', isVisible);
		});
});

function carregarDiasSemana() {
	const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
	const hoje = new Date();
	const diaAtual = hoje.getDate();
	const diaSemanaAtual = hoje.getDay();

	const diasSemanaDiv = document.getElementById('dias-semana');
	diasSemanaDiv.innerHTML = ''; // Clear previous content

	for (let i = 0; i < 7; i++) {
		const dia = document.createElement('div');
		const data = new Date();
		data.setDate(diaAtual - diaSemanaAtual + i);

		dia.textContent = `${data.getDate()} ${diasSemana[i]}`;
		dia.classList.add('px-2');

		if (i === diaSemanaAtual) {
			dia.classList.add('dia-ativo');
		}

		diasSemanaDiv.appendChild(dia);
	}
}

// Show task details in modal
function showTaskDetails(tipoAcao, descricao, planta) {
	document.getElementById('taskDetails').innerText = descricao;
	$('#taskModal').modal('show');
}

// Toggle task completion status
function toggleTaskCompletion(checkbox) {
	const taskItem = checkbox.parentElement;
	if (checkbox.checked) {
		document.getElementById('concluidas-list').appendChild(taskItem);
	} else {
		document.getElementById('pendentes-section').appendChild(taskItem);
	}
}
