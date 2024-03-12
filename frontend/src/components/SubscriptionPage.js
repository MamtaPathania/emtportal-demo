import React, { useState, useEffect } from 'react';
import SelectDate from './SelectDate';
import axios from 'axios';
import { format } from 'date-fns';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import CheckToken from '../components/CheckToken';
import * as XLSX from 'xlsx'; // Import xlsx library
// import {cron} from 'node-cron'



function SubscriptionPage() {

  useEffect(() => {
    if (!CheckToken()) {
      navigate('/');
    }
  });
  
  const [currentData, setCurrentData] = useState([]);
 const [infoData,setInfoData]=useState(false)
//  console.log("info===",infoData)
 const [product, setProduct] = useState('Football%');


  const [apiData, setApiData] = useState(false);
  const [tableapiData, setTableApiData] = useState([]);
  // console.log("jjjjjjjjj",tableapiData)
  const [dataAvailable, setDataAvailable] = useState(false);
  const [tableData, setTableData] = useState([]);
// console.log("tabledataclicked",tableData)
  // const [tableData, setTableData] = useState([{ SUB: [], SMS: [], SECURE: [], USSD: [], REN: [], UNSUB: [], REVENUE: [], ACTIVE_BASE: [], TOTAL_REVENUE: [], TOTAL_BASE: [] }]);
  // console.log("---TABLE",tableapiData)
  const [values, setValues] = useState({
    DATE_RANGE: {
      startDate: null,
      endDate: null,
    },
    service: 'Football%',
  });
  const [submitClicked, setSubmitClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
// console.log(excelFile)
console.log("excel========",excelFile)
  const navigate = useNavigate();

  // const sendEmail = async() =>{
  //   try {
  //     const response = await axios.post('http://localhost:6079/send-email', {excelFile} );
  //     console.log('Email sent successfully:', response.data);
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   }
  // }

  // const handleDownload = async () => {
  //   const ws = XLSX.utils.json_to_sheet(currentData);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    
  //   // Store Excel data in state
  //   setExcelFile(wb);
  //   // const excelBinary = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  //       // await sendEmail(excelBinary);
  //   XLSX.writeFile(wb, 'subscription_data.xlsx');
    
  //   await sendEmail()
    
  // };

  const sendEmail = async (fileBlob) => {
    try {
        let formData = new FormData();
        formData.append("file", fileBlob, "subscription_data.xlsx");

        const response = await axios.post('http://localhost:6079/send-email', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Email sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
sendEmail()



const handleDownload = async () => {
    const ws = XLSX.utils.json_to_sheet(currentData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

   // Send the email with the Excel file
    // await sendEmail(blob);
    
   // If you also want to download the file in the browser
    XLSX.writeFile(wb, 'subscription_data.xlsx');
};


  useEffect(() => {
    // Update currentData when the service or data changes
    setCurrentData(submitClicked ? tableData : tableapiData);
  }, [submitClicked, tableData, tableapiData]);

  const handleChange = (name, value) => {
    if (name === 'service') {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
      // Update product based on the selected service, you can customize this logic
      setProduct(value); // Implement getProductForService function
    } else if (name === 'product') {
      setProduct(value);
    } else if (name === 'DATE_RANGE') {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitClicked(true);
    setLoading(true);
  
    const { startDate, endDate } = values.DATE_RANGE;
    console.log("daterange",values.DATE_RANGE)
    
    // Check if start date and end date are not selected
    if (!startDate && !endDate && values.service !== 'none') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
      const formattedStartDate = format(thirtyDaysAgo, "yyyy-MM-dd'T'HH:mm:ss'Z'", {
        timeZone: 'UTC',
      });
      // {  console.log("---njj",formattedStartDate) }
      const formattedEndDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'", {
        timeZone: 'UTC',
      });
      // {  console.log("---enddate",formattedEndDate) }
      
      axios 
        .get('http://localhost:6079/date', {
          params: {
            START_DATE: formattedStartDate,
            END_DATE: formattedEndDate,
            service: values.service,
          },
        })
        .then((res) => {
          // setLoading(false);
          console.log("responseaxios:",res.data.message)

          if (res.data && res.data.message) {
            // console.log('Message:', res.data.message);
            setLoading(false);
            
            setTableData(res.data.message)
            setDataAvailable(true);
          } else {
            setTableData([]);
            setDataAvailable(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log('Error from the backend:', error);
          setTableData([]);
          setDataAvailable(false);
        });
    } else if (startDate && endDate && values.service !== 'none') {
      // If start date and end date are selected, proceed with the selected dates
      const formattedStartDate = format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'", {
        timeZone: 'UTC',
      });
      const formattedEndDate = format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'", {
        timeZone: 'UTC',
      });
      
      axios
        .get('http://localhost:6079/date', {
          params: {
            START_DATE: formattedStartDate,
            END_DATE: formattedEndDate,
            service: values.service,
          },
        })
        .then((res) => {
          // setLoading(false);
          console.log("responsedate:",res.data.message)

          if (res.data && res.data.message) {
            // console.log("clickedresponse:",res.data.message)
         
          setLoading(false); 
            setTableData(res.data.message)
            setDataAvailable(true);
          } else {
            setTableData([]);
            setDataAvailable(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log('Error from the backend:', error);
          setTableData([]);
          setDataAvailable(false);
        });
    } else {
      setLoading(false);
      setTableData([]);
      setDataAvailable(false);
    }
  };


  const fetchAdditionalData = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:6079/info', {
        params: {
          product: product,
        },
      });

      if (res.data && res.data.message) {
        const additionalData = res.data.message;
        console.log("=======-------",additionalData)
        setInfoData(additionalData)
        
      } else {
      }
    } catch (error) {
      console.error('Error fetching additional data:', error);
      setLoading(false)
    }
  };

  
  useEffect(() => {
    fetchAdditionalData();
  }, [product]); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 

      try {
        const endDate = new Date(); // Get today's date
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 29); // Subtract 29 days to get the start date
  

        const formattedStartDate = format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'", {
          timeZone: 'UTC',
        });
  
        const formattedEndDate = format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'", {
          timeZone: 'UTC',
        });
        
        const res = await axios.get('http://localhost:6079/date', {
          params: {
          START_DATE: formattedStartDate,
          END_DATE: formattedEndDate,
          service: values.service,
          },
        });
        if (res.data && res.data.message) {
          console.log("response:",res.data.message)
         
          setLoading(false); 

          setTableApiData(res.data.message)
          setApiData(true);
          setDataAvailable(true);
        } else {
          setLoading(false); 

          setTableApiData([]);
          setDataAvailable(false);
          setApiData(true); 

        }
      } catch (error) {
        setLoading(false); 

        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [values.service]);

 
  return (
    <div className="bg-black">
      <h1 className="sticky top-0 z-10 text-white bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center text-2xl md:text-3xl lg:text-4xl font-sans font-semibold p-6 md:p-3 lg:p-5">
        <BiArrowBack size={30} className="mr-2" onClick={() => navigate('/emt-service')} />
        <span className="flex-1 text-center font-serif tracking-wider">EMT REPORTING PORTAL</span>
      </h1>
      <h1 className="text-white flex justify-center items-center uppercase mt-6 lg:text-3xl md:text-xl text-2xl text-sans underline">Select Details</h1>
      
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row justify-center items-center gap-6 mt-4"
      >
        <div className="lg:flex lg:flex-row items-center flex flex-col">
          <label className="text-white text-xl">Select Service: </label>
          <select 
            name="service"
            value={values.service}
            onChange={(e) => handleChange('service', e.target.value)}
                 className="border p-1 lg:mx-6 w-[200px]"
          >
            <option value='Football%' selected>Football Quiz</option>
            <option value='Goal%'>Goal Alert</option>
            <option value='Instant%'>Instant Game</option>
            <option value='Video%'>Video Central</option>
            <option value='npfl%'>NPFL Football</option>
            <option value='Game Box%'>Game Box</option>


          </select>
        </div>

        <div className="lg:flex items-center mr-3 ml-3 lg:ml-0 lg:mr-0">
          <SelectDate
            handleDateChange={(dateRange) => handleChange('DATE_RANGE', dateRange)}
            className="text-black"
          />
          <button
            type="submit" 
            className="mt-16 lg:mt-0  text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
             hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 
             shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 
             font-medium rounded-lg text-sm px-5 py-2.5 text-center lg:mr-2 ml-16 lg:ml-8 mb-2 "
          >
            Submit
          </button>
        </div>
      </form>
      {loading && (
        <div className="text-center text-white h-screen">
          <Spinner/>
        </div>
      )}
     
      {submitClicked && (!dataAvailable || (dataAvailable && tableData.length === 0)) ? (
        // Only show "Oops!" message if the submit button was clicked
        <p className="text-center text-white mt-24 lg-32 text-2xl lg:text-5xl font-sans">
          Oops!
          <br />
          No data is available for the selected date range.
        </p>
      ) : null}
      
    
      {submitClicked && dataAvailable && tableData.length > 0 ? (
        <div className=" lg:mt-6 mt-6 lg-32 flex justify-center items-center">
          <div className="w-full lg-w-[900px] text-center m-4 lg:m-6">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <h1 className="text-white flex justify-center text-center items-center uppercase underline mt-1 text-2xl">
                Details Box
              </h1>
              <button onClick={handleDownload}
            className="mt-2 lg:mt-4 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-600 
             dark:focus:ring-blue-600 shadow-lg hover:border-2 border-white
             shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 
             py-2.5 text-center lg:mr-2 ml-6 lg:ml-2"
          >
            Download                       
          </button>

             
              <table className="w-full text-sm text-left text-blue-100 dark:text-blue-100 mt-4">
                <thead className="text-md  text-white uppercase bg-gradient-to-r from-cyan-400 to-blue-600 dark:text-white">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      DATE
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      SUB
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      SMS
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                     SecureD
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                    USSD
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                    RENEWAL 
                     </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      UNSUB
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      ACTIVE_BASE
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                     Total_BASE
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      REVENUE<br/>(NGN)
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                    TOTAL_REVENUE<br/>(NGN)           
                             </th>         
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((subItem, i) => (
                  
                  
                    <tr key={i} className="bg-blue-100 text-black border-b border-blue-400">
                      <td className="px-3 sm:px-6 md:px-6 py-4 text-black  dark:text-gray-900">
                      {subItem.mis_date.split('T')[0]}
                      </td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.subscriptions}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.sms}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.secureD}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.ussd}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.renewals}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.unsubscriptions}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.active_base}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.total_base}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.revenue}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.total_revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

