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
  padding: 10px;
  margin: 20px 15px 20px 15px;

  span {
    font-size: 16px;
    margin-top: 15px;
    text-align: center;
  }
`;
