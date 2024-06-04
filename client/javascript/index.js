import { getCities, getCourtTypes } from "./module.js"

window.onload = async () => {
    const cities = await getCities()
    const courtTypes = await getCourtTypes()

    cities.forEach(city => {
        document.getElementById("locationSelect").innerHTML += `
            <option value="${city}">${city}</option>
        `
    });

    courtTypes.forEach(courtType => {
        document.getElementById("categorySelect").innerHTML += `
            <option value="${courtType.courtTypeName}">${courtType.courtTypeName}</option>
        `
    });
}

function buildUrl(baseUrl, params) {
    const queryString = Object.keys(params)
        .filter(key => params[key] !== '')
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
    return baseUrl + '?' + queryString;
}

document.getElementById('findCourtButton').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value
    const category = document.getElementById('categorySelect').value
    const location = document.getElementById('locationSelect').value

    if(name == '' && category == '' && location == '') {
        return
    }

    const url = buildUrl('court.html', { name: name, category: category, location: location})
    window.location.href = url
})