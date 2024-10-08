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
    'Brasil': ['Acre (AC)', 'Alagoas (AL)', 'Amapá (AP)', 'Amazonas (AM)', 'Bahia (BA)', 'Ceará (CE)', 'Distrito Federal (DF)', 'Espírito Santo (ES)', 'Goiás (GO)', 'Maranhão (MA)', 'Mato Grosso (MT)', 'Mato Grosso do Sul (MS)', 'Minas Gerais (MG)', 'Pará (PA)', 'Paraíba (PB)', 'Paraná (PR)', 'Pernambuco (PE)', 'Piauí (PI)', 'Rio de Janeiro (RJ)', 'Rio Grande do Norte (RN)', 'Rio Grande do Sul (RS)', 'Rondônia (RO)', 'Roraima (RR)', 'Santa Catarina (SC)', 'São Paulo (SP)', 'Sergipe (SE)', 'Tocantins (TO)'],
  };
  return estados[pais];
}

function getCidadesDoEstado(estado) {
    const cidades = {
      'Pernambuco (PE)': ['Carpina'],
    };
    return cidades[estado];
  }