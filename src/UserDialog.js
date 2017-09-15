import React, {Component} from 'react';
import './UserDialog.css'
import {signUp, signIn, sendPasswordResetEmail} from './leanCloud'
import ForgotPasswordForm from './ForgotPasswordForm'
import SignInOrSignUp from './SignInOrSignUp'

export default class UserDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTab: 'signInOrSignUp', // 'forgotPassword'
            formData: {
                email: '',
                username: '',
                password: '',
            }
        }
    }

    signUp(e) {
        e.preventDefault()
        let {email, username, password} = this.state.formData
        let success = (user) => {
            this.props.onSignUp.call(null, user)

        }
        let error = (error) => {
            switch (error.code) {
                case 202:
                    alert('对不起，该用户名已被占用')
                    break
                default:
                    alert(error)
                    break
            }
        }
        signUp(email, password, success, error)
    }

    signIn(e) {
        e.preventDefault()
        let {username, password} = this.state.formData
        let success = (user) => {
            this.props.onSignIn.call(null, user)
        }
        let error = (error) => {
            console.log(error.code)
            switch (error.code) {
                case 210:
                    alert('用户名与密码不匹配')
                    break
                case 211:
                    alert('该用户是“黑户”，请注册后重新登录，谢谢！')
                    break
                default:
                    alert(error)

            }
        }
        signIn(username, password, success, error)
    }

    changeFormData(key, e) {
        let stateCopy = JSON.parse(JSON.stringify(this.state))  // 用 JSON 深拷贝
        stateCopy.formData[key] = e.target.value
        this.setState(stateCopy)
    }

    render() {

        return (
            <div className="UserDialog-Wrapper">
                <div className="UserDialog">
                    {
                        this.state.selectedTab === 'signInOrSignUp' ?//注意有三元运算符
                            <SignInOrSignUp
                                formData={this.state.formData}
                                onSignIn={this.signIn.bind(this)}
                                onSignUp={this.signUp.bind(this)}
                                onChange={this.changeFormData.bind(this)}
                                onForgotPassword={this.showForgotPassword.bind(this)}
                            /> ://注意有三元运算符
                            <ForgotPasswordForm
                                formData={this.state.formData}
                                onSubmit={this.resetPassword.bind(this)}
                                onChange={this.changeFormData.bind(this)}
                                onSignIn={this.returnToSignIn.bind(this)}
                            />}
                </div>
            </div>
        )
    }

    showForgotPassword() {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.selectedTab = 'forgotPassword'
        this.setState(stateCopy)
    }

    returnToSignIn() {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.selectedTab = 'signInOrSignUp'
        this.setState(stateCopy)
    }

    resetPassword(e) {
        e.preventDefault()
        sendPasswordResetEmail(this.state.formData.email)
    }
}