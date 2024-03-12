import React, { useState } from 'react';

  import DatePicker from "react-datepicker";

  import "react-datepicker/dist/react-datepicker.css";

  const SelectSingleDate = ({ handleDateChange }) => {
    const [startDate, setStartDate] = useState(null);
// 
    return (
      <div className='flex flex-col lg:flex lg:flex-row'>
        <label className="text-white lg:m-0 flex justify-start items-start text-xl">Select Date: </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            handleDateChange(date);
            
          }}
          placeholderText="Select Date"
          className="p-1 ml-0 m-1 lg:mx-4 lg:ml-3 w-[180px] text-black"
        />
      </div>
    );
  };


  export default SelectSingleDate
