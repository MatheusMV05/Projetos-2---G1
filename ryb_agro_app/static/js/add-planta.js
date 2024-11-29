console.log('Arquivo add-planta.js carregado com sucesso!');

let SubmitMenu = document.getElementById('menu-abrir');
let menu = document.getElementById('menu-mobile');

SubmitMenu.addEventListener('click', () => {
	menu.classList.add('abrir-menu');
});

menu.addEventListener('click', () => {
	menu.classList.remove('abrir-menu');
});

const cardContainer = document.querySelector('.card-container');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const closeModal = document.querySelector('.close');
const harvestAmountInput = document.getElementById('harvestAmount');
const harvestFrequencySelect = document.getElementById('harvestFrequency');
const addPlantButton = document.getElementById('addPlantButton');
const plantListContainer = document.getElementById('plantList');
let savedPlants = [];

// Dados das plantas para exibição
const data = [
	{ title: 'Abóbora', image: cardContainer.dataset.aboboraImg },
	{ title: 'Batata-doce', image: cardContainer.dataset.batataImg },
	{ title: 'Cenoura', image: cardContainer.dataset.cenouraImg },
	{ title: 'Inhame', image: cardContainer.dataset.inhameImg },
	{ title: 'Milho', image: cardContainer.dataset.milhoImg },
];

// Função para exibir os cards das plantas
const displayData = (data) => {
	cardContainer.innerHTML = '';
	data.forEach((e) => {
		const cardHTML = `
            <div class="card" data-title="${e.title}" data-image="${e.image}">
                <h3>${e.title}</h3>
                <img src="${e.image}" alt="${e.title}">
            </div>
        `;
		cardContainer.innerHTML += cardHTML;
	});

	// Evento de clique nos cards para abrir o modal
	document.querySelectorAll('.card').forEach((card) => {
		card.addEventListener('click', (event) => {
			const title = event.currentTarget.dataset.title;
			const image = event.currentTarget.dataset.image;

			modalTitle.textContent = title;
			modalImage.src = image;

			console.log('Card clicado, tentando carregar canteiros...');
			loadCanteiros(); // Carrega os canteiros sempre que o modal é aberto

			// Limpa os campos do modal
			harvestAmountInput.value = '';
			harvestFrequencySelect.value = 'uma vez';

			// Exibe o modal
			modal.style.display = 'block';
		});
	});
};

// Fecha o modal quando clicar no botão de fechar
closeModal.addEventListener('click', () => {
	modal.style.display = 'none';
});

// Fecha o modal quando clicar fora do modal
window.addEventListener('click', (event) => {
	if (event.target === modal) {
		modal.style.display = 'none';
	}
});

// Dados das plantas que não devem ser plantadas juntas
const conflictingPlants = {
	Abóbora: ['Cenoura'],
	'Batata-doce': ['Abóbora'],
	Cenoura: ['Abóbora'],
	Inhame: [],
	Milho: [],
};

// Função para verificar se há conflito entre plantas e retornar as plantas conflitantes
const checkConflictingPlants = (newPlant, setorId) => {
	let conflictingList = new Set(); // Usamos um Set para evitar duplicatas

	// Filtra plantas do mesmo setor
	const plantsInSameSector = savedPlants.filter(
		(plant) => plant.setor === setorId
	);

	// Verifica conflitos apenas dentro do mesmo setor
	plantsInSameSector.forEach((plant) => {
		// Planta nova é conflitante com uma salva
		if (conflictingPlants[newPlant]?.includes(plant.name)) {
			conflictingList.add(plant.name);
		}

		// Planta salva é conflitante com a nova
		if (conflictingPlants[plant.name]?.includes(newPlant)) {
			conflictingList.add(plant.name);
		}
	});

	return Array.from(conflictingList); // Converte o Set de volta para array
};

// Evento para adicionar a planta na lista
addPlantButton.addEventListener('click', () => {
    const harvestAmount = harvestAmountInput.value;
    const harvestFrequency = harvestFrequencySelect.value;
    const selectedPlant = modalTitle.textContent;
    const selectedCanteiro = document.getElementById('selectCanteiro').value;

    if (!harvestAmount || !selectedCanteiro) {
        alert('Por favor, insira uma quantidade válida e selecione um canteiro.');
        return;
    }

    // Obtém o setor do dropdown do canteiro
    const setorId = document.querySelector(
        `#selectCanteiro option[value="${selectedCanteiro}"]`
    )?.dataset.setor;

    const plant = {
        name: selectedPlant,
        amount: harvestAmount,
        frequency: harvestFrequency,
        canteiro: selectedCanteiro,
        setor: setorId, // Inclui o setor associado
    };
    savedPlants.push(plant);
    updatePlantList();
    modal.style.display = 'none';
});

