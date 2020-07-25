import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      num:0,
    }
  }
  componentWillMount(){
    console.log('组件将要加载');
  }
  componentWillReceiveProps(props){
    console.log('props');
  }
  componentWillUpdate(){
    console.log('组件将要更新');
  }
  componentDidUpdate(){
    console.log('组件更新完成');
  }
  componentDidMount(){
    console.log('组件加载完成');
  }
  handlerClick(){
    // 修改状态唯一方法
    this.setState({
      num:this.state.num + 1
    })
  }
  render(){
    console.log(this.props.name)
    return(
      <div className="main-container"> 
        <div id="case">
          hello, <span>react {this.state.num}</span>
          <button onClick={this.handlerClick.bind(this)}>摸我</button>
        </div>
      </div>
    )
  }
}
const title = 'active';
ReactDOM.render(
  <Home name={title} />,
  document.getElementById('root')
);


