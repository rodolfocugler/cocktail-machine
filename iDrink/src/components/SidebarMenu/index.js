import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {GoTriangleRight} from 'react-icons/go';
import {GiHamburgerMenu} from 'react-icons/gi';
import {MdClose} from 'react-icons/md';
import api from '../../services/api';

import colors from '../../utils/colors';
import logo from '../../assets/logo.svg';

import {CategoryListItem, CircleIcon, Container, Content, MobileMenuButton,} from './styles';
import cocktailMachineApi, {cocktailMachineDomain, getDomain} from "../../services/cocktail-machine-api";
import useWebSocket from "react-use-websocket";
import {useHistory, useLocation} from "react-router-dom";
import * as queryString from "querystring";

function SidebarMenu({onSelect, selected}) {
  const [ categories, setCategories ] = useState([]);
  const [ filteredCategories, setFilteredCategories ] = useState([]);
  const [ selectedCategory, setSelectedCategory ] = useState('');
  const [ filterTimeout, setFilterTimeout ] = useState(null);
  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false);
  const [ machines, setMachines ] = useState([]);
  const [ machineStatus, setMachineStatus ] = useState("");
  const {search} = useLocation();
  const [ socketUrl ] = useState(`ws://${cocktailMachineDomain(search)}/echo`);
  const history = useHistory();
  const {lastMessage} = useWebSocket(socketUrl, {
    onError: (event) => console.log(event),
    onOpen: (event) => console.log(event),
    shouldReconnect: () => {
      return window.location.pathname === "/";
    },
    retryOnError: true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(`message received: ${lastMessage.data}`)
      setMachineStatus(lastMessage.data);
    }
  }, [ lastMessage ]);

  useEffect(() => {
    async function loadCategories() {
      const response = await api.get('list.php', {
        params: {
          c: 'list',
        },
      });

      response.data.drinks = response.data.drinks.sort(function (a, b) {
        if (a.strCategory < b.strCategory) return -1;
        return 1;
      });

      response.data.drinks = [ {"strCategory": "Favorites"}, {"strCategory": "Custom Recipes"} ].concat(response.data.drinks);
      response.data.drinks.push({"strCategory": "Random Cocktail"});
      response.data.drinks.push({"strCategory": "Bottles"});

      setCategories(response.data.drinks);
      setFilteredCategories(response.data.drinks);
      const query = queryString.parse(search.replace("?", ""))
      if (!!selected)
        setSelectedCategory(selected);
      else if (query.strCategory)
        setSelectedCategory(query.strCategory);
      else
        setSelectedCategory(response.data.drinks[0].strCategory);
    }

    async function loadMachines() {
      const response = await cocktailMachineApi(search).get("/machines");
      setMachines(response.data);
    }

    loadMachines();
    loadCategories();
  }, []);

  useEffect(() => {
    async function pingMachine() {
      if (!!machines && machines.length > 0) {
        const response = await cocktailMachineApi(search).get(`/machines/${machines[0].id}/health`)
          .catch(() => setMachineStatus("offline"));

        if (!!response)
          setMachineStatus(response.status === 200 ? "online" : "offline");
      }
    }

    pingMachine();
  }, [ machines ])

  useEffect(() => {
    setMobileMenuOpen(false);
    onSelect(selectedCategory);
  }, [ selectedCategory, onSelect ]);

  function handleFilterCategories(event) {
    const {value} = event.target;

    if (filterTimeout) {
      clearTimeout(filterTimeout);
      setFilterTimeout(null);
    }

    setFilterTimeout(
      setTimeout(() => {
        setFilteredCategories(
          categories.filter((category) =>
            category.strCategory.toLowerCase().includes(value.toLowerCase())
          )
        );
      }, 700)
    );
  }

  return (
    <Container hidden={!mobileMenuOpen}>
      <MobileMenuButton
        onClick={() => {
          setMobileMenuOpen(!mobileMenuOpen);
        }}
      >
        {mobileMenuOpen ? (
          <MdClose color="#fff" size={30}/>
        ) : (
          <GiHamburgerMenu color="#fff" size={30}/>
        )}
      </MobileMenuButton>

      <img src={logo} alt="iDrink" width={100}/>

      <h3 style={{
        display: "flex",
        alignItems: "center"
      }}>
        <CircleIcon className={[ machineStatus, "blink" ]}></CircleIcon>
        Drinkeiro
      </h3>

      <Content>
        <header>
          <h2>categories</h2>
        </header>

        <div>
          <input
            type="text"
            placeholder="filter by name"
            onChange={handleFilterCategories}
          />

          <ul>
            {filteredCategories.map(({strCategory}) => (
              <CategoryListItem
                key={strCategory}
                selected={selectedCategory === strCategory}
                onClick={() => {
                  setSelectedCategory(strCategory);
                }}
              >
                {selectedCategory === strCategory && (
                  <GoTriangleRight color={colors.primaryColor} size={20}/>
                )}
                {strCategory}
              </CategoryListItem>
            ))}

            <CategoryListItem
              selected={selectedCategory === "Settings"}
              onClick={() => history.push(`/settings?domain=${getDomain(search)}`)}>
              {selectedCategory === "Settings" && (
                <GoTriangleRight color={colors.primaryColor} size={20}/>
              )}
              settings
            </CategoryListItem>

            <CategoryListItem
              selected={selectedCategory === "Recipes"}
              onClick={() => history.push(`/recipe/0?domain=${getDomain(search)}`)}>
              {selectedCategory === "Recipes" && (
                <GoTriangleRight color={colors.primaryColor} size={20}/>
              )}
              recipes
            </CategoryListItem>

            <CategoryListItem
              selected={selectedCategory === "History"}
              onClick={() => history.push(`/history?domain=${getDomain(search)}`)}>
              {selectedCategory === "History" && (
                <GoTriangleRight color={colors.primaryColor} size={20}/>
              )}
              history
            </CategoryListItem>
          </ul>
        </div>
      </Content>
    </Container>
  );
}

SidebarMenu.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default SidebarMenu;
