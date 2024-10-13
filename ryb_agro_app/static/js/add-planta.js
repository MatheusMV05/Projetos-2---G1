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

const data = [
    {
        title: "Abóbora",
        image: cardContainer.dataset.aboboraImg
    },
    {
        title: "Batata doce",
        image: cardContainer.dataset.batataImg
    },
    {
        title: "Cenoura",
        image: cardContainer.dataset.cenouraImg
    },
    {
        title: "Inhame",
        image: cardContainer.dataset.inhameImg
    },
    {
        title: "Milho",
        image: cardContainer.dataset.milhoImg
    },
];

const searchInput = document.querySelector("#searchInput");

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

    // Attach click event for each card to show the modal
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (event) => {
            const title = event.currentTarget.dataset.title;
            const image = event.currentTarget.dataset.image;

            modalTitle.textContent = title;
            modalImage.src = image;

            // Reset the input fields when opening the modal
            harvestAmountInput.value = '';
            harvestFrequencySelect.value = 'daily';

            // Show the modal
            modal.style.display = "block";
        });
    });
}

// Close the modal when the user clicks on (x)
closeModal.addEventListener('click', () => {
    modal.style.display = "none";
});

// Also close modal when clicking outside of modal-content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Add plant button click event
addPlantButton.addEventListener('click', () => {
    const harvestAmount = harvestAmountInput.value;
    const harvestFrequency = harvestFrequencySelect.value;
    const selectedPlant = modalTitle.textContent;

    if (!harvestAmount) {
        alert('Please enter a valid harvest amount.');
        return;
    }

    // Perform desired action here (e.g., add plant to a list, send data to a server)
    console.log(`Added plant: ${selectedPlant}`);
    console.log(`Harvest Amount: ${harvestAmount} kg`);
    console.log(`Harvest Frequency: ${harvestFrequency}`);

    // Close the modal after adding the plant
    modal.style.display = "none";
});

searchInput.addEventListener("keyup", (e) => {
    const search = data.filter(i => i.title.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()));
    displayData(search);
});

window.addEventListener("load", displayData.bind(null, data));