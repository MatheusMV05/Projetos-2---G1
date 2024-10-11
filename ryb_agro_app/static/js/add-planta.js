let SubmitMenu = document.getElementById('menu-abrir')
let menu = document.getElementById('menu-mobile')

SubmitMenu.addEventListener('click', () => {
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click', () => {
    menu.classList.remove('abrir-menu')
})

// Get the search input field and the results list
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// Create an array of data to search through (e.g., an array of objects)
const searchData = [
    { id: 1, name: 'Abóbora' },
    { id: 2, name: 'Feijão de corda' },
    { id: 3, name: 'Inhame' },
    { id: 4, name: 'Jaca' },
    { id: 5, name: 'Milho' },
    // Add more data here...
];

// Add an event listener to the search input field
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    console.log('Search term:', searchTerm);
    const filteredData = searchData.filter((item) => {
        return item.name.toLowerCase().includes(searchTerm);
    });

    console.log('Filtered Data:', filteredData);  // <-- Add this line

    // Clear the results list and add the filtered data
    searchResults.innerHTML = '';
    filteredData.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = item.name;
        searchResults.appendChild(listItem);
    });
});

// Hide search results when clicking outside the search bar or results
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';  // Hide the results
    }
});

// Optional: Hide the results when the input loses focus
searchInput.addEventListener('blur', () => {
    // Delay to allow clicking on search results before hiding
    setTimeout(() => {
        searchResults.style.display = 'none';
    }, 100);
});

// Keep search results visible when interacting with them
searchResults.addEventListener('mousedown', (e) => {
    e.preventDefault();  // Prevent the input from losing focus
});