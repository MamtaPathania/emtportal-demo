
import Cookies from 'js-cookie';


const CheckToken = () => {
  const token = Cookies.get('token');
  return !!token; 
};

export default CheckToken
