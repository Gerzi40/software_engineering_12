import { getScheduleByRenterId, getUserByUserId, updateScheduleRating, updateCourtRating, getCourtByCourtId } from "./module.js"


window.onload = async () => {

    const userId = localStorage.getItem("user")

    if (userId == null) {
        document.getElementById('background').style.display = 'block'
        document.getElementById('login').style.display = 'flex'
        return
    }

    if (localStorage.getItem('user-role') != 'renter') {
        window.location.href = "./index.html"
    }

    const schedules = await getScheduleByRenterId(userId)

    if (schedules.length == 0) {
        const tr = document.createElement('tr')

        const name = document.createElement('td')
        name.innerHTML = '-'
        const type = document.createElement('td')
        type.innerHTML = '-'
        const date = document.createElement('td')
        date.innerHTML = '-'
        const time = document.createElement('td')
        time.innerHTML = '-'
        const price = document.createElement('td')
        price.innerHTML = '-'
        const status = document.createElement('td')
        status.innerHTML = '-'

        tr.appendChild(name)
        tr.appendChild(type)
        tr.appendChild(date)
        tr.appendChild(time)
        tr.appendChild(price)
        tr.appendChild(status)

        document.getElementById("bookingTable").appendChild(tr)
        return;
    }

    schedules.forEach(schedule => {
        const dbStartDate = new Date(`${schedule.scheduleDate}T${schedule.startTime}`)
        const dbEndDate = new Date(`${schedule.scheduleDate}T${schedule.endTime}`)
        const options = { day: 'numeric', month: 'long', year: 'numeric' }
        const formattedDate = dbStartDate.toLocaleDateString('en-GB', options)

        const currentDate = new Date()

        const tr = document.createElement('tr')

        const name = document.createElement('td')
        name.innerHTML = schedule.courtName

        const type = document.createElement('td')
        type.innerHTML = schedule.courtTypeName

        const date = document.createElement('td')
        date.innerHTML = formattedDate

        const time = document.createElement('td')
        time.innerHTML = `${schedule.startTime.slice(0, 5)}-${schedule.endTime.slice(0, 5)}`

        const price = document.createElement('td')
        // price.innerHTML = schedule.courtPrice

        const totalCourtPriceInInt = parseInt(schedule.courtPrice, 10);
        let totalCourtPriceInString = (totalCourtPriceInInt / 1000).toLocaleString('id-ID', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        }).replace(',', '.')
        price.innerHTML = `Rp ${totalCourtPriceInString}`

        const status = document.createElement('td')
        if (currentDate < dbStartDate) {
            status.innerHTML = 'Upcoming'
        } else if (currentDate > dbEndDate) {
            status.innerHTML = 'Done'
        } else if (currentDate > dbStartDate && currentDate < dbEndDate) {
            status.innerHTML = 'Ongoing'
        }

        tr.appendChild(name)
        tr.appendChild(type)
        tr.appendChild(date)
        tr.appendChild(time)
        tr.appendChild(price)
        tr.appendChild(status)

        if(schedule.isRated != 1){
            const tdtd = document.createElement('td')
            const rateButton = document.createElement('button')
            // rateButton.id = 'Button' + schedules.courtId
            rateButton.innerHTML = "Rate Here!"
            rateButton.className = "RateButton"
            rateButton.addEventListener('click', () => {
            document.getElementById('pop-up').style.display = 'flex'
            document.getElementById('terserah').value = schedule.courtId
            document.getElementById('terserah1').value = schedule.scheduleDate
            document.getElementById('terserah2').value = schedule.scheduleTypeId
            })
            tdtd.appendChild(rateButton)
            tr.appendChild(tdtd)
        }
        else{
            const rating = document.createElement('td')
            rating.innerHTML = schedule.scheduleRating
            tr.appendChild(rating)
        }

        document.getElementById("bookingTable").appendChild(tr)

        // document.getElementById("bookingListDiv").innerHTML += `
        //     <br/>
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

    const rating = document.getElementById('rating');

    const span1 = document.createElement('span');
    span1.innerHTML = '★';
    span1.id = 'star1'
    const span2 = document.createElement('span');
    span2.innerHTML = '★';
    span2.id = 'star2'
    const span3 = document.createElement('span');
    span3.innerHTML = '★';
    span3.id = 'star3'
    const span4 = document.createElement('span');
    span4.innerHTML = '★';
    span4.id = 'star4'
    const span5 = document.createElement('span');
    span5.innerHTML = '★';
    span5.id = 'star5'

    const butt = document.createElement('button');
    butt.innerHTML = 'Rate'
    butt.id = 'rateButton'

        span1.className = "star"
        span2.className = "star"
        span3.className = "star"
        span4.className = "star"
        span5.className = "star"

    span1.addEventListener('click', () => {
        span1.className = "star one"
        span2.className = "star"
        span3.className = "star"
        span4.className = "star"
        span5.className = "star"
    })
    span2.addEventListener('click', () => {
        span1.className = "star one"
        span2.className = "star one"
        span3.className = "star"
        span4.className = "star"
        span5.className = "star"
    })
    span3.addEventListener('click', () => {
        span1.className = "star one"
        span2.className = "star one"
        span3.className = "star one"
        span4.className = "star"
        span5.className = "star"
    })
    span4.addEventListener('click', () => {
        span1.className = "star one"
        span2.className = "star one"
        span3.className = "star one"
        span4.className = "star one"
        span5.className = "star"
    })
    span5.addEventListener('click', () => {
        span1.className = "star one"
        span2.className = "star one"
        span3.className = "star one"
        span4.className = "star one"
        span5.className = "star one"
    })
    butt.addEventListener('click', async() => {
        // update 
        let rating = 0
        if(span1.className == "star one" && span2.className == "star" && span3.className == "star" && span4.className == "star" && span5.className == "star"){
            rating = 1
        }
        else if(span1.className == "star one" && span2.className == "star one" && span3.className == "star" && span4.className == "star" && span5.className == "star"){
            rating = 2
        }
        else if(span1.className == "star one" && span2.className == "star one" && span3.className == "star one" && span4.className == "star" && span5.className == "star"){
            rating = 3
        }
        else if(span1.className == "star one" && span2.className == "star one" && span3.className == "star one" && span4.className == "star one" && span5.className == "star"){
            rating = 4
        }
        else if(span1.className == "star one" && span2.className == "star one" && span3.className == "star one" && span4.className == "star one" && span5.className == "star one"){
            rating = 5
        }
        const court = await getCourtByCourtId(document.getElementById('terserah').value)
        const ratings = court[0].courtRating;
        const rating_count = court[0].courtRatingCount;
        const a = ((ratings * rating_count) + rating) / rating_count + 1 
        const kuda = await updateCourtRating(document.getElementById('terserah').value, a, rating_count+1)
        const rest = await updateScheduleRating(document.getElementById('terserah').value, document.getElementById('terserah1').value, document.getElementById('terserah2').value, rating) 
        document.getElementById('pop-up').style.display = 'none'
    })

    

    rating.appendChild(span1)
    rating.appendChild(span2)
    rating.appendChild(span3)
    rating.appendChild(span4)
    rating.appendChild(span5)
    rating.appendChild(butt)

}

// Funtion to update rating
// function gfg(n) {
//     let output = 0;
//     let stars = document.getElementsByClassName("star");
//     remove();
//     for (let i = 0; i < n; i++) {
//         if (n == 1) cls = "one";
//         else if (n == 2) cls = "two";
//         else if (n == 3) cls = "three";
//         else if (n == 4) cls = "four";
//         else if (n == 5) cls = "five";
//         console.log(stars[i]);
//         stars[i].className = "star " + cls;
//     }
//     output =  n ;
// }

// // To remove the pre-applied styling
// function remove() {
//     let stars = document.getElementsByClassName("star");
//     let i = 0;
//     while (i < 5) {
//         stars[i].className = "star";
//         i++;
//     }
// }

