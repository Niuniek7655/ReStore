import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";

export interface ResponseData {
    type: string;    
    title: string;  
    status: number;   
    traceId: string;    
    errors: any;   
}

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

axios.defaults.baseURL = 'http://localhost:5000/api/';

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(async response => {
    await sleep();
    return response
}, (error: AxiosError) => {
    const {data, status} = error.response!;
    let newObject = data as ResponseData;
    switch(status) {
        case 400:
            if(newObject.errors) {
                const modelStateErrors: string[] = []; 
                for (const key in newObject.errors) {
                    if (newObject.errors[key]) {
                        modelStateErrors.push(newObject.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(newObject.title)
            break;
        case 401:
            toast.error(newObject.title)
            break;
        case 500:
            history.push({
                pathname: '/server-error',
                state: {error: data}
            });
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Catalog = {
    list: () => requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`)
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),
}

const agent = {
    Catalog,
    TestErrors
}

export default agent;