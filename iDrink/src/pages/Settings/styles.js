import styled, {keyframes} from 'styled-components';

import colors from '../../utils/colors';

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

  svg.loading {
    margin: 50px auto 0;
    animation: ${rotate} 2s linear infinite;
  }
`;

export const Filters = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 50px;

  section {
    max-height: 1000px;
    overflow: hidden;
    transition: all 300ms, padding 300ms;
  }
`;

export const Drinks = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 50px;

  > h4 {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    color: ${colors.secondaryColor};
    font-size: 20px;
    font-weight: 400;
    text-transform: lowercase;
    margin: 0;

    &::after {
      content: '';
      display: flex;
      flex: 1;
      height: 2px;
      background: ${colors.primaryColor};
      margin-left: 10px;
    }
  }

  ul {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin: 0 -15px;
  }
`;

export const Table = styled.table`
  margin-top: 30px;
  margin-bottom: 30px;

  & caption{
    font-weight: bold;
    font-size: larger;
  }

  & thead{
    font-weight: bold;
  }
`;

export const Button = styled.button.attrs({
    type: 'button',
})`
  width: 100px;
  display: flex;
  justify-content: center;
  background: ${colors.primaryColor};
  border: none;
  border-radius: 30px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  padding: 5px 10px;
  margin: auto 0 0 auto;
  transition: background 300ms;

  &:hover {
    background: ${colors.secondaryColor};
  }
`;

export const Content = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
