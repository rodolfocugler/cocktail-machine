import styled from 'styled-components';

import colors from '../../utils/colors';

export const Container = styled.div`
  width: 250px;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, ${colors.primaryColor} 40%, #fff 0%);
  border: 2px solid ${colors.primaryColor};
  border-radius: 4px;
  box-shadow: 5px 7px 7px 0px rgba(0, 0, 0, 0.2);
  padding: 10px 25px 20px 25px;
  margin: 20px 15px 20px 15px;

  &.isPump {
    padding: 30px 25px 20px 25px;
  }

  span {
    font-size: 16px;
    margin-top: 20px;
    text-align: center;
  }
`;

export const FavDiv = styled.div`
  color: white;

  & :first-child {
    cursor: pointer;
    width: 25px;
    height: 25px;

    & :hover {
      color: #005c9e;
      width: 30px;
      height: 30px;
    }
  }

  & .fav {
    color: #005c9e;
    & :hover {
      color: white;
      width: 30px;
      height: 30px;
    }
  }
`;

export const MenuBar = styled.div`
  display: flex;
  width: 115%;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;

export const Menu = styled.div`
  display: flex;
  justify-content: space-between;

  .menu-item {
    color: #FCC;
    padding: 3px;
  }

  .three-dots:after {
    cursor: pointer;
    color: white;
    content: '\\22EE';
    font-size: x-large;
    font-weight: bold;
    margin-right: 10px;
  }

  .dropdown {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    background-color: ${colors.backgroundColor};
    border-radius: 5%;
    min-width: 130px;

    outline: none;
    opacity: 0;
    z-index: -1;
    max-height: 0;
    transition: opacity 0.1s, z-index 0.1s, height 5s;
  }

  .menu-option {
    cursor: pointer;
    text-decoration: none;
    font-size: 16px;
    color: ${colors.textColor};

    padding: 10px 10px;
    border-radius: 5%;
    text-align: center;

    &:hover {
      color: ${colors.backgroundColor};
      background-color: ${colors.secondaryColor};
      font-weight: bold;
    }
  }

  .dropdown-container:focus {
    outline: none;
    position: relative;
    display: inline-block;
  }

  .dropdown-container:focus .dropdown {
    opacity: 1;
    z-index: 100;
    max-height: 100vh;
    transition: opacity 0.2s, z-index 0.2s, height 0.2s;
  }
`;

export const DrinkImage = styled.div`
  width: 130px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.backgroundColor};
  border: 5px solid ${colors.primaryColor};
  border-radius: 50%;

  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }
`;

export const DetailsButton = styled.button.attrs({
  type: 'button',
})`
  width: 100%;
  background: ${colors.primaryColor};
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 5px 20px;
  margin-top: auto;
  transition: background 300ms;

  &:hover {
    background: ${colors.secondaryColor};
  }
`;
