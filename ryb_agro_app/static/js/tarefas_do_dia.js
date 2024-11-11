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
function toggleTaskCompletion(checkbox, tipoAcao, tarefaId) {
	const taskItem = checkbox.parentElement;
	if (checkbox.checked) {
		document.getElementById('concluidas-list').appendChild(taskItem);

		// Verifique se o tipo é colheita e envie ao backend
		if (tipoAcao === 'Colheita') {
			fetch('/registrar_colheita/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': '{{ csrf_token }}', // Token CSRF do Django
				},
				body: JSON.stringify({ tarefaId: tarefaId }),
			})
				.then((response) => response.json())
				.then((data) => console.log(data.message))
				.catch((error) => console.error('Erro:', error));
		}
	} else {
		document.getElementById('pendentes-section').appendChild(taskItem);
	}
}

// Função para obter o CSRF token no Django
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

function buscarPlanta() {
	const query = document.getElementById('search-plant').value;

	fetch(`/buscar_planta/?query=${encodeURIComponent(query)}`)
		.then((response) => response.json())
		.then((data) => {
			const pendentesSection = document.getElementById('pendentes-section');
			pendentesSection.innerHTML = '';

			if (data.tarefas) {
				for (const [planta, tarefas] of Object.entries(data.tarefas)) {
					const plantaSection = document.createElement('div');
					plantaSection.classList.add('planta-section', 'mb-3');
					const tarefaList = document.createElement('ul');
					tarefaList.classList.add('list-group');

					tarefas.forEach((tarefa) => {
						const listItem = document.createElement('li');
						listItem.classList.add(
							'list-group-item',
							'd-flex',
							'justify-content-between',
							'align-items-center'
						);
						listItem.innerHTML = `
                            <span onclick="showTaskDetails('${tarefa.tipo_acao}', '${tarefa.descricao}', '${tarefa.planta}')">
                                ${tarefa.tipo_acao} - ${tarefa.planta}
                            </span>
                            <input type="checkbox" class="checkbox" onclick="toggleTaskCompletion(this)" />
                        `;
						tarefaList.appendChild(listItem);
					});

					plantaSection.appendChild(tarefaList);
					pendentesSection.appendChild(plantaSection);
				}
			} else {
				pendentesSection.innerHTML =
					'<p class="text-muted">Nenhuma tarefa encontrada.</p>';
			}
		})
		.catch((error) => console.error('Erro ao buscar plantas:', error));
}

function aplicarFiltros() {
	const query = document.getElementById('search-plant').value;
	const tipoAcao = document.getElementById('tipo-acao-filter').value;

	// Faz a requisição ao backend com os parâmetros de busca e filtragem
	fetch(
		`/buscar_planta/?query=${encodeURIComponent(
			query
		)}&tipo_acao=${encodeURIComponent(tipoAcao)}`
	)
		.then((response) => response.json())
		.then((data) => {
			const pendentesSection = document.getElementById('pendentes-section');
			pendentesSection.innerHTML = '';

			if (data.tarefas) {
				for (const [planta, tarefas] of Object.entries(data.tarefas)) {
					const plantaSection = document.createElement('div');
					plantaSection.classList.add('planta-section', 'mb-3');
					const tarefaList = document.createElement('ul');
					tarefaList.classList.add('list-group');

					tarefas.forEach((tarefa) => {
						const listItem = document.createElement('li');
						listItem.classList.add(
							'list-group-item',
							'd-flex',
							'justify-content-between',
							'align-items-center'
						);
						listItem.innerHTML = `
                            <span onclick="showTaskDetails('${tarefa.tipo_acao}', '${tarefa.descricao}', '${tarefa.planta}')">
                                ${tarefa.tipo_acao} - ${tarefa.planta}
                            </span>
                            <input type="checkbox" class="checkbox" onclick="toggleTaskCompletion(this)" />
                        `;
						tarefaList.appendChild(listItem);
					});

					plantaSection.appendChild(tarefaList);
					pendentesSection.appendChild(plantaSection);
				}
			} else {
				pendentesSection.innerHTML =
					'<p class="text-muted">Nenhuma tarefa encontrada.</p>';
			}
		})
		.catch((error) => console.error('Erro ao buscar plantas:', error));
}
