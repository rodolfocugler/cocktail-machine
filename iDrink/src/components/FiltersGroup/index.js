import React from 'react';
import PropTypes from 'prop-types';

import {Container, FilterButton} from './styles';

function FiltersGroup({
                          onChangeFilterValue,
                          inputValue,
                          handleFilter,
                      }) {
    return (
        <Container>
            <div>
                <input
                    type="text"
                    name="filter"
                    placeholder="filter drinks"
                    value={inputValue}
                    onChange={onChangeFilterValue}
                />
            </div>

            <FilterButton onClick={handleFilter}>filter</FilterButton>
        </Container>
    );
}

FiltersGroup.propTypes = {
    onChangeFilterValue: PropTypes.func.isRequired,
    inputValue: PropTypes.string.isRequired,
    handleFilter: PropTypes.func.isRequired,
};

export default FiltersGroup;
