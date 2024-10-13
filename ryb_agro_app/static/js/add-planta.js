let SubmitMenu = document.getElementById('menu-abrir')
let menu = document.getElementById('menu-mobile')

SubmitMenu.addEventListener('click', () => {
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click', () => {
    menu.classList.remove('abrir-menu')
})

const cardContainer = document.querySelector(".card-container");

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
        cardContainer.innerHTML += `
            <div class="card">
                <h3>${e.title}</h3>
                <img src="${e.image}" alt="${e.title}">
            </div>
            `
    });
}

searchInput.addEventListener("keyup", (e) => {
    const search = data.filter(i => i.title.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()));
    displayData(search);
})

window.addEventListener("load", displayData.bind(null, data))

const section = document.querySelector(".section"),
    SumbitPop = section.querySelector("#submit"),
    closeSubmit = section.querySelectorAll("#close");

SumbitPop.addEventListener("click", () => {
    section.classList.add("show");
});

closeSubmit.forEach(cSbmt => {
    cSbmt.addEventListener("click", () => {
        section.classList.remove("show");
    })
});