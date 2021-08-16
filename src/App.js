import React, { Component } from 'react';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import { getCurrentUser } from './util/APIUtils';
import { ACCESS_TOKEN } from './constants';

import './App.css';
import Main from "./container/Main";
import WebtoonHome from "./container/WebtoonHome";
import Viewer from "./container/Viewer";

import Market from "./market/Market";

import Login from "./user/login/Login";
import Signup from "./user/signup/Signup";
import Profile from './user/profile/Profile';
import AppHeader from './common/AppHeader';
import AppHeader2 from './common/AppHeader2';
import NotFound from './common/NotFound';
import BanPage from './common/BanPage';
import LoadingIndicator from './common/LoadingIndicator';
import PrivateRoute from './common/PrivateRoute';

/*8/7일자 추가 import */
import ProfileRoute from './common/ProfileRoute';


import { Layout, notification } from 'antd';

import AdminMenu from './admin/AdminMenu';
import NewAdd from './admin/NewAdd';
import NewEpi from './admin/NewEpi';
import EditToonList from './admin/EditToonList';
import EditEpiList from './admin/EditEpiList';
import EditToon from './admin/EditToon';
import EditEpi from './admin/EditEpi';

import AllTokens from './market/AllTokens'
import MyToken from './market/MyToken'
import TokenProfile from './market/TokenProfile'
import TokenIssuance from './market/TokenIssuance'
import TokenIssuance_Epi from './market/TokenIssuance_Epi'
import TokenOnSale from './market/TokenOnSale'
//import TokenTransaction from './market/TokenTransaction'

//작가
import AuthorMenu from './author/AdminMenu';
import NewEpiAuthor from './author/NewEpi';
import NewAddAuthor from './author/NewAdd';
import EditToonListAuthor from './author/EditToonList';
import EditEpiListAuthor from './author/EditEpiList';
import EditToonAuthor from './author/EditToon';
import EditEpiAuthor from './author/EditEpi';

import * as authActions from './redux/actions/auth'
import { connect } from 'react-redux'

import Cash from './user/cash/Cash';
import MyLib from './user/mylib/MyLib';


