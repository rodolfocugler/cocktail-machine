import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {MdClose} from 'react-icons/md';
import api from '../../services/api';

import alcoholic from '../../assets/alcoholic.svg';
import glass from '../../assets/glass.svg';

import colors from '../../utils/colors';
import {
  CloseButton,
  Container,
  Content,
  DrinkImage,
  DrinkInformations,
  DrinkIngredients,
  DrinkInstructions,
  DrinkName,
  DrinkTags,
  OrderButton,
  Overlay,
  Wrapper,
} from './styles';
import cocktailMachineApi from "../../services/cocktail-machine-api";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";

const amountIngredients = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ];

function DrinkDetails({drink: drink_id, type, hidden, onClose, pumps}) {
  const [ drink, setDrink ] = useState({});
  const [ prepareEnabled, setPrepareEnabled ] = useState(false);
  const [ disabledIngredients, setDisabledIngredients ] = useState(new Set());
  const {search} = useLocation();

  function handlePrepare() {
    cocktailMachineApi(search).post(`/commands/recipe/id/${drink_id}/type/${type}`,
      JSON.stringify({disabledIngredients: Array.from(disabledIngredients)}))
      .then(() => toast.success("Drink ready", {position: toast.POSITION.BOTTOM_RIGHT}))
      .catch((e) => {
        if (e.response.status === 400) {
          toast.error(e.response.data.message.message, {position: toast.POSITION.BOTTOM_RIGHT});
        } else {
          toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT});
        }
      });
  }

  useEffect(() => {
    async function loadDrink() {
      let response;
      if (type === 1) {
        response = await api.get('lookup.php', {params: {i: drink_id}});
      } else {
        response = await cocktailMachineApi(search).get(`recipes/${drink_id}`);
      }

      setDrink(response.data.drinks[0]);
      let pumpNames = pumps.map((p) => p.name.toLowerCase());
      setPrepareEnabled(amountIngredients.some((index) => response.data.drinks[0][`strIngredient${index}`] && pumpNames.indexOf(response.data.drinks[0][`strIngredient${index}`].toLowerCase()) > -1));
    }

    if (drink_id) {
      setDisabledIngredients(new Set());
      loadDrink();
    }
  }, [ drink_id ]);

  const disableIngredient = (index) => {
    disabledIngredients.has(index) ? disabledIngredients.delete(index) : disabledIngredients.add(index)
    setDisabledIngredients(new Set(disabledIngredients.values()));
  }

  return (<Wrapper hidden={hidden}>
    <Overlay hidden={hidden} onClick={onClose}/>

    <Container hidden={hidden}>
      <CloseButton onClick={onClose}>
        <MdClose color={colors.primaryColor} size={48}/>
      </CloseButton>

      <DrinkImage>
        <img src={drink.strDrinkThumb} alt="Thumbnail"/>
      </DrinkImage>

      <DrinkName>
        {drink.strDrink}
      </DrinkName>

      {prepareEnabled && <OrderButton onClick={handlePrepare}>Prepare</OrderButton>}
      {!prepareEnabled && <OrderButton className={"disabled"}>Drink not possible</OrderButton>}

      <DrinkTags>
        {drink.tags && drink.tags.join(',').map((tag) => <span>{tag}</span>)}
      </DrinkTags>

      <DrinkInformations>
        <div>
          <i>
            <img src={alcoholic} alt="Alcoholic" width="18"/>
          </i>
          <span>{drink.strAlcoholic}</span>
        </div>

        <div>
          <i>
            <img src={glass} alt="Glass" width="18"/>
          </i>
          <span>{drink.strGlass}</span>
        </div>
      </DrinkInformations>

      <Content>
        <DrinkIngredients>
          <span>ingredients</span>
          <ul>
            {amountIngredients.map((index) => {
              if (drink[`strIngredient${index}`]) {
                return (<li key={drink[`strIngredient${index}`]}>
                      <span onClick={() => disableIngredient(index)}
                            className={disabledIngredients.has(index) ? "disabled" : undefined}>
                        {drink[`strIngredient${index}`]}
                      </span>

                  {drink[`strMeasure${index}`] && (<small>{drink[`strMeasure${index}`]}</small>)}
                </li>);
              }
              return null;
            })}
          </ul>
        </DrinkIngredients>

        {drink.strInstructions && (<DrinkInstructions>
          <p>{drink.strInstructions}</p>
        </DrinkInstructions>)}
      </Content>
    </Container>
  </Wrapper>);
}

DrinkDetails.propTypes = {
  drink: PropTypes.string, hidden: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired,
};

DrinkDetails.defaultProps = {
  drink: null,
};

export default DrinkDetails;
