import React from 'react';
import PropTypes from 'prop-types';

import {Container, FilterButton} from './styles';

function FiltersGroup({
                          onSelectFilterType,
                          onChangeFilterValue,
                          inputValue,
                          handleFilter,
                      }) {
    return (
        <Container>
            <div>
                <span>filter by</span>
                <select name="filter_by" id="filter_by" onChange={onSelectFilterType}>
                    <option value="all">all</option>
                    <option value="name">name</option>
                    <option value="ingredient">ingredient</option>
                </select>
            </div>

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
    onSelectFilterType: PropTypes.func.isRequired,
    onChangeFilterValue: PropTypes.func.isRequired,
    inputValue: PropTypes.string.isRequired,
    handleFilter: PropTypes.func.isRequired,
};

export default FiltersGroup;
