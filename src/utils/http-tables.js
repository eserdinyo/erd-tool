import axios from 'axios'

const httpTables = axios.create({
  baseURL: 'http://localhost:3000/',
})

export default httpTables
