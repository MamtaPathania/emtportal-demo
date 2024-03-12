import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
// eslint-disable-next-line
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import "./SelectDate.css";

const SelectDate = ({ handleDateChange }) => {
  const [dateRange, setDateRange] = useState([
    { 
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Check if it's the initial load
    if (initialLoad) {
      setInitialLoad(false); // Set the flag to false for subsequent renders
      return; // Return to avoid setting dateRange on initial load
    }

    // Set an empty date range on subsequent renders (page reloads)
    setDateRange([
      {
        startDate: null,
        endDate: null,
        key: 'selection'
      }
    ]);
  }, [initialLoad]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const handleConfirm = () => {
    setIsPickerOpen(false);
    handleDateChange(dateRange[0]);
  };

  const handleTogglePicker = () => {
    setIsPickerOpen(!isPickerOpen);
  };

  const formatDate = (date) => {
    return date ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}` : 'Select Date Range';
  };

  return (
    <div className='relative lg:flex lg:flex-row items-center flex justify-center flex-col'>
      <label className="text-white text-xl lg:mr-5">Select Date Range: </label>
         
      <input
        type="text"
        value={`${formatDate(dateRange[0].startDate)} - ${formatDate(dateRange[0].endDate)}`}
        readOnly 
        placeholder="Select Date Range"
        className="border p-1 m-1 lg:w-[180px] w-[200px]"
         
        onClick={handleTogglePicker}
      />
      
      {isPickerOpen && (
        <div className="date-picker-container lg:absolute absolute top-[6rem] lg:top-[4rem] z-10">
        <DateRangePicker 
            ranges={dateRange}
            onChange={handleSelect}
            direction="horizontal"
            
            // staticRanges={[]}
            //  inputRanges={[]}
             className="custom-date-range-picker mt-6 lg:mt-1 "
               
          />
          <button onClick={handleConfirm} className="ok-button bg-blue-600 p-3 lg:w-[50px] w-[60px] text-white">
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectDate;




