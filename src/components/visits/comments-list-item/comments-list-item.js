import React, {Component} from 'react';

import './comments-list-item.css';

export default class CommentsListItem extends Component {
  render() {
    const { name, comment, date, onDeleted } = this.props;
    return (
      <div className="comments-block">
        <span className="comments-name">
          {name}
        </span>
        <div className="comment-text">
          {comment}
          <button 
            type="button"
            className="btn btn-outline-danger btn-sm float-right"
            onClick={onDeleted}>
            <i className="fa fa-trash-o"></i>
          </button>
          <p className="comments-date">{date}</p>
        </div>
      </div>
    )
  }
}
