import { getCourtByCourtId, getScheduleByCourtIdAndDate, getScheduleTypes, insertSchedule } from "./module.js"

const dateInput = document.getElementById("dateInput")
const scheduleDiv = document.getElementById('scheduleDiv')
const paragraf = document.getElementById('paragraf')
const hiddenInput = document.getElementById('hiddenInput')
const infoAndBook = document.getElementById('infoAndBook')

const getParam = (parameterName) => {
    const url = window.location.href;
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);
    return params.get(parameterName);
}

const dateDiv = document.getElementById('dateDiv')

const fillDateDiv = () => {

    
    for(let i=0; i<6; i++) {
        let currentDate = new Date()
        // console.log(currentDate)
        currentDate.setDate(currentDate.getDate() + i)

        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

        const formattedCurrentDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate()}`

        let dayOfWeek = currentDate.toLocaleString('default', { weekday: 'long' }); // Short day name (e.g., "Tue")
        let month = currentDate.toLocaleString('default', { month: 'short' }); // Short month name (e.g., "Jun")
        let date = currentDate.getDate().toString().padStart(2, '0'); // Day of the month
        let year = currentDate.getFullYear(); // Full year

        // console.log(dayOfWeek)
        // console.log(date)

        // console.log(dateFromCurrentDate)

        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.id = 'radio' + i + 1
        radio.value = formattedCurrentDate
        radio.name = 'date'
        radio.checked = i == 0
        radio.addEventListener('change', (event) => {

            const dateee = event.target.value
            fillScheduleDiv(dateee)

        })

        const label = document.createElement('label')
        label.innerHTML = `
            ${date} ${month}
            <br/>
            <b>${dayOfWeek}</b>
        `
        label.htmlFor = 'radio' + i + 1

        dateDiv.appendChild(radio)
        dateDiv.appendChild(label)

    }

}

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

    const courtId = getParam('court-id');

    if(courtId == "" || courtId == undefined) {
        window.location.href = "./my-court.html"
    }

    const court = await getCourtByCourtId(courtId)

    if(court[0].ownerId != userId) {
        window.location.href = "./my-court.html"
        return
    }

    document.getElementById("courtDetailDiv").innerHTML = `
        <div>court id: ${court[0].courtId}</div>
        <div>name: ${court[0].courtName}</div>
        <div>address: ${court[0].courtAddress}</div>
        <div>type: ${court[0].courtTypeName}</div>
        <div>price: ${court[0].courtPrice}</div>
        <div>rating: ${court[0].courtRating}</div>
        <div>rating count: ${court[0].courtRatingCount}</div>
    `

    fillDateDiv()

    // tanggal yang diselect di calender minimal hari ini
    const today = new Date();
    const date = today.toISOString().split('T')[0];
    dateInput.min = date;
    dateInput.value = date;

    fillScheduleDiv(date)
    
}

document.getElementById("dateInput").addEventListener("change", async () => {

    const date = dateInput.value
    fillScheduleDiv(date)

    paragraf.innerHTML = ''
    hiddenInput.value = ''

})

const fillScheduleDiv = async (date) => {

    const courtId = getParam("court-id")

    const scheduleTypes = await getScheduleTypes()
    const schedules = await getScheduleByCourtIdAndDate(courtId, date)
    
    const currentDate = new Date()
    const formattedDate = currentDate.toISOString().split('T')[0];
    const currentTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`
    
    scheduleDiv.innerHTML = ""
    scheduleTypes.forEach((scheduleType, index) => {

        const button = document.createElement('button')
        button.innerHTML = `${scheduleType.startTime.slice(0, 5)} - ${scheduleType.endTime.slice(0, 5)}`

        const filteredSchedule = schedules.find(schedule => schedule.scheduleTypeId == scheduleType.scheduleTypeId)

        if(filteredSchedule) {
            button.addEventListener('click', () => {
                paragraf.innerHTML = 'Uda ada yang booking. user id=' + filteredSchedule.renterId
                hiddenInput.value = ''
                infoAndBook.style.display = 'none'
            })
        } else if(currentTime > scheduleType.startTime && date == formattedDate) {
            button.addEventListener('click', () => {
                paragraf.innerHTML = 'sudah melewati waktu'
                hiddenInput.value = ''
                infoAndBook.style.display = 'none'
            })
        } else {
            button.addEventListener('click', () => {
                paragraf.innerHTML = 'available'
                hiddenInput.value = scheduleType.scheduleTypeId
                infoAndBook.style.display = 'block'
            })
        }

        scheduleDiv.appendChild(button)
        
    });

}

infoAndBook.addEventListener('click', async () => {

    const courtId = getParam('court-id')
    const date = dateInput.value
    const typeId = hiddenInput.value
    const userId = localStorage.getItem('user')

    const res = await insertSchedule(courtId, date, [typeId], userId)
    console.log(res)

    if(res.message == 'Insert Schedule Success') {
        window.location.reload()
    }
    
})