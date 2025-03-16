import React, {useEffect, useState} from 'react';
import SidebarMenu from "../../components/SidebarMenu";
import {Container, Wrapper} from "../Home/styles";
import cocktailMachineApi, {getDomain} from "../../services/cocktail-machine-api";
import {AiOutlineReload} from "react-icons/ai";
import colors from "../../utils/colors";
import {Button, Content, Table} from "./styles";
import {useHistory, useLocation} from "react-router-dom";
import {toast} from "react-toastify";

function Settings() {
  const history = useHistory();
  const [machine, setMachine] = useState({"name": ""});
  const [loading, setLoading] = useState(true);
  const [pump, setPump] = useState({
    "name": "",
    "port": -1,
    "flowRateInMlPerSec": 0,
    "ingredientId": ""
  });
  const {search} = useLocation();

  async function onTrigger(id, name) {
    await cocktailMachineApi(search).post(`machines/${id}/name/${name}/seconds/10`)
      .then(() => toast.success("Triggered", {position: toast.POSITION.BOTTOM_RIGHT}))
      .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
  }


  const onMachineSave = async (id) => {
    await cocktailMachineApi(search).put(`/machines/${id}`, JSON.stringify(machine))
      .then(() => toast.success("Saved", {position: toast.POSITION.BOTTOM_RIGHT}))
      .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
  }

  const loadMachines = async () => {
    const response = await cocktailMachineApi(search).get('/machines');
    setMachine(!!response.data ? response.data[0] : {name: "error"});
  }

  useEffect(() => {
    async function loadData() {
      await loadMachines();
      setLoading(false);
    }

    setLoading(true);
    loadData();
  }, []);

  const setPumpValue = async (value, index, name) => {
    const m = machine;
    m.pumps[index][name] = value;
    setMachine({...machine, pumps: m.pumps});
  }

  const onPumpAdd = async () => {
    const m = machine;
    m.pumps.push(pump);
    setMachine({...machine, pumps: m.pumps});
    setPump({
      "name": "",
      "port": -1,
      "flowRateInMlPerSec": 0,
      "ingredientId": ""
    });
  }

  const onPumpDelete = async (index) => {
    const m = machine;
    m.pumps.splice(index, 1);
    setMachine({...machine, pumps: m.pumps});
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
            <Content>
              <input
                key={machine.id}
                type="text"
                name="Name"
                placeholder="Name"
                value={machine.name}
                onChange={e => setMachine({...machine, name: e.target.value})}
              />
            </Content>
            <hr className="solid"/>
            <Table>
              <caption>Pumps</caption>
              <thead>
              <tr>
                <td style={{textAlign: "center"}}>Name</td>
                <td style={{textAlign: "center"}}>Port</td>
                <td style={{textAlign: "center"}}>Flow rate</td>
                <td style={{textAlign: "center"}}>Ingredient Id</td>
                <td width={105} style={{textAlign: "center"}}>Trigger (10s)</td>
                <td width={105} style={{textAlign: "center"}}>delete</td>
              </tr>
              </thead>
              <tbody>
              {machine.pumps.map((p, index) => (<tr key={p.id}>
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
                    type="text"
                    name="Ingredient Id"
                    placeholder="ingredientId"
                    value={p.ingredientId}
                    onChange={(e) => {
                      setPumpValue(e.target.value, index, "ingredientId");
                    }}
                  />}
                </td>
                <td>
                  <Button onClick={() => onTrigger(machine.id, p.name)}>trigger</Button>
                </td>
                <td>
                  <Button onClick={() => onPumpDelete(index)}>delete</Button>
                </td>
              </tr>))}
              <tr>
                <td>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={pump.name}
                    onChange={e => setPump({...pump, name: e.target.value})}
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
                    onChange={e => setPump({...pump, port: e.target.value})}
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
                    onChange={e => setPump({...pump, flowRateInMlPerSec: e.target.value})}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="Ingredient Id"
                    placeholder="ingredientId"
                    value={pump.ingredientId}
                    onChange={e => setPump({...pump, ingredientId: e.target.value})}
                  />
                </td>
                <td>
                </td>
                <td>
                  <Button onClick={() => onPumpAdd()}>add</Button>
                </td>
              </tr>
              </tbody>
            </Table>
            <hr className="solid"/>
            <Content style={{marginTop: "20px"}}>
              <Button onClick={() => onMachineSave(machine.id)}>save</Button>

              <Button onClick={() => history.push(`/recipe/0?domain=${getDomain(search)}`)}>new recipe</Button>
            </Content>
          </>)}
        </Container>
      </Wrapper>
    </>
  );
}

export default Settings;
