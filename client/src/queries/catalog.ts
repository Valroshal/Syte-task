import axios from "axios"
import { saveTokenToStorage } from '../localStorage/localStorage'
import * as consts from "../consts/consts";
import {TypeCatalog, TypeFormValues} from "../consts/types";

export const userLogin = async (email: string, password: string) => {
    const data: TypeFormValues = {
        email: email,
        password: password
    }
    const url = 'http://localhost:8000/login/'

    try {
        const res = await axios.post(url, data)
        if (res.status === consts.SUCCESS) {
            await saveTokenToStorage(res.data.token)
        }
        return res.data.token
    } catch (error: any) {
        return error.message
    }
}

export const fetchCatalogs = async () => {
    try {
        const url = consts.MY_IP + '/get_catalogs/'
        const res = await axios.get(url)
        return res.data
    } catch (error: any) {
        return error.message
    }
}

export const updateCatalog = async ( name: string, is_primary: boolean) => {
    try {
        const url = consts.MY_IP + '/update_catalog/'
        const res = await axios.put(url, {
            name:name,
            is_primary:is_primary
        })
        return res.status
    } catch (error: any) {
        console.log('error', error.response.data.error)
        return error.response.data.error

    }
}

export const deleteCatalog = async (id: string) => {
    const url = consts.MY_IP + `/delete_catalog/${id}`
    try {
        const res = await axios.delete(url)
        return res.status
    } catch (error: any) {
        return error.message
    }
}

export const addCatalog = async (catalog: TypeCatalog) => {
    try {
        const url = consts.MY_IP + '/add_catalog/'

        const res = await axios.post(url, catalog)
        return res.status
    } catch (error: any) {
        console.log('error', error.response.data.error)
        return error.response.data.error
    }
}
