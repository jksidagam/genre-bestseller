// functions.js

// Function to convert isbn 13 code to isbn 10
export const isbn13to10 = (isbn13) => {
	// Remove any hyphens
	isbn13 = isbn13.replace(/-/g, "");

	// Check if the input is a valid ISBN-13 starting with 978
	if (isbn13.length !== 13 || isbn13.substring(0, 3) !== "978") {
		return false; // Invalid ISBN-13 or not a 978-prefixed ISBN
	}

	// Extract the middle 9 digits
	let isbn10 = isbn13.substring(3, 12);

	// Calculate checksum for ISBN-10
	let sum = 0;
	for (let i = 0; i < 9; i++) {
		sum += (10 - i) * parseInt(isbn10[i]);
	}

	// Compute the checksum
	let checksum = 11 - (sum % 11);
	if (checksum === 10) {
		checksum = "X"; // Special case where checksum is 10
	} else if (checksum === 11) {
		checksum = "0";
	}

	// Return the ISBN-10
	return isbn10 + checksum;
};
