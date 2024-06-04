import { getCourtByCourtId, getCourtTypes, updateCourt } from "./module.js"

const getParam = (parameterName) => {
    const url = window.location.href;
    const urlObject = new URL(url);
    const params = new URLSearchParams(urlObject.search);
    return params.get(parameterName);
}

window.onload = async () => {

    const courtTypes = await getCourtTypes()
    // console.log(courtTypes)
    courtTypes.forEach(courtType => {
        document.getElementById("typeDdl").innerHTML += `
            <option value=${courtType.courtTypeId}>${courtType.courtTypeName}</option>
        `
    });


    const courtId = getParam("court-id")
    const court = await getCourtByCourtId(courtId)
    // console.log(court)

    document.getElementById("nameInput").value = court[0].courtName
    document.getElementById("addressInput").value = court[0].courtAddress
    document.getElementById("typeDdl").selectedIndex = court[0].courtTypeId - 1
    document.getElementById("priceInput").value = court[0].courtPrice
    document.getElementById("imageInput").value = court[0].courtImage

}

document.getElementById("updateButton").addEventListener("click", async () => {

    const courtId = getParam("court-id")

    const name = document.getElementById("nameInput").value
    const address = document.getElementById("addressInput").value
    const type = document.getElementById("typeDdl").value
    const price = document.getElementById("priceInput").value
    const image = document.getElementById("imageInput").value

    // console.log(name)
    // console.log(address)
    // console.log(type)
    // console.log(price)
    // console.log(image)

    if(name == "") {
        document.getElementById("statusLabel").innerHTML = "Name must be filled"
        return
    } else if(address == "") {
        document.getElementById("statusLabel").innerHTML = "Address must be filled"
        return
    } else if(price == "") {
        document.getElementById("statusLabel").innerHTML = "Price must be filled"
        return
    } else if(isNaN(parseInt(price))) {
        document.getElementById("statusLabel").innerHTML = "Price must be a number"
        return
    } else if(image == "") {
        document.getElementById("statusLabel").innerHTML = "Image must be filled"
        return
    }

    const res = await updateCourt(courtId, name, address, type, price, image)
    console.log(res)
    window.location.href = "./my-court.html"
})