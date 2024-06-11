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

window.onload = async () => {

    const courtId = getParam('court-id');

    const court = await getCourtByCourtId(courtId)
    document.getElementById("courtDetailDiv").innerHTML = `
        <div>court id: ${court[0].courtId}</div>
        <div>name: ${court[0].courtName}</div>
        <div>address: ${court[0].courtAddress}</div>
        <div>type: ${court[0].courtTypeName}</div>
        <div>price: ${court[0].courtPrice}</div>
        <div>rating: ${court[0].courtRating}</div>
        <div>rating count: ${court[0].courtRatingCount}</div>
    `

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