import { getUserByUserId, updateUser, getScheduleByRenterId } from "./module.js"

const usernameInput = document.getElementById('usernameInput')
const passwordInput = document.getElementById('passwordInput')

const profileDiv = document.getElementById('profileDiv')
const bookingSummaryDiv = document.getElementById('bookingSummaryDiv')
const bookingHistoryDiv = document.getElementById('bookingHistoryDiv')
const insertCourtDiv = document.getElementById('insertCourtDiv')
const updateCourtDiv = document.getElementById('updateCourtDiv')

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

const changeDisplay = (profile, bookingSummary, bookingHistory, insertCourt, updateCourt) => {
    profileDiv.style.display = profile ? 'block' : 'none'
    bookingSummaryDiv.style.display = bookingSummary ? 'block' : 'none'
    bookingHistoryDiv.style.display = bookingHistory ? 'block' : 'none'
    insertCourtDiv.style.display = insertCourt ? 'block' : 'none'
    updateCourtDiv.style.display = updateCourt ? 'block' : 'none'

    document.getElementById('profileButton').className = profile ? 'blue-text' : ''
    document.getElementById('bookingSummaryButton').className = bookingSummary ? 'blue-text' : ''
    document.getElementById('bookingHistoryButton').className = bookingHistory ? 'blue-text' : ''
    document.getElementById('insertCourtButton').className = insertCourt ? 'blue-text' : ''
    document.getElementById('updateCourtButton').className = updateCourt ? 'blue-text' : ''
}

document.getElementById('profileButton').addEventListener('click', () => changeDisplay(true, false, false, false, false))

document.getElementById('bookingSummaryButton').addEventListener('click', async () => {

    const schedules = await getScheduleByRenterId(localStorage.getItem('user'))
    schedules.forEach(schedule => {
        const dbStartDate = new Date(`${schedule.scheduleDate}T${schedule.startTime}`)
        const dbEndDate = new Date(`${schedule.scheduleDate}T${schedule.endTime}`)
        const options = { day: 'numeric', month: 'long', year: 'numeric' }
        const formattedDate = dbStartDate.toLocaleDateString('en-GB', options)

        const currentDate = new Date()

        const tr = document.createElement('tr')

        const name = document.createElement('td')
        const type = document.createElement('td')
        const date = document.createElement('td')
        const duration = document.createElement('td')
        const price = document.createElement('td')
        const status = document.createElement('td')
        const action = document.createElement('td')

        name.innerHTML = schedule.courtName
        type.innerHTML = schedule.courtTypeName
        date.innerHTML = formattedDate
        duration.innerHTML = `${schedule.startTime.slice(0, 5)}-${schedule.endTime.slice(0, 5)}`
        price.innerHTML = Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR"
        }).format(schedule.courtPrice)

        tr.appendChild(name)
        tr.appendChild(type)
        tr.appendChild(date)
        tr.appendChild(duration)
        tr.appendChild(price)
        tr.appendChild(status)
        tr.appendChild(action)

        document.getElementById('bookingSummaryTable').appendChild(tr)

        // document.getElementById("bookingSummaryTable").innerHTML += `
        //     <div>
        //         <p>${schedule.courtName}</p>
        //         <p>${formattedDate}</p>
        //         <p>${schedule.startTime.slice(0, 5)}-${schedule.endTime.slice(0, 5)}</p>
        //         <p>${schedule.courtAddress}</p>
        //         ${currentDate < dbStartDate ? '<p>status: upcoming</p>' : '' }
        //         ${currentDate > dbEndDate ? '<p>status: done</p>' : '' }
        //         ${currentDate > dbStartDate && currentDate < dbEndDate ? '<p>status: ongoing</p>' : '' }
        //     </div>
        // `
    });
    changeDisplay(false, true, false, false, false)
})

document.getElementById('bookingHistoryButton').addEventListener('click', async () => {
    const schedules = await getScheduleByRenterId(userId)

    schedules.forEach(schedule => {
        const dbStartDate = new Date(`${schedule.scheduleDate}T${schedule.startTime}`)
        const dbEndDate = new Date(`${schedule.scheduleDate}T${schedule.endTime}`)
        const options = { day: 'numeric', month: 'long', year: 'numeric' }
        const formattedDate = dbStartDate.toLocaleDateString('en-GB', options)

        const currentDate = new Date()

        document.getElementById("bookingListDiv").innerHTML += `
            <br/>
            <div>
                <p>${schedule.courtName}</p>
                <p>${formattedDate}</p>
                <p>${schedule.startTime.slice(0, 5)}-${schedule.endTime.slice(0, 5)}</p>
                <p>${schedule.courtAddress}</p>
                ${currentDate < dbStartDate ? '<p>status: upcoming</p>' : '' }
                ${currentDate > dbEndDate ? '<p>status: done</p>' : '' }
                ${currentDate > dbStartDate && currentDate < dbEndDate ? '<p>status: ongoing</p>' : '' }
            </div>
        `
    });
    changeDisplay(false, false, true, false, false)
})

document.getElementById('insertCourtButton').addEventListener('click', () => changeDisplay(false, false, false, true, false))

document.getElementById('updateCourtButton').addEventListener('click', () => changeDisplay(false, false, false, false, true))

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

document.getElementById('switchToRenter').addEventListener('click', () => {
    localStorage.setItem('user-role', 'renter')
    window.location.reload()
})

document.getElementById('switchToOwner').addEventListener('click', () => {
    localStorage.setItem('user-role', 'owner')
    window.location.reload()
})