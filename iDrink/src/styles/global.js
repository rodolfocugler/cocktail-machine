import { createGlobalStyle } from 'styled-components';

import colors from '../utils/colors';

import gilroyLight from '../assets/fonts/gilroy-light.ttf';
import gilroyRegular from '../assets/fonts/gilroy-regular.ttf';
import gilroyBold from '../assets/fonts/gilroy-bold.ttf';

export default createGlobalStyle`
   @font-face {
    font-family: 'Gilroy';
    src: url(${gilroyLight}) format('truetype');
    font-weight: 300;
  }

  @font-face {
    font-family: 'Gilroy';
    src: url(${gilroyRegular}) format('truetype');
    font-weight: normal;
  }

  @font-face {
    font-family: 'Gilroy';
    src: url(${gilroyBold}) format('truetype');
    font-weight: bold;
  }

  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  *:focus {
    outline: 0;
  }

  html, body, #root {
    min-height: 100vh;
    overflow: hidden;
  }

  body {
    -webkit-font-smoothing: antialiased;
  }

  body, button, input, select {
    font: 15px 'Gilroy', sans-serif;
    color: ${colors.textColor};
  }

  a {
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  button {
    cursor: pointer;
  }

  input, select {
    width: 100%;
    height: 45px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px 10px
  }

  input:focus {
    border: 1px solid ${colors.primaryColor};
  }

  input::placeholder {
    color: #999;
  }
`;
