import React, { useState ,useEffect} from 'react';
import SelectSingleDate from './SelectSingleDate';
import axios from 'axios';
import { format } from 'date-fns';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import CheckToken from '../components/CheckToken';


function HomePage() {

  useEffect(() => {
    if (!CheckToken()) {
      navigate('/');
    }
  });
  const [dataAvailable, setDataAvailable] = useState(true);
  const [values, setValues] = useState({
    msisdn: '',
    DATE: null,
    service: '',
  });
  const [tabledata, setTableData] = useState([]);
  console.log("tabledata:", tabledata);

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target) {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    } else {
      setValues({
        ...values,
        DATE: e,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (values.DATE) {
      const formattedDate = format(values.DATE, "yyyy-MM-dd'T'HH:mm:ss'Z'", { timeZone: 'UTC' });
      
      axios
        .get('http://localhost:6079/insta-alert', {
          params: {
            DATE: formattedDate,
            msisdn: values.msisdn,
            pisisid: values.service,
          },
        })
        .then((res) => {
          console.log('Response from the backend:', res.data);

          if (Array.isArray(res.data.message)) {
            setTableData(res.data.message);
            setDataAvailable(res.data.message.length > 0);
          } else {
            setTableData([]);
            setDataAvailable(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setTableData([]);
          setDataAvailable(false);
        });
    } else {
      setTableData([]);
      setDataAvailable(false);
    }
  };

  return (
    <div className='bg-black'>
      <h1 className='sticky top-0 z-10 text-white bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center text-2xl md:text-3xl lg:text-4xl font-sans font-semibold p-6 md:p-3 lg:p-5'>
        <BiArrowBack size={30} className="mr-2" onClick={() => navigate('/emt-service')} />
        <span className="flex-1 text-center font-serif">EMT REPORTING PORTAL</span>
      </h1>

      <h1 className='text-white flex justify-center items-center uppercase mt-6 underline text-2xl'>Select Details</h1>

      <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row justify-center items-center gap-4 mt-8'>
        <div className="lg:flex lg:flex-row lg:items-center flex flex-col">
          <label className='text-white text-xl'>Enter Number: </label>
          <input
            type='text'
            placeholder='Enter Number'
            name='msisdn' 
            value={values.msisdn}
            onChange={handleChange}
            className='border lg:m-4 p-1 w-[180px] m-1 '
          />
        </div>

        <div className="lg:flex lg:flex-row lg:items-center flex flex-col">
          <label className='text-white text-xl'>Select Service:  </label>
          <select name='service' value={values.service} onChange={handleChange} className='border p-1 m-1 w-[180px] lg:m-4'>
            <option value='none'>Select an option</option>
            <option value='174'>Football Quiz</option>
            <option value='178'>Goal Alert</option>
            <option value='176'>Instant Game</option>
            <option value='188'>Video Central</option>
            <option value='199'>NPFL Football</option>
            <option value='198'>Game Box</option>
            <option value='200'>NPFL Football OnDemand</option>
            <option value='175'>Football Quiz OnDemand</option>
            <option value='177'>Instant Game Ondemand</option>
          </select>
        </div>

        <div className="lg:flex items-center ">
          <SelectSingleDate handleDateChange={handleChange} />
          <button type="button" onClick={handleSubmit}
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80
           font-medium rounded-lg text-sm px-5 py-2.5 text-center lg:mr-2 ml-12 lg:ml-8 mb-2 lg:mt-0 mt-12 md:mt-18">
            Submit</button>
          
        </div>
      </form>

      {Array.isArray(tabledata) && tabledata.length > 0 ? (
        <div className="p-8 overflow-x-auto text-4xl shadow-md sm:rounded-lg lg:mt-6">
                <h1 className='text-white flex justify-center items-center uppercase underline mt-6 text-2xl'>Details Box</h1>

          <table className="w-full text-sm text-left text-black dark:text-blue-100 mt-4 rounded-lg">
            <thead className="text-md text-white uppercase bg-blue-600 border-b border-blue-400 dark:text-white">
              <tr>
                <th scope="col" className="px-6 py-3 bg-blue-500">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 bg-blue-500">
                  MSISDN
                </th>
                <th scope="col" className="px-6 py-3 bg-blue-500">
                  Message
                </th>
              </tr>
            </thead>
            <tbody>
              {tabledata.map((item, i) => (
                <tr key={i} className="bg-white text-black border-b border-blue-400">
                  <td className="px-4 sm:px-6 md:px-6 py-4 ">{item.processDateTime.split('T')[0]}</td>
                  <td className="px-4 sm:px-6 md:px-6 py-4">{item.msisdn}</td>
                  <td className="px-4 sm:px-6 md:px-6 py-4">{item.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {!dataAvailable && (
        <p className="text-center text-white mt-8 text-2xl lg:text-5xl font-sans">
          Oops!<br />No data is available for the selected date and criteria.
        </p>
      )}
    </div>
  );
}

export default HomePage;