// Atualiza a lista de plantas exibida
const updatePlantList = () => {
    plantListContainer.innerHTML = ''; // Limpa a lista existente

    // Agrupa as plantas por canteiro
    const groupedPlants = savedPlants.reduce((acc, plant) => {
        if (!acc[plant.canteiro]) {
            acc[plant.canteiro] = [];
        }
        acc[plant.canteiro].push(plant);
        return acc;
    }, {});

    // Cria elementos separados para cada canteiro
    Object.keys(groupedPlants).forEach((canteiroId) => {
        const canteiroOption = document.querySelector(`#selectCanteiro option[value="${canteiroId}"]`);
        const canteiroName = canteiroOption?.textContent || `Canteiro ${canteiroId}`;
        const setorName = canteiroOption?.dataset.setor || "Setor desconhecido";

        const canteiroSection = document.createElement('div');
        canteiroSection.innerHTML = `<h4>${setorName} - ${canteiroName}</h4>`;
        plantListContainer.appendChild(canteiroSection);

        const plantList = document.createElement('ul');
        groupedPlants[canteiroId].forEach((plant, index) => {
            const plantItem = document.createElement('li');
            plantItem.innerHTML = `
                ${plant.name} - ${plant.amount} kg, ${plant.frequency}
                <button class="remove-plant" data-index="${index}"> X </button>
            `;
            plantList.appendChild(plantItem);
        });
        canteiroSection.appendChild(plantList);
    });

    // Adiciona evento para remover plantas
    document.querySelectorAll('.remove-plant').forEach((button) => {
        button.addEventListener('click', (event) => {
            const index = event.currentTarget.dataset.index;
            removePlant(index);
        });
    });
};


// Remove a planta da lista
const removePlant = (index) => {
	savedPlants.splice(index, 1);
	updatePlantList();
};

// Evento para salvar e continuar
const saveAndContinueButton = document.getElementById('saveAndContinueButton');
saveAndContinueButton.addEventListener('click', () => {
	if (savedPlants.length === 0) {
		alert('Nenhuma planta foi registrada!');
		return;
	}

	// Agrupa as plantas por canteiro
	const groupedPlants = savedPlants.reduce((acc, plant) => {
		if (!acc[plant.canteiro]) {
			acc[plant.canteiro] = [];
		}
		acc[plant.canteiro].push(plant);
		return acc;
	}, {});

	// Envia os dados agrupados por canteiro para o backend
	Object.keys(groupedPlants).forEach((canteiroId) => {
		sendDataToBackend(groupedPlants[canteiroId], canteiroId);
	});
});

// Função para enviar os dados ao backend
const sendDataToBackend = async (plantas, canteiroId) => {
    try {
        const canteiroOption = document.querySelector(`#selectCanteiro option[value="${canteiroId}"]`);
        const setorId = canteiroOption?.dataset.setor; // Captura o setor do dropdown

        if (!setorId) {
            throw new Error('Setor não encontrado para o canteiro selecionado.');
        }

        const response = await fetch('/planta/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ plantas, canteiro_id: canteiroId, setor_id: setorId }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Erro do backend:', errorMessage);
            throw new Error(`Erro ao salvar os dados: ${errorMessage}`);
        }

        alert('Plantas salvas com sucesso!');
        window.location.href = '/tarefas_do_dia/';
    } catch (error) {
        console.error('Erro durante o envio das plantas:', error);
        alert('Erro ao tentar salvar as plantas. Consulte o console para mais detalhes.');
    }
};

// Função para pegar o CSRF token
function getCSRFToken() {
	const cookieValue = document.cookie
		.split('; ')
		.find((row) => row.startsWith('csrftoken'))
		?.split('=')[1];
	return cookieValue;
}

// Exibe as plantas no carregamento da página
searchInput.addEventListener('keyup', (e) => {
	const search = data.filter((i) =>
		i.title.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
	);
	displayData(search);
});

window.addEventListener('load', displayData.bind(null, data));

// Carrega os canteiros para o dropdown do modal
const loadCanteiros = async () => {
    try {
        const response = await fetch('/get-canteiros/');
        if (!response.ok) {
            throw new Error(`Erro ao buscar canteiros: ${response.status}`);
        }

        const canteiros = await response.json();
        const selectCanteiro = document.getElementById('selectCanteiro');
        selectCanteiro.innerHTML = '';

        canteiros.forEach((canteiro) => {
            const option = document.createElement('option');
            option.value = canteiro.id;
            option.textContent = `${canteiro.setor} - ${canteiro.name}`;
            option.dataset.setor = canteiro.setor;
            selectCanteiro.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar os canteiros:', error);
    }
};

