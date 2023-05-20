import axios from "axios"
import * as consts from "../consts/consts";
export const saveTokenToStorage = async (token: string) => {
    console.log('token in save', token)
    try {
        await localStorage.setItem('token', token)
        console.log('Token saved to local storage')
    } catch (error) {
        console.log('Failed to save token to local storage:', error)
    }
}

export const retrieveTokenFromStorage = async () => {
    try {
        const token = await localStorage.getItem('token')
        if (token) {
            const isValid = await checkTokenValidity(token)
            if (isValid === consts.SUCCESS) {
                console.log('Token retrieved from local storage:', token)
                return isValid
            } else {
                console.log('Token not valid')
                return null
            }
        } else {
            console.log('No token found in local storage')
            return null
        }
    } catch (error) {
        console.log('Failed to retrieve token from local storage:', error)
        return null
    }
}

const checkTokenValidity = async (token: string) => {
    const url = consts.MY_IP + '/validate_token/'
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('response', response)
        return response.status
    } catch (error) {
        throw error
    }
}
