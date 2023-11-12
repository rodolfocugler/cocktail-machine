import React from 'react';
import {Container} from './styles';

function HistoryCard({history}) {

    return (
        <Container>

            <span>Seconds: {history.seconds.split("-").map(s => parseFloat(s).toFixed(2)).join("-")}</span>
            <span>Pump: {history.name}</span>
            <span>Machine: {history.machinename}</span>
            <span>Domain: {history.domain}</span>
            <span>Ports: {history.port}</span>
            <span>Flow rate: {history.flowrateinmlpersec.split("-").map(s => parseFloat(s).toFixed(2)).join("-")}</span>
            <span>{new Date(history.timestamp * 1000).toLocaleString()}</span>

        </Container>
    );
}

export default HistoryCard;
