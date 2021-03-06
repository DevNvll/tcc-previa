import React, { Component } from 'react'

export default class Header extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      dropdownOpen: false
    }
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }
  render() {
    const auth = this.props
    return (
      <header className="main-header">
        <a href="/" className="logo">
          <span className="logo-mini" style={{ fontFamily: 'Open Sans' }}>
            <b>G</b>IF
          </span>
          <span style={{ fontFamily: 'Open Sans' }}>
            <b>Gest</b>IF
          </span>
        </a>
        <nav className="navbar navbar-static-top" role="navigation">
          <a
            href="#"
            className="sidebar-toggle"
            data-toggle="push-menu"
            role="button"
          >
            <i className="fa fa-bars" />
            <span className="sr-only">Toggle navigation</span>
          </a>
          <div className="navbar-custom-menu">
            <ul className="nav navbar-nav">
              <li className="dropdown user user-menu">
                <a
                  className="dropdown-toggle"
                  href="#"
                  onClick={() => this.props.auth.logout()}
                >
                  <span className="hidden-xs">Sair</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    )
  }
}
