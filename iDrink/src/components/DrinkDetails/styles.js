import styled from 'styled-components';

import colors from '../../utils/colors';

export const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-end;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 999;
  transition: width 0s, height 0s;

  &[hidden] {
    width: 0px;
    height: 0px;
    transition: width 0s 501ms, height 0s 501ms;
  }
`;

export const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  opacity: 1;
  transition: width 0s, height 0s, opacity 500ms;

  &[hidden] {
    width: 0px;
    height: 0px;
    opacity: 0;
    transition: opacity 500ms, width 0s 501ms, height 0s 501ms;
  }
`;

export const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-left: 5px solid ${colors.primaryColor};
  padding: 30px 30px 30px 100px;
  transition: all 700ms, padding 0s;

  &[hidden] {
    padding: 0;
    transition: all 700ms, padding 0s 701ms;
  }

  @media only screen and (min-width: 769px) {
    &[hidden] {
      transform: translateX(1000px);
    }
  }

  @media only screen and (max-width: 768px) {
    max-width: none;
    height: 80vh;
    border: none;
    padding: 30px;
    margin-top: auto;

    &[hidden] {
      transform: translateY(1000px);
    }
  }
`;

export const CloseButton = styled.button.attrs({
  type: 'button',
})`
  position: absolute;
  background: none;
  border: none;
  top: 20px;
  right: 15px;

  &:hover {
    svg {
      color: ${colors.secondaryColor} !important;
    }
  }

  svg {
    transition: color 300ms;
  }
`;

export const DrinkImage = styled.div`
  position: absolute;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.backgroundColor};
  border: 5px solid ${colors.primaryColor};
  border-radius: 50%;
  left: calc(0% - 80px);

  @media only screen and (max-width: 768px) {
    width: 120px;
    height: 120px;
    top: calc(0% - 60px);
    left: calc(50% - 60px);
  }

  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;

    @media only screen and (max-width: 768px) {
      width: 110px;
      height: 110px;
    }
  }
`;

export const DrinkName = styled.h3`
  color: ${colors.secondaryColor};
  font-size: 20px;
  margin-top: 60px;

  @media only screen and (max-width: 768px) {
    text-align: center;
  }
`;

export const DrinkTags = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 20px 0 0 -20px;

  span {
    min-width: max-content;
    background: ${colors.primaryColor};
    border: 1.5px solid ${colors.primaryColor};
    border-radius: 30px;
    color: #fff;
    font-size: 13px;
    padding: 3px 20px;
    margin: 5px 0 5px 20px;

    & + span {
      margin-left: 20px;
    }
  }
`;

export const DrinkInformations = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;

    i {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${colors.primaryColor};
      border-radius: 50%;
      margin-right: 5px;
    }
  }
`;

export const Content = styled.section`
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  margin: 20px -20px 0 0;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.secondaryColor};
  }
`;

export const DrinkIngredients = styled.section`
  display: flex;
  flex-direction: column;

  > span {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    color: ${colors.secondaryColor};
    font-size: 18px;
    text-transform: lowercase;

    &::after {
      content: '';
      display: flex;
      flex: 1;
      height: 1.5px;
      background: ${colors.primaryColor};
      margin-left: 10px;
    }
  }

  ul {
    margin-top: 10px;

    li {
      display: flex;
      flex-direction: column;
      padding: 10px 0;

      & + li {
        border-top: 1px solid #ddd;
      }

      small {
        color: #999;
        font-size: 12px;
        font-weight: 300;
        margin: 5px 0 0 10px;
      }
    }
  }
`;

export const DrinkInstructions = styled.section`
  position: relative;
  padding-top: 20px;
  margin-top: 20px;

  &::before {
    position: absolute;
    content: '';
    width: 120px;
    height: 2px;
    display: block;
    background: ${colors.primaryColor};
    top: 0;
    left: calc(50% - 60px);
  }

  p {
    line-height: 1.5;
    text-align: justify;

    @media only screen and (max-width: 768px) {
      text-align: center;
    }
  }
`;

export const OrderButton = styled.button.attrs({
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
  margin-top: 10px;
  transition: background 300ms;

  &:hover {
    background: ${colors.secondaryColor};
  }

  &.disabled {
    background: ${colors.backgroundColor};
    color: #8d8d8d;
  }
`;
