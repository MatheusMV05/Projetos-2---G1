function showTaskDetails(tipoAcao, descricao, planta) {
	document.getElementById('taskDetails').innerText = `${descricao}`;
	$('#taskModal').modal('show');
}

function toggleTaskCompletion(checkbox) {
	const taskItem = checkbox.parentElement; // Obtem o item da tarefa
	const targetList = checkbox.checked ? 'concluidas-list' : 'pendentes-section';

	// Mover o item da tarefa para a lista apropriada
	if (checkbox.checked) {
		document.getElementById('concluidas-list').appendChild(taskItem);
	} else {
		const plantaSection = taskItem.closest('.planta-section');
		plantaSection.querySelector('ul').appendChild(taskItem);
	}
}

document
	.getElementById('toggle-concluidas-btn')
	.addEventListener('click', function () {
		const concluidasSection = document.getElementById('concluidas-list');
		const isVisible = concluidasSection.style.display !== 'none';

		// Alternar visibilidade
		concluidasSection.style.display = isVisible ? 'none' : 'block';

		// Girar a seta
		this.classList.toggle('closed', isVisible);
	});
