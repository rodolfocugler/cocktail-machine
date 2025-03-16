import React, {useEffect, useState} from 'react';
import {AiOutlineReload} from 'react-icons/ai';

import SidebarMenu from '../../components/SidebarMenu';
import FiltersGroup from '../../components/FiltersGroup';
import DrinkCard from '../../components/DrinkCard';
import DrinkDetails from '../../components/DrinkDetails';

import colors from '../../utils/colors';
import {Container, Drinks, Filters, RandomButton, Wrapper} from './styles';
import cocktailMachineApi from "../../services/cocktail-machine-api";
import PumpDetails from "../../components/PumpDetails";
import {useLocation} from "react-router-dom";

function Home() {
  const [drinks, setDrinks] = useState([]);
  const [machine, setMachine] = useState([]);
  const [filteredDrinks, setFilteredDrinks] = useState([]);
  const [category, setCategory] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [drinkDetails, setDrinkDetails] = useState(null);
  const [pumpDetails, setPumpDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const {search} = useLocation();

  async function loadDrinks() {
    let response;
    let auxDrinkType = 1;
    const machineResponse = await cocktailMachineApi(search).get('/machines');
    setMachine(machineResponse.data[0]);
    if (category === 'Random Cocktail') {
      response = await cocktailMachineApi(search).get('/drinks/random');
      response.data = [response.data];
    } else if (category === 'Favorites') {
      response = await cocktailMachineApi(search).get('/drinks/favorites');
    } else if (category === 'Bottles') {
      response = {
        data: machineResponse.data[0].pumps.filter(p => p.name).map(p => {
          p.machine = machineResponse.data[0];
          return {
            strDrink: `${p.name}`,
            strDrinkThumb: `https://www.thecocktaildb.com/images/ingredients/${p.name}.png`,
            isPump: true,
            pump: p
          }
        })
      };
    } else {
      response = await cocktailMachineApi(search).get(`/drinks?filter=${category}`);
    }

    setDrinks(response.data);
    setFilteredDrinks(response.data);
    setLoading(false);
  }

  useEffect(() => {
    if (category) {
      setLoading(true);
      setFilterValue('');

      loadDrinks();
    }
  }, [category]);

  async function handleFilter() {
    setLoading(true);

    if (filterValue) {
      const response = await cocktailMachineApi(search).get(`/drinks?filter=${filterValue}`);

      if (response.data) {
        setFilteredDrinks(response.data);
      } else {
        setFilteredDrinks([]);
      }
    } else {
      setFilteredDrinks(drinks);
    }

    setLoading(false);
  }

  async function handleRandomCocktail() {
    setLoading(true);
    const response = await cocktailMachineApi(search).get('/drinks/random');
    response.data = [response.data];
    setDrinks(response.data);
    setFilteredDrinks(response.data);
    setLoading(false);
  }

  return (<>
    <DrinkDetails
      drink={drinkDetails}
      hidden={drinkDetails === null}
      machineId={machine.id}
      pumps={machine.pumps}
      onClose={() => {
        setDrinkDetails(null);
      }}
    />

    <PumpDetails
      pump={pumpDetails}
      hidden={pumpDetails === null}
      onClose={() => {
        setPumpDetails(null);
      }}
    />

    <Wrapper>
      <SidebarMenu
        onSelect={(value) => {
          setCategory(value);
        }}
      />

      <Container>
        <header>
          <h1>{category || 'Drinks'}</h1>
        </header>

        <Filters>
          <section>
            <FiltersGroup
              onChangeFilterValue={(e) => {
                setFilterValue(e.target.value);
              }}
              inputValue={filterValue}
              handleFilter={handleFilter}
            />
          </section>
        </Filters>

        {loading ? (<AiOutlineReload
          className="loading"
          size={100}
          color={colors.primaryColor}
        />) : (<Drinks>
          <h4>
            choose your drink
            {category === "Random Cocktail" &&
              <RandomButton onClick={handleRandomCocktail}> random </RandomButton>}
          </h4>

          <ul>
            {filteredDrinks.map((drink) => (<DrinkCard
              onUpdateList={loadDrinks}
              key={String(drink.id)}
              drink={drink}
              onDetails={() => {
                if ((drink.isPump !== undefined && !drink.isPump) || drink.isPump !== undefined) {
                  setPumpDetails(drink.pump);
                } else {
                  setDrinkDetails(drink.id);
                }
              }}
            />))}
          </ul>
        </Drinks>)}
      </Container>
    </Wrapper>
  </>);
}

export default Home;
