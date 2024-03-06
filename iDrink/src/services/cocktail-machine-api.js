import axios from 'axios';
import * as queryString from "querystring";

const cocktailMachineApi = (search) => axios.create({
  baseURL: `http://${cocktailMachineDomain(search)}/api`,
  headers: {'Content-Type': 'application/json'}
});


export function getDomain(search) {
  const domain = queryString.parse(search.replace('?', '')).domain
  return domain ? domain : 'pi-desktop'
}

export function cocktailMachineDomain(search) {
  return `${getDomain(search)}:5000`;
}

export default cocktailMachineApi;
