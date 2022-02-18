import React, {Component} from 'react';

import './app-header.css'

export default class AppHeader extends Component {

  state = {
    name: '',
    comment: ''
  }

  onNameChange = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  onCommentChange = (e) => {
    this.setState({
      comment: e.target.value
    })
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.onItemAdded(this.state.name, this.state.comment);
    this.setState({
      name: '',
      comment: ''
    })
  }

  render() {
    return (
      <div className="app-header">
        <form className="d-flex flex-column" onSubmit={this.onSubmit}>
          <input type="text"
          className = "form-control"
          value={this.state.name}
          onChange={this.onNameChange}
          placeholder="Ваше имя"
          required />
          <textarea rows="5"
          className="form-control"
          value={this.state.comment}
          placeholder="Ваш комментарий"
          onChange={this.onCommentChange}
          required />
          <button type="submit" className="btn btn-primary">
          Оставить комментарий</button>
        </form>
      </div>
    )
  }
}