import React, { Component } from "react";

import AppHeader from "./app-header";
import CommentsList from "./comments-list";

export default class App extends Component {
  maxId = 100;

  options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };

  state = {
    comments: [
      // this.createComment('George', 'What a greate app!'),
      // this.createComment('Julia', 'Its awesome app builded on React!'),
      // this.createComment('Ivan', 'Weak skills, dude...')
    ]
  };

  regExp = /<\/?[a-z0-9]+>/gi;

  deleteTags(commentToDelete) {
    let comment = commentToDelete.replace(this.regExp, "");
    console.log(comment);
    return comment;
  }

  createComment(name, comment) {
    return {
      name,
      comment: this.deleteTags(comment),
      // comment,
      date: new Date().toLocaleString("ru", this.options),
      id: this.maxId++
    };
  }

  saveToLocal() {
    const local = this.state.comments;
    localStorage.setItem("key", JSON.stringify(local));
  }

  getLocal() {
    const str = localStorage.getItem("key");
    this.comments = JSON.parse(str);
  }

  deleteItem = id => {
    this.setState(({ comments }) => {
      const idx = comments.findIndex(el => el.id === id);
      const before = comments.slice(0, idx);
      const after = comments.slice(idx + 1);

      const newArray = [...before, ...after];
      this.saveToLocal();

      return {
        comments: newArray
      };
    });
  };

  addItem = (name, comment) => {
    const newItem = this.createComment(name, comment);
    this.setState(({ comments }) => {
      const newArr = [...comments, newItem];
      this.saveToLocal();
      return {
        comments: newArr
      };
    });
  };

  render() {
    const { comments } = this.state;
    this.saveToLocal();
    return (
      <div className="comments">
        <AppHeader onItemAdded={this.addItem} />
        <CommentsList comments={comments} onDeleted={this.deleteItem} />
      </div>
    );
  }
}
