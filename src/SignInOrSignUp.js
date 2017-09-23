import React, {Component} from 'react';
import SignUpForm from './SignUpForm'
import SignInForm from './SignInForm'
import './SignInOrSignUp.css'

export default class SignInOrSignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: 'signUp'
        }
    }

    switch(e) {
        this.setState({
            selected: e.target.value
        })
    }

    render() {
        return (
            <div className="signInOrSignUp">
                <nav>
                    <input type="radio" value="signUp" id="signUp"
                           checked={this.state.selected === 'signUp'}
                           onChange={this.switch.bind(this)}/>
                    <label htmlFor="signUp">注册</label>{/*注意jsx中html的for要写成htmlFor*/}

                    <input type="radio" value="signIn" id="signIn"
                           checked={this.state.selected === 'signIn'}
                           onChange={this.switch.bind(this)}/>
                    <label htmlFor="signIn">登录</label>
                </nav>
                <div className="panes">
                    {this.state.selected === 'signUp' ?
                        <SignUpForm formData={this.props.formData}
                                    onSubmit={this.props.onSignUp}
                                    onChange={this.props.onChange}/>
                        : null}
                    {this.state.selected === 'signIn' ?
                        <SignInForm formData={this.props.formData}
                                    onChange={this.props.onChange}
                                    onSubmit={this.props.onSignIn}
                                    onForgotPassword={this.props.onForgotPassword}/>
                        : null}
                </div>
            </div>
        )
    }
}