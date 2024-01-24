import { Logo } from '../components'
import inter from '../assets/images/inter.svg'
import Wrapper from '../assets/wrappers/LandingPage'
import {Link} from 'react-router-dom'
const Landing = () => {
  return (
    <Wrapper>
        <main>
        <nav>
            <Logo/>
            
        </nav>
        <div className='container page'>
            <div className='info'>
                <h1>job <span>tracking</span></h1>
                <p>
                    "Welcome to Jobster your gateway to career excellence! Unleash your potential with powerful search tools, personalized recommendations, and connections to top employers. Join thousands who've found success. Sign up today and elevate your career journey to new heights.
                </p>
                <Link to='/register' className='btn btn-hero'>Login/Register</Link>
            </div>
            <img src={inter} alt='job hunt' className='img main-img'/>
        </div>
    </main>
    </Wrapper>
  )
}

export default Landing
