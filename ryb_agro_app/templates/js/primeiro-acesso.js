let SubmitMenu = document.getElementById('menu-abrir')
let menu = document.getElementById('menu-mobile')

SubmitMenu.addEventListener('click',()=>{
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click',()=>{
    menu.classList.remove('abrir-menu')
})

const paisInput = document.getElementById('pais');
const estadoInput = document.getElementById('estado');
const estadosDatalist = document.getElementById('estados');
const cidadeInput = document.getElementById('cidade');
const cidadesDatalist = document.getElementById('cidades');

paisInput.addEventListener('change', (e) => {
    const paisSelecionado = e.target.value;
    const estadosDoPais = getEstadosDoPais(paisSelecionado); 
    estadosDatalist.innerHTML = ''; 
    estadosDoPais.forEach((estado) => {
        const option = document.createElement('option');
        option.value = estado;
        option.text = estado;
        estadosDatalist.appendChild(option);
    });
});

function getEstadosDoPais(pais) {
  const estados = {
    'Brasil': ['Acre (AC)', 'Alagoas (AL)', 'Amapá (AP)', 'Amazonas (AM)', 'Bahia (BA)', 'Ceará (CE)', 'Distrito Federal (DF)', 'Espírito Santo (ES)', 'Goiás (GO)', 'Maranhão (MA)', 'Mato Grosso (MT)', 'Mato Grosso do Sul (MS)', 'Minas Gerais (MG)', 'Pará (PA)', 'Paraíba (PB)', 'Paraná (PR)', 'Pernambuco (PE)', 'Piauí (PI)', 'Rio de Janeiro (RJ)', 'Rio Grande do Norte (RN)', 'Rio Grande do Sul (RS)', 'Rondônia (RO)', 'Roraima (RR)', 'Santa Catarina (SC)', 'São Paulo (SP)', 'Sergipe (SE)', 'Tocantins (TO)']
  };
  return estados[pais];
}

estadoInput.addEventListener('change', (e) => {
    const estadoSelecionado = e.target.value;
    const cidadesDoEstado = getCidadesDoEstado(estadoSelecionado); 
    cidadesDatalist.innerHTML = ''; 
    cidadesDoEstado.forEach((cidade) => {
        const option = document.createElement('option');    
        option.value = cidade;
        option.text = cidade;
        cidadesDatalist.appendChild(option);
    });
});

function getCidadesDoEstado(estado) {
    const cidades = {
        'Pernambuco (PE)': ['Carpina']
    };
    return cidades[estado];
}

const input = document.getElementById('plantas');
const suggestions = document.getElementById('suggestions');

input.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    if (searchTerm.length > 2) {
        fetch(`https://api.example.com/plantas?q=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                const suggestionsList = data.map(plant => {
                    return `<div class="suggestion">${plant.name}</div>`;
                }).join('');
                suggestions.innerHTML = suggestionsList;
                suggestions.style.display = 'block';
            });
    } else {
        suggestions.style.display = 'none';
    }
});

input.addEventListener('focus', () => {
    suggestions.style.display = 'block';
});

input.addEventListener('blur', () => {
    suggestions.style.display = 'none';
});

suggestions.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('suggestion')) {
        input.value = target.textContent;
        suggestions.style.display = 'none';
  }
});