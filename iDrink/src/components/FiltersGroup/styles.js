import styled from 'styled-components';

import colors from '../../utils/colors';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;

  @media only screen and (max-width: 1024px) {
    flex-direction: column;
  }

  div {
    display: flex;
    flex-direction: column;

    &:first-child {
      width: 180px;
    }

    & + div {
      max-width: 500px;
      display: flex;
      flex: 1;
      margin: 0 30px;

      @media only screen and (max-width: 1024px) {
        max-width: none;
        margin: 20px 0;
      }

      input {
        margin-top: auto;
      }
    }

    span {
      margin-bottom: 8px;
    }
  }
`;

export const FilterButton = styled.button.attrs({
  type: 'button',
})`
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
  margin: auto 0 0 auto;
  transition: background 300ms;

  &:hover {
    background: ${colors.secondaryColor};
  }
`;
