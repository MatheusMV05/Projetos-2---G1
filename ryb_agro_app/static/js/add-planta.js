let SubmitMenu = document.getElementById('menu-abrir')
let menu = document.getElementById('menu-mobile')

SubmitMenu.addEventListener('click', () => {
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click', () => {
    menu.classList.remove('abrir-menu')
})

const data = [
    {
        title: "Abóbora"
    },
    {
        title: "Batata doce"
    },
    {
        title: "Cenoura"
    },
    {
        title: "Inhame"
    },
    {
        title: "Milho"
    },
];

const cardContainer = document.querySelector(".card-container");
const searchInput = document.querySelector("#searchInput");

const displayData = data => {
    cardContainer.innerHTML = "";
    data.forEach(e => {
        cardContainer.innerHTML += `
            <div class="card">
                <h3>${e.title}</h3>
            </div>
            `
    });
}

searchInput.addEventListener("keyup", (e) => {
    const search = data.filter(i => i.title.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()));
    displayData(search);
})

window.addEventListener("load", displayData.bind(null,data))

const section = document.querySelector(".section"),
hireBtn = section.querySelector("#hire-btn"),
closeBtn = section.querySelectorAll("#close");
 
hireBtn.addEventListener("click" , () =>{
    section.classList.add("show");
});

closeBtn.forEach(cBtn => {
    cBtn.addEventListener("click" , ()=>{
        section.classList.remove("show");
    })
});