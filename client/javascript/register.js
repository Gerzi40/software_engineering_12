import { insertUser } from "./module.js"

window.onload = () => {

    if (localStorage.getItem("user") != null) {
        window.location.href = "./index.html"
    }

}

function validatePassword(password) {
    const minLength = /.{8,}/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;
    const hasWord = /[a-zA-Z]+/;
    const hasUpperCase = /[A-Z]/;
    const hasNumber = /[0-9]/;

    if (minLength.test(password) && 
        hasSymbol.test(password) && 
        hasWord.test(password) && 
        hasUpperCase.test(password) && 
        hasNumber.test(password)) {
        return false
    }

    return true
}



document.getElementById("registerButton").addEventListener("click", async () => {

    const name = document.getElementById("usernameInput").value
    const password = document.getElementById("passwordInput").value
    const confirmPassword = document.getElementById("confirmPasswordInput").value
    const role = document.getElementById("roleDdl").value
    const agree = document.getElementById("agreeCheckBox").checked

    const statusLabel = document.getElementById("statusLabel")
    if (name.length < 5) {
        statusLabel.innerHTML = "Name must be atleast 5 character"
    } else if (validatePassword(password)) {
        statusLabel.innerHTML = "Password must be atleast 8 character, 1 symbol, 1 number, and 1 upper case"
    } else if (password != confirmPassword) {
        statusLabel.innerHTML = "Password and Confirm Password must match"
    } else if (role == "") {
        statusLabel.innerHTML = "Please choose a role"
    } else if (agree == false) {
        statusLabel.innerHTML = "Checkbox must be checked"
    } else {
        const res = await insertUser(name, password, role)
        console.log(res)
        if(res.message == "Username already taken") {
            statusLabel.innerHTML = "Uda ada username yang sama"
        }
        if (res.message == "Register Success") {
            window.location.href = "login.html"
        }
    }

})