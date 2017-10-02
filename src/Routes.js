import React,{Component} from 'react';
import {BrowserRouter,Route,Link} from 'react-router-dom';
import * as firebase from 'firebase';
import { Layout,Menu,Icon,notification } from 'antd';
const { Header } = Layout;
import Create from './Create';
import ShowBids from './ShowBids';

class Routes extends Component{

    constructor(){
        super();
        this.state={
            loggedIn:false,
            currentUser:null,
            signInText:'login'
        };
        this.handleHeaderClicked=this.handleHeaderClicked.bind(this);
        this.authRedirectSuccess=this.authRedirectSuccess.bind(this);
        this.handleAuthChange=this.handleAuthChange.bind(this);
        this.renderCreate=this.renderCreate.bind(this);
    }

    componentDidMount(){
        firebase.auth().getRedirectResult().then(this.authRedirectSuccess).catch(this.authRedirectFail);
        firebase.auth().onAuthStateChanged(this.handleAuthChange)
    }

    handleAuthChange(user){
        if(user !== null){
            this.setState({loggedIn : true, currentUser:user, signInText:'sign out'});
        }
    }

    authRedirectSuccess(result){
        if(result.user !=null){
            notification.success({
              message: 'Successfull '+result.user.displayName
         });
         }
    }

    authRedirectFail(reason){
        console.log(reason);
    }

    handleHeaderClicked(propsPassed){

        if(propsPassed.key === '5'){
            if(this.state.loggedIn !== true){
                let provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithRedirect(provider);
            }
            
            else{
                firebase.auth().signOut();
            }
        }
    }

    renderCreate(props){
        return(<Create routeProps={props} currentUser={this.state.currentUser} />);
    }

    render(){
        return(
                <BrowserRouter>
                <div>
                <Layout>
                <Header style={{ background: '#fff',lineHeight: '64px' }}>
                    <Menu theme='light' mode='horizontal'>
                    <Menu.Item key="1" >
                    <Link to='/create'> <Icon type="file-text" />
                            <span className="nav-text">Create</span></Link>
                        </Menu.Item>
                        <Menu.Item key="5" style={{ float: 'right' }}>
                            <Icon type="user" />
                            <span className="nav-text">{this.state.signInText}</span>
                        </Menu.Item>
                    </Menu>
                    <Menu theme="light" mode="horizontal" 
                        onClick={this.handleHeaderClicked}
                        >
                        
                    </Menu>
                </Header>
                </Layout>
                    <Route path='/create' render={this.renderCreate} />
                    <Route path='/showbids' component={ShowBids}/>
                </div>
                </BrowserRouter>
        );
    }
}

export default Routes;