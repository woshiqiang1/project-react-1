//函数式定义组件，不能使用state
import React from 'react';
import './SignInForm.css'
export default function (props) {
    return (
        <form className="signIn" onSubmit={props.onSubmit}> {/* 登录*/}
            <div className="username-row">
                <input type="text" value={props.formData.username}
                       onChange={props.onChange.bind(null, 'username')}
                       placeholder='用户名'/>
            </div>
            <div className="password-row">
                <input type="password" value={props.formData.password}
                       onChange={props.onChange.bind(null, 'password')}
                       placeholder='密码'/>
            </div>
            <div className="submit-row actions">
                <button type="submit">登录</button>
                <a href="#" onClick={props.onForgotPassword}>忘记密码了？</a>
            </div>
        </form>
    )
}