const { Content } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
          currentUser: null,
          isAuthenticated: false,
          isLoading: false,
          role: null,
          username : null
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogin2 = this.handleLogin2.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3,
        });    

        /**
         * sessionStorage is internet browser's feature which stores data
         * until the browser tab is closed.
         */
         const walletFromSession = sessionStorage.getItem('walletInstance')
         const { integrateWallet, removeWallet } = this.props
         if (walletFromSession) {
           try {
             /**
              * 1. If 'walletInstance' value exists,
              * add it to caver's wallet and it's information to store
              * cf) redux/actions/auth.js -> integrateWallet()
              */
             integrateWallet(JSON.parse(walletFromSession).privateKey)
           } catch (e) {
             /**
              * 2. If value in sessionStorage is invalid wallet instance,
              * remove it from caver's wallet and it's information from store
              * cf) redux/actions/auth.js -> removeWallet()
              */
             console.error(e);
             removeWallet()
           }
         }

        
    }

    loadCurrentUser() {
        this.setState({
          isLoading: true
        });
        getCurrentUser()
        .then(response => {
          this.setState({
            role : response.authorities[0].authority,
            currentUser: response,
            isAuthenticated: true,
            isLoading: false,
            username : response.username
          }, function(){
          });
        }).catch(error => {
          this.setState({
            isLoading: false
          });  
        });
      }

      componentDidMount() {
        this.loadCurrentUser();
      }
    
      handleLogout(redirectTo="/", notificationType="success", description="로그아웃 되었습니다. 거래소도 자동 로그아웃됩니다") {
        localStorage.removeItem(ACCESS_TOKEN);
    
        this.setState({
          currentUser: null,
          isAuthenticated: false,
          role:null,
          username: null
        });
    
        this.props.history.push(redirectTo);
        
        this.handleTansactionLogout();

        notification[notificationType]({
          message: 'JOY Toon',
          description: description,
        });
      }

      handleTansactionLogout = (e) => {

        const { logout } = this.props;
        logout();
    
      }

      handleLogin() {
        notification.success({
          message: 'JOY Toon',
          description: "로그인 되었습니다.",
        });
        this.loadCurrentUser();
        this.props.history.push("/");
      }

      handleLogin2 = async () => {
        notification.success({
          message: 'JOY Toon',
          description: "로그인 되었습니다.",
        });
        
        await this.loadCurrentUser();
        
        if(this.state.role ==="ROLE_AUTHOR"){
          notification.success({
            message: '거래소',
            description: "작가 계정이 인증되었습니다.",
          });
        }

        this.props.history.push("/tokenissuance");
      }

    render() {
       const { isLoggedIn } = this.props
        if(this.state.isLoading) {
            return <LoadingIndicator />
          }
        return (
            <Layout className="app-container">
                <AppHeader isAuthenticated={this.state.isAuthenticated} 
                    currentUser={this.state.currentUser} 
                    onLogout={this.handleLogout} role={this.state.role}/>
                <AppHeader2 isAuthenticated={this.state.isAuthenticated} 
                    currentUser={this.state.currentUser} 
                    onLogout={this.handleLogout} role={this.state.role} isLoggedIn={isLoggedIn}/>

            <Content className="app-content">
                <div className="container">
                  <Switch>
                        <Route exact path="/" component={Main} />
                        {/* ":" 뒤에 있는 것은 prams */}
                        <Route path="/webtoon/:webtoonId" 
                        render={(props) => <WebtoonHome username={this.state.username} {...props} />}></Route>
                        <Route path="/viewer/:episodeId"
                        render={(props) => <Viewer username={this.state.username} {...props} />}></Route>
                        <Route path="/login" 
                        render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                        <Route path="/tokenissuance/login" 
                        render={(props) => <Login onLogin={this.handleLogin2} {...props} />}></Route>
                        <Route path="/signup" component={Signup}></Route>

                        <Route path="/market" 
                        render={(props) => <Market isLoggedIn={isLoggedIn} isAuthenticated={this.state.isAuthenticated} 
                          currentUser={this.state.currentUser} role={this.state.role}/>}></Route>
                        <Route path="/alltokens" 
                        render={(props) => <AllTokens isLoggedIn={isLoggedIn} role={this.state.role} />}></Route>
                        <Route path="/tokenprofile" 
                        render={(props) => <TokenProfile isLoggedIn={isLoggedIn} role={this.state.role}/>}></Route>
                        <Route path="/mytoken" 
                        render={(props) => <MyToken isLoggedIn={isLoggedIn} role={this.state.role}/>}></Route>
                        <Route path="/tokenissuance" 
                        render={(props) => <TokenIssuance isLoggedIn={isLoggedIn} isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} role={this.state.role}/>}></Route>
                        <Route path="/tokenissuance_Epi/:id" 
                        render={(props) => <TokenIssuance_Epi isLoggedIn={isLoggedIn} isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} role={this.state.role} {...props}/>}></Route>
                        <Route path="/tokenonsale" 
                        render={(props) => <TokenOnSale isLoggedIn={isLoggedIn} role={this.state.role}/>}></Route>

                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/newAdd" component={NewAdd} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/newEpi" component={NewEpi} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/adminmenu" component={AdminMenu} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/editList" component={EditToonList} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/editToon/:id" component={EditToon} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/editEpiList/:id" component={EditEpiList} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/editEpi/:id" component={EditEpi} handleLogout={this.handleLogout}></PrivateRoute>

                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/newAddAuthor" component={NewAddAuthor} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/newEpiAuthor" component={NewEpiAuthor} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/authormenu" component={AuthorMenu} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/editListAuthor" component={EditToonListAuthor} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/editToonAuthor/:id" component={EditToonAuthor} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/editEpiListAuthor/:id" component={EditEpiListAuthor} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/editEpiAuthor/:id" component={EditEpiAuthor} handleLogout={this.handleLogout}></PrivateRoute>
                        
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/cash/:username" component={Cash} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} path="/mylib/:username" component={MyLib} handleLogout={this.handleLogout}></PrivateRoute>
                        
                        <ProfileRoute isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser}></ProfileRoute>

                        <Route component={NotFound}></Route>
                        <Route component={BanPage}></Route>
                  </Switch>
                </div>
            </Content>
        </Layout>);
    }
}
const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
})

const mapDispatchToProps = (dispatch) => ({
  integrateWallet: (privateKey) => dispatch(authActions.integrateWallet(privateKey)),
  removeWallet: () => dispatch(authActions.removeWallet()),
  logout: () => dispatch(authActions.logout()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));



  /* 8/7일자 수정 전
  <Route path="/users/:username" 
  render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
  </Route>
  <Route path="/cash/:username" component={Cash}></Route>
  <Route path="/mylib/:username" component={MyLib}></Route>
  */

