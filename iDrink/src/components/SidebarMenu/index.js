import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {GoTriangleRight} from 'react-icons/go';
import {GiHamburgerMenu} from 'react-icons/gi';
import {MdClose} from 'react-icons/md';

import colors from '../../utils/colors';
import logo from '../../assets/logo.svg';

import {CategoryListItem, CircleIcon, Container, Content, MobileMenuButton,} from './styles';
import cocktailMachineApi, {getDomain} from "../../services/cocktail-machine-api";
import {useHistory, useLocation} from "react-router-dom";
import * as queryString from "querystring";

function SidebarMenu({onSelect, selected}) {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterTimeout, setFilterTimeout] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [machineStatus, setMachineStatus] = useState("");
  const {search} = useLocation();
  const history = useHistory();

  useEffect(() => {
    async function loadCategories() {
      const response = await cocktailMachineApi(search).get('/categories');

      response.data = response.data.sort(function (a, b) {
        if (a.strCategory < b.strCategory) return -1;
        return 1;
      });

      response.data = [{"strCategory": "Favorites"}].concat(response.data);
      response.data.push({"strCategory": "Random Cocktail"});
      response.data.push({"strCategory": "Bottles"});

      setCategories(response.data);
      setFilteredCategories(response.data);
      const query = queryString.parse(search.replace("?", ""))
      if (!!selected)
        setSelectedCategory(selected);
      else if (query.strCategory)
        setSelectedCategory(query.strCategory);
      else
        setSelectedCategory(response.data[0].strCategory);
    }

    loadCategories();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    onSelect(selectedCategory);
  }, [selectedCategory, onSelect]);

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
        <CircleIcon className={[machineStatus, "blink"]}></CircleIcon>
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
