

import React, { useState, useEffect } from 'react';
import SelectSingleDate from './SelectSingleDate';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import CheckToken from '../components/CheckToken';
import axios from 'axios';
import { format } from 'date-fns';
import Spinner from './Spinner';

function AccessLogs() {
  useEffect(() => {
    if (!CheckToken()) {
      navigate('/');
    }
  });

  const [values, setValues] = useState({
    DATE: null,
  });
  const [dataAvailable, setDataAvailable] = useState(false);

  const [tableData, setTableData] = useState({
    LOGS: [],
    INSTANT_LOGS: [],
    VIDEO_LOGS: [],
    ALL_LOGS: [],
  });
  const [submitClicked, setSubmitClicked] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setSubmitClicked(true);
    setLoading(true);

    if (values.DATE) {
      const formattedDate = format(values.DATE, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", {
        timeZone: 'UTC',
      });

      axios
        .get('http://localhost:6079/access-logs', {
          params: {
            DATE: formattedDate,
          },
        })
        .then((res) => {
          setLoading(false);

          if (res.data && res.data.message) {
            const instantlogsData = res.data.message.INSTANT_LOGS || [];
            const logsData = res.data.message.LOGS || [];
            const videologsData = res.data.message.VIDEO_LOGS || [];
            const alllogsData = res.data.message.ALL_LOGS || [];

            const logsDates = logsData.map((item) => item.DATE);

            const combinedData = logsDates.map((date) => ({
              DATE: date,
              LOGS: logsData.find((logsItem) => logsItem.DATE === date)?.Football_quiz_played || 0,
              INSTANT_LOGS:
                instantlogsData.find((instantlogsItem) => instantlogsItem.DATE === date)?.Instant_game_played || 0,
              VIDEO_LOGS:
                videologsData.find((videologsItem) => videologsItem.DATE === date)?.VideoCentral || 0,
              ALL_LOGS: alllogsData.find((alllogsItem) => alllogsItem.DATE === date) || { GoalAlertSent: 0, NPFLFootball: 0, GameBox: 0 },
            }));

            setTableData({
              LOGS: combinedData.map((item) => ({ Football_quiz_played: item.LOGS })),
              INSTANT_LOGS: combinedData.map((item) => ({ Instant_game_played: item.INSTANT_LOGS })),
              VIDEO_LOGS: combinedData.map((item) => ({ VideoCentral: item.VIDEO_LOGS })),
              ALL_LOGS: combinedData.map((item) => ({ ...item.ALL_LOGS })),
            });

            setDataAvailable(true);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="bg-black">
      <h1 className="sticky top-0 z-10 text-white  bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center text-xl md:text-3xl lg:text-4xl font-sans font-semibold p-6 md:p-3 lg:p-5">
        <BiArrowBack size={30} className="mr-2" onClick={() => navigate('/emt-service')} />
        <span className="flex-1 text-center font-serif">EMT REPORTING PORTAL</span>
      </h1>
      <h1 className="text-white flex justify-center items-center uppercase mt-6 lg:text-3xl underline text-2xl">
        Select Date
      </h1>
     
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row justify-center items-center gap-8 mt-6 px-12"
      >
        <div className="lg:flex lg:flex-row items-center flex flex-col">
          <SelectSingleDate handleDateChange={handleChange} />
          <button
            type="submit"
            onSubmit={handleSubmit}
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
             hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300
              dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg
               dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5
                text-center lg:mr-2 ml-4 mt-8 lg:mt-0 lg:ml-8 mb-2"
          >
            Submit
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center text-white mt-10">
          <Spinner />
        </div>
      )}
      {submitClicked && dataAvailable && tableData.LOGS.length > 0 ? (
        <div className="lg:mt-16  mt-6 lg-32 flex justify-center items-center">
          <div className="w-full lg-w-[900px] text-center m-4 lg:m-6">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <h1 className="text-white flex justify-center text-center items-center uppercase underline mt-1 text-2xl">
                Access Logs
              </h1>
              <div>
                <table className="w-full text-sm text-left text-blue-100 dark:text-blue-100 mt-4">
                  <thead className="text-md  text-white uppercase bg-gradient-to-r from-cyan-400 to-blue-600 dark:text-white">
                    <tr>
                      <th scope="col" className="px-6 sm:px-6 md:px-6 py-3">
                        FOOTBALL_QUIZ
                      </th>
                      <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                        INSTANT_GAME
                      </th>
                      <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                        VIDEO_CENTRAL
                      </th>
                      <th scope="col" className="px-4 sm:px-6 md:px-6 py-4">
                        GOAL_ALERT
                      </th>
                      <th>NPFL_FOOTBALL</th>
                      <th>GAME_BOX</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.LOGS.map((logsItem, i) => (
                      <tr key={i} className="bg-blue-100 text-black border-b border-blue-400">
                        <td className="px-4 sm:px-6 md:px-6 py-4">{logsItem.Football_quiz_played}</td>
                        <td className="px-4 sm:px-6 md:px-6 py-4">{tableData.INSTANT_LOGS[i].Instant_game_played}</td>
                        <td className="px-4 sm:px-6 md:px-6 py-4">{tableData.VIDEO_LOGS[i].VideoCentral}</td>
                        <td className="px-4 sm:px-6 md:px-6 py-4">{tableData.ALL_LOGS[i].GoalAlertSent}</td>
                        <td className="px-4 sm:px-6 md:px-6 py-4">{tableData.ALL_LOGS[i].NPFLFootball}</td>
                        <td className="px-4 sm:px-6 md:px-6 py-4">{tableData.ALL_LOGS[i].GameBox}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AccessLogs;

