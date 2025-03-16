import styled, {keyframes} from 'styled-components';

import colors from '../../utils/colors';
import {Button} from "../Settings/styles";

export const Wrapper = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: stretch;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: stretch;
  padding: 30px;
  overflow: auto;

  header {
    position: relative;

    &::before {
      position: absolute;
      content: '';
      width: 100%;
      height: 5px;
      display: block;
      background: ${colors.primaryColor};
      top: calc(50% - 5px);
      left: 0;
    }

    h1 {
      position: relative;
      width: max-content;
      max-width: 90%;
      background: #fff;
      font-size: 35px;
      color: ${colors.secondaryColor};
      text-align: center;
      padding: 0 15px;
      margin: 0 auto;
      z-index: 1;
    }
  }

  label {
    font-weight: bold;
  }

  input {
    margin: 5px 0 20px 0;
  }

  .ingredient {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;

    label {
      flex-grow: 1;

      :nth-child(1), :nth-child(2) {
        margin-right: 15px;
      }
    }
  }

  svg.loading {
    margin: 50px auto 0;
    animation: ${rotate} 2s linear infinite;
  }
`;

export const RemoveButton = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;

  button {
    width: 120px;
    display: flex;
    justify-content: center;
    background: ${colors.primaryColor};
    border: none;
    border-radius: 30px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    padding: 5px 20px;
    margin: auto 0 0 10px;
    transition: background 300ms;

    &:hover {
      background: ${colors.secondaryColor};
    }
  }
`;


export const ButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: auto;

  button {
    width: 120px;
    display: flex;
    justify-content: center;
    background: ${colors.primaryColor};
    border: none;
    border-radius: 30px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    padding: 5px 20px;
    margin: auto 0 0 10px;
    transition: background 300ms;

    &:hover {
      background: ${colors.secondaryColor};
    }
  }
`;
