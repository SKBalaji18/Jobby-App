import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-bg-container">
      <div className="home-text-container">
        <h1 className="home-head">Find The Job That Fits Your Life</h1>
        <p className="home-desc">
          Millions of people are searching for jobs,salary information,company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <button className="home-button">
          <Link className="nav-link" to="/jobs">
            Find Jobs
          </Link>
        </button>
<<<<<<< HEAD
        <Link className="job-btn-link" to="/jobs">
          <button type="button" className="home-button">
            Find Jobs
          </button>
        </Link>
=======
>>>>>>> 2bed345ed658b5f26ee5745c9ff7eefd75c641d5
      </div>
    </div>
  </>
)

export default Home
