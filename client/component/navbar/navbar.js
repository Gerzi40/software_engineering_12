import { getUserByUserId } from "../../javascript/module.js"

document.getElementById("nav").innerHTML = `
<<<<<<< HEAD
    <div id="navLogo">
        <a href="index.html">BOOKSPORT</a>
    </div>
    <div id="guestLink">
        <a href="court.html">Court</a>
        <a href="about.html">About</a>
    </div>
    <div id="renterLink">
        <a href="court.html">Court</a>
        <a href="booking.html">Booking</a>
        <a href="about.html">About</a>
    </div>
    <div id="ownerLink">
        <a href="my-court.html">My Court</a>
        <a href="manual-booking.html">Manual Booking</a>
        <a href="about.html">About</a>
    </div>

    <div>
        <a id="loginButton">Sign In</a>
        <a id="registerButton">Sign Up</a>
        <label id="greetLabel" style="display: none"></label>
        <button id="logoutButton" style="display: none">Logout</button>
    </div>
`

if(localStorage.getItem("user") != null) {

    document.getElementById("registerButton").style.display = "none"
    document.getElementById("loginButton").style.display = "none"

=======
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
>>>>>>> b027b4ae07363fd1ac42edae1362d9851671992c
    document.getElementById("greetLabel").style.display = "inline"
    document.getElementById("logoutButton").style.display = "inline"

    const userId = localStorage.getItem("user")
    const user = await getUserByUserId(userId)
    
    document.getElementById("greetLabel").innerHTML = "Hi " + user[0].userName

}

<<<<<<< HEAD
document.getElementById("registerButton").addEventListener("click", () => {
    document.getElementById('background').style.display = 'block'
    document.getElementById('register').style.display = 'flex'
})

document.getElementById("loginButton").addEventListener("click", () => {
    document.getElementById('background').style.display = 'block'
    document.getElementById('login').style.display = 'flex'
})

document.getElementById("background").addEventListener("click", () => {
    document.getElementById("background").style.display = 'none'
    document.getElementById("register").style.display = 'none'
    document.getElementById("login").style.display = 'none'

    document.getElementById('registerUsernameInput').value = ''
    document.getElementById('registerPasswordInput').value = ''
    document.getElementById('confirmPasswordInput').value = ''
    document.getElementById('registerStatusLabel').innerHTML = ''

    document.getElementById('loginUsernameInput').value = ''
    document.getElementById('loginPasswordInput').value = ''
})

=======
>>>>>>> b027b4ae07363fd1ac42edae1362d9851671992c
document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("user")
    window.location.reload()
})
<<<<<<< HEAD

window.onscroll = () => {
    const nav = document.getElementById('nav');
    if ( window.pageYOffset > 0 ) {
        nav.classList.add("backgroundWhite");
    } else {
        nav.classList.remove("backgroundWhite");
    }
}
=======
>>>>>>> b027b4ae07363fd1ac42edae1362d9851671992c