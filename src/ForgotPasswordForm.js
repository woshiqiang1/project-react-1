import React, {Component} from 'react';
import './FrogetPasswordForm.css'

export default class ForgotPasswordForm extends Component {
    render() {
        return (
            <div className="forget-warpper">
                <h3 className="title">
                    重置密码
                </h3>
                <form className="forgetPassword" onSubmit={this.props.onSubmit}> {/* 登录*/}
                    <div className="row">
                        <input type="text" value={this.props.formData.email}
                               onChange={this.props.onChange.bind(null, 'email')}
                               placeholder="邮箱"/>
                    </div>
                    <div className="submit-row">
                        <button type="submit">发送重置邮件</button>
                        <a href="#" onClick={this.props.onSignIn}>返回登录</a>
                    </div>
                </form>
            </div>
        )
    }
}