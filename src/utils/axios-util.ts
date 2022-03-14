import Axios from 'axios';
import * as config from 'config';

/*
export const axiosKite = Axios.create({
  baseURL: config.get<any>('kite').apiUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
*/

export const axiosAlice = Axios.create({
  baseURL: config.get<any>('alice').apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*'
  }
});

export const axiosAliceServices = Axios.create({
  baseURL: 'https://app.aliceblueonline.com/Services/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

/*
export const axiosUpstox = Axios.create({
  baseURL: config.get<any>('upstox').apiUrl,
  headers: {
    'Content-Type': 'application/json',
  }
});
*/
