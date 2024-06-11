import { getUserByUserId, updateUser, getScheduleByRenterId, getCourtTypes, insertCourt, getCourtsByOwnerId } from "./module.js"

const usernameInput = document.getElementById('usernameInput')
const passwordInput = document.getElementById('passwordInput')

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