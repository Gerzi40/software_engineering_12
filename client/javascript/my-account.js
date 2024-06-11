import { getUserByUserId, updateUser, getScheduleByRenterId, getCourtTypes, insertCourt, getCourtsByOwnerId } from "./module.js"

const usernameInput = document.getElementById('usernameInput')
const passwordInput = document.getElementById('passwordInput')

window.onload = async () => {

    const userId = localStorage.getItem("user")

    if(userId == null) {
        document.getElementById('background').style.display = 'block'
        document.getElementById('login').style.display = 'flex'
        return
    }

    const user = await getUserByUserId(userId)

    usernameInput.value = user[0].userName
    passwordInput.value = user[0].userPassword

}

document.getElementById('updateButton').addEventListener('click', async () => {

    const id = localStorage.getItem('user')
    const username = usernameInput.value
    const password = passwordInput.value

    const statusLabel = document.getElementById("updateStatusLabel")
    if (username.length < 5) {
        statusLabel.innerHTML = "Name must be atleast 5 character"
    } else if (validatePassword(password)) {
        statusLabel.innerHTML = "Password must be atleast 8 character, 1 symbol, 1 number, and 1 upper case"
    } else {
        const res = await updateUser(id, username, password)
        console.log(res)
        if(res.message == "Username already taken") {
            statusLabel.innerHTML = "Uda ada username yang sama"
        }
        if (res.message == "Update Success") {
            window.location.reload()
        }
    }

})

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

document.getElementById("logoutButton").addEventListener('click', () => {
    localStorage.removeItem('user')
    localStorage.removeItem('user-role')
    window.location.href = 'index.html'
})