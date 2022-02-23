import axios from 'axios'
import 'dotenv/config'

const { SERVER_BASE_URL } = process.env

const api = axios.create({
    baseURL: SERVER_BASE_URL
})

export default api
