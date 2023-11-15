import axios from 'axios';

const cocktailMachine = {}
const cocktailMachineApi = axios.create({
  baseURL: `http://${cocktailMachineDomain()}/api`,
  headers: {'Content-Type': 'application/json'}
});


export function cocktailMachineDomain() {
  return "rasp-pi:5000";
}

export default cocktailMachineApi;
