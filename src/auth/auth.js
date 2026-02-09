const KEY = "isLoggedIn";

export function isLoggedIn(){
    return localStorage.getItem(KEY) === "true";
}

export function loginFake(){
    localStorage.setItem(KEY, "true");
}

export function logoutFake(){
    localStorage.setItem(KEY, "false");
}