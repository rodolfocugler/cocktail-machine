import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {MdClose} from 'react-icons/md';
import api from '../../services/api';

import alcoholic from '../../assets/alcoholic.svg';
import glass from '../../assets/glass.svg';

import colors from '../../utils/colors';
import {
  Wrapper,
  Overlay,
  Container,
  CloseButton,
  DrinkImage,
  DrinkName,
  DrinkTags,
  DrinkInformations,
  Content,
  DrinkIngredients,
  DrinkInstructions,
} from './styles';
import {OrderButton} from "./styles";
import cocktailMachineApi from "../../services/cocktail-machine-api";

const amountIngredients = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
];

function PumpDetails({pump: pump_id, hidden, onClose}) {
  const [pump, setPump] = useState({});
  const [inputValue, setInputValue] = useState(45);

  async function handlePrepare() {
    const response = await cocktailMachineApi.post(`/commands/id/${pump_id}/ml/${inputValue}`);

  }

  useEffect(() => {
    async function loadPump() {
      const response = await cocktailMachineApi.get(`/pumps/${pump_id}`);
      setPump(response.data);
    }

    if (pump_id) {
      loadPump();
    }
  }, [pump_id]);

  return (
    <Wrapper hidden={hidden}>
      <Overlay hidden={hidden} onClick={onClose}/>

      <Container hidden={hidden}>
        <CloseButton onClick={onClose}>
          <MdClose color={colors.primaryColor} size={48}/>
        </CloseButton>

        <DrinkImage>
          <img src={`https://www.thecocktaildb.com/images/ingredients/${pump.name}.png`} alt="Thumbnail"/>
        </DrinkImage>

        <DrinkName>{pump.name}</DrinkName>

        <OrderButton onClick={handlePrepare}>Prepare</OrderButton>

        <DrinkTags>

        </DrinkTags>

        <DrinkInformations>
          <div>
            <i></i>
            {!!pump.machine && `${pump.machine.name} (${pump.machine.domain})`}
          </div>
        </DrinkInformations>

        <DrinkInformations>
          <div>
            <i></i>
            Port {pump.port}
          </div>

          <div>
            <i></i>
            {pump.flowRateInMlPerSec} ml per second
          </div>
        </DrinkInformations>

        <Content>
          <span>quantity in ml</span>
          <input
            type="number"
            min={0}
            max={500}
            step={1}
            name="quantity"
            placeholder="45"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
        </Content>
      </Container>
    </Wrapper>
  );
}

PumpDetails.propTypes = {
  pump: PropTypes.string,
  hidden: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

PumpDetails.defaultProps = {
  pump: null,
};

export default PumpDetails;
