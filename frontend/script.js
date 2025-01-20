// Function to fetch with token\
function fetchWithToken(url, options = {}) {
    const token = localStorage.getItem('authToken'); //TO get token from localstorage
    if (!token) { //checks for token
        window.location.href = 'login.html';//Redirects to login if there's no token
        return;
    }

    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the token to the Authorization header
            ...options.headers
        }
    }).then(response => response.json()); // Return the response as JSON
}

// Function to handle user login
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message);
        }
    })
    .catch(console.error);
});

// Function to handle user registration
document.getElementById('registerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            window.location.href = 'login.html';
        } else {
            alert(data.error);
        }
    })
    .catch(console.error);
});

// Function to handle adding a new food item (for add-food.html)
document.getElementById('add-food-form')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const quantity = document.getElementById('quantity').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const storageLocation = document.getElementById('storageLocation').value;

    fetchWithToken('http://localhost:3000/api/food/add', {
        method: 'POST',
        body: JSON.stringify({ name, quantity, expiryDate, storageLocation })
    })
    .then(data => {
        if (data.message) {
            alert(data.message);
            window.location.href = 'dashboard.html';
        } else {
            alert('Error: ' + (data.error || 'Something went wrong'));
        }
    })
    .catch(console.error);
});

// Function to fetch and display food items in the table (for dashboard.html)
function fetchFoodItemsForTable() {
    fetchWithToken('http://localhost:3000/api/food/all')
        .then(data => {
            const tableBody = document.getElementById('foodItemsTableBody');
            if (!tableBody) return;

            tableBody.innerHTML = ''; // Clear the table

            if (data && data.length > 0) {
                data.forEach(foodItem => {
                    const formattedDate = new Date(foodItem.expiryDate).toISOString().split('T')[0];

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${foodItem.name}</td>
                        <td>${foodItem.quantity}</td>
                        <td>${formattedDate}</td>
                        <td>${foodItem.storageLocation}</td>
                        <td><button class="delete-btn" data-id="${foodItem._id}">Delete</button></td>
                    `;
                    tableBody.appendChild(row);
                });

                // Add event listeners to delete buttons
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', deleteFoodItem);
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="5">No food items found.</td></tr>';
            }
        })
        .catch(console.error);
}

// Function to delete a food item (for dashboard.html)
function deleteFoodItem(event) {
    const foodItemId = event.target.getAttribute('data-id');

    fetchWithToken(`http://localhost:3000/api/food/${foodItemId}`, {
        method: 'DELETE'
    })
    .then(data => {
        if (data.message === 'Food item deleted successfully!') {
            alert('Food item deleted successfully!');
            fetchFoodItemsForTable(); // Re-fetch and update the list
        } else {
            alert(`Error: ${data.error || data.message}`);
        }
    })
    .catch(console.error);
}

// Function to fetch and populate the dropdown with food items
function fetchFoodItemsForDropdown() {
    fetchWithToken('http://localhost:3000/api/food/all')
        .then(data => {
            const foodSelect = document.getElementById('foodSelect');
            foodSelect.innerHTML = '<option value="">Select a Food Item</option>';
            data.forEach(foodItem => {
                const option = document.createElement('option');
                option.value = foodItem._id;
                option.textContent = foodItem.name;
                foodSelect.appendChild(option);
            });
        })
        .catch(console.error);
}

// Function to pre-fill the form when a food item is selected
document.getElementById('foodSelect')?.addEventListener('change', function(event) {
    const foodId = event.target.value;

    if (foodId) {
        fetchWithToken(`http://localhost:3000/api/food/${foodId}`)
            .then(data => {
                if (data.name) {
                    document.getElementById('foodDetails').style.display = 'block';
                    document.getElementById('name').value = data.name;
                    document.getElementById('quantity').value = data.quantity;
                    document.getElementById('expiryDate').value = new Date(data.expiryDate).toISOString().split('T')[0];
                    document.getElementById('storageLocation').value = data.storageLocation;
                    document.getElementById('foodSelect').setAttribute('data-id', data._id);
                } else {
                    alert('Food item not found!');
                }
            })
            .catch(console.error);
    } else {
        document.getElementById('foodDetails').style.display = 'none';
    }
});

// Function to handle updating the food item
document.getElementById('update-food-form')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const foodId = document.getElementById('foodSelect').getAttribute('data-id');
    const name = document.getElementById('name').value;
    const quantity = document.getElementById('quantity').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const storageLocation = document.getElementById('storageLocation').value;

    fetchWithToken(`http://localhost:3000/api/food/${foodId}`, {
        method: 'PUT',
        body: JSON.stringify({ name, quantity, expiryDate, storageLocation })
    })
    .then(data => {
        if (data.message) {
            alert(data.message);
            window.location.href = 'dashboard.html';
        } else {
            alert(data.error || 'Error updating food item!');
        }
    })
    .catch(console.error);
});

// Function to handle scheduling a donation
document.getElementById('donation-form')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const foodItems = Array.from(document.getElementById('foodSelect').selectedOptions)
                            .map(option => option.value);
    const donationDate = document.getElementById('donationDate').value;

    if (foodItems.length === 0 || !donationDate) {
        alert('Please select food items and set a donation date.');
        return;
    }

    fetchWithToken('http://localhost:3000/api/donation/schedule-donation', {
        method: 'POST',
        body: JSON.stringify({ foodItems, donationDate })
    })
    .then(data => {
        if (data.message) {
            alert(data.message);
            window.location.href = 'dashboard.html'; // Redirect after scheduling donation
        } else {
            alert(data.error || 'Error scheduling donation!');
        }
    })
    .catch(console.error);
});

// Function to fetch and display food items for tracking (for food-tracking.html)
function fetchFoodTrackingData() {
    fetchWithToken('http://localhost:3000/api/food/all')
        .then(data => {
            const foodAddedTable = document.getElementById('food-items-added');
            const foodScheduledTable = document.getElementById('food-items-scheduled');
            const expiredItemsTable = document.getElementById('expired-items-list');

            // Clear the tables first
            foodAddedTable.innerHTML = '';
            foodScheduledTable.innerHTML = '';
            expiredItemsTable.innerHTML = '';

            if (data && data.length > 0) {
                // Grouping food items based on their status
                data.forEach(foodItem => {
                    const formattedDate = new Date(foodItem.expiryDate).toISOString().split('T')[0];
                    const currentDate = new Date();
                    const isExpired = new Date(foodItem.expiryDate) < currentDate; // Checks expiry

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${foodItem.name}</td>
                        <td>${foodItem.quantity}</td>
                        <td>${formattedDate}</td>
                        <td>${foodItem.storageLocation}</td>
                    `;

                    // Categorizing based on expiry status
                    if (isExpired) {
                        expiredItemsTable.appendChild(row);
                    } else if (foodItem.scheduledForDonation) {
                        foodScheduledTable.appendChild(row);
                    } else {
                        foodAddedTable.appendChild(row);
                    }
                });
            } else {
                foodAddedTable.innerHTML = '<tr><td colspan="4">No food items found.</td></tr>';
                foodScheduledTable.innerHTML = '<tr><td colspan="4">No scheduled donations found.</td></tr>';
                expiredItemsTable.innerHTML = '<tr><td colspan="2">No expired food items.</td></tr>';
            }
        })
        .catch(console.error);
}

// Call all fetch functions on page load
window.onload = function() {
    fetchFoodItemsForTable();
    fetchFoodItemsForDropdown();
    fetchFoodTrackingData();
};