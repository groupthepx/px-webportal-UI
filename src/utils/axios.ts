'use client';
import Axios from 'axios'

const getDataTokenAPI = (token : any) => {
   return Axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_API,
        headers: {
            'Content-Type': 'application/json',
            'Authorization':  `Bearer ${token}` ,
            'Accept': 'application/json'
        }
    })
}

export default getDataTokenAPI
