import React from 'react';
import PropTypes from 'prop-types';
import {MdStar} from 'react-icons/md';

import {Container, DrinkImage, DetailsButton, FavDiv, Menu, MenuBar} from './styles';
import cocktailMachineApi from "../../services/cocktail-machine-api";
import {useHistory} from "react-router-dom";
import {toast} from "react-toastify";

function DrinkCard({drink, type, isFavorite, onDetails, onFavoriteClick, onUpdateList}) {
    const history = useHistory();
    const isPump = () => (drink.isPump !== undefined && !drink.isPump) || drink.isPump !== undefined;

    const onFavoriteHandle = async () => {
        if (isFavorite)
            await cocktailMachineApi.delete(`/favorites/drinks/${drink.idDrink}/type/${type}`);
        else
            await cocktailMachineApi.post('/favorites', JSON.stringify({
                "recipeId": parseInt(drink.idDrink),
                "type": type
            }));

        onFavoriteClick();
    }

    const onDelete = async () => {
        await cocktailMachineApi.delete(`/recipes/${drink.idDrink}`)
            .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
        onUpdateList();
    }

    return (
        <Container className={isPump() && "isPump"}>
            {!isPump() && <MenuBar>
                <FavDiv onClick={onFavoriteHandle}>
                    <MdStar className={isFavorite && "fav"}></MdStar>
                </FavDiv>

                <Menu className="menu-nav">
                    <div className="dropdown-container" tabIndex="-1">
                        <div className="three-dots"></div>
                        <div className="dropdown">
                            {type === 1 && <div className={"menu-option"}
                                                onClick={() => history.push(`/recipe/0?ref=${drink.idDrink}`)}>
                                Clone
                            </div>}
                            {type === 2 &&
                                <div onClick={() => history.push(`/recipe/${drink.idDrink}`)} className={"menu-option"}>
                                    Edit
                                </div>}
                            {type === 2 &&
                                <div onClick={onDelete} className={"menu-option"}>
                                    Delete
                                </div>}
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