{!submitClicked && infoData && infoData.length > 0?(
        <div className="mt-6 lg:mt-4 lg-32 flex justify-center  items-center">
        <div className="w-full lg:w-[600px] text-center m-4 lg:m-6 ">
          <div className="relative overflow-x-auto shadow-lg rounded-lg">
            <table className="w-full text-sm text-left text-blue-100 dark:text-blue-100 mt-4">
              <thead className="text-md text-white uppercase bg-gradient-to-r from-cyan-400 to-blue-600">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                    service
                  </th>
                  <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                    shortcode
                  </th>
                  <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                    amount
                  </th>
                  </tr>
              </thead>
              <tbody>
                {infoData.map((Item, i) => (
                  <tr key={i} className="bg-blue-100 text-black border-b border-blue-400">
                    
                    <td className="px-4 sm:px-6 md:px-6 py-4">{Item.service}</td>
                    <td className="px-4 sm:px-6 md:px-6 py-4">{Item.shortcode}</td>
                    <td className="px-4 sm:px-6 md:px-6 py-4">{Item.amount}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      ):null}

      {!submitClicked && apiData && tableapiData.length > 0 ? (
        <div className="mt-16 lg:mt-2 lg-32 flex justify-center rounded-lg items-center">
          <div className="w-full lg-w-[900px] text-center m-4 lg:m-6">
            <div className="relative overflow-x-auto shadow-md rounded-lg">
            <button onClick={handleDownload}
            className="mt-2 lg:mt-0 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-600 
             dark:focus:ring-blue-600 shadow-lg hover:border-2 border-white
             shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 
             py-2.5 text-center lg:mr-2 ml-2 lg:ml-8"
          >
            Download                       
          </button>
              <table className="w-full text-sm text-left text-blue-100 dark:text-blue-100 mt-2">
                <thead className="text-md text-white uppercase bg-gradient-to-r from-cyan-400 to-blue-600">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      DATE
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      SUB
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      SMS
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      SecureD
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      USSD
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                    RENEWAL
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      UNSUB
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      ACTIVE_BASE
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                     Total_BASE
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                      REVENUE<br/>(NGN)
                    </th>
                    <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                    TOTAL_REVENUE<br/>(NGN)           
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableapiData.map((subItem, i) => (
                    <tr key={i} className="bg-blue-100 text-black border-b border-blue-400">
                      {console.log('============', subItem)}
                      <td className="px-4 sm:px-6 md:px-6 py-4 text-black font-medium whitespace-nowrap dark:text-gray-900">
                        {subItem.mis_date.split('T')[0]}
                      </td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.subscriptions}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.sms}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.secureD}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.ussd}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.renewals}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.unsubscriptions}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.active_base}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.total_base}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.revenue}</td>
                      <td className="px-4 sm:px-6 md:px-6 py-4">{subItem.total_revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SubscriptionPage;
