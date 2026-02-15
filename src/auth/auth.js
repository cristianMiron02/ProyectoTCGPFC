const KEY_LOGGED = "isLoggedIn";
const KEY_USERS = "users";
const KEY_CURRENT = "currentUser";

function loadUsers() {
    try {
        const raw = localStorage.getItem(KEY_USERS);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
        localStorage.setItem(KEY_USERS, JSON.stringify(users));
}

export function isLoggedIn() {
    return localStorage.getItem(KEY_LOGGED) === "true";
}

export function getCurrentUser() {
    try {
        const raw = localStorage.getItem(KEY_CURRENT);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function logout() {
    localStorage.setItem(KEY_LOGGED, "false");
    localStorage.removeItem(KEY_CURRENT);
}

export function registerUser(user) {
    const users = loadUsers();
    const emailLower = user.email.trim().toLowerCase();

    const exists = users.some((u) => u.email.toLowerCase() === emailLower);
    if (exists) throw new Error("Ya existe una cuenta con ese email.");

    const newUser = { ...user, email: emailLower, createdAt: new Date().toISOString() };
    users.push(newUser);
    saveUsers(users);

    localStorage.setItem(KEY_LOGGED, "true");
    localStorage.setItem(KEY_CURRENT, JSON.stringify(newUser));

    return newUser;
}

export function login(email, password) {
    const users = loadUsers();
    const emailLower = email.trim().toLowerCase();

    const found = users.find((u) => u.email.toLowerCase() === emailLower);
    if (!found) throw new Error("No existe una cuenta con ese email.");
    if (found.password !== password) throw new Error("Contraseña incorrecta.");

    localStorage.setItem(KEY_LOGGED, "true");
    localStorage.setItem(KEY_CURRENT, JSON.stringify(found));

    return found;
}
