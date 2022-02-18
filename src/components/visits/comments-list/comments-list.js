import React from 'react';

import CommentsListItem from '../comments-list-item';

const CommentsList = ({ comments, onDeleted }) => {
  const elements = comments.map((item) => {
    const { id, ...itemProps } = item;
    return (
      <div key={id}><CommentsListItem {...itemProps}
      onDeleted={() => onDeleted(id)} /></div>
      )
    })
  return (
    <div>
      {elements}
    </div>
  )
}

export default CommentsList;