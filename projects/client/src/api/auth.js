import axios from 'axios'

export function login(values){
    return axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, values, {
        headers: { "Content-Type": "application/json" },
      })
}

export function addEmployee(values, token){
  return axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/employee-registration`, values, {
    headers: {
      "Authorization" : `Bearer ${token}`
    }
  })
}

export function setPassword(values, setPasswordToken) {
  return axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/set-password?token=${setPasswordToken}`, values, {
    headers: { "Content-Type": "application/json"}
  })
}