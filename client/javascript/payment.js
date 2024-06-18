import { getCourtByCourtId, getScheduleTypes, insertSchedule } from "./module.js";

const getParam = (parameterName) => {
    const url = window.location.href;
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);
    return params.get(parameterName);
}

window.onload = async () => {

    const userId = localStorage.getItem('user')

    if(userId == null) {
        window.location.href = 'index.html'
    }

    if(localStorage.getItem('user-role') != 'renter') {
        window.location.href = 'index.html'
    }

    const courtId = getParam('court-id')
    const date = getParam('date')
    let schedules = getParam('schedule')

    if(courtId == null || courtId == "" || date == null || date == "" || schedules == null || schedules == "") {
        window.location.href = 'index.html'
    }

    // const court = await getCourtByCourtId(courtId)

    // schedules = schedules.split(',')
    // let res = ''
    // const scheduleTypes = await getScheduleTypes()

    // schedules.forEach(schedule => {
    //     res += `${scheduleTypes[schedule].startTime}-${scheduleTypes[schedule].endTime},`
    // });

    // const name = document.createElement('p')
    // name.innerHTML = `Name: ${court[0].courtName}`
    // const date2 = document.createElement('p')
    // date2.innerHTML = date
    // const schedule = document.createElement('p')
    // schedule.innerHTML = res
    // const button = document.createElement('button')
    // button.textContent = 'Pay'
    // button.addEventListener('click', async () => {
    //     document.getElementById('background').style.display = 'block';
    //     document.getElementById('paymentPopUp').style.display = 'block';

    //     const res = await insertSchedule(courtId, date, schedules, userId)
    //     console.log(res)
    //     setTimeout(() => {
    //         window.location.href = 'booking.html'
    //     }, 3000)
    // })

    // document.getElementById('paymentDiv').appendChild(name)
    // document.getElementById('paymentDiv').appendChild(date2)
    // document.getElementById('paymentDiv').appendChild(schedule)
    // document.getElementById('paymentDiv').appendChild(button)

}

document.getElementById('confirmButton').addEventListener('click', async () => {
    document.getElementById('background').style.display = 'block';
    document.getElementById('paymentPopUp').style.display = 'flex';

    const userId = localStorage.getItem('user')
    const courtId = getParam('court-id')
    const date = getParam('date')
    let schedules = getParam('schedule')
    schedules = schedules.split(',')

    const res = await insertSchedule(courtId, date, schedules, userId)
    console.log(res)
    setTimeout(() => {
        window.location.href = 'booking.html'
    }, 3000)
})