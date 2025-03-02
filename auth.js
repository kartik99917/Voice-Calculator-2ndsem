
function checkAuth() {
    const sessionUser = sessionStorage.getItem('sessionUser');
    return !!sessionUser; 
}


function login(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || {};

   
    if (users[username] && users[username].password === password) {
        sessionStorage.setItem('sessionUser', username); 
        return true; 
    }
    return false; 
}

function register(username, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const existingUsers = Object.values(users);
    const usernameExists = users[username] !== undefined;
    const emailExists = Object.values(users).some(user => user.email === email);

    if (usernameExists || emailExists) {
        return false; 
    }

    users[username] = { email: email, password: password };
    localStorage.setItem('users', JSON.stringify(users)); 
    return true; 
}

function logout() {
    sessionStorage.removeItem('sessionUser'); 
    window.location.href = 'index.html';  
}

if (window.location.pathname.endsWith('home.html')) {
    if (!checkAuth()) {
        window.location.href = 'index.html';  
    }
}
