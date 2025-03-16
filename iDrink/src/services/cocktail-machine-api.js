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
  if (search.indexOf("pump") >= 0)
    return `${getDomain(search).replace("pump","")}:5000`;

  return `${getDomain(search)}:5001`;
}

export default cocktailMachineApi;
