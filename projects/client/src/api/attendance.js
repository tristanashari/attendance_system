import axios from 'axios'

export function todaysAttendance(
    token,
    paramPage,
    paramSearch,
    paramStatus,
    paramSort){
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/employees-attendances?page=${paramPage}&search=${paramSearch}&filterStatus=${paramStatus}&sort=${paramSort}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export function todaysLog(token){
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/todays-log`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export function clockIn(token, time){
    return axios.post(`${process.env.REACT_APP_API_BASE_URL}/attendance-clockin?clockIn=${time}`, {}, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export function clockOut(token, time){
    return axios.post(`${process.env.REACT_APP_API_BASE_URL}/attendance-clockout?clockOut=${time}`, {}, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export function attendanceLog(
    token,
    paramPage,
    paramStartDate,
    paramEndDate,
    paramStatus,
    paramSort
){
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/attendance-log?page=${paramPage}&startDate=${paramStartDate}&endDate=${paramEndDate}&status=${paramStatus}&sortBy=${paramSort}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export function oneYearAttendance(token){
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/one-year-attendance`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}