import React from 'react'; // 为什么要 import React
class Welcome extends React.Component {
  constructor(props) {
    super(props)
    // 上面照抄，不懂的话看 MDN 
    this.state = {
      date: new Date(),
      test: '1'
    }
    console.log('我已经在 constructor 里将 props 和 state 初始化好了')
  }
  componentWillMount() {
    console.log('运行到这里的话，说明马上就要运行 render 了')
      this.setState({
        date: new Date(), // 更新 date
        test: 'componentWillMount'
      })
  }
  render() {
    console.log('嗯，这里是 render')
    return (
      <div>
        <h1>Hello,react {this.props.name}</h1>
        <h2>{this.state.date.toString()}</h2>
        <p>{this.state.test}</p>
      </div>
    )
  }

  componentDidMount() {
    this.setState({
      date: new Date(), // 更新 date
      test: 'componentDidMount'
    })
    console.log('已经挂载到页面里了')
  }

  componentWillReceiveProps() {
    this.setState({
      date: new Date(), // 更新 date
      test: 'componentWillReceiveProps'
    })
  }
  shouldComponentUpdate() {
    this.setState({
      date: new Date(), // 更新 date
      test: 'shouldComponentUpdate'
    })
    return true;
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }
  componentWillUnmount() {
    console.log('要死了')
  }
}
export default Welcome // 为什么要 export，为什么要加 default