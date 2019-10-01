import React, { Component } from 'react'
import { Location } from '@reach/router'
import { Link } from 'gatsby'
import { Menu, X } from 'react-feather'
import Logo from './Logo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'
import './Nav.css'

const transparentCss = {
  background: 'transparent'
};

const transparentDepth = 200;

export class Navigation extends Component {
  state = {
    active: false,
    activeSubNav: false,
    currentPath: false,
    startTransparent: false,
    transparentBackground: false
  }

  componentWillMount = () =>
    this.setState({
      currentPath: this.props.location.pathname,
      startTransparent: this.props.startTransparent
    })

  componentDidMount = () => {
    window.addEventListener('scroll', this.setOpacity)
  }

  setOpacity = () => {
    if (this.state.startTransparent && window.scrollY < transparentDepth) {
      return this.setState({transparentBackground: true})
    }
    return this.setState({transparentBackground: false})
  }

  handleMenuToggle = () => this.setState({ active: !this.state.active })

  // Only close nav if it is open
  handleLinkClick = () => this.state.active && this.handleMenuToggle()

  toggleSubNav = subNav =>
    this.setState({
      activeSubNav: this.state.activeSubNav === subNav ? false : subNav
    })

  render() {
    const { active } = this.state,
      { subNav } = this.props,
      NavLink = ({ to, className, children, ...props }) => (
        <Link
          to={to}
          className={`NavLink ${
            to === this.state.currentPath ? 'active' : ''
          } ${className}`}
          onClick={this.handleLinkClick}
          {...props}
        >
          {children}
        </Link>
      )

    return (
      <nav className={`Nav ${active ? 'Nav-active' : ''}`} style={this.state.transparentBackground ? transparentCss : null }>
        <div className="Nav--Container container">
          <Link to="/" onClick={this.handleLinkClick}>
            <Logo />
          </Link>
          <div className="Nav--Links">
            <NavLink to="/">Home</NavLink>
            {/* <NavLink to="/components/">Components</NavLink> */}
            <div
              className={`Nav--Group ${
                this.state.activeSubNav === 'posts' ? 'active' : ''
              }`}
            >
              <span
                className={`NavLink Nav--GroupParent ${
                  this.props.location.pathname.includes('posts') ||
                  this.props.location.pathname.includes('blog') ||
                  this.props.location.pathname.includes('post-categories')
                    ? 'active'
                    : ''
                }`}
                onClick={() => this.toggleSubNav('posts')}
              >
                Blog
              </span>
              <div className="Nav--GroupLinks">
                <NavLink to="/blog/" className="Nav--GroupLink">
                  All Posts
                </NavLink>
                {subNav.posts.map((link, index) => (
                  <NavLink
                    to={link.slug}
                    key={'posts-subnav-link-' + index}
                    className="Nav--GroupLink"
                  >
                    {link.title}
                  </NavLink>
                ))}
              </div>
            </div>
            <NavLink 
              to="/tutorials/"
              className={`NavLink Nav--GroupParent ${
                this.props.location.pathname.includes('tutorials')
                  ? 'active'
                  : ''
                }`}
            >
              Tutorials
            </NavLink>
            {/* <NavLink to="/default/">Default</NavLink> */}
            {/* <NavLink to="/contact/">Contact</NavLink> */}
            <a href="https://github.com/antoinedao">
              <FontAwesomeIcon icon={faGithub} size="lg" color="#00C2BD" />
            </a>
            <a href="https://www.linkedin.com/in/antoinedao/">
              <FontAwesomeIcon icon={faLinkedin} size="lg" color="#00C2BD" />
            </a>
            <a href="https://twitter.com/ntoinedao">
              <FontAwesomeIcon icon={faTwitter} size="lg" color="#00C2BD" />
            </a>
          </div>
          <button
            className="Button-blank Nav--MenuButton"
            onClick={this.handleMenuToggle}
          >
            {active ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
    )
  }
}

export default ({ subNav, startTransparent }) => (
  <Location>{route => <Navigation startTransparent={startTransparent} subNav={subNav} {...route} />}</Location>
)
