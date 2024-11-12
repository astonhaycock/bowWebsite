const apiUrl = window.location.protocol === 'file:' ? 'http://localhost:8080' : '';
//  Local API server during development || Production API



function storePassword(password, user) {
    localStorage.setItem("password", password);
    localStorage.setItem("user", user);
}
document.querySelector("form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    if(await checkLogin(username, password)) {
        storePassword(password, username);
        alert("Login successful");
        username.value = "";
        password.value = "";
    }
    else {
        alert("Invalid login");
        username.value = "";
        password.value = "";
        storePassword("", "");
    }
});


async function checkLogin(user, password) {

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