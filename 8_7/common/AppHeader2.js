import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './AppHeader2.css';
import { Layout, Menu, Dropdown, Icon, Modal} from 'antd';
import Form from '../market/components/Form';

const { SubMenu } = Menu;
const { Header, Sider } = Layout;




class AppHeader2 extends Component {
    constructor(props) {
        super(props);   
        this.state = {
          isModalVisible : false,
        }
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
    }

    showModal = () =>{
      this.setState({
        isModalVisible: true,
      })
    }
    handleOk = () =>{
      this.setState({
        isModalVisible: false,
      })
    }
    handleCancel=()=>{
      this.setState({
        isModalVisible: false,
      })
    }
    render() {
        //console.log(this.props);
        let menuItems, menuItems_l;
        if(this.props.role === "ROLE_ADMIN") {
          menuItems = [ 
          <Menu.Item key="/adminmenu">
            <Link to="/adminmenu">
              Admin
            </Link>
          </Menu.Item>,
          <Menu.Item key="/profile" className="profile-menu">
          <ProfileDropdownMenu 
            currentUser={this.props.currentUser} 
            handleMenuClick={this.handleMenuClick}/>
          </Menu.Item>
        ]; 
      } else if(this.props.role === "ROLE_AUTHOR" || this.props.role ==="ROLE_USER") {

        if(this.props.isLoggedIn){//작가로그인, 거래소 로그인
          menuItems = [//상단 바
            <Menu.Item key="/market"><Link to="/">JOY 웹툰</Link></Menu.Item>,
            <Menu.Item key="/profile" className="profile-menu">
                  <ProfileDropdownMenu
                      currentUser={this.props.currentUser}
                      role={this.props.role}
                      isLoggedIn={this.props.isLoggedIn}
                      handleMenuClick={this.handleMenuClick}/>
            </Menu.Item>,
          ];
          menuItems_l = [//왼쪽 바
            <Menu.Item>
                    <Link to="/alltokens">전체 토큰 보기</Link>
                </Menu.Item>,
                <SubMenu
                  title={<span>내 토큰 보기</span>}>
                  <Menu.Item>
                    <Link to="/mytoken">내 보유 토큰</Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to="/tokenonsale">내 판매중 토큰</Link>
                  </Menu.Item>
                </SubMenu>,
                <Menu.Item>
                    <Link to="/tokenissuance">토큰 발행</Link>
                </Menu.Item>,
          ];
        }else{//작가, 사용자 로그인, 거래소 로그아웃
          menuItems = [
            <Menu.Item key="/market"><Link to="/">JOY 웹툰</Link></Menu.Item>,
            <Menu.Item key="transactionlogin"><Form  role={this.props.role} /></Menu.Item>,
            <Menu.Item key="/profile" className="profile-menu">
                  <ProfileDropdownMenu
                      currentUser={this.props.currentUser}
                      role={this.props.role}
                      isLoggedIn={this.props.isLoggedIn}
                      handleMenuClick={this.handleMenuClick}/>
            </Menu.Item>,
          ];
          menuItems_l = [
            <Menu.Item>
                    <Link to="/alltokens">전체 토큰 보기</Link>
                </Menu.Item>,
                <SubMenu
                  title={<span>내 토큰 보기</span>}>
                  <Menu.Item>
                    <Link to="/mytoken">내 보유 토큰</Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to="/tokenonsale">내 판매중 토큰</Link>
                  </Menu.Item>
                </SubMenu>,
                <Menu.Item>
                  <Link to="/tokenissuance">토큰 발행</Link>
                </Menu.Item>,
          ];
        }
      } else {//웹툰 페이지 로그아웃->거래소 로그인 할 수 있음
        if(this.props.isLoggedIn){//거래소 로그인됨
          menuItems = [
            <Menu.Item key="/market"><Link to="/">JOY 웹툰</Link></Menu.Item>,  
            <Menu.Item key="/profile" className="profile-menu">
                  <ProfileDropdownMenu
                      isLoggedIn={this.props.isLoggedIn}
                      handleMenuClick={this.handleMenuClick}/>
            </Menu.Item>,             
          ];
          menuItems_l = [
            <Menu.Item>
                    <Link to="/alltokens">전체 토큰 보기</Link>
                </Menu.Item>,
                <SubMenu
                  title={<span>내 토큰 보기</span>}>
                  <Menu.Item>
                    <Link to="/mytoken">내 보유 토큰</Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to="/tokenonsale">내 판매중 토큰</Link>
                  </Menu.Item>
                </SubMenu>,
                <Menu.Item>
                    <Link to="/tokenissuance">토큰 발행</Link>
                </Menu.Item>,
          ];
        }else{//웹툰 로그아웃, 거래소 로그아웃
          menuItems = [
            <Menu.Item key="/market"><Link to="/">JOY 웹툰</Link></Menu.Item>,  
            <Menu.Item key="transactionlogin"><Form  role={this.props.role} /></Menu.Item>,          
          ];
          menuItems_l = [
            <Menu.Item>
                    <Link to="/alltokens">전체 토큰 보기</Link>
                </Menu.Item>,
                <SubMenu
                  title={<span>내 토큰 보기</span>}>
                  <Menu.Item>
                    <Link to="/mytoken">내 보유 토큰</Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link to="/tokenonsale">내 판매중 토큰</Link>
                  </Menu.Item>
                </SubMenu>,
                <Menu.Item>
                    <Link to="/tokenissuance">토큰 발행</Link>
                </Menu.Item>,
          ];
        } 
      }


    if(window.location.pathname.indexOf('market')==-1&&window.location.pathname.indexOf('token')==-1){return null;}
    else{
    return (
      <Layout>
        <Header className="app-header">
          <div className="container">
            <div className="app-title" >
              <Link to="/market">JOY TOON 거래소</Link>
            </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '64px' }} >
                  {menuItems}
              </Menu>
          </div>
          </Header>
          <Layout>
            <Sider style={{ width:"200", background: '#025C30', height:"100vh", position: 'fixed', left: 0}} className="app-sider">
              <Menu
                mode="inline"
                defaultSelectedKeys={['1','2']}
                defaultOpenKeys={['sub1','sub2']}
                style={{ height: '100%', borderRight: 0 }}
              >
              {menuItems_l}
              </Menu>
            </Sider>
          </Layout>
      </Layout>
        );}
      }
    }

   

