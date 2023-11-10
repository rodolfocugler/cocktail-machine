import styled, { css } from 'styled-components';

import colors from '../../utils/colors';

export const Container = styled.aside`
  position: relative;
  width: 300px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${colors.backgroundColor};
  border-right: 5px solid ${colors.primaryColor};
  box-shadow: 5px 0 20px -2px rgba(0, 0, 0, 0.3);
  padding: 30px 15px;
  z-index: 990;
  transition: all 300ms;

  @media only screen and (max-width: 768px) {
    position: fixed;
    transform: translateX(0);
  }

  @media only screen and (min-width: 376px) and (max-width: 768px) {
    &[hidden] {
      transform: translateX(-300px);
    }
  }

  @media only screen and (max-width: 375px) {
    width: 250px;

    &[hidden] {
      transform: translateX(-250px);
    }
  }
`;

export const MobileMenuButton = styled.button.attrs({
  type: 'button',
})`
  position: absolute;
  display: none;
  align-items: center;
  justify-content: center;
  background: ${colors.primaryColor};
  border: none;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 10px;
  right: -50px;

  @media only screen and (max-width: 768px) {
    display: flex;
  }

  @media only screen and (max-width: 375px) {
    right: -55px;
  }
`;

export const Content = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 30px;
  overflow: auto;

  header {
    position: relative;

    &::before {
      position: absolute;
      content: '';
      width: 100%;
      height: 2px;
      display: block;
      background: ${colors.primaryColor};
      top: calc(50% - 1px);
      left: 0;
    }

    h2 {
      position: relative;
      width: max-content;
      background: ${colors.backgroundColor};
      font-size: 20px;
      color: ${colors.secondaryColor};
      text-transform: lowercase;
      padding: 0 10px;
      margin: 0 auto;
      z-index: 1;
    }
  }

  div {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    overflow: auto;

    ul {
      margin-top: 20px;
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
    }
  }
`;

export const CategoryListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${colors.textColor};
  text-transform: lowercase;
  padding: 10px 0;
  cursor: pointer;
  transition: color 150ms;

  &:hover {
    color: ${colors.secondaryColor};
    font-weight: bold;
  }

  ${(props) =>
    props.selected &&
    css`
      color: ${colors.secondaryColor};
      font-weight: bold;
      transform: translateX(-6px);

      svg {
        margin-right: 5px;
      }
    `}
`;


export const CircleIcon = styled.span`
  height: 15px;
  width: 15px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
  background-color: gray;

  &.online {
    background-color: green;
  }

  &.locked {
    background-color: yellow;
  }

  &.offline {
    background-color: red;
  }
`;
