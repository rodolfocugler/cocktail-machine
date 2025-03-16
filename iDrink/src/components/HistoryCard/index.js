import React from 'react';
import {Container} from './styles';

function HistoryCard({history}) {

  return (
    <Container>
      <span>Machine: {history.machineName}</span>
      <span>{new Date(history.timestamp).toLocaleString()}</span>
      {history.historyEntries.map(e => {
        return <>
          <span>Pump: {e.name} (port: {e.port})</span>
          <span>Ingredient: {e.ingredientName}</span>
          <span>Seconds: {e.second} - {e.flowRateInMlPerSec}</span>
        </>
      })}

    </Container>
  );
}

export default HistoryCard;
