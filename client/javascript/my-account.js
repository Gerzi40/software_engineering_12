window.onload = () => {

    if(localStorage.getItem("user") == null) {
        document.getElementById('background').style.display = 'block'
        document.getElementById('login').style.display = 'flex'
        return
    }

}

document.getElementById("logoutButton").addEventListener('click', () => {
    localStorage.removeItem('user')
    localStorage.removeItem('user-role')
    window.location.href = 'index.html'
})

document.getElementById('switchToRenter').addEventListener('click', () => {
    localStorage.setItem('user-role', 'renter')
    window.location.reload()
})

document.getElementById('switchToOwner').addEventListener('click', () => {
    localStorage.setItem('user-role', 'owner')
    window.location.reload()
})