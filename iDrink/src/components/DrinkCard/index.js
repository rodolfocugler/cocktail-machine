import React from 'react';
import PropTypes from 'prop-types';
import {MdStar} from 'react-icons/md';

import {Container, DetailsButton, DrinkImage, FavDiv, Menu, MenuBar} from './styles';
import cocktailMachineApi, {getDomain} from "../../services/cocktail-machine-api";
import {useHistory, useLocation} from "react-router-dom";
import {toast} from "react-toastify";

function DrinkCard({drink, onDetails, onUpdateList}) {
  const history = useHistory();
  const {search} = useLocation();

  const isPump = () => (drink.isPump !== undefined && !drink.isPump) || drink.isPump !== undefined;

  const onFavoriteHandle = async () => {
    await cocktailMachineApi(search).patch(`/drinks/favorite/id/${drink.id}`);
    onUpdateList();
  }

  const onDelete = async () => {
    await cocktailMachineApi(search).delete(`/drinks/${drink.id}`)
      .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
    onUpdateList();
  }

  return (
    <Container className={isPump() && "isPump"}>
      {!isPump() && <MenuBar>
        <FavDiv onClick={onFavoriteHandle}>
          <MdStar className={drink.isFavorite && "fav"}></MdStar>
        </FavDiv>

        <Menu className="menu-nav">
          <div className="dropdown-container" tabIndex="-1">
            <div className="three-dots"></div>
            <div className="dropdown">
              <div className={"menu-option"}
                   onClick={() => history.push(`/recipe/0?ref=${drink.id}&domain=${getDomain(search)}`)}>
                Clone
              </div>
              <div onClick={() => history.push(`/recipe/${drink.id}?domain=${getDomain(search)}`)} className={"menu-option"}>
                Edit
              </div>
              <div onClick={onDelete} className={"menu-option"}>
                Delete
              </div>
            </div>
          </div>
        </Menu>
      </MenuBar>}


      <DrinkImage>
        <img src={drink.strDrinkThumb} alt="Thumbnail"/>
      </DrinkImage>

      <span>{drink.strDrink}</span>

      <DetailsButton onClick={onDetails}>details</DetailsButton>
    </Container>
  );
}

DrinkCard.propTypes = {
  drink: PropTypes.shape({
    strDrink: PropTypes.string.isRequired,
    strDrinkThumb: PropTypes.string.isRequired,
  }).isRequired,
  onDetails: PropTypes.func.isRequired,
};

export default DrinkCard;
