import React, {useEffect, useState} from 'react';
import SidebarMenu from "../../components/SidebarMenu";
import {Container, Drinks, Wrapper} from "../Home/styles";
import {useHistory, useLocation} from "react-router-dom";
import HistoryCard from "../../components/HistoryCard";
import cocktailMachineApi, {getDomain} from "../../services/cocktail-machine-api";
import {AiOutlineReload} from "react-icons/ai";
import colors from "../../utils/colors";

function History() {
  const history = useHistory();
  const [ histories, setHistories ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const {search} = useLocation();


  useEffect(() => {
    async function loadHistories() {
      const response = await cocktailMachineApi(search).get('/histories');
      setHistories(!!response.data ? response.data : []);
      setLoading(false);
    }

    setLoading(true);
    loadHistories();
  }, []);

  return (<>
    <Wrapper>
      <SidebarMenu
        selected={"History"}
        onSelect={(value) => {
          if (value !== "History" && value !== "") history.push(`/?strCategory=${value}&domain=${getDomain(search)}`);
        }}
      />

      <Container>
        <Drinks>
          <ul>
            {loading ? (<AiOutlineReload
              className="loading"
              size={100}
              color={colors.primaryColor}
            />) : (histories.map((history) => (<HistoryCard key={history} history={history}></HistoryCard>)))}
          </ul>
        </Drinks>
      </Container>
    </Wrapper>
  </>);
}

export default History;
