import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import './index.css'

const SimilarJobs = props => {
  const {eachJob, updateId} = props
  const {
    id,
    location,
    title,
    rating,
    companyLogoUrl,
    employmentType,
    jobDescription,
  } = eachJob

  const updateJobDetail = () => updateId(id)

  return (
    <li onClick={updateJobDetail} className="smj-job-list">
      <Link className="job-card-link" to={`/jobs/${id}`}>
        <div className="smj-job-li-top">
          <img
            src={companyLogoUrl}
            alt=" similar job company logo"
            className="smj-company-logo"
          />
          <div>
            <h1 className="smj-job-title">{title}</h1>
            <div className="star-container">
              <FaStar className="star-icon" color="#fbbf24" />
              <p className="job-rating">{rating}</p>
            </div>
          </div>
        </div>
        <h1 className="smj-jd-head">Description</h1>
        <p className="smj-job-desc">{jobDescription}</p>
        <div className="smj-emp-typ-loc-container">
          <div className="smj-loc-container">
            <MdLocationOn className="smj-job-icons" />
            <p className="smj-job-icon-label">{location}</p>
          </div>
          <div className="emp-typ-container">
            <BsBriefcaseFill className="smj-job-icons" />
            <p className="smj-job-icon-label">{employmentType}</p>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default SimilarJobs
