


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { IoIosHome } from 'react-icons/io';
// import axios from 'axios';
// import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

// function MainPage() {
//   const navigate = useNavigate();
//   const [month, setMonth] = useState([]);
  
// console.log(month)
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get('http://localhost:6079/month');
//         if (res.data && res.data.message && Array.isArray(res.data.message)) {
//           const data = res.data.message;
//           setMonth(data);
//         } else {
//           setMonth([]);
//         }
//       } catch (error) {
//         console.error('Error fetching additional data:', error);
//         setMonth([]);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className='bg-black'>
//       <div className='w-full'>
//         <div className='w-full lg:px-10 flex flex-col lg:flex-row items-center bg-gradient-to-r from-cyan-500 to-blue-500 lg:gap-80 gap-0'>
//           <h1 className='p-6 md:p-5 z-10 text-white text-center flex justify-end items-end text-3xl md:text-3xl lg:text-xl uppercase font-serif lg:px-8 lg:ml-0'>
//             <IoIosHome size={35} onClick={() => navigate('/')} />
//             home
//           </h1>
//           <div className='flex lg:flex-row items-center lg:mt-4 lg:px-32 px-0 lg:gap-12'>
//             <h1
//               className='md:p-5 z-10 text-white text-center text-xl md:text-3xl lg:text-xl font-sans p-2 lg:p-1 rounded-lg hover:bg-white hover:text-black'
//               onClick={() => navigate('/emt-service/check-logs')}
//             >
//               Check User Logs
//             </h1>
//             <h1
//               className='md:p-5 z-10 text-white text-center text-xl md:text-3xl lg:text-xl font-sans p-2 lg:p-1 rounded-lg hover:bg-white hover:text-black'
//               onClick={() => navigate('/emt-service/subscription')}
//             >
//               Get Subscription
//             </h1>
//             <h1
//               className='md:p-5 z-10 text-white text-center text-xl md:text-3xl lg:text-xl font-sans p-2 lg:p-1 rounded-lg hover:bg-white hover:text-black'
//               onClick={() => navigate('/emt-service/access-logs')}
//             >
//               Access Logs
//             </h1>
//           </div>
//         </div>
//       </div>

//       <h1 className='lg:text-2xl text-xl uppercase text-white lg:mt-8 mt-12 flex justify-center items-center font-serif underline'>Dashboard</h1>
// <div className='lg:px-16 md:px-8'>
//       <div className='lg:w-full w-11/12 md:w-full lg:mx-auto mx-auto mt-10 bg-zinc-100 rounded-lg'>
//   <ResponsiveContainer width='100%' height={420} className='lg:p-6 p-2'>
//     <LineChart data={month}>
//       <CartesianGrid strokeDasharray='3 3' />
//       <XAxis dataKey='service_category' className='lg:p-0 p-8'/>
//       <YAxis />
//       <Tooltip />
//       <Legend />
//       <Line type='monotone' dataKey='monthly_revenue'  stroke='#046d8a'/>
//       <Line type='monotone' dataKey='revenue_month' stroke='#046d8a'/>
//     </LineChart>
    
//   </ResponsiveContainer>
// </div>
// </div>

