import { getCities, getCourtTypes, getCourts, getUserByUserId } from "./module.js";

window.onload = async () => {

    const courtTypes = await getCourtTypes()
    courtTypes.forEach(courtType => {
        const option = document.createElement('option')
        option.innerHTML = courtType.courtTypeName
        option.value = courtType.courtTypeName
        document.getElementById('categorySelect').appendChild(option)
    });

    const cities = await getCities()
    cities.forEach(city => {
        const option = document.createElement('option')
        option.innerHTML = city
        option.value = city
        document.getElementById('locationSelect').appendChild(option)
    });

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.size == 0) {
        const courts = await getCourts();
        displayCourts(courts);
    } else {
        const name = urlParams.get('name')
        const category = urlParams.get('category')
        const location = urlParams.get('location')
        document.getElementById('nameInput').value = name ?  name : ''
        document.getElementById('categorySelect').value = category ?  category : ''
        document.getElementById('locationSelect').value = location ?  location : ''

        if(category != '') {
            categorySelect.style.color = 'black'
        } else {
            categorySelect.style.color = 'grey'
        }

        if(location != '') {
            locationSelect.style.color = 'black'
        } else {
            locationSelect.style.color = 'grey'
        }
        // console.log(name == '')
        // console.log(name == undefined)
        // console.log(category == '')
        // console.log(category == undefined)
        // console.log(location == '')
        // console.log(location == undefined)
        const newCourts = await searchCourts(name, category, location)
        displayCourts(newCourts)
    }
};

function extractCityPart(address) {
    // Mencari posisi kata "kota "
    let kotaIndex = address.toLowerCase().indexOf("kota ");
    if (kotaIndex === -1) {
        return null;  // Jika tidak ditemukan, kembalikan null
    }

    // Menentukan posisi awal kata setelah "kota "
    let startIndex = kotaIndex + "kota ".length;

    // Mencari posisi koma pertama setelah "kota "
    let endIndex = address.indexOf(",", startIndex);
    if (endIndex === -1) {
        return null;  // Jika tidak ditemukan, kembalikan null
    }

    // Mengambil kata di antara "kota " dan ","
    let cityPart = address.substring(startIndex, endIndex).trim();
    return cityPart;
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function roundFloatToString(floatString) {
    const floatValue = parseFloat(floatString);
    const roundedValue = Math.round(floatValue * 10) / 10; // round to 1 decimal place
    return roundedValue.toString();
}

const displayCourts = (courtsToDisplay) => {
    const courtListDiv = document.getElementById("courtListDiv");
    courtListDiv.innerHTML = "";
    courtsToDisplay.forEach(court => {

        const div = document.createElement('div')
        div.id = "grid_box"

        const img = document.createElement('img')
        img.src = court.courtImage
        const name = document.createElement('p')
        name.id = "name"
        name.innerHTML = court.courtName

        const rating = document.createElement('div')
        rating.className = "rating"
        const angka = document.createElement('td')
        angka.id = "angka"
        angka.innerHTML = roundFloatToString(court.courtRating)
        const bintang = document.createElement('td')
        bintang.id = "bintang"
        bintang.innerHTML = "★"
        rating.append(angka)
        rating.append(bintang)


        const div_loc_typ = document.createElement('div')
        div_loc_typ.className = "div_loc_typ"
        const icon_loc = document.createElement('img')
        icon_loc.id = "icon_loc"
        icon_loc.src = "./asset/court/Icon (1).png"
        const location = document.createElement('td')
        location.innerHTML = "|     " + extractCityPart(court.courtAddress)
        div_loc_typ.append(icon_loc)
        div_loc_typ.append(location)

        const div_sport_typ = document.createElement('div')
        div_sport_typ.className = "div_sport_typ"
        const icon_sport = document.createElement('img')
        icon_sport.id = "icon_sport"
        icon_sport.src = "./asset/court/Icon (2).png"
        const sportType = document.createElement('td')
        sportType.innerHTML = "|     " + court.courtTypeName
        div_sport_typ.appendChild(icon_sport)
        div_sport_typ.appendChild(sportType)

        const price = document.createElement('div')
        price.className = "price"
        const courtPrice = document.createElement('td')
        courtPrice.id = "courtPrice"
        courtPrice.innerHTML = `RP. ${formatNumber(court.courtPrice)} / Hour`
        price.appendChild(courtPrice)

        div.addEventListener('click', () => {
            window.location.href = `court-detail.html?court-id=${court.courtId}`
        })

        div.appendChild(img)
        div.appendChild(name)
        div.appendChild(div_loc_typ)
        div.appendChild(div_sport_typ)
        div.appendChild(rating)
        div.appendChild(price)

        courtListDiv.appendChild(div)

    });
};

document.getElementById('findCourtButton').addEventListener('click', async () => {

    const name = document.getElementById('nameInput').value
    const category = document.getElementById('categorySelect').value
    const location = document.getElementById('locationSelect').value

    if(name == '' && category == '' && location == '') return

    const params = {
        name: name,
        category: category,
        location: location
    }

    let url = 'court.html?';
    for (let key in params) {
        if (params[key]) {
            url += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
        }
    }
    url = url.replace(/&$/, '');

    window.location.href = url
})

const searchCourts = async (toFind, category, location) => {
    const courts = await getCourts();
    const toFindLowerCase = toFind ? toFind.toLowerCase() : '';
    return courts.filter(court => {
        const matchesName = toFind ? court.courtName.toLowerCase().includes(toFindLowerCase) : true;
        const matchesCategory = category ? court.courtTypeName === category : true;
        const matchesLocation = location ? court.courtAddress.includes(location) : true;
        return matchesName && matchesCategory && matchesLocation;
    });
};

const categorySelect = document.getElementById('categorySelect')
categorySelect.addEventListener('change', () => {
    if(categorySelect.value != '') {
        categorySelect.style.color = 'black'
    } else {
        categorySelect.style.color = 'grey'
    }
})

const locationSelect = document.getElementById('locationSelect')
locationSelect.addEventListener('change', () => {
    if(locationSelect.value != '') {
        locationSelect.style.color = 'black'
    } else {
        locationSelect.style.color = 'grey'
    }
})