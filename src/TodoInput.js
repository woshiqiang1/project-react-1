import React from 'react';
import './TodoInput.css'

function submit(props, e) {
    if (e.key === 'Enter') {
        if(e.target.value.trim() !== ''){
            props.onSubmit(e)
        }else{
            alert('请输入something todo 再保存哦！')
        }

    }
}

function changeTitle(props, e) {
    props.onChange(e)
}

// 搞不清楚 bind 用法的同学，请看完 MDN
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
// 尤其是示例要看懂

export default function (props) {
    return <input type="text" value={props.content}
                  className="TodoInput"
                  onChange={changeTitle.bind(null, props)}
                  onKeyPress={submit.bind(null, props)}/> //bind除了指定this还可以指定第一个参数
}
