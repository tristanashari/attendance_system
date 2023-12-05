import axios from 'axios'

export function getSalary(token){
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/salary`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}