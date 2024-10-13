let SubmitMenu = document.getElementById('menu-abrir')
let menu = document.getElementById('menu-mobile')

SubmitMenu.addEventListener('click', () => {
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click', () => {
    menu.classList.remove('abrir-menu')
})

const cardContainer = document.querySelector(".card-container");
/*const cards = document.querySelectorAll('.card');
const popupOuter = document.querySelector(".popup-outer");
const popupImg = document.querySelectorById("#popup-img");
const popupTitle = document.querySelectorById(".popup-title");*/

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

/*cards.forEach(card => {
    card.addEventListener('click', () => {
        const cardTitle = card.querySelector('h3').textContent;
        const cardImage = card.querySelector('img').src;

        // Update popup content with card details
        popupTitle.textContent = cardTitle;
        popupImage.src = cardImage;

        // Show the popup
        popupOuter.style.opacity = '1';
        popupOuter.style.pointerEvents = 'auto';
        popupOuter.style.transform = 'scale(1)';
    });
});

const closePopup = document.getElementById('close');
closePopup.addEventListener('click', () => {
    popupOuter.style.opacity = '0';
    popupOuter.style.pointerEvents = 'none';
    popupOuter.style.transform = 'scale(1.2)';
});*/
/*const displayData = data => {
    cardContainer.innerHTML = "";
    data.forEach(e => {
        cardContainer.innerHTML += `
            <div class="card">
                <h3>${e.title}</h3>
                <img src="${e.image}" alt="${e.title}">
            </div>
            `
    });
}*/

/*const displayData = data => {
    cardContainer.innerHTML = "";
    data.forEach((e, index) => {
        cardContainer.innerHTML += `
            <div class="card" data-index="${index}">
                <h3>${e.title}</h3>
                <img src="${e.image}" alt="${e.title}">
            </div>
        `;
    });

    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const index = card.dataset.index;
            showPopup(data[index]); // Mostra o popup correspondente ao card clicado
        });
    });
};

const showPopup = plant => {
    popupTitle.textContent = plant.title; // Define o título
    popupImg.src = plant.image;           // Altera a imagem
    popupOuter.classList.add("show");     // Exibe o popup
};

popupClose.addEventListener("click", () => {
    popupOuter.classList.remove("show");
});*/

searchInput.addEventListener("keyup", (e) => {
    const search = data.filter(i => i.title.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()));
    displayData(search);
})

window.addEventListener("load", displayData.bind(null, data))

/*const section = document.querySelector(".section"),
    SumbitPop = section.querySelector("#submit"),
    closeSubmit = section.querySelectorAll("#close");

SumbitPop.addEventListener("click", () => {
    section.classList.add("show");
});

closeSubmit.forEach(cSbmt => {
    cSbmt.addEventListener("click", () => {
        section.classList.remove("show");
    })
});*/