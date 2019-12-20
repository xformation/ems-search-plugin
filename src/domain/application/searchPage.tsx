import * as React from 'react';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import { parse } from 'query-string';
import { StudentSearchPage } from './studentSearchPage';
import { TeacherSearchPage } from './teacherSearchPage';
import { StaffSearchPage } from './staffSearchPage';
import { VehicleSearchPage } from './vehicleSearchPage';

export class SearchPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeTab: 0,
    };
    this.toggleTab = this.toggleTab.bind(this);
  }

  componentDidMount(){
    let entity = parse(this.props.location.search).entity;
    let activeTab = 0;
    if(entity === "students"){
      activeTab = 0;
    } else if(entity === "teachers") {
      activeTab = 1;
    } else if(entity === "staff") {
      activeTab = 2;
    } else {
      activeTab = 3;
    }
    this.setState({
      activeTab: activeTab
    });
    
  }

  toggleTab(tabNo: any) {
    this.setState({
      activeTab: tabNo,
    });
  }

  render() {
    const {activeTab} = this.state;
    return (
      <section className="container-fluid search-tabs">
        <Nav tabs className="pl-3 pl-3 mb-4 mt-4 bottom-box-shadow">
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 0 ? 'active' : ''}`} onClick={() => { this.toggleTab(0); }} >
              Students
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 1 ? 'active' : ''}`} onClick={() => { this.toggleTab(1); }} >
              Teachers
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 2 ? 'active' : ''}`} onClick={() => { this.toggleTab(2); }} >
              Staff
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 3 ? 'active' : ''}`} onClick={() => { this.toggleTab(3); }} >
              Vehicle
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={0}>
            <StudentSearchPage />
          </TabPane>
          <TabPane tabId={1}>
            <TeacherSearchPage />
          </TabPane>
          <TabPane tabId={2}>
            <StaffSearchPage />
          </TabPane>
          <TabPane tabId={3}>
            <VehicleSearchPage />
          </TabPane>
        </TabContent>
      </section>
    );
  }
}
