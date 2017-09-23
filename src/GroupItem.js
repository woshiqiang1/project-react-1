import React, { Component } from 'react';
import './GroupItem.css'
export default class GroupItem extends Component {
    render() {

        return (
            <div className={'GroupItem ' + (this.props.seleted?'selected':'')}>
                <span className={'group-title'}>{this.props.title}</span>
                <a className="delete-icon iconfont" onClick={this.props.onDelete}>&#xe62d;</a>
            </div>
        )
    }
}