function ProfileDropdownMenu(props) {
  let dropdownMenu;
  if(props.isLoggedIn){
    if(props.role === "ROLE_AUTHOR" || props.role ==="ROLE_USER"){//거래소 로그인 상태, 웹툰페이지에선 작가 or user로 로그인된 상태
      dropdownMenu = (
        <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
          <Menu.Item key="user-info" className="dropdown-item" disabled>
            JOYTOON계정
            <div className="user-full-name-info">
              {props.currentUser.name}
            </div>
            <div className="username-info">
              @{props.currentUser.username}
            </div>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="tokenprofile" className="dropdown-item">
            <Link to="/tokenprofile">거래소 프로필</Link>
          </Menu.Item>,
          <Menu.Item key="logout" className="dropdown-item">
            Logout
          </Menu.Item>
        </Menu>
      );
      }else{//거래소 로그인 상태, 웹툰페이지에선 로그아웃 상태
        dropdownMenu = (
          <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
            <Menu.Item key="user-info" className="dropdown-item" disabled>
              JOYTOON계정 없음
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="tokenprofile" className="dropdown-item">
              <Link to="/tokenprofile">거래소 프로필</Link>
            </Menu.Item>,
            <Menu.Item key="logout" className="dropdown-item">
              Logout
            </Menu.Item>
          </Menu>
        );
      }
  }else{
      dropdownMenu = (
        <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
          <Menu.Item key="user-info" className="dropdown-item" disabled>
            JOYTOON계정
            <div className="user-full-name-info">
              {props.currentUser.name}
            </div>
            <div className="username-info">
              @{props.currentUser.username}
            </div>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="logout" className="dropdown-item">
            Logout(웹툰, 거래소 모두 로그아웃)
          </Menu.Item>
        </Menu>
      );
  }
  return (
      <Dropdown 
        overlay={dropdownMenu} 
        trigger={['click']}
        getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
        <a className="ant-dropdown-link">
           <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
        </a>
      </Dropdown>
    );
  }

    
    export default withRouter(AppHeader2);