import React from 'react';
import PropTypes from 'prop-types';
import {MdStar} from 'react-icons/md';

import {Container, DrinkImage, DetailsButton, FavDiv} from './styles';

function DrinkCard({drink, isFavorite, onDetails}) {
  const isPump = () => (drink.isPump !== undefined && !drink.isPump) || drink.isPump !== undefined;

  return (
    <Container className={isPump() && "isPump"}>
      {!isPump() && <FavDiv>
        <MdStar className={isFavorite && "fav"}></MdStar>
      </FavDiv>}
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
