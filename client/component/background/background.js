document.getElementById("background").addEventListener("click", () => {

    const href = window.location.href
    if(!href.includes('index.html') && !href.includes('court.html') && !href.includes('court-detail.html')){
        window.location.href = 'index.html'
    }

    document.getElementById("background").style.display = 'none'
    document.getElementById("register").style.display = 'none'
    document.getElementById("login").style.display = 'none'

    document.getElementById('registerUsernameInput').value = ''
    document.getElementById('registerPasswordInput').value = ''
    document.getElementById('confirmPasswordInput').value = ''
    document.getElementById('roleDdl').value = ''
    document.getElementById('registerStatusLabel').innerHTML = ''

    document.getElementById('loginUsernameInput').value = ''
    document.getElementById('loginPasswordInput').value = ''
})