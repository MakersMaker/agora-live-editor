import React,{Component} from 'react';

export default class Console extends React.Component {

    state = {
        result : ''
    }

    props ={

    }

    constructor(props) {
        super(props);
    }
    render(){
        return  (
            <div>
                <input type="button" value="버튼" onClick={()=>{this.testCompile();}}/><br/>
                코드결과값<br/>
                {this.state.result}
            </div>
        );
    }

    testCompile(){
        console.log(this.props.text);
        // axios({
        //   url: 'https://localhost:8081/compile',
        //   method: 'post',
        //   data: {
        //     fileName: this.state.file.name,
        //     fileContent : this.editor.getModel().value
        //   },
        //   validateStatus:false
        // }).then((res)=>{
        //   this.setState({result : res.data.output})
        // });

      }

}
