import React, {useState, useEffect} from 'react';
import {AiOutlineReload} from 'react-icons/ai';
import api from '../../services/api';

import SidebarMenu from '../../components/SidebarMenu';
import FiltersGroup from '../../components/FiltersGroup';
import DrinkCard from '../../components/DrinkCard';
import DrinkDetails from '../../components/DrinkDetails';

import colors from '../../utils/colors';
import {Wrapper, Container, Filters, Drinks, RandomButton} from './styles';
import cocktailMachineApi from "../../services/cocktail-machine-api";
import PumpDetails from "../../components/PumpDetails";

function Home() {
    const [drinks, setDrinks] = useState([]);
    const [pumps, setPumps] = useState([]);
    const [filteredDrinks, setFilteredDrinks] = useState([]);
    const [category, setCategory] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [filterValue, setFilterValue] = useState('');
    const [drinkDetails, setDrinkDetails] = useState(null);
    const [pumpDetails, setPumpDetails] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDrinks() {
            let response;
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?strCategory=${category}`;
            window.history.pushState({path: newurl}, '', newurl);

            if (category === 'Random Cocktail') {
                response = await api.get('random.php');
            } else if (category === 'Favorities') {
                response = await cocktailMachineApi.get('/favorites/drinks');
            } else if (category === 'Bottles') {
                const pumpsDrinks = pumps.map(p => {
                    return {
                        strDrink: `${p.name}`,
                        strDrinkThumb: `https://www.thecocktaildb.com/images/ingredients/${p.name}.png`,
                        isPump: true,
                        idDrink: p.id
                    }
                });

                response = {
                    data: {
                        drinks: pumpsDrinks,
                    }
                };
            } else {
                response = await api.get('/filter.php', {
                    params: {
                        c: category.replace(' ', '_'),
                    },
                });
            }

            setDrinks(response.data.drinks);
            setFilteredDrinks(response.data.drinks);
            setLoading(false);
        }

        if (category) {
            setLoading(true);
            setFilterValue('');

            loadDrinks();
        }
    }, [category]);

    useEffect(() => {
        async function loadData() {
            loadFavorites();
            const pumpsResponse = await cocktailMachineApi.get('/pumps');
            setPumps(pumpsResponse.data);
            setLoading(false);
        }

        setLoading(true);
        loadData();
    }, []);

    async function handleFilter() {
        setLoading(true);

        let resp = []
        if (filterValue) {
            if (filterType === "all" || filterType === 'name') {
                const response = await api.get('search.php', {params: {s: filterValue}});

                if (response.data.drinks) {
                    resp = resp.concat(response.data.drinks);
                }
            }
            if (filterType === "all" || filterType === 'ingredient') {
                const response = await api.get('filter.php', {params: {i: filterValue}});
                if (response.data.drinks) {
                    resp = resp.concat(response.data.drinks);
                }
            }

            if (resp) {
                setFilteredDrinks([...new Map(resp.map(d => [d.idDrink, d])).values()]);
            } else {
                setFilteredDrinks([]);
            }
        } else {
            setFilteredDrinks(drinks);
        }

        setLoading(false);
    }

    async function loadFavorites() {
        const favoritesResponse = await cocktailMachineApi.get('/favorites');
        setFavorites(!!favoritesResponse.data ? favoritesResponse.data.map(f => f.recipeid) : []);
    }

    async function handleRandomCocktail() {
        setLoading(true);
        const response = await api.get('random.php');
        setDrinks(response.data.drinks);
        setFilteredDrinks(response.data.drinks);
        setLoading(false);
    }

    return (<>
        <DrinkDetails
            drink={drinkDetails}
            hidden={drinkDetails === null}
            pumps={pumps}
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
                            onSelectFilterType={(e) => {
                                setFilterType(e.target.value);
                            }}
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
                            onFavoriteClick={loadFavorites}
                            isFavorite={favorites.indexOf(parseInt(drink.idDrink)) > -1}
                            key={String(drink.idDrink)}
                            drink={drink}
                            onDetails={() => {
                                if ((drink.isPump !== undefined && !drink.isPump) || drink.isPump !== undefined)
                                    setPumpDetails(drink.idDrink);
                                else
                                    setDrinkDetails(drink.idDrink);
                            }}
                        />))}
                    </ul>
                </Drinks>)}
            </Container>
        </Wrapper>
    </>);
}

export default Home;
