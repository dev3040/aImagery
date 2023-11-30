import axios from "axios";
import { CheckServer, Emotion, GetCaption, Login, SignUp, ValidateUser, StoreData } from "./config/api";
import _ from "lodash";
import nextConfig from "@/next.config";

export const checkServer = () => {
    return axios.get(CheckServer())
}

const getHeader = () => {
    const userDetails = getToken();
    if (!_.isEmpty(userDetails?.access?.token)) {
        return {
            Authorization: `Bearer ${userDetails?.access?.token}`
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

export const getEmotionCaption = (body) => {
    return axios.post(Emotion(), body);
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
    if (_.isEmpty(userDetails) && _.isEmpty(userDetails?.user)) {
        return;
    }
    return axios.get(ValidateUser(userDetails?.user.id), {
        headers: {
            ...getHeader()
        }
    })
}

export const regenerateCaption = (image) => {
    return axios.post(`${nextConfig.API_URL}/recheckCaption`, image, {
        headers: {
            ...getHeader(),
            "Content-Type": "multipart/form-data"
        }
    })
}

export const captionPromt = (text) => {
    console.log('text: ', text);
    return axios.post(`${nextConfig.PROMP_URL}/prompt`, text, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const storeData = (body) => {
    console.log('body: ', body);
    // ${nextConfig.BACKEND_URL}/retraining/store-data
    return axios.post(`${nextConfig.BACKEND_URL}/retraining/store-data`, body, {
        headers: {
            ...getHeader(),
            "Content-Type": "multipart/form-data"
        }
    })
}

