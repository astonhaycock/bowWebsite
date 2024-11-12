const apiUrl = window.location.protocol === 'file:' ? 'http://localhost:8080' : '';
//  Local API server during development || Production API



async function fetchBows() {
    try {
        const response = await fetch(`${apiUrl}/bows`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        displayBows(data);
    } catch (error) {
        console.error('Error fetching bows:', error);
    }
}

function createBowDiv(bow, admin) {
    const bowDiv = document.createElement('div');
    bowDiv.classList.add('bow-item');
    bowDiv.innerHTML = `
        <h3>${bow.bow_name}</h3>
        <img src="${bow.bow_image_url}" alt="${bow.bow_name}">
        <div class="description">
            <p>Type: ${bow.bow_type}</p>
            <p>Price: $${bow.bow_price}</p>
            <p>Draw Length: ${bow.bow_draw_length} inches</p>
            <p>Draw Weight: ${bow.bow_draw_weight} lbs</p>
            <p>Length: ${bow.bow_length} inches</p>
            <p>Weight: ${bow.bow_weight} lbs</p>
            ${admin ? `
        </div>
        <div class="admin">
            <button class="edit">EDIT</button>
            <button class="delete">DELETE</button>
        </div>` : `
            <div class="shopper">
                <button class="addCart">Add To Cart</button>
            </div>
            `}
    `;
    if (admin) {
        addEditEventListener(bowDiv, bow);
    }
    return bowDiv;
}

function addEditEventListener(bowDiv, bow) {
    bowDiv.querySelector('.edit').addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
            <div class="modal-header">
                <h4>Your Cart</h4>
                <span class="close">&times;</span>
            </div>
                <div class="modal-inputs">
                    <label for="bow_name">Name:</label>
                    <input type="text" id="bow_name" value="${bow.bow_name}">
                </div>
                <div class="modal-inputs">
                    <label for="bow_type">Type:</label>
                    <input type="text" id="bow_type" value="${bow.bow_type}">
                </div>
                <div class="modal-inputs">
                    <label for="bow_weight">Weight:</label>
                    <input type="text" id="bow_weight" value="${bow.bow_weight}">
                </div>
                <div class="modal-inputs">
                    <label for="bow_length">Length:</label>
                    <input type="text" id="bow_length" value="${bow.bow_length}">
                </div>
                <div class="modal-inputs">
                    <label for="bow_draw_length">Draw Length:</label>
                    <input type="text" id="bow_draw_length" value="${bow.bow_draw_length}">
                </div>
                <div class="modal-inputs">
                    <label for="bow_draw_weight">Draw Weight:</label>
                    <input type="text" id="bow_draw_weight" value="${bow.bow_draw_weight}">
                </div>
                <div class="modal-inputs">
                    <label for="bow_price">Price:</label>
                    <input type="text" id="bow_price" value="${bow.bow_price}">
                </div>
                <div class="modal-inputs">
                    <label for="bow_image_url">Image URL:</label>
                    <input type="text" id="bow_image_url" value="${bow.bow_image_url}">
                </div>
                <button id="save">Save</button>
            </div>
        `;
        document.body.appendChild(modal);

        const closeModal = () => {
            modal.remove();
        };

        modal.querySelector('.close').addEventListener('click', closeModal);

        modal.querySelector('#save').addEventListener('click', async () => {
            const updatedBow = {
                bow_id: bow.bow_id,
                bow_name: modal.querySelector('#bow_name').value,
                bow_type: modal.querySelector('#bow_type').value,
                bow_weight: modal.querySelector('#bow_weight').value,
                bow_length: modal.querySelector('#bow_length').value,
                bow_draw_length: modal.querySelector('#bow_draw_length').value,
                bow_draw_weight: modal.querySelector('#bow_draw_weight').value,
                bow_price: modal.querySelector('#bow_price').value,
                bow_image_url: modal.querySelector('#bow_image_url').value
            };

            try {
                const response = await fetch(`${apiUrl}/bows/${bow.bow_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedBow)
                });
                const result = await response.json();
                if (result.message) {
                    alert(result.message);
                    bowDiv.replaceWith(createBowDiv(updatedBow, true));
                    closeModal();
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Error updating bow:', error);
            }
        });
    });

    bowDiv.querySelector('.delete').addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete this bow?')) {
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/bows/${bow.bow_id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.message) {
                alert(result.message);
                bowDiv.remove();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error deleting bow:', error);
        }
    });
}

