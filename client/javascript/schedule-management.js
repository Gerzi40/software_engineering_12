import { getCourtByCourtId, getScheduleByCourtIdAndDate, getScheduleTypes, insertSchedule } from "./module.js"

const dateInput = document.getElementById("dateInput")
const scheduleDiv = document.getElementById('scheduleDiv')
const paragraf = document.getElementById('paragraf')
const hiddenInput = document.getElementById('hiddenInput')
const manualBookButton = document.getElementById('manualBookButton')

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

    fillScheduleDiv(date)
    
}

// document.getElementById("dateInput").addEventListener("change", async () => {

//     const date = dateInput.value
//     fillScheduleDiv(date)

//     paragraf.innerHTML = ''
//     hiddenInput.value = ''

// })

const fillScheduleDiv = async (date) => {

    const courtId = getParam("court-id")

    const scheduleTypes = await getScheduleTypes()
    let scheduleTypeIds = await getScheduleByCourtIdAndDate(courtId, date)
    scheduleTypeIds = scheduleTypeIds.map(scheduleType => {return scheduleType.scheduleTypeId})
    
    const currentDate = new Date()
    const currentTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`
    
    scheduleDiv.innerHTML = ""

    // value checkbox merupakan scheduletypeid
    scheduleTypes.forEach((scheduleType, index) => {


        // gada di table schedule ato uda melewati waktu
        if(scheduleTypeIds.indexOf(index + 1) == -1 && (currentTime < scheduleType.startTime || date > currentDate.toLocaleDateString('en-CA'))) {

            const div = document.createElement("div")
            const checkBox = document.createElement("input")
            checkBox.type = 'radio'
            checkBox.id = `checkBox${index + 1}`
            checkBox.value = index + 1
            checkBox.name = 'hour'
            checkBox.addEventListener('change', async (event) => {
                hiddenInput.value = event.target.value
                manualBookButton.style.display = 'block'
                // let checkBoxs = document.querySelectorAll('input[type="checkbox"]:checked');
                // const amount = checkBoxs.length
                // const court = await getCourtByCourtId(courtId)
                // const totalCourtPriceInInt = parseInt(court[0].courtPrice, 10) * amount;
                // let totalCourtPriceInString = (totalCourtPriceInInt / 1000).toLocaleString('id-ID', {
                //     minimumFractionDigits: 3,
                //     maximumFractionDigits: 3
                //   }).replace(',', '.')
                // document.getElementById("totalPrice").innerHTML = `Rp ${totalCourtPriceInString}`
            })

            const label = document.createElement("label")
            label.htmlFor = `checkBox${index + 1}`
            label.innerHTML = `${scheduleType.startTime.slice(0, 5)} - ${scheduleType.endTime.slice(0, 5)}`
            
            div.appendChild(checkBox)
            div.appendChild(label)

            scheduleDiv.appendChild(div)

        } else {

            const div = document.createElement("div")
            const label = document.createElement("label")
            label.className = 'disabledLabel'
            label.innerHTML = `${scheduleType.startTime.slice(0, 5)} - ${scheduleType.endTime.slice(0, 5)}`

            div.appendChild(label)
            scheduleDiv.appendChild(div)

        }
    });

}

manualBookButton.addEventListener('click', async () => {

    const courtId = getParam('court-id')
    // const date = dateInput.value
    const date = document.querySelector('input[name="date"]:checked').value;
    const typeId = hiddenInput.value
    const userId = localStorage.getItem('user')

    const res = await insertSchedule(courtId, date, [typeId], userId)
    console.log(res)

    if(res.message == 'Insert Schedule Success') {
        window.location.reload()
    }
    
})