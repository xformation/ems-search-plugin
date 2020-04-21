import * as React from 'react';
import { parse } from 'query-string';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
// import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import "../../../css/StudentSearchApp.css";
import { staffServices } from '../_services/staffs.service';

export class StaffSearchPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            capcity: {
                min: "",
                max: ""
            },
            staffsData: [],
            allData: [],
            isApiCalled: false,
            isCollapsedOwnership: false,
            isCollapsedType: false,
            isCollapsedStatus: false,
            bus: "0",
            minibus: "0",
            car: "0",
            auto: "0",
            contract: "0",
            owned: "0",
            temporary: "0",
            permenant: "0",
            itemsPerPage: 5,
            totalPages: 1,
            currentPage: 0,
            searchName: "",
            isAllChecked: false
        };

        this.onClickApply = this.onClickApply.bind(this);
        this.onClickClear = this.onClickClear.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.createTeacherJSX = this.createTeacherJSX.bind(this);
        this.createPaginationJSX = this.createPaginationJSX.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.onClickNext = this.onClickNext.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
        this.calculateTotalPages = this.calculateTotalPages.bind(this);
        this.onCheckStaff = this.onCheckStaff.bind(this);
        this.checkAllStaff = this.checkAllStaff.bind(this);
        this.createSelectbox = this.createSelectbox.bind(this);
        this.onAttendaceChange = this.onAttendaceChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            isApiCalled: true
        });
        let value = parse(window.location.search).value;
        if (value) {
            staffServices.searchStaff({ name: value }).then(
                (response: any) => {
                    this.setState({
                        staffsData: response,
                        allData: response
                    });
                    this.calculateTotalPages(response);
                    this.setState({
                        isApiCalled: false
                    });
                },
                error => {
                    this.setState({
                        isApiCalled: false
                    });
                }
            );
        } else {
            staffServices.searchGetAllStaff().then(
                (response: any) => {
                    this.setState({
                        staffsData: response,
                        allData: response
                    });
                    this.calculateTotalPages(response);
                    this.setState({
                        isApiCalled: false
                    });
                },
                error => {
                    this.setState({
                        isApiCalled: false
                    });
                }
            );
        }

    }

    onStateChange(e: any) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
        if (name === "searchName") {
            let result = [];
            const { allData } = this.state;
            if (value !== "") {
                if (allData && allData.length > 0) {
                    for (let i = 0; i < allData.length; i++) {
                        let staff = allData[i];
                        let name = staff.teacherName + " " + staff.staffMiddleName + " " + staff.staffLastName;
                        name = name.toLowerCase();
                        if (name.indexOf(value.toLowerCase()) !== -1) {
                            result.push(staff);
                        }
                    }
                    this.setState({
                        staffsData: result
                    });
                    this.calculateTotalPages(result);
                }
            } else {
                this.setState({
                    staffsData: allData
                });
                this.calculateTotalPages(allData);
            }
        }
    }

    calculateTotalPages(teaches: any) {
        const { itemsPerPage } = this.state;
        if (teaches && teaches.length > 0) {
            let totalPages = Math.ceil(teaches.length / itemsPerPage);
            this.setState({
                totalPages: totalPages,
                currentPage: 0
            });
        } else {
            this.setState({
                totalPages: 1,
                currentPage: 0
            });
        }
    }

    toggleCollapse(collasedItem: any) {
        this.setState({
            [collasedItem]: !this.state[collasedItem]
        });
    }

    onClickApply() {
        const { capcity } = this.state;
        let data: any = {
            filters: []
        };
        let sendData: any = {};
        if (capcity.min && capcity.max) {
            sendData.capcity = capcity.min + "-" + capcity.max;
        }
        data.filters.push(sendData);
        this.setState({
            isApiCalled: true
        });
        staffServices.searchStaff("filters=" + JSON.stringify(data)).then(
            (response: any) => {
                console.log(response);
                this.setState({
                    isApiCalled: false
                });
            },
            error => {
                this.setState({
                    isApiCalled: false
                });
            }
        );
    }

    onClickClear() {
        this.setState({
            capcity: {
                min: "",
                max: ""
            },
            bus: "0",
            minibus: "0",
            car: "0",
            auto: "0",
            contract: "0",
            owned: "0",
            temporary: "0",
            permenant: "0"
        });
    }

    onChangeCheckbox(e: any) {
        const { name, checked } = e.target;
        this.setState({
            [name]: checked ? "1" : "0"
        });
    }

    onAttendaceChange(e: any) {
        const { name, value } = e.target;
        const { capcity } = this.state;
        if (name === "min-capcity") {
            capcity.min = value;
        } else {
            capcity.max = value;
        }
        this.setState({
            capcity: capcity
        });
    }

    createSelectbox() {
        const allData = [];
        for (let i = 0; i < 100; i++) {
            allData.push(
                <option value={i + 1}>{i + 1}</option>
            );
        }
        return allData;
    }

    onCheckStaff(staff: any, e: any) {
        const { name, checked } = e.target;
        staff.isChecked = checked;
    }

    createTeacherJSX() {
        const { staffsData, isApiCalled, currentPage, itemsPerPage } = this.state;
        let retData = [];
        const length = staffsData.length;
        if (length > 0) {
            for (let i = 0; i < length; i++) {
                const staff = staffsData[i];
                const pageFactor = Math.floor(i / itemsPerPage);
                if (pageFactor === currentPage) {
                    retData.push(
                        <div className="contant-row">
                            <div className="row">
                                <div className="col-xs-6 col-sm-6 col-md-2 image-check">
                                    <input type="checkbox" className="checkbox" name={staff.staffName} onChange={e => this.onCheckStaff(staff, e)} checked={staff.isChecked} />
                                    <span><img src="" alt="" /></span>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-7 name-contant">
                                    <div className="name">{staff.staffName} {staff.staffMiddleName} {staff.staffLastName}</div>
                                    <div className="row admission-contant">
                                        <div className="col-12 col-md-4">
                                            <div className="admission_no">
                                                <span>Admission No:</span>
                                                <p>{staff.id}</p>
                                            </div>
                                            <div className="admission_no">
                                                <span>Student Id:</span>
                                                <p>{staff.id}</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="admission_no">
                                                <span>Roll No:</span>
                                                <p>{staff.id}</p>
                                            </div>
                                            <div className="admission_no">
                                                <span>Department</span>
                                                <p>{staff.department.name}</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="admission_no">
                                                <span>Class:</span>
                                                <p>{staff.branch.branchName}</p>
                                            </div>
                                            <div className="admission_no">
                                                <span>Status:</span>
                                                <p>{staff.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-6 col-sm-12 col-md-3 right-button">
                                    <ul>
                                        <li><i className="fa fa-envelope"></i></li>
                                        <li><i className="fa fa-trash"></i></li>
                                        <li><i className="fa fa-print"></i></li>
                                        <li><i className="fa fa-cloud-download"></i></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        } else if (isApiCalled) {
            retData.push(
                <div className="text-cetner loading_img">
                    <img src="public/plugins/cms-ui-search-plugin/img/loader.gif" alt="Loader" />
                </div>
            );
        } else {
            retData.push(
                <div className="text-center">There is no staff.</div>
            );
        }
        return retData;
    }

    changeCurrentPage(currentPage: any) {
        this.setState({
            currentPage: currentPage
        });
    }

    createPaginationJSX() {
        const { totalPages, currentPage } = this.state;
        let retData = [];
        for (let i = 0; i < totalPages; i++) {
            retData.push(
                <li className={(currentPage === i ? ' active' : '')}><a href="#" onClick={e => this.changeCurrentPage(i)}>{i + 1}</a></li>
            )
        }
        return retData;
    }

    onClickPrev() {
        const { currentPage } = this.state;
        if (currentPage - 1 >= 0) {
            this.setState({
                currentPage: currentPage - 1
            });
        }
    }

    onClickNext() {
        const { currentPage, totalPages } = this.state;
        if ((currentPage + 1) < totalPages) {
            this.setState({
                currentPage: currentPage + 1
            });
        }
    }

    checkAllStaff(e:any){
        const { checked } = e.target;
        const { staffsData } = this.state;
        this.setState({
            isAllChecked: checked
        });
        let length = staffsData.length;
        for (let i = 0; i < length; i++) {
            const staff = staffsData[i];
            staff.isChecked = checked;
        }
        this.setState({
            staffsData: staffsData
        });
    }

    render() {
        const state = this.state;
        return (
            <section className="container-fluid">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-2">
                        <div className="bg-white filters-box">
                            <div className="heading">
                                <h5>Filters</h5>
                            </div>
                            <div className="filters-btn">
                                <button className="btn btn-secondary clear-btn" onClick={this.onClickClear} disabled={state.isApiCalled}>Clear</button>
                                <button className="btn btn-secondary apply-btn" onClick={this.onClickApply} disabled={state.isApiCalled}>Apply</button>
                            </div>
                            <div className="filterbox">
                            <div className="box">
                                    <h4>Capcity</h4>
                                    <div className="rainge">
                                        <div className="min-box">
                                            <label>Min</label>
                                            <select name="min-capcity" onChange={this.onAttendaceChange} value={state.capcity.min}>
                                                <option value="">Min</option>
                                                {this.createSelectbox()}
                                            </select>
                                        </div>
                                        <div className="mix-box">
                                            <label>Max</label>
                                            <select name="max-capcity" onChange={this.onAttendaceChange} value={state.capcity.max}>
                                                <option value="">Max</option>
                                                {this.createSelectbox()}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="box">
                                    <h4 onClick={e => this.toggleCollapse("isCollapsedType")} className="toggle">Vehicle Type <i className={"fa " + (this.state.isCollapsedType ? 'fa-chevron-down' : 'fa-chevron-up')}></i></h4>
                                    <div className={"rainge " + (this.state.isCollapsedType ? 'active' : '')}>
                                        <ul>
                                            <li>Bus <input type="checkbox" name="bus" className="checkbox" onChange={this.onChangeCheckbox} checked={state.bus === "1"} /></li>
                                            <li>Mini Bus <input type="checkbox" className="checkbox" name="minibus" onChange={this.onChangeCheckbox} checked={state.minibus === "1"} /></li>
                                            <li>Car <input type="checkbox" className="checkbox" name="car" onChange={this.onChangeCheckbox} checked={state.car === "1"} /></li>
                                            <li>Auto <input type="checkbox" className="checkbox" name="auto" onChange={this.onChangeCheckbox} checked={state.auto === "1"} /></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="box">
                                    <h4 onClick={e => this.toggleCollapse("isCollapsedOwnership")} className="toggle">Ownership <i className={"fa " + (this.state.isCollapsedOwnership ? 'fa-chevron-down' : 'fa-chevron-up')}></i></h4>
                                    <div className={"rainge " + (this.state.isCollapsedOwnership ? 'active' : '')}>
                                        <ul>
                                            <li>Contract <input type="checkbox" name="contract" className="checkbox" onChange={this.onChangeCheckbox} checked={state.contract === "1"} /></li>
                                            <li>Owned <input type="checkbox" className="checkbox" name="owned" onChange={this.onChangeCheckbox} checked={state.owned === "1"} /></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="box">
                                    <h4 onClick={e => this.toggleCollapse("isCollapsedStatus")} className="toggle">Contract Status <i className={"fa " + (this.state.isCollapsedStatus ? 'fa-chevron-down' : 'fa-chevron-up')}></i></h4>
                                    <div className={"rainge " + (this.state.isCollapsedStatus ? 'active' : '')}>
                                        <ul>
                                            <li>Temporary <input type="checkbox" name="temporary" className="checkbox" onChange={this.onChangeCheckbox} checked={state.temporary === "1"} /></li>
                                            <li>Permenant <input type="checkbox" className="checkbox" name="permenant" onChange={this.onChangeCheckbox} checked={state.permenant === "1"} /></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-10">
                        <div className="students-main">
                            <div className="students-heading">
                                <h3>Staffs</h3>
                            </div>
                            <div className="bg-white students-inner">
                                <div className="w-100">
                                    <div className="button-section">
                                        <select className="select">
                                            <option value="Class">Class</option>
                                            <option value="Class">Class</option>
                                            <option value="Class">Class</option>
                                        </select>
                                        <select className="select">
                                            <option value="Section">Section</option>
                                            <option value="Section">Section</option>
                                            <option value="Section">Section</option>
                                        </select>
                                        <input type="text" className="input" placeholder="Enter name" name="searchName" onChange={this.onStateChange} value={state.searchName} />
                                    </div>
                                    <div className="students-table">
                                        <div className="top-head">
                                            <div className="row">
                                                <div className="col-xs-12 col-sm-12 col-md-6 left">
                                                    <input type="checkbox" className="checkbox" name="AllCheck" onChange={this.checkAllStaff} checked={this.state.isAllChecked} />
                                                    <ul>
                                                        <li><i className="fa fa-refresh"></i></li>
                                                        <li><i className="fa fa-envelope"></i></li>
                                                        <li><i className="fa fa-trash"></i></li>
                                                        <li><i className="fa fa-print"></i></li>
                                                        <li><i className="fa fa-cloud-download"></i></li>
                                                    </ul>
                                                </div>
                                                <div className="col-xs-12 col-sm-12 col-md-6 right text-right">
                                                    <ul>
                                                        <li><a href="#" onClick={this.onClickPrev}><i className="fa fa-chevron-left"></i> Prev</a></li>
                                                        {this.createPaginationJSX()}
                                                        <li><a href="#" onClick={this.onClickNext}>Next <i className="fa fa-chevron-right"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="main-contant-row">
                                            {this.createTeacherJSX()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
