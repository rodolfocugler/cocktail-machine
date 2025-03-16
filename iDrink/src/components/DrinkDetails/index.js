import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {MdClose} from 'react-icons/md';

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

function DrinkDetails({drink: drink_id, machineId, hidden, onClose, pumps}) {
  const [drink, setDrink] = useState({});
  const [prepareEnabled, setPrepareEnabled] = useState(false);
  const [disabledIngredients, setDisabledIngredients] = useState(new Set());
  const {search} = useLocation();

  function handlePrepare() {
    cocktailMachineApi(search).post(`machines/${machineId}/drink/${drink_id}`,
      JSON.stringify(Array.from(disabledIngredients)))
      .then(() => toast.success("Drink ready", {position: toast.POSITION.BOTTOM_RIGHT}))
      .catch((e) => {
        toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT});
      });
  }

  useEffect(() => {
    async function loadDrink() {
      let response = await cocktailMachineApi(search).get(`drinks/${drink_id}`);
      setDrink(response.data);
      let pumpNames = pumps.map((p) => p.name.toLowerCase());
      setPrepareEnabled(response.data?.strIngredient?.some((strIngredient) =>
        strIngredient.strIngredient && pumpNames.indexOf(strIngredient.strIngredient.toLowerCase()) > -1));
    }

    if (drink_id) {
      setDisabledIngredients(new Set());
      loadDrink();
    }
  }, [drink_id]);

  const disableIngredient = (strIngredient) => {
    disabledIngredients.has(strIngredient.strIngredient) ? disabledIngredients.delete(strIngredient.strIngredient) :
      disabledIngredients.add(strIngredient.strIngredient)
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
            {drink?.strIngredient?.map((strIngredient) => {
              return (<li key={strIngredient}>
                      <span onClick={() => disableIngredient(strIngredient)}
                            className={disabledIngredients.has(strIngredient.strIngredient) ? "disabled" : undefined}>
                        {strIngredient.strIngredient}
                      </span>
                {strIngredient.strMeasure && (<small>{strIngredient.strMeasure}</small>)}
              </li>);
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