document.getElementById('cart').addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h4>Your Cart</h4>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <ul id="cart-items"></ul>
            </div>
            <div class="modal-footer">
                <button id="checkout">Checkout</button>
                <button id="clearCart">Clear Cart</button>
            </div>
        </div>
    `;

    modal.querySelector('#clearCart').addEventListener('click', () => {
        localStorage.removeItem('cart');
        modal.querySelector('#cart-items').innerHTML = '';
        alert('Cart cleared');
    });
    document.body.appendChild(modal);

    const closeModal = () => {
        modal.remove();
    };

    modal.querySelector('.close').addEventListener('click', closeModal);

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsList = modal.querySelector('#cart-items');
    cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.bow_name} - $${item.bow_price}`;
        cartItemsList.appendChild(listItem);
    });

    modal.querySelector('#checkout').addEventListener('click', () => {
        alert('Working on this feature to connect to a payment');
        closeModal();
    });
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('addCart')) {
        const bowDiv = event.target.closest('.bow-item');
        const bow = {
            bow_name: bowDiv.querySelector('h3').textContent,
            bow_price: bowDiv.querySelector('.description p:nth-child(2)').textContent.split('$')[1]
        };
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.push(bow);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        alert(`${bow.bow_name} added to cart`);
    }
});

async function checkLogin() {
    const password = localStorage.getItem('password');
    const user = localStorage.getItem('user');
    let admin = false;
    if (password) {
        try {
            const response = await fetch(`${apiUrl}/admins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user, password })
            });
            admin = response.status === 200;
        } catch (error) {
            console.error('Error checking login:', error);
        }
    }
    return admin;
}

document.getElementById('add-bow').addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h4>Add New Bow</h4>
                <span class="close">&times;</span>
            </div>
            <div class="modal-inputs">
                <label for="new_bow_name">Name:</label>
                <input type="text" id="new_bow_name">
            </div>
            <div class="modal-inputs">
                <label for="new_bow_type">Type:</label>
                <input type="text" id="new_bow_type">
            </div>
            <div class="modal-inputs">
                <label for="new_bow_weight">Weight:</label>
                <input type="text" id="new_bow_weight">
            </div>
            <div class="modal-inputs">
                <label for="new_bow_length">Length:</label>
                <input type="text" id="new_bow_length">
            </div>
            <div class="modal-inputs">
                <label for="new_bow_draw_length">Draw Length:</label>
                <input type="text" id="new_bow_draw_length">
            </div>
            <div class="modal-inputs">
                <label for="new_bow_draw_weight">Draw Weight:</label>
                <input type="text" id="new_bow_draw_weight">
            </div>
            <div class="modal-inputs">
                <label for="new_bow_price">Price:</label>
                <input type="text" id="new_bow_price">
            </div>
            <div class="modal-inputs">
                <label for="new_bow_image_url">Image URL:</label>
                <input type="text" id="new_bow_image_url">
            </div>
            <button id="saveNewBow">Save</button>
        </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => {
        modal.remove();
    };

    modal.querySelector('.close').addEventListener('click', closeModal);

    modal.querySelector('#saveNewBow').addEventListener('click', async () => {
        const newBow = {
            bow_name: modal.querySelector('#new_bow_name').value,
            bow_type: modal.querySelector('#new_bow_type').value,
            bow_weight: modal.querySelector('#new_bow_weight').value,
            bow_length: modal.querySelector('#new_bow_length').value,
            bow_draw_length: modal.querySelector('#new_bow_draw_length').value,
            bow_draw_weight: modal.querySelector('#new_bow_draw_weight').value,
            bow_price: modal.querySelector('#new_bow_price').value,
            bow_image_url: modal.querySelector('#new_bow_image_url').value
        };

        try {
            const response = await fetch(`${apiUrl}/bows`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBow)
            });
            const result = await response.json();
            if (result.message) {
                alert(result.message);
                closeModal();
                document.getElementById('items').innerHTML = '';
                fetchBows();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error adding new bow:', error);
        }
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    const admin = await checkLogin();
    if (!admin) {
        document.getElementById('add-bow').style.display = 'none';
    }
});


async function displayBows(data) {
    const itemsDiv = document.getElementById('items');
    let admin = await checkLogin();
    data.forEach(bow => {
        const bowDiv = createBowDiv(bow, admin);
        itemsDiv.appendChild(bowDiv);
    });
}

fetchBows();

