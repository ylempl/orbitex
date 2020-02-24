import { baseURL } from '../constants/config'

export const GET = (endpoint) => {
  let url = `${baseURL}${endpoint}`

  return fetch(url)
    .then(res => res.json())
    .catch(err => err)
}

export const GET_WITH_PAGINATION = (endpoint, page) => {
  let p = new URLSearchParams()
  p.append('_page', page || 1 )

  let url = `${baseURL}${endpoint}?${p}`

  return fetch(url, {
  })
    .then(res => res.json())
    .catch(err => err)
}

export const GET_BY_ID = (endpoint, id) => {
  let url = `${baseURL}${endpoint}/${id}`

  return fetch(url, {
  })
    .then(res => res.json())
    .catch(err => err)
}

export const SEARCH = (endpoint, query) =>{
  let q = new URLSearchParams()
  q.append('q', query || '')

  let url = `${baseURL}${endpoint}?${q}&_limit=10`

  return fetch(url)
  .then(res => res.json())
  .catch(err => err)
}

export const DELETE = (endpoint, id) => {
  let url = `${baseURL}${endpoint}/${id}`

  return fetch(url, {
    method: 'delete',
    headers: {'Content-Type':'application/json'},
    })
    .then(response => response.json().then(data => ({status: response.status,data:data})))
}

export const POST = (endpoint, data) => {
  let url = `${baseURL}${endpoint}`

  return fetch(url, {
    method: 'post',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({...data})
    })
    .then(response => response.json().then(data => ({status: response.status,data:data})))
}

export const PUT = (endpoint, data, id) => {
  let url = `${baseURL}${endpoint}/${id}`

  return fetch(url, {
    method: 'put',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({...data})
    })
    .then(response => response.json().then(data => ({status: response.status,data:data})))
}