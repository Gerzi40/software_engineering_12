export const getCourts = async () => {
    const res = await fetch("http://localhost:5000/courts")
    const data = await res.json()
    return data
}

export const getCourtByCourtId = async (courtId) => {
    const res = await fetch(`http://localhost:5000/court/court-id/${courtId}`)
    const data = await res.json()
    return data
}

export const getCourtsByOwnerId = async (ownerId) => {
    const res = await fetch(`http://localhost:5000/courts/owner-id/${ownerId}`)
    const data = await res.json()
    return data
}

export const getCities = async () => {
    const city = [
        'Jakarta',
        'Bogor',
        'Depok',
        'Tanggerang',
        'Bekasi'
    ]
    return city
}

export const insertCourt = async (ownerId, name, address, typeId, price, image) => {
    const res = await fetch(`http://localhost:5000/court`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ownerId: ownerId,
            courtName: name,
            courtAddress: address,
            courtTypeId: typeId,
            courtPrice: price,
            courtImage: image
        })
    })
    const data = await res.json()
    return data
}

export const updateCourt = async (id, name, address, typeId, price, image) => {
    const res = await fetch(`http://localhost:5000/court`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            courtId: id,
            courtName: name,
            courtAddress: address,
            courtTypeId: typeId,
            courtPrice: price,
            courtImage: image
        })
    })
    const data = await res.json()
    return data
}

export const updateCourtRating = async (id, rating, ratingCount) => {
    const res = await fetch(`http://localhost:5000/court-rating`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            courtId: id,
            courtRating: rating,
            courtRatingCount: ratingCount
        })
    })
    const data = await res.json()
    return data
}

export const deleteCourt = async (id) => {
    const res = await fetch(`http://localhost:5000/court/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    const data = await res.json()
    return data
}

export const getCourtTypes = async () => {
    const res = await fetch("http://localhost:5000/court-types")
    const data = await res.json()
    return data
}

export const getScheduleByCourtIdAndDate = async (courtId, date) => {
    const res = await fetch(`http://localhost:5000/schedule/court-id/${courtId}/date/${date}`)
    const data = await res.json()
    return data
}

export const getScheduleByRenterId = async (renterId) => {
    const res = await fetch(`http://localhost:5000/schedule/renter-id/${renterId}`)
    const data = await res.json()
    return data
}

export const getSchedule = async () => {
    const res = await fetch("http://localhost:5000/schedule")
    const data = await res.json()
    return data
}

export const insertSchedule = async (courtId, date, typeIds, renterId) => {
    const res = await fetch(`http://localhost:5000/schedule`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            courtId: courtId,
            scheduleDate: date,
            scheduleTypeIds: typeIds,
            renterId: renterId
        })
    })
    const data = await res.json()
    return data
}

export const updateScheduleRating = async (id, date, typeId, rating) => {
    const res = await fetch(`http://localhost:5000/schedule-rating`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            courtId: id,
            scheduleDate: date,
            scheduleTypeId: typeId,
            scheduleRating: rating
        })
    })
    const data = await res.json()
    return data
}

export const getScheduleTypes = async () => {
    const res = await fetch(`http://localhost:5000/schedule-types`)
    const data = await res.json()
    return data
}

export const getUsers = async () => {
    const res = await fetch(`http://localhost:5000/users`)
    const data = await res.json()
    return data
}

export const getUserByUserId = async (userId) => {
    const res = await fetch(`http://localhost:5000/user/user-id/${userId}`)
    const data = await res.json()
    return data
}

export const getUserByUserName = async (userName) => {
    const res = await fetch(`http://localhost:5000/user/user-name/${userName}`)
    const data = await res.json()
    return data
}

export const insertUser = async (name, password, role) => {
    const res = await fetch(`http://localhost:5000/user`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName: name,
            userPassword: password,
            userRole: role
        })
    })
    const data = await res.json()
    return data
}

export const login = async (name, password) => {
    const res = await fetch(`http://localhost:5000/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName: name,
            userPassword: password
        })
    })
    const data = await res.json()
    return data
}

export const updateUser = async (id, name, password) => {
    const res = await fetch(`http://localhost:5000/user`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: id,
            userName: name,
            userPassword: password
        })
    })
    const data = await res.json()
    return data
}