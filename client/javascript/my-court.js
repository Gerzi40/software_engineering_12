import { deleteCourt, getCourtsByOwnerId, getUserByUserId } from "./module.js"

window.onload = async () => {

    const userId = localStorage.getItem("user")

    if(userId == null) {
        document.getElementById('background').style.display = 'block'
        document.getElementById('login').style.display = 'flex'
        return
    }

    if(localStorage.getItem('user-role') != 'owner') {
        window.location.href = "./index.html"
    }

    const courts = await getCourtsByOwnerId(userId)

    courts.forEach(court => {

        const div = document.createElement('div')
        div.className = 'container_div'

        const img = document.createElement('img')
        img.src = court.courtImage
        const name = document.createElement('p')
        name.innerHTML = `${court.courtName}`
        const rating = document.createElement('p')
        rating.innerHTML = `rating: ${court.courtRating}`

        const button_div = document.createElement('div')
        button_div.className = "button_div"
        const update = document.createElement('button')
        update.innerHTML = 'Update'
        const manual = document.createElement('button')
        manual.innerHTML = 'Schedule Management'
        const button = document.createElement('button')
        button.textContent = 'Delete'
        button_div.appendChild(update)
        button_div.appendChild(manual)
        button_div.appendChild(button)
        update.addEventListener('click', () => {
            window.location.href = `update-court.html?court-id=${court.courtId}`
        })
        manual.addEventListener('click', () =>{
            window.location.href = `schedule-management.html?court-id=${court.courtId}`
        })
        button.addEventListener('click', async () => {
            const res = await deleteCourt(court.courtId)
            if(res.message == 'Delete Court Success'){
                window.location.reload()
            } else  {
                alert("Ada reference di tabel lain")
            }
        })

        div.appendChild(img)
        div.appendChild(name)
        // div.appendChild(rating)
        div.appendChild(button_div)

        document.getElementById("courtListDiv").appendChild(div)
    });

}