//       <div className='lg:px-14 lg:mt-8 md:px-8 md:mt-12 mt-8 px-4'>
//         <table className='mx-auto mt-6 md:mt-4 lg:mt-16 lg:mb-12 w-full lg:w-full text-sm text-left text-blue-100 dark:text-blue-100 overflow-x-auto'>
//           <thead className='text-md text-white uppercase bg-gradient-to-r from-cyan-400 to-blue-600 dark:text-white'>
//             <tr>
//               <th scope='col' className='px-4 sm:px-6 md:px-6 py-4'>
//                 service
//               </th>
//               <th scope='col' className='px-4 sm:px-6 md:px-6 py-4'>
//                 month
//               </th>
//               <th scope='col' className='px-4 sm:px-6 md:px-6 py-4'>
//                 YEAR
//               </th>
//               <th scope='col' className='px-4 sm:px-6 md:px-6 py-4'>
//                 revenue
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {month.map((Item, i) => (
//               <tr key={i} className='bg-blue-100 text-black border-b border-blue-400'>
//                 <td className='px-4 sm:px-6 md:px-6 py-4'>{Item.service_category}</td>
//                 <td className='px-4 sm:px-6 md:px-6 py-4'>{Item.revenue_month}</td>
//                 <td className='px-4 sm:px-6 md:px-6 py-4'>{Item.revenue_year}</td>
//                 <td className='px-4 sm:px-6 md:px-6 py-4'>{Item.monthly_revenue}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default MainPage;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosHome } from 'react-icons/io';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

function MainPage() {
  const navigate = useNavigate();
  const [month, setMonth] = useState([]);

   // Function to get unique months from the data
   const getUniqueMonths = () => {
    const uniqueMonths = new Set();
    month.forEach((item) => {
      uniqueMonths.add(item.revenue_month);
    });
    return Array.from(uniqueMonths);
  };
   
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:6079/month');
        if (res.data && res.data.message && Array.isArray(res.data.message)) {
          const data = res.data.message;
          setMonth(data);
        } else {
          setMonth([]);
        }
      } catch (error) {
        console.error('Error fetching additional data:', error);
        setMonth([]);
      }
    };

    fetchData();
  }, []);

  const transformData = () => {
    const transformedData = month.reduce((acc, currentItem) => {
      const existingItem = acc.find((item) => item.service_category === currentItem.service_category);

      if (existingItem) {
        existingItem[currentItem.revenue_month] = currentItem.monthly_revenue;
      } else {
        const newItem = {
          service_category: currentItem.service_category,
          [currentItem.revenue_month]: currentItem.monthly_revenue,
        };
        acc.push(newItem);
      }

      return acc;
    }, []);

    return transformedData;
  };

  return (
    <div className='bg-black'>
      <div className='w-full'>
        {/* Navigation Section */}
        <div className='w-full lg:px-10 flex flex-col lg:flex-row items-center bg-gradient-to-r from-cyan-500 to-blue-500 lg:gap-80 gap-0'>
          <h1 className='p-6 md:p-5 z-10 text-white text-center flex justify-end items-end text-3xl md:text-3xl lg:text-xl uppercase font-serif lg:px-8 lg:ml-0'>
            <IoIosHome size={35} onClick={() => navigate('/')} />
            home
          </h1>
          <div className='flex lg:flex-row items-center lg:mt-4 lg:px-32 px-0 lg:gap-12'>
            <h1
              className='md:p-5 z-10 text-white text-center text-xl md:text-3xl lg:text-xl font-sans p-2 lg:p-1 rounded-lg hover:bg-white hover:text-black'
              onClick={() => navigate('/emt-service/check-logs')}
            >
              Check User Logs
            </h1>
            <h1
              className='md:p-5 z-10 text-white text-center text-xl md:text-3xl lg:text-xl font-sans p-2 lg:p-1 rounded-lg hover:bg-white hover:text-black'
              onClick={() => navigate('/emt-service/subscription')}
            >
              Get Subscription
            </h1>
            <h1
              className='md:p-5 z-10 text-white text-center text-xl md:text-3xl lg:text-xl font-sans p-2 lg:p-1 rounded-lg hover:bg-white hover:text-black'
              onClick={() => navigate('/emt-service/access-logs')}
            >
              Access Logs
            </h1>
          </div>
        </div>
      </div>

      {/* Dashboard Title */}
      <h1 className='lg:text-2xl text-xl uppercase text-white lg:mt-8 mt-12 flex justify-center items-center font-serif underline'>Dashboard</h1>

      {/* Line Chart Section */}
      <div className='lg:px-16 md:px-8'>
        <div className='lg:w-full w-11/12 md:w-full lg:mx-auto mx-auto mt-10 bg-zinc-100 rounded-lg'>
          <ResponsiveContainer width='100%' height={420} className='lg:p-6 p-2'>
            <LineChart data={transformData()}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='service_category' className='lg:p-0 p-8' />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* {['12', '11', '10'].map((month) => ( */}
              {getUniqueMonths().map((month) => (

                <Line key={month} type='monotone' dataKey={month} stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table Section */}
      <div className='lg:px-14 lg:mt-8 md:px-8 md:mt-12 mt-8 px-4'>
        <table className='mx-auto mt-6 md:mt-4 lg:mt-16 lg:mb-12 w-full lg:w-full text-sm text-left text-blue-100 dark:text-blue-100 overflow-x-auto'>
          <thead className='text-md text-white uppercase bg-gradient-to-r from-cyan-400 to-blue-600 dark:text-white'>
            <tr>
              <th scope='col' className='px-4 sm:px-6 md:px-6 py-4'>
                service
              </th>
              <th scope='col' className='px-4 sm:px-6 md:px-6 py-4'>
                month
              </th>
              <th scope='col' className='px-4 sm:px-6 md:px-6 py-4'>
                YEAR
              </th>
              <th scope='col' className='px-4 sm:px-6 md:px-6 py-4'>
                revenue
              </th>
            </tr>
          </thead>
          <tbody>
            {month.map((Item, i) => (
              <tr key={i} className='bg-blue-100 text-black border-b border-blue-400'>
                <td className='px-4 sm:px-6 md:px-6 py-4'>{Item.service_category}</td>
                <td className='px-4 sm:px-6 md:px-6 py-4'>{Item.revenue_month}</td>
                <td className='px-4 sm:px-6 md:px-6 py-4'>{Item.revenue_year}</td>
                <td className='px-4 sm:px-6 md:px-6 py-4'>{Item.monthly_revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MainPage;





