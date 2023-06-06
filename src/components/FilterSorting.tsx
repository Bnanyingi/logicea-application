import React, { useState } from 'react';
import './FilterSorting.css';

interface FilterSortingProps {
  onFilterSort: (filterBy: string, sortBy: string) => void;
}

const FilterSorting: React.FC<FilterSortingProps> = ({ onFilterSort }) => {
  const [filterBy, setFilterBy] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilterBy = event.target.value;
    setFilterBy(selectedFilterBy);
    onFilterSort(selectedFilterBy, sortBy);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSortBy = event.target.value;
    setSortBy(selectedSortBy);
    onFilterSort(filterBy, selectedSortBy);
  };


  return (
    <div className="filter-sorting">
      <div className='filter-label'>
      <label htmlFor="filter">Filter By:</label>
      <select id="filter" value={filterBy} onChange={handleFilterChange}>
        <option value="">None</option>
        <option value="lessThan50">Views: Less than 50</option>
        <option value="between50And100">Views: 50 to 100</option>
        <option value="moreThan100">Views: More than 100</option>
      </select>
      </div>

      <div className='filter-label'>
      <label htmlFor="sort">Sort By:</label>
      <select id="sort" value={sortBy} onChange={handleSortChange}>
        <option value="">None</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      </div>
    </div>
  );
};

export default FilterSorting;