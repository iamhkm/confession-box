export function validateEmail(email:string){
    return /^\S+@\S+\.\S+$/.test(email);
}

export function validatePassword(password:string){
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password);
}