import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobCard from '../JobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileApiStatus: apiStatusConstants.initial,
    jobsList: [],
    jobsApiStatus: apiStatusConstants.initial,
    checkBoxList: [],
    activeSalaryRange: 0,
    searchQuery: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobData()
  }

  getProfileData = async () => {
    this.setState({
      profileApiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        profileApiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobData = async () => {
    this.setState({
      jobsApiStatus: apiStatusConstants.inProgress,
    })

    const {checkBoxList, activeSalaryRange, searchQuery} = this.state
    const checkboxInputs = checkBoxList.join(',')
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${activeSalaryRange}&search=${searchQuery}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedJobData = data.jobs.map(eachItem => ({
        id: eachItem.id,
        location: eachItem.location,
        title: eachItem.title,
        rating: eachItem.rating,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        jobDescription: eachItem.job_description,
        packagePerAnnum: eachItem.package_per_annum,
      }))

      this.setState({
        jobsList: updatedJobData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        jobsApiStatus: apiStatusConstants.failure,
      })
    }
  }

  retryProfile = () => {
    this.getProfileData()
  }

  onClickCheckbox = event => {
    const {checkBoxList} = this.state

    if (checkBoxList.includes(event.target.id)) {
      const updatedList = checkBoxList.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({checkBoxList: updatedList}, this.getJobData)
    } else {
      this.setState(
        prevState => ({
          checkBoxList: [...prevState.checkBoxList, event.target.id],
        }),
        this.getJobData,
      )
    }
  }

  onActiveSalary = event => {
    this.setState({activeSalaryRange: event.target.id}, this.getJobData)
  }

  onChangeSearch = event => {
    this.setState({searchQuery: event.target.value})
  }

  onSubmitSearch = () => {
    this.getJobData()
  }

  onEnterSearch = event => {
    if (event.key === 'Enter') {
      this.getJobData()
    }
  }

  renderEmployeeType = () => (
    <ul className="emp-type-container">
      {employmentTypesList.map(eachItem => (
        <li key={eachItem.employmentTypeId} className="filter-list">
          <input
            className="filter-input"
            type="checkbox"
            onChange={this.onClickCheckbox}
            id={eachItem.employmentTypeId}
          />
          <label className="filter-label" htmlFor={eachItem.employmentTypeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderSalaryRange = () => (
    <ul className="emp-type-container">
      {salaryRangesList.map(eachItem => (
        <li key={eachItem.salaryRangeId} className="filter-list">
          <input
            className="filter-input"
            type="radio"
            name="option"
            id={eachItem.salaryRangeId}
            onChange={this.onActiveSalary}
          />
          <label className="filter-label" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderSearchBar = () => {
    const {searchQuery} = this.state
    return (
      <div className="search-bar-container">
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={this.onChangeSearch}
          onKeyDown={this.onEnterSearch}
        />
        <button
          onClick={this.onSubmitSearch}
          className="serach-btn"
          type="button"
          data-testid="searchButton"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderProfileSuccess = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-bg-container">
        <img src={profileImageUrl} alt="profile" className="profile-avatar" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileLoading = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailure = () => (
    <div>
      <button
        type="button"
        onClick={this.retryProfile}
        className="profile-retry-btn"
      >
        Retry
      </button>
    </div>
  )

  renderProfileResult = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccess()
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      case apiStatusConstants.inProgress:
        return this.renderProfileLoading()
      default:
        return null
    }
  }

  renderJobSuccess = () => {
    const {jobsList} = this.state
    const showTheList = jobsList.length >= 1

    if (showTheList) {
      return (
        <ul className="job-li-container">
          {jobsList.map(eachItem => (
            <JobCard key={eachItem.id} eachJob={eachItem} />
          ))}
        </ul>
      )
    }
    return this.renderNoJobs()
  }

  renderNoJobs = () => (
    <div className="job-fail-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-job-img"
      />
      <h1 className="no-job-head">No Jobs Found</h1>
      <p className="no-job-desc">
        we could not find any jobs. Try other filters
      </p>
    </div>
  )

  retryJobData = () => {
    this.getJobData()
  }

  renderJobLoading = () => (
    <div className="job-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsFailView = () => (
    <div className="job-fail-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-job-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p className="no-job-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        onClick={this.retryJobData}
        className="profile-retry-btn"
      >
        Retry
      </button>
    </div>
  )

  renderJobDataResult = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobSuccess()
      case apiStatusConstants.failure:
        return this.renderJobsFailView()
      case apiStatusConstants.inProgress:
        return this.renderJobLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-bg-container">
          <div className="side-bar-container">
            <div className="sm-search-bar">{this.renderSearchBar()}</div>
            <div className="profile-container">
              {this.renderProfileResult()}
            </div>
            <hr />
            <h1 className="filter-head">Type of Employment</h1>
            {this.renderEmployeeType()}
            <hr />
            <h1 className="filter-head">Salary Range</h1>
            {this.renderSalaryRange()}
          </div>
          <div className="right-bar">
            <div className="lg-search-bar">{this.renderSearchBar()}</div>
            <div className="total-jobs-container">
              {this.renderJobDataResult()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
