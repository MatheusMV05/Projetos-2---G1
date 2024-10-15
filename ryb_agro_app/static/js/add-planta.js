let SubmitMenu = document.getElementById('menu-abrir');
let menu = document.getElementById('menu-mobile');

SubmitMenu.addEventListener('click', () => {
    menu.classList.add('abrir-menu');
});

menu.addEventListener('click', () => {
    menu.classList.remove('abrir-menu');
});

const cardContainer = document.querySelector(".card-container");
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
    { title: "Abóbora", image: cardContainer.dataset.aboboraImg },
    { title: "Batata doce", image: cardContainer.dataset.batataImg },
    { title: "Cenoura", image: cardContainer.dataset.cenouraImg },
    { title: "Inhame", image: cardContainer.dataset.inhameImg },
    { title: "Milho", image: cardContainer.dataset.milhoImg },
];

// Função para exibir os cards das plantas
const displayData = data => {
    cardContainer.innerHTML = "";
    data.forEach(e => {
        const cardHTML = `
            <div class="card" data-title="${e.title}" data-image="${e.image}">
                <h3>${e.title}</h3>
                <img src="${e.image}" alt="${e.title}">
            </div>
        `;
        cardContainer.innerHTML += cardHTML;
    });

    // Evento de clique nos cards para abrir o modal
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (event) => {
            const title = event.currentTarget.dataset.title;
            const image = event.currentTarget.dataset.image;

            modalTitle.textContent = title;
            modalImage.src = image;

            // Limpa os campos do modal
            harvestAmountInput.value = '';
            harvestFrequencySelect.value = 'uma vez';

            // Exibe o modal
            modal.style.display = "block";
        });
    });
}

// Fecha o modal quando clicar no botão de fechar
closeModal.addEventListener('click', () => {
    modal.style.display = "none";
});

// Fecha o modal quando clicar fora do modal
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Evento para adicionar a planta na lista
addPlantButton.addEventListener('click', () => {
    const harvestAmount = harvestAmountInput.value;
    const harvestFrequency = harvestFrequencySelect.value;
    const selectedPlant = modalTitle.textContent;

    if (!harvestAmount) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    // Adiciona a planta na lista
    const plant = { name: selectedPlant, amount: harvestAmount, frequency: harvestFrequency };
    savedPlants.push(plant);

    // Atualiza a lista de plantas exibida
    updatePlantList();

    // Fecha o modal
    modal.style.display = "none";
});

// Atualiza a lista de plantas exibida
const updatePlantList = () => {
    plantListContainer.innerHTML = "";
    savedPlants.forEach((plant, index) => {
        const plantItem = document.createElement('li');
        plantItem.innerHTML = `
            ${plant.name} - ${plant.amount} kg, ${plant.frequency}
            <button class="remove-plant" data-index="${index}"> X </button>
        `;
        plantListContainer.appendChild(plantItem);
    });

    // Adiciona evento de remover planta
    document.querySelectorAll('.remove-plant').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.currentTarget.dataset.index;
            removePlant(index);
        });
    });
}

// Remove a planta da lista
const removePlant = (index) => {
    savedPlants.splice(index, 1);
    updatePlantList();
}

// Evento para salvar e continuar
const saveAndContinueButton = document.getElementById('saveAndContinueButton');
saveAndContinueButton.addEventListener('click', () => {
    if (savedPlants.length === 0) {
        alert('Nenhuma planta foi registrada!');
        return;
    }

    sendDataToBackend(savedPlants);  // Envia a lista de plantas para o backend
});

// Função para enviar os dados ao backend
const sendDataToBackend = async (plantas) => {
    try {
        const response = await fetch('/planta/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()  // Adiciona o CSRF token
            },
            body: JSON.stringify({ plantas })
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar os dados!');
        }

        alert('Plantas salvas com sucesso!');
        window.location.href = '/dashboard/';
    } catch (error) {
        console.error(error);
        alert('Erro ao tentar salvar as plantas.');
    }
};

// Função para pegar o CSRF token
function getCSRFToken() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken'))
        ?.split('=')[1];
    return cookieValue;
}

// Exibe as plantas no carregamento da página
searchInput.addEventListener("keyup", (e) => {
    const search = data.filter(i => i.title.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()));
    displayData(search);
});

window.addEventListener("load", displayData.bind(null, data));
