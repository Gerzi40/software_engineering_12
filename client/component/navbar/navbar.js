import { getUserByUserId } from "../../javascript/module.js"

document.getElementById("nav").innerHTML = `
    <a href="index.html">home</a>
    <a href="court.html">court</a>
    <a href="my-court.html">my court</a>
    <a href="insert-court.html">insert court</a>
    <a href="booking.html">booking</a>
    <a href="about.html">about</a>
    <a href="register.html">register</a>
    <a href="login.html">login</a>
    <label id="greetLabel" style="display: none"></label>
    <button id="logoutButton" style="display: none">Logout</button>
`

if(localStorage.getItem("user") != null) {
    document.getElementById("greetLabel").style.display = "inline"
    document.getElementById("logoutButton").style.display = "inline"

    const userId = localStorage.getItem("user")
    const user = await getUserByUserId(userId)
    
    document.getElementById("greetLabel").innerHTML = "Hi " + user[0].userName

}

document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("user")
    window.location.reload()
})
