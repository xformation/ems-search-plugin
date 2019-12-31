import * as React from 'react';
import { parse } from 'query-string';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
// import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import "../../../css/studentSearchApp.css";
import { teacherServices } from '../_services/teachers.service';

export class TeacherSearchPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            passing: {
                min: "",
                max: ""
            },
            subjects: {
                min: "",
                max: ""
            },
            teachersData: [],
            allData: [],
            isApiCalled: false,
            isCollapsed: false,
            visiting: "0",
            permanent: "0",
            fulltime: "0",
            parttime: "0",
            itemsPerPage: 5,
            totalPages: 1,
            currentPage: 0,
            searchName: "",
            isAllChecked: false
        };

        this.onClickApply = this.onClickApply.bind(this);
        this.onClickClear = this.onClickClear.bind(this);
        this.onPassingChange = this.onPassingChange.bind(this);
        this.onSubjectsChange = this.onSubjectsChange.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.createTeacherJSX = this.createTeacherJSX.bind(this);
        this.createPaginationJSX = this.createPaginationJSX.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.onClickNext = this.onClickNext.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
        this.calculateTotalPages = this.calculateTotalPages.bind(this);
        this.onCheckTeacher = this.onCheckTeacher.bind(this);
        this.checkAllTeacher = this.checkAllTeacher.bind(this);
    }

    componentDidMount() {
        this.setState({
            isApiCalled: true
        });
        let value = parse(window.location.search).value;
        if (value) {
            teacherServices.searchTeacher({ name: value }).then(
                (response: any) => {
                    this.setState({
                        teachersData: response,
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
            teacherServices.searchGetAllTeacher().then(
                (response: any) => {
                    this.setState({
                        teachersData: response,
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
                        let teacher = allData[i];
                        let name = teacher.teacherName + " " + teacher.teacherMiddleName + " " + teacher.teacherLastName;
                        name = name.toLowerCase();
                        if (name.indexOf(value.toLowerCase()) !== -1) {
                            result.push(teacher);
                        }
                    }
                    this.setState({
                        teachersData: result
                    });
                    this.calculateTotalPages(result);
                }
            } else {
                this.setState({
                    teachersData: allData
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

    toggleCollapse() {
        this.setState({
            isCollapsed: !this.state.isCollapsed
        });
    }

    onPassingChange(e: any) {
        const { name, value } = e.target;
        const { passing } = this.state;
        if (name === "min-passing") {
            passing.min = value;
        } else {
            passing.max = value;
        }
        this.setState({
            passing: passing
        });
    }

    onSubjectsChange(e: any) {
        const { name, value } = e.target;
        const { subjects } = this.state;
        if (name === "min-subjects") {
            subjects.min = value;
        } else {
            subjects.max = value;
        }
        this.setState({
            subjects: subjects
        });
    }

    onClickApply() {
        const { passing, subjects } = this.state;
        if ((passing.min && passing.max) || (subjects.min && subjects.max)) {
            let data: any = {
                filters: []
            };
            let sendData: any = {};
            if (passing.min && passing.max) {
                sendData.passing = passing.min + "-" + passing.max;
            }
            if (subjects.min && subjects.max) {
                sendData.subjects = subjects.min + "-" + subjects.max;
            }
            data.filters.push(sendData);
            this.setState({
                isApiCalled: true
            });
            teacherServices.searchTeacher("filters=" + JSON.stringify(data)).then(
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
    }

    onClickClear() {
        this.setState({
            passing: {
                min: "",
                max: ""
            },
            subjects: {
                min: "",
                max: ""
            }
        });
    }

    onChangeCheckbox(e: any) {
        const { name, checked } = e.target;
        this.setState({
            [name]: checked ? "1" : "0"
        });
    }

    createTeacherJSX() {
        const { teachersData, isApiCalled, currentPage, itemsPerPage } = this.state;
        let retData = [];
        const length = teachersData.length;
        if (length > 0) {
            for (let i = 0; i < length; i++) {
                const teacher = teachersData[i];
                const pageFactor = Math.floor(i / itemsPerPage);
                if (pageFactor === currentPage) {
                    retData.push(
                        <div className="contant-row">
                            <div className="row">
                                <div className="col-xs-6 col-sm-6 col-md-2 image-check">
                                    <input type="checkbox" className="checkbox" name={teacher.teacherName} onChange={e => this.onCheckTeacher(teacher, e)} checked={teacher.isChecked} />
                                    <span><img src="" alt="" /></span>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-7 name-contant">
                                    <div className="name">{teacher.teacherName} {teacher.teacherMiddleName} {teacher.teacherLastName}</div>
                                    <div className="row admission-contant">
                                        <div className="col-12 col-md-4">
                                            <div className="admission_no">
                                                <span>Admission No:</span>
                                                <p>{teacher.id}</p>
                                            </div>
                                            <div className="admission_no">
                                                <span>Student Id:</span>
                                                <p>{teacher.id}</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="admission_no">
                                                <span>Roll No:</span>
                                                <p>{teacher.id}</p>
                                            </div>
                                            <div className="admission_no">
                                                <span>Department</span>
                                                <p>{teacher.department.name}</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="admission_no">
                                                <span>Class:</span>
                                                <p>{teacher.branch.branchName}</p>
                                            </div>
                                            <div className="admission_no">
                                                <span>Status:</span>
                                                <p>{teacher.status}</p>
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
                <div className="text-center">There is no teacher.</div>
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

    onCheckTeacher(teacher: any, e: any) {
        const { name, checked } = e.target;
        teacher.isChecked = checked;
    }

    checkAllTeacher(e:any){
        const { checked } = e.target;
        const { teachersData } = this.state;
        this.setState({
            isAllChecked: checked
        });
        let length = teachersData.length;
        for (let i = 0; i < length; i++) {
            const teacher = teachersData[i];
            teacher.isChecked = checked;
        }
        this.setState({
            teachersData: teachersData
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
                                    <h4>Passing rate</h4>
                                    <div className="rainge">
                                        <div className="min-box">
                                            <label>Min</label>
                                            <select name="min-passing" onChange={this.onPassingChange} value={state.passing.min}>
                                                <option value="">Min</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </select>
                                        </div>
                                        <div className="mix-box">
                                            <label>Max</label>
                                            <select name="max-passing" onChange={this.onPassingChange} value={state.passing.max}>
                                                <option value="">Max</option>
                                                <option>6</option>
                                                <option>7</option>
                                                <option>8</option>
                                                <option>9</option>
                                                <option>10</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="box">
                                    <h4>No. of Subjects</h4>
                                    <div className="rainge">
                                        <div className="min-box">
                                            <label>Min</label>
                                            <select name="min-subjects" onChange={this.onSubjectsChange} value={state.subjects.min}>
                                                <option value="">Min</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </select>
                                        </div>
                                        <div className="mix-box">
                                            <label>Max</label>
                                            <select name="max-subjects" onChange={this.onSubjectsChange} value={state.subjects.max}>
                                                <option value="">Max</option>
                                                <option>6</option>
                                                <option>7</option>
                                                <option>8</option>
                                                <option>9</option>
                                                <option>10</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="box">
                                    <h4 onClick={this.toggleCollapse} className="toggle">Type of Faculty <i className={"fa " + (this.state.isCollapsed ? 'fa-chevron-down' : 'fa-chevron-up')}></i></h4>
                                    <div className={"rainge " + (this.state.isCollapsed ? 'active' : '')}>
                                        <ul>
                                            <li>Visiting <input type="checkbox" name="visiting" className="checkbox" onChange={this.onChangeCheckbox} checked={state.visiting === "1"} /></li>
                                            <li>Permanent <input type="checkbox" className="checkbox" name="permanent" onChange={this.onChangeCheckbox} checked={state.permanent === "1"} /></li>
                                            <li>Fulltime <input type="checkbox" className="checkbox" name="fulltime" onChange={this.onChangeCheckbox} checked={state.fulltime === "1"} /></li>
                                            <li>Parttime <input type="checkbox" className="checkbox" name="parttime" onChange={this.onChangeCheckbox} checked={state.parttime === "1"} /></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-10">
                        <div className="students-main">
                            <div className="students-heading">
                                <h3>Teachers</h3>
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
                                                    <input type="checkbox" className="checkbox" name="AllCheck" onChange={this.checkAllTeacher} checked={this.state.isAllChecked} />
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
