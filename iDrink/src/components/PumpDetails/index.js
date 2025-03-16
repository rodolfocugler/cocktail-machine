import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {MdClose} from 'react-icons/md';
import colors from '../../utils/colors';
import {
  CloseButton,
  Container,
  Content,
  DrinkImage,
  DrinkInformations,
  DrinkName,
  DrinkTags,
  OrderButton,
  Overlay,
  Wrapper,
} from './styles';
import cocktailMachineApi from "../../services/cocktail-machine-api";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";

function PumpDetails({pump: pump, hidden, onClose}) {
  const [inputValue, setInputValue] = useState(45);
  const {search} = useLocation();

  function handlePrepare() {
    cocktailMachineApi(search).post(`/machines/${pump.machine.id}/ingredient/${pump.ingredientId}/ml/${inputValue}`)
      .then(() => toast.success("Drink ready", {position: toast.POSITION.BOTTOM_RIGHT}))
      .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
  }

  return (
    <Wrapper hidden={hidden}>
      <Overlay hidden={hidden} onClick={onClose}/>
      {pump &&
        <Container hidden={hidden}>
          <CloseButton onClick={onClose}>
            <MdClose color={colors.primaryColor} size={48}/>
          </CloseButton>

          {pump.name && <DrinkImage>
            <img src={`https://www.thecocktaildb.com/images/ingredients/${pump.name}.png`} alt="Thumbnail"/>
          </DrinkImage>}

          <DrinkName>{pump.name}</DrinkName>

          <OrderButton onClick={handlePrepare}>Prepare</OrderButton>

          <DrinkTags>

          </DrinkTags>

          <DrinkInformations>
            <div>
              <i></i>
              {!!pump.machine && pump.machine.name}
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
        </Container>}
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
