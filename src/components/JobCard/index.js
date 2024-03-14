import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobCard = props => {
  const {eachJob} = props
  const {
    id,
    location,
    title,
    rating,
    companyLogoUrl,
    employmentType,
    jobDescription,
    packagePerAnnum,
  } = eachJob

  return (
    <li className="job-list">
      <Link className="job-card-link" to={`/jobs/${id}`}>
        <div className="job-li-top">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="job-title">{title}</h1>
            <div className="star-container">
              <FaStar className="star-icon" color="#fbbf24" />
              <p className="job-rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="emp-type-salary-container">
          <div className="emp-typ-loc-container">
            <div className="loc-container">
              <MdLocationOn className="job-icons" />
              <p className="job-icon-label">{location}</p>
            </div>
            <div className="emp-typ-container">
              <BsBriefcaseFill className="job-icons" />
              <p className="job-icon-label">{employmentType}</p>
            </div>
          </div>
          <p className="job-icon-label">{packagePerAnnum}</p>
        </div>
        <hr />
        <h1 className="jd-head">Description</h1>
        <p className="job-desc">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobCard
