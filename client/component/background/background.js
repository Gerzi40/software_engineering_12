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