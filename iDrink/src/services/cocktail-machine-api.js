import axios from 'axios';

const cocktailMachineApi = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {'Content-Type': 'application/json'}
});

export default cocktailMachineApi;
