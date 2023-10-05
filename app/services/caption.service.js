import axios from "axios";
import { GetCaption, Login, SignUp, ValidateUser } from "./config/api";
import _ from "lodash";

const getHeader = () => {
    const userDetails = getToken();
    if (!_.isEmpty(userDetails?.access_token)) {
        return {
            Authorization: `Bearer ${userDetails?.access_token}`
        }
    }
    return
}

export const getCaption = (image) => {
    return axios.post(GetCaption(), image, {
        headers: {
            ...getHeader(),
            "Content-Type": "multipart/form-data",
        }
    });
}

export const login = (body) => {
    return axios.post(Login(), body,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        },);
}

export const signup = (body) => {
    return axios.post(SignUp(), body,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        },);
}

export const logout = () => {
    localStorage.removeItem("user_details")
    return true;
}

export const setToken = (data) => {
    localStorage.setItem("user_details", JSON.stringify(data));
    return true;
}

export const getToken = () => {
    const userDetails = localStorage.getItem("user_details");
    return JSON.parse(userDetails);
}

export const validateUser = async () => {
    const userDetails = getToken();
    if (_.isEmpty(userDetails)) {
        return;
    }
    return axios.get(ValidateUser(userDetails?.id), {
        headers: {
            ...getHeader()
        }
    })
}
