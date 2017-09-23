//函数式定义组件，不可以使用state
import React from 'react';
import './SignUpForm.css'
export default function (props) {
    return (
        <form className="signUp" onSubmit={props.onSubmit.bind(this)}> {/* 注册*/}
            <div className="row">
                <input type="text" value={props.formData.email}
                       onChange={props.onChange.bind(null, 'email')}
                       placeholder="邮箱"/>
            </div>
            {/* bind 不仅可以绑定 this，还可以绑定第一个参数 */}
            <div className="row">
                <input type="text" value={props.formData.username}
                       onChange={props.onChange.bind(null, 'username')}
                       placeholder="用户名"/>
            </div>
            <div className="row">
                <input type="password" value={props.formData.password}
                       onChange={props.onChange.bind(null, 'password')}
                       placeholder="密码"/>
            </div>
            <div className="submit-row actions">
                <button type="submit">注册</button>
            </div>
        </form>
    )
}