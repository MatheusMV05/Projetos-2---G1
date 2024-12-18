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

	// Verificar se a tarefa foi marcada como concluída
	if (checkbox.checked) {
		// Adicionar uma classe para animação de conclusão
		taskItem.classList.add('fade-out');

		// Remover a tarefa da lista de pendentes após a animação
		setTimeout(() => {
			document.getElementById('concluidas-list').appendChild(taskItem);
			taskItem.classList.remove('fade-out'); // Remove a classe para reutilização futura
			taskItem.style.width = '100%'; // Ensure proper width in completed section
		}, 300);

		// Enviar ao backend caso seja uma colheita
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
		// Remover a tarefa da lista de concluídas e retornar para pendentes
		document.getElementById('pendentes-section').appendChild(taskItem);
		taskItem.style.width = '82vw'; // Reset width for pending section
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

function abrirModalTarefa() {
	// Exibe o modal usando o método Bootstrap para mostrar modais
	$('#addTaskModal').modal('show');
}

function adicionarTarefa(event) {
	event.preventDefault(); // Evita o reload da página ao enviar o formulário

	// Coletando os valores do formulário
	const tipoAcao = document.getElementById('tipo-acao').value;
	const descricao = document.getElementById('descricao').value;
	const planta = document.getElementById('planta').value;

	// Enviando a nova tarefa ao backend
	fetch('/adicionar_tarefa/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': getCookie('csrftoken'), // Token CSRF para segurança no Django
		},
		body: JSON.stringify({
			tipo_acao: tipoAcao,
			descricao: descricao,
			planta: planta,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				// Criando o novo item da tarefa
				const novaTarefa = document.createElement('li');
				novaTarefa.classList.add(
					'list-group-item',
					'd-flex',
					'justify-content-between',
					'align-items-center'
				);
				novaTarefa.innerHTML = `
                <span onclick="showTaskDetails('${data.tarefa.tipo_acao}', '${data.tarefa.descricao}', '${data.tarefa.planta}')">
                    ${data.tarefa.tipo_acao} - ${data.tarefa.planta}
                </span>
                <input type="checkbox" class="checkbox" onclick="toggleTaskCompletion(this, '${data.tarefa.tipo_acao}', ${data.tarefa.id})" />
            `;

				// Adicionando a nova tarefa à lista de pendentes
				document.getElementById('pendentes-list').appendChild(novaTarefa);

				// Limpar o formulário e fechar o modal
				document.getElementById('add-task-form').reset();
				$('#addTaskModal').modal('hide');
			} else {
				console.error('Erro ao adicionar tarefa:', data.error);
			}
		})
		.catch((error) => {
			console.error('Erro de conexão:', error);
		});
}

const trimesterDisplay = document.getElementById('trimester-display');
const calendarGrid = document.getElementById('calendar-grid');

let date = new Date();

function getTrimester(month) {
	if (month < 3) return [0, 1, 2]; // Q1: Jan, Feb, Mar
	else if (month < 6) return [3, 4, 5]; // Q2: Apr, May, Jun
	else if (month < 9) return [6, 7, 8]; // Q3: Jul, Aug, Sep
	else return [9, 10, 11]; // Q4: Oct, Nov, Dec
}

function renderTrimester() {
	trimesterDisplay.innerHTML = '';
	const currentMonth = date.getMonth();
	const trimesterMonths = getTrimester(currentMonth);

	trimesterMonths.forEach((monthIndex) => {
		const monthDiv = document.createElement('div');
		monthDiv.classList.add('trimester-month');
		monthDiv.innerText = new Date(
			date.getFullYear(),
			monthIndex
		).toLocaleString('default', { month: 'long' });

		if (monthIndex === currentMonth) {
			monthDiv.classList.add('highlighted-month');
		}

		trimesterDisplay.appendChild(monthDiv);
	});
}

function renderCalendar() {
	calendarGrid.innerHTML = `
                <div class="day-header">D</div>
                <div class="day-header">S</div>
                <div class="day-header">T</div>
                <div class="day-header">Q</div>
                <div class="day-header">Q</div>
                <div class="day-header">S</div>
                <div class="day-header">S</div>
            `;

	const year = date.getFullYear();
	const month = date.getMonth();
	const firstDayIndex = new Date(year, month, 1).getDay();
	const lastDay = new Date(year, month + 1, 0).getDate();

	for (let i = 0; i < firstDayIndex; i++) {
		calendarGrid.innerHTML += `<div class="day-cell"></div>`;
	}

	for (let i = 1; i <= lastDay; i++) {
		const day = document.createElement('div');
		day.classList.add('day-cell', 'date-cell'); // Apply background only to actual date cells
		day.innerText = i;

		if (
			i === new Date().getDate() &&
			year === new Date().getFullYear() &&
			month === new Date().getMonth()
		) {
			day.classList.add('current-day');
		}

		day.addEventListener('click', () => {
			alert(`Date selected: ${i}/${month + 1}/${year}`);
		});

		calendarGrid.appendChild(day);
	}
}

renderTrimester();
renderCalendar();
