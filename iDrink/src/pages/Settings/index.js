import React, {useEffect, useState} from 'react';
import SidebarMenu from "../../components/SidebarMenu";
import {Container, Wrapper} from "../Home/styles";
import {useHistory, useLocation} from "react-router-dom";
import cocktailMachineApi, {getDomain} from "../../services/cocktail-machine-api";
import {AiOutlineReload} from "react-icons/ai";
import colors from "../../utils/colors";
import {Button, Table} from "./styles";
import {toast} from "react-toastify";

function Settings() {
  const history = useHistory();
  const [ pumps, setPumps ] = useState([]);
  const [ machines, setMachines ] = useState([]);
  const [ machine, setMachine ] = useState({"name": "", "domain": ""});
  const [ pump, setPump ] = useState({
    "name": "",
    "port": 0,
    "flowRateInMlPerSec": 10,
    "ingredientId": 1,
    "machineId": 1
  });
  const [ loading, setLoading ] = useState(true);
  const {search} = useLocation();

  const onPumpSave = async (index) => {
    if (index > -1) {
      const p = {...pumps[index]};
      p.machineId = p.machine.id;
      delete p.machine
      await cocktailMachineApi(search).put(`/pumps/${p.id}`, JSON.stringify(p))
        .then(() => toast.success("Saved", {position: toast.POSITION.BOTTOM_RIGHT}))
        .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
    } else {
      await cocktailMachineApi(search).post(`/pumps`, JSON.stringify(pump))
        .then(() => toast.success("Saved", {position: toast.POSITION.BOTTOM_RIGHT}))
        .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
      await loadPumps();
      setPump({
        "name": "",
        "port": 0,
        "flowRateInMlPerSec": 10,
        "ingredientId": 1,
        "machineId": 1
      });
    }
  }

  async function onTrigger(index) {
    await cocktailMachineApi(search).post(`/commands/id/${pumps[index].id}/seconds/10`)
      .then(() => toast.success("Triggered", {position: toast.POSITION.BOTTOM_RIGHT}))
      .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
  }

  async function onPumpDelete(index) {
    await cocktailMachineApi(search).delete(`/pumps/${pumps[index].id}`)
      .then(() => toast.success("Deleted", {position: toast.POSITION.BOTTOM_RIGHT}))
      .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
    setPumps([ ...pumps.slice(0, index).concat(pumps.slice(index + 1, pumps.length)) ]);
  }

  async function onMachineDelete(index) {
    await cocktailMachineApi(search).delete(`/machines/${machines[index].id}`)
      .then(() => toast.success("Deleted", {position: toast.POSITION.BOTTOM_RIGHT}))
      .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
    setMachines([ ...machines.slice(0, index).concat(machines.slice(index + 1, machines.length)) ]);
  }

  const onMachineSave = async (index) => {
    if (index > -1) {
      await cocktailMachineApi(search).put(`/machines/${machines[index].id}`, JSON.stringify(machines[index]))
        .then(() => toast.success("Saved", {position: toast.POSITION.BOTTOM_RIGHT}))
        .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
    } else {
      await cocktailMachineApi(search).post(`/machines`, JSON.stringify(machine))
        .then(() => toast.success("Saved", {position: toast.POSITION.BOTTOM_RIGHT}))
        .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
      setMachine({"name": "", "domain": ""});
      await loadMachines();
    }
  }

  const loadMachines = async () => {
    const machineResponse = await cocktailMachineApi(search).get('/machines');
    setMachines(!!machineResponse.data ? machineResponse.data : []);
  }

  const loadPumps = async () => {
    const pumpResponse = await cocktailMachineApi(search).get('/pumps');
    setPumps(!!pumpResponse.data ? pumpResponse.data : []);
  }

  useEffect(() => {
    async function loadData() {
      await loadPumps();
      await loadMachines();
      setLoading(false);
    }

    setLoading(true);
    loadData();
  }, []);

  const setPumpValue = (value, index, name) => {
    pumps[index][name] = value;
    setPumps([ ...pumps ]);
  }

  const setMachineValue = (value, index, name) => {
    machines[index][name] = value;
    setMachines([ ...machines ]);
  }

  const updatePump = (value, field) => {
    const p = {...pump}
    p[field] = value;
    setPump(p);
  }

  return (<>
      <Wrapper>
        <SidebarMenu
          selected={"Settings"}
          onSelect={(value) => {
            if (value !== "Settings" && value !== "") history.push(`/?strCategory=${value}&domain=${getDomain(search)}`);
          }}
        />

        <Container>
          {loading ? (<AiOutlineReload
            className="loading"
            size={100}
            color={colors.primaryColor}
          />) : (<>
            <Table>
              <caption>Machines</caption>
              <thead>
              <tr>
                <td style={{textAlign: "center"}}>Id</td>
                <td style={{textAlign: "center"}}>Name</td>
                <td style={{textAlign: "center"}}>Domain</td>
                <td width={105} style={{textAlign: "center"}}>Save</td>
                <td width={105} style={{textAlign: "center"}}>Delete</td>
              </tr>
              </thead>
              <tbody>
              {machines.map((m, index) => (<tr key={m.id}>
                <td style={{textAlign: "center"}}>{m.id}</td>
                <td>
                  {<input
                    type="text"
                    name="quantity"
                    placeholder="Name"
                    value={m.name}
                    onChange={(e) => {
                      setMachineValue(e.target.value, index, "name");
                    }}
                  />}
                </td>
                <td>{<input
                  type="text"
                  name="domain"
                  placeholder="Domain"
                  value={m.domain}
                  onChange={(e) => {
                    setMachineValue(e.target.value, index, "domain");
                  }}
                />}</td>
                <td>
                  <Button onClick={() => onMachineSave(index)}>save</Button>
                </td>
                <td>
                  <Button onClick={() => onMachineDelete(index)}>delete</Button>
                </td>
              </tr>))}
              <tr>
                <td style={{textAlign: "center"}}>0</td>
                <td>
                  <input
                    type="text"
                    name="quantity"
                    placeholder="Name"
                    value={machine.name}
                    onChange={e => setMachine({"domain": machine.domain, "name": e.target.value})}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="domain"
                    placeholder="Domain"
                    value={machine.domain}
                    onChange={e => setMachine({"name": machine.name, "domain": e.target.value})}
                  />
                </td>
                <td>
                  <Button onClick={() => onMachineSave(-1)}>save</Button>
                </td>
                <td></td>
              </tr>
              </tbody>
            </Table>
            <hr className="solid"/>
            <Table>
              <caption>Pumps</caption>
              <thead>
              <tr>
                <td style={{textAlign: "center"}}>Id</td>
                <td style={{textAlign: "center"}}>Name</td>
                <td style={{textAlign: "center"}}>Port</td>
                <td style={{textAlign: "center"}}>Flow rate</td>
                <td style={{textAlign: "center"}}>Ingredient Id</td>
                <td style={{textAlign: "center"}}>Machine Id</td>
                <td width={105} style={{textAlign: "center"}}>Save</td>
                <td width={105} style={{textAlign: "center"}}>Delete</td>
                <td width={105} style={{textAlign: "center"}}>Trigger (10s)</td>
              </tr>
              </thead>
              <tbody>
              {pumps.map((p, index) => (<tr key={p.id}>
                <td style={{textAlign: "center"}}>
                  {p.id}
                </td>
                <td>
                  {<input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={p.name}
                    onChange={(e) => {
                      setPumpValue(e.target.value, index, "name");
                    }}
                  />}
                </td>
                <td>
                  {<input
                    type="number"
                    min={0}
                    max={50}
                    step={1}
                    name="port"
                    placeholder="Port"
                    value={p.port}
                    onChange={(e) => {
                      setPumpValue(e.target.value, index, "port");
                    }}
                  />}
                </td>
                <td>
                  {<input
                    type="number"
                    min={0}
                    max={500}
                    name="flowRateInMlPerSec"
                    placeholder="Flow Rate in ml/s"
                    value={p.flowRateInMlPerSec}
                    onChange={(e) => {
                      setPumpValue(e.target.value, index, "flowRateInMlPerSec");
                    }}
                  />}
                </td>
                <td>
                  {<input
                    type="number"
                    min={0}
                    max={500}
                    step={1}
                    name="Ingredient Id"
                    placeholder="ingredientId"
                    value={p.ingredientId}
                    onChange={(e) => {
                      setPumpValue(e.target.value, index, "ingredientId");
                    }}
                  />}
                </td>
                <td style={{textAlign: "center"}}>{p.machine.id}</td>
                <td>
                  <Button onClick={() => onPumpSave(index)}>save</Button>
                </td>
                <td>
                  <Button onClick={() => onPumpDelete(index)}>delete</Button>
                </td>
                <td>
                  <Button onClick={() => onTrigger(index)}>trigger</Button>
                </td>
              </tr>))}
              <tr>
                <td style={{textAlign: "center"}}>0</td>
                <td>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={pump.name}
                    onChange={e => updatePump(e.target.value, "name")}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    step={1}
                    name="port"
                    placeholder="Port"
                    value={pump.port}
                    onChange={e => updatePump(e.target.value, "port")}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    name="flowRateInMlPerSec"
                    placeholder="Flow Rate in ml/s"
                    value={pump.flowRateInMlPerSec}
                    onChange={e => updatePump(e.target.value, "flowRateInMlPerSec")}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    step={1}
                    name="Ingredient Id"
                    placeholder="ingredientId"
                    value={pump.ingredientId}
                    onChange={e => updatePump(e.target.value, "ingredientId")}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    step={1}
                    name="Machine Id"
                    placeholder="machineId"
                    value={pump.machineId}
                    onChange={e => updatePump(e.target.value, "machineId")}
                  />
                </td>
                <td>
                  <Button onClick={() => onPumpSave(-1)}>save</Button>
                </td>
                <td>
                </td>
                <td>
                </td>
              </tr>
              </tbody>
            </Table>
            <hr className="solid"/>
            <div style={{marginTop: "20px"}}>
              <Button onClick={() => history.push("/recipe/0")}>new recipe</Button>
            </div>
          </>)}
        </Container>
      </Wrapper>
    </>
  );
}

export default Settings;
