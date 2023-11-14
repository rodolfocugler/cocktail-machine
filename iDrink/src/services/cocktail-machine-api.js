import axios from 'axios';

const cocktailMachineApi = axios.create({
    baseURL: 'http://rasp-pi:5000/api',
    headers: {'Content-Type': 'application/json'}
});

export default cocktailMachineApi;
