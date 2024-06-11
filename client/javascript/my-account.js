import { getUserByUserId, updateUser, getScheduleByRenterId, getCourtTypes, insertCourt, getCourtsByOwnerId } from "./module.js"

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

document.getElementById('insertCourtButton').addEventListener('click', async () => {

    const courtTypes = await getCourtTypes()

    document.getElementById('typeInsertDdl').innerHTML = `
        <option value="" hidden></option>
    `

    courtTypes.forEach((courtType, index) => {
        const option = document.createElement('option')
        option.innerHTML = courtType.courtTypeName
        option.value = index + 1
        document.getElementById('typeInsertDdl').appendChild(option)
    });
    changeDisplay(false, false, false, true, false)
})

document.getElementById('updateCourtButton').addEventListener('click', async () => {

    const courts = await getCourtsByOwnerId(localStorage.getItem('user'))
    courts.forEach(court => {

    })
    changeDisplay(false, false, false, false, true)
})

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






















document.getElementById("insertButton").addEventListener("click", async (event) => {

    const name = document.getElementById("nameInsertInput").value
    const address = document.getElementById("addressInsertInput").value
    const type = document.getElementById("typeInsertDdl").value
    const price = document.getElementById("priceInsertInput").value
    // const image = document.getElementById("fileInsertInput").files[0]

    if(name == "") {
        document.getElementById("statusInsertLabel").innerHTML = "Name must be filled"
        return
    } else if(address == "") {
        document.getElementById("statusInsertLabel").innerHTML = "Address must be filled"
        return
    } else if(type == "") {
        document.getElementById("statusInsertLabel").innerHTML = "Type must be filled"
        return
    } else if(price == "") {
        document.getElementById("statusInsertLabel").innerHTML = "Price must be filled"
        return
    } else if(isNaN(parseInt(price))) {
        document.getElementById("statusInsertLabel").innerHTML = "Price must be a number"
        return
    } else if(document.getElementById('fileInsertInput').files[0] == undefined) {
        document.getElementById("statusInsertLabel").innerHTML = "Image must be filled"
        return
    }

    event.preventDefault()


    const file = document.getElementById('fileInsertInput').files[0];      
    const filename = document.getElementById('fileInsertInput').files[0].name;      
    const blob = new Blob([file]);
    const url  = URL.createObjectURL(blob);

    // $(this).attr({ 'download': filename, 'href': url});  
    // filename = "";

    // document.getElementById('insertButton').download = filename
    document.getElementById('insertButton').href = url

    const imageName = './asset/court_image/' + filename

    // const userId = localStorage.getItem("user")

    // const res = await insertCourt(userId, name, address, type, price, imageName)
    // console.log(res)
    // if(res.message == "Insert Court Success") {
    //     window.location.href = "my-court.html"
    // }
})

// function download() {
//     const fileInput = document.getElementById('fileInsertInput');
//     const file = fileInput.files[0];
    
//     const reader = new FileReader();
    
//     reader.onload = function(event) {
//         const fileContents = event.target.result;
//         const blob = new Blob([fileContents], { type: file.type });
//         const url = URL.createObjectURL(blob);

//         const a = document.createElement('a');
//         a.href = url;
//         a.download = file.name;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//     };

//     reader.readAsArrayBuffer(file);
//     return file.name
// }