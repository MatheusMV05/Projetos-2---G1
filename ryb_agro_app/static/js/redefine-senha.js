// redefine-senha.js

// Get the form and error message elements
const form = document.getElementById('redefine-password-form');
const errorMessage = document.getElementById('error-message');

// Add an event listener to the form submission
form.addEventListener('submit', (e) => {
	e.preventDefault();

	// Get the input values
	const currentPassword = document.getElementById('current-password').value;
	const newPassword = document.getElementById('new-password').value;
	const confirmPassword = document.getElementById('confirm-password').value;

	// Check if the passwords match
	if (newPassword !== confirmPassword) {
		errorMessage.textContent = 'As senhas não coincidem.';
		return;
	}

	// Check if the current password is empty
	if (currentPassword === '') {
		errorMessage.textContent = 'Digite a senha atual.';
		return;
	}

	// Check if the new password is empty
	if (newPassword === '') {
		errorMessage.textContent = 'Digite a nova senha.';
		return;
	}

	// Send a request to the server to redefine the password
	fetch('/redefine-password', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			currentPassword,
			newPassword,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				// Redirect the user to the login page
				window.location.href = '/login';
			} else {
				errorMessage.textContent = data.message;
			}
		})
		.catch((error) => {
			console.error(error);
			errorMessage.textContent = 'Erro ao redefinir a senha.';
		});
});
