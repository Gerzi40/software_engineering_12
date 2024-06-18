const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

// const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'seDB'
})

/* COURT */
app.get("/courts", (req, res) => {
    db.query("SELECT * FROM court JOIN court_type ON court.courtTypeId = court_type.courtTypeId", (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send(result)
        }
    })
})

app.get("/court/court-id/:courtId", (req, res) => {
    const courtId = req.params.courtId
    db.query("SELECT * FROM court JOIN court_type ON court.courtTypeId = court_type.courtTypeId WHERE courtId = ?", [courtId], (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send(result)
        }
    })
})

app.get("/courts/owner-id/:ownerId", (req, res) => {
    const ownerId = req.params.ownerId
    db.query("SELECT * FROM court JOIN court_type ON court.courtTypeId = court_type.courtTypeId WHERE ownerId = ?", [ownerId], (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send(result)
        }
    })
})

app.post("/court", (req, res) => {
    const ownerId = req.body.ownerId
    const name = req.body.courtName
    const address = req.body.courtAddress
    const typeId = req.body.courtTypeId
    const price = req.body.courtPrice
    const image = req.body.courtImage

    db.query(`
    INSERT INTO court (ownerId, courtName, courtAddress, courtTypeId, courtPrice, courtRating, courtRatingCount, courtImage) VALUES (?, ?, ?, ?, ?, 0, 0, ?)`,
    [ownerId, name, address, typeId, price, image],
    (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send({ message: "Insert Court Success" })
        }
    })
})

app.put("/court", (req, res) => {
    const id = req.body.courtId
    const name = req.body.courtName
    const address = req.body.courtAddress
    const typeId = req.body.courtTypeId
    const price = req.body.courtPrice
    const image = req.body.courtImage

    db.query(`
    UPDATE court 
    SET 
        courtName = ?,
        courtAddress = ?,
        courtTypeId = ?,
        courtPrice = ?,
        courtImage = ?
    WHERE
        courtId = ?`, 
    [name, address, typeId, price, image, id],
    (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send(result)
        }
    })
})

app.put("/court-rating", (req, res) => {
    const id = req.body.courtId
    const rating = req.body.courtRating
    const ratingCount = req.body.courtRatingCount

    db.query(`
    UPDATE court 
    SET 
        courtRating = ?,
        courtRatingCount = ?
    WHERE
        courtId = ?`, 
    [rating, ratingCount, id],
    (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send(result)
        }
    })
})

app.delete("/court/:courtId", (req, res) => {
    const courtId = req.params.courtId
    
    db.query(`DELETE FROM court WHERE courtId = ?`, [courtId], (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send({ message: 'Delete Court Success' })
        }
    })
})

/* COURT TYPE */
app.get("/court-types", (req, res) => {
    const courtId = req.params.courtId
    db.query("SELECT * FROM court_type", (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send(result)
        }
    })
})

/* SCHEDULE */
app.get("/schedule", (req, res) => {
    db.query("SELECT * FROM schedule", (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send(result)
        }
    })
})

app.get("/schedule/court-id/:courtId/date/:date", (req, res) => {
    const courtId = req.params.courtId
    const date = req.params.date

    db.query("SELECT * FROM schedule JOIN user ON schedule.renterId = user.userId WHERE courtId = ? AND scheduleDate = ?", [courtId, date], (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send(result)
        }
    })
})

app.get("/schedule/renter-id/:renterId", (req, res) => {
    const renterId = req.params.renterId
    
    db.query("SELECT * FROM schedule JOIN court ON schedule.courtId = court.courtId JOIN schedule_type ON schedule.scheduleTypeId = schedule_type.scheduleTypeId JOIN court_type ON court.courtTypeId = court_type.courtTypeId WHERE renterId = ?", [renterId], (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send(result)
        }
    })
})

app.post("/schedule", (req, res) => {
    
    const courtId = req.body.courtId
    const scheduleDate = req.body.scheduleDate
    const scheduleTypeIds = req.body.scheduleTypeIds
    const renterId = req.body.renterId

    let query = "INSERT INTO schedule (courtId, scheduleDate, scheduleTypeId, renterId) VALUES "


    for(let i=0; i<scheduleTypeIds.length; i++) {
        if(i != 0) query += ","
        query += `(${courtId}, '${scheduleDate}', ${scheduleTypeIds[i]}, ${renterId})`
    }

    db.query(query, (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send({message: "Insert Schedule Success"})
        }
    })
})

app.put("/schedule-rating", (req, res) => {
    
    const courtId = req.body.courtId
    const scheduleDate = req.body.scheduleDate
    const scheduleTypeId = req.body.scheduleTypeId
    const scheduleRating = req.body.scheduleRating

    db.query('UPDATE schedule SET scheduleRating = ?, isRated = 1 WHERE courtId=? AND scheduleDate=? AND scheduleTypeId=?', [scheduleRating, courtId, scheduleDate, scheduleTypeId], (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send({message: "Success"})
        }
    })
})

/* SCHEDULE TYPE */
app.get("/schedule-types", (req, res) => {
    db.query("SELECT * FROM schedule_type", (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send(result)
        }
    })
})

/* USER */
app.get("/users", (req, res) => {
    db.query("SELECT * FROM user", (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send(result)
        }
    })
})

app.get("/user/user-id/:userId", (req, res) => {
    const userId = req.params.userId
    db.query("SELECT * FROM user WHERE userId = ?", [userId], (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send(result)
        }
    })
})

app.get("/user/user-name/:userName", (req, res) => {
    const userName = req.params.userName
    db.query("SELECT * FROM user WHERE userName = ?", [userName], (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            res.send(result)
        }
    })
})

app.post("/user", (req, res) => {
    const username = req.body.userName
    const password = req.body.userPassword
    const role = req.body.userRole

    db.query("SELECT * FROM user WHERE userName = ?", [username], (err, result) => {
        if(err){
            res.send({message: err})
        } else {
            if(result.length > 0){
                res.send({message: "Username already taken"})
            } else {
                db.query("INSERT INTO user (userName, userPassword, userRole) VALUES (?, ?, ?)", [username, password, role], (err, result) => {
                    if(err){
                        res.send({message: err})
                    } else {
                        res.send({message: "Register Success"})
                    }
                })
            }
        }
    })
})

app.post("/login", (req, res) => {
    const username = req.body.userName
    const password = req.body.userPassword

    db.query("SELECT * FROM user WHERE userName = ?", [username], (err, result) => {
        if(err){
            res.send({message: err});
        } else {
            if(result.length > 0){
                if(result[0].userPassword == password){
                    res.send({
                        user: result[0],
                        message: "Login Success"
                    })
                } else{
                    res.send({message: "Wrong Password"})
                }
            } else {
                res.send({message: "Username Not Found"})
            }
        }
    })
})

app.put("/user", (req, res) => {
    const username = req.body.userName
    const password = req.body.userPassword
    const id = req.body.userId

    db.query("SELECT * FROM user WHERE userName = ?", [username], (err, result) => {
        if(err){
            res.send({message: err});
        } else {
            if(result.length > 0 && result[0].userId != id){
                res.send({message: "Username already taken"})
            } else {
                db.query("UPDATE user SET userName = ?, userPassword = ? WHERE userId = ?", [username, password, id], (err, result) => {
                    if(err){
                        res.send({message: err})
                    } else {
                        res.send({message: "Update Success"})
                    }
                })
            }
        }
    })
})



app.listen(5000, () => {console.log("Running...")})