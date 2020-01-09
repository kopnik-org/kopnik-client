import 'isomorphic-fetch'
import fetchIntercept from "fetch-intercept/lib/node";

import errorInterceptor from "./errorInterceptor";
import dataInterceptor from "./dataInterceptor";
import cookieInterceptor from "./cookieInterceptor";
import headersInterceptor from "./headersInterceptor";
import api from "./api";

fetchIntercept.register(errorInterceptor)
fetchIntercept.register(dataInterceptor)
fetchIntercept.register(cookieInterceptor)
fetchIntercept.register(headersInterceptor)



export default api
