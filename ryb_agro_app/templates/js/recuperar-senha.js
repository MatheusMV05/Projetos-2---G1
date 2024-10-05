// Get the form and error message elements
const form = document.getElementById('forgot-password-form');
const errorMessage = document.getElementById('error-message');
const emailInput = document.getElementById('email');

// Add event listener to the form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get the email input value
    const email = emailInput.value;

    // Validate the email address
    if (!validateEmail(email)) {
        errorMessage.textContent = 'Por favor, insira um endereço de e-mail válido.';
        return;
    }

    // Send a password reset link to the user (TO DO: implement server-side logic)
    console.log('Enviando link de redefinição de senha para', email);

    // Clear the form fields
    form.reset();
});

// Add event listener to the email input field to clear error message on change
emailInput.addEventListener('input', () => {
    errorMessage.textContent = '';
});

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}