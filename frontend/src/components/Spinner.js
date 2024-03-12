import {ThreeDots} from 'react-loader-spinner'

const Spinner=()=>{
    return(
        <div className='flex justify-center items-center lg:mt-32'>
<ThreeDots 
height="180" 
width="100" 
radius="9"
color="white" 
ariaLabel="three-dots-loading"
wrapperStyle={{}}
wrapperClassName=""
visible={true}
 />
        </div>
    )
}
export default Spinner