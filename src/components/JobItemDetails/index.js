import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: [],
    jdApiStatus: apiStatusConstants.initial,
    jdSimillarJobs: [],
    activeJobDetailId: '',
  }

  componentDidMount() {
    this.getJobDetails()
  }

  updateId = id => {
    const {activeJobDetailId} = this.state
    this.setState({activeJobDetailId: id}, this.getJobDetails)
  }

  getJobDetails = async () => {
    this.setState({jdApiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({activeJobDetailId: id})

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const updatedJDData = [data.job_details].map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        companyWebsiteUrl: eachItem.company_website_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        skills: eachItem.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: eachItem.life_at_company.description,
          imageUrl: eachItem.life_at_company.image_url,
        },
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      const updateSimilarJobData = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        employmentType: eachItem.employment_type,
        title: eachItem.title,
      }))

      this.setState({
        jobDetails: updatedJDData,
        jdApiStatus: apiStatusConstants.success,
        jdSimillarJobs: updateSimilarJobData,
      })
    } else {
      this.setState({jdApiStatus: apiStatusConstants.failure})
    }
  }

  retryJobDetailData = () => {
    this.getJobDetails()
  }

  renderJDSuccessView = () => {
    const {jobDetails, jdSimillarJobs} = this.state

    if (jobDetails.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        id,
        jobDescription,
        skills,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        title,
      } = jobDetails[0]

      return (
        <>
          <div className="jd-job-list">
            <div className="jd-job-li-top">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="jd-company-logo"
              />
              <div>
                <h1 className="jd-job-title">{title}</h1>
                <div className="star-container">
                  <FaStar className="star-icon" color="#fbbf24" />
                  <p className="job-rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="jd-emp-type-salary-container">
              <div className="jd-emp-typ-loc-container">
                <div className="jd-loc-container">
                  <MdLocationOn className="jd-job-icons" />
                  <p className="jd-job-icon-label">{location}</p>
                </div>
                <div className="jd-emp-typ-container">
                  <BsBriefcaseFill className="jd-job-icons" />
                  <p className="jd-job-icon-label">{employmentType}</p>
                </div>
              </div>
              <p className="jd-job-icon-label package">{packagePerAnnum}</p>
            </div>
            <hr className="hr-jdline" />
            <div className="desc-visit-container">
              <h1 className="detail-jd-head">Description</h1>
              <div className="anchor-cont">
                <a href={companyWebsiteUrl} className="visit-nav">
                  Visit
                </a>
                <BiLinkExternal className="visit-icon" />
              </div>
            </div>
            <p className="detail-job-desc">{jobDescription}</p>
            <h1 className="jd-skills">Skills</h1>
            <ul className="jd-skills-li-container">
              {skills.map(eachItem => (
                <li className="jd-skills-li" key={eachItem.name}>
                  <img
                    src={eachItem.imageUrl}
                    alt={eachItem.name}
                    className="jd-skill-icon"
                  />
                  <p className="jd-skill-label">{eachItem.name}</p>
                </li>
              ))}
            </ul>
            <div>
              <h1 className="jd-life-at-head">Life at Company</h1>
              <div className="life-at-container">
                <p className="jd-life-at-desc">{lifeAtCompany.description}</p>
                <img
                  className="life-at-img"
                  src={lifeAtCompany.imageUrl}
                  alt="life at company"
                />
              </div>
            </div>
          </div>
          <h1 className="jd-sm-job-head">Similar Jobs</h1>
          <div className="similar-jobs">
            <ul className="similarjob-container">
              {jdSimillarJobs.map(eachItem => (
                <SimilarJobs
                  key={eachItem.id}
                  eachJob={eachItem}
                  updateId={this.updateId}
                />
              ))}
            </ul>
          </div>
        </>
      )
    }
    return null
  }

  renderJDFailureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-job-img"
      />
      <h1 className="no-job-head">Oops! Something Went Wrong</h1>
      <p className="no-job-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button onClick={this.retryJobDetailData} className="profile-retry-btn">
        Retry
      </button>
    </>
  )

  renderLoader = () => (
    <div className="job-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetailsResult = () => {
    const {jdApiStatus} = this.state

    switch (jdApiStatus) {
      case apiStatusConstants.success:
        return this.renderJDSuccessView()
      case apiStatusConstants.failure:
        return this.renderJDFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jd-bg-container">{this.renderJobDetailsResult()}</div>
      </>
    )
  }
}

export default JobItemDetails
