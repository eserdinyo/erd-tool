import axios from 'axios'

const httpTable = axios.create({
  baseURL: 'http://localhost:3000/',
})

export default httpTable