import {useState,useEffect} from 'react';
import {Logo} from '../components'
import Wrapper from '../assets/wrappers/RegisterPage';
import FormRow from '../components/FormRow';
import {toast} from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../features/user/userSlice';
import {useNavigate} from 'react-router-dom'
const initialState={
  name:'',
  email:'',
  password:'',
  isMember:true,
}



function Register() {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  
  const [values,setValues]=useState(initialState);
  const {user,isLoading}=useSelector(store=>store.user)
  const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    console.log(`${name}:::${value}`);
    setValues({...values,[name]:value})//dynamic object keys
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    const {name,email,password,isMember}=values;
    if (!email || !password || (!isMember && !name)){
      toast.error('Please fill all the feilds');
      return;
    }
    if(isMember){
      dispatch(loginUser({email:email,password:password}))
      return;
    }
    dispatch(registerUser({name,email,password}))
    console.log(e.target);
  }
  const toggleMember=()=>{
  setValues({...values,isMember:!values.isMember});
}
useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [user, navigate]);
  return (
    
    <Wrapper className='full-page'>
      <form className='form' onSubmit={handleSubmit}>
        <Logo />
        <h3>{values.isMember? 'Login': 'Register'}</h3>

        {/* name field */}
        {!values.isMember &&(<FormRow type='text' value={values.name} name='name' handleChange={handleChange}/>)}
          
          <FormRow type='email' value={values.email} name='email' handleChange={handleChange}/>
          <FormRow type='password' value={values.password} name='password' handleChange={handleChange}/>
        

        <button type='submit' className='btn btn-block' disabled={isLoading}>
          submit
        </button>
        <button
  type="button"
  className="btn btn-block btn-hipster"
  disabled={isLoading}
  onClick={() => {
    dispatch(loginUser({ email: "testUser@test.com", password: "secret" }));
  }}
>
  {isLoading ? "loading..." : "demo"}
</button>
        <p>
      {values.isMember ? 'Not a member yet?' : 'Already a member?'}

      <button type='button' onClick={toggleMember} className='member-btn'>
        {values.isMember ? 'Register' : 'Login'}
      </button>
    </p>
      </form>
    </Wrapper>
  )
}

export default Register
