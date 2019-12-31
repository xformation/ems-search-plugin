import * as React from 'react';
import { parse } from 'query-string';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
// import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import "../../../css/studentSearchApp.css";
import { studentServices } from '../_services/students.service';


export class StudentSearchPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            attendance: {
                min: "",
                max: ""
            },
            grades: {
                min: "",
                max: ""
            },
            aggregate: {
                min: "",
                max: ""
            },
            isApiCalled: false,
            studentsData: [],
            allData: [],
            itemsPerPage: 5,
            totalPages: 1,
            currentPage: 0,
            searchName: ""
        };
        this.onClickApply = this.onClickApply.bind(this);
        this.onClickClear = this.onClickClear.bind(this);
        this.onAttendaceChange = this.onAttendaceChange.bind(this);
        this.onGradesChange = this.onGradesChange.bind(this);
        this.onAggregateChange = this.onAggregateChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.createStudentJSX = this.createStudentJSX.bind(this);
        this.createPaginationJSX = this.createPaginationJSX.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.onClickNext = this.onClickNext.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
        this.calculateTotalPages = this.calculateTotalPages.bind(this);
        this.onCheckStudent = this.onCheckStudent.bind(this);
        this.checkAllStudent = this.checkAllStudent.bind(this);
    }

    componentDidMount() {
        this.setState({
            isApiCalled: true
        });
        let value = parse(window.location.search).value;
        if (value) {
            studentServices.searchStuent({ name: value }).then(
                (response: any) => {
                    this.setState({
                        studentsData: response,
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
            studentServices.searchGetAllStuent().then(
                (response: any) => {
                    this.setState({
                        studentsData: response,
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

    onAttendaceChange(e: any) {
        const { name, value } = e.target;
        const { attendance } = this.state;
        if (name === "min-attendance") {
            attendance.min = value;
        } else {
            attendance.max = value;
        }
        this.setState({
            attendance: attendance
        });
    }

    onGradesChange(e: any) {
        const { name, value } = e.target;
        const { grades } = this.state;
        if (name === "min-grades") {
            grades.min = value;
        } else {
            grades.max = value;
        }
        this.setState({
            grades: grades
        });
    }

    onAggregateChange(e: any) {
        const { name, value } = e.target;
        const { aggregate } = this.state;
        if (name === "min-aggregate") {
            aggregate.min = value;
        } else {
            aggregate.max = value;
        }
        this.setState({
            aggregate: aggregate
        });
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
                        let student = allData[i];
                        let name = student.studentName + " " + student.studentMiddleName + " " + student.studentLastName;
                        name = name.toLowerCase();
                        if (name.indexOf(value.toLowerCase()) !== -1) {
                            result.push(student);
                        }
                    }
                    this.setState({
                        studentsData: result
                    });
                    this.calculateTotalPages(result);
                }
            } else {
                this.setState({
                    studentsData: allData
                });
                this.calculateTotalPages(allData);
            }
        }
    }

    onClickApply() {
        const { attendance, grades, aggregate } = this.state;
        if ((attendance.min && attendance.max) || (grades.min && grades.max) || (aggregate.min && aggregate.max)) {
            let data: any = {
                filters: []
            };
            let sendData: any = {};
            if (attendance.min && attendance.max) {
                sendData.attendance = attendance.min + "-" + attendance.max;
            }
            if (grades.min && grades.max) {
                sendData.grades = grades.min + "-" + grades.max;
            }
            if (aggregate.min && aggregate.max) {
                sendData.aggregate = aggregate.min + "-" + aggregate.max;
            }
            data.filters.push(sendData);
            this.setState({
                isApiCalled: true
            });
            studentServices.searchStuent("filters=" + JSON.stringify(data)).then(
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
            attendance: {
                min: "",
                max: ""
            },
            grades: {
                min: "",
                max: ""
            },
            aggregate: {
                min: "",
                max: ""
            }
        });
    }

    calculateTotalPages(students: any) {
        const { itemsPerPage } = this.state;
        if (students && students.length > 0) {
            let totalPages = Math.ceil(students.length / itemsPerPage);
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

    createStudentJSX() {
        const { studentsData, isApiCalled, currentPage, itemsPerPage } = this.state;
        let retData = [];
        const length = studentsData.length;
        if (length > 0) {
            for (let i = 0; i < length; i++) {
                const student = studentsData[i];
                const pageFactor = Math.floor(i / itemsPerPage);
                if (pageFactor === currentPage) {
                    retData.push(
                        <div className="contant-row">
                            <div className="row">
                                <div className="col-xs-6 col-sm-6 col-md-2 image-check">
                                <input type="checkbox" className="checkbox" name={student.teacherName} onChange={e => this.onCheckStudent(student, e)} checked={student.isChecked} />
                                    <span><img src="public/plugins/cms-ui-search-plugin/img/students.png" alt="" /></span>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-7 name-contant">
                                    <div className="name">{student.studentName} {student.studentMiddleName} {student.studentLastName}</div>
                                    <div className="row admission-contant">
                                        <div className="col-12 col-md-4">
                                            <div className="admission_no">
                                                <span>Admission No:</span>
                                                <p>{student.id}</p>
                                            </div>
                                            <div className="admission_no">
                                                <span>Student Id:</span>
                                                <p>{student.id}</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="admission_no">
                                                <span>Roll No:</span>
                                                <p>{student.id}</p>
                                            </div>
                                            <div className="admission_no">
                                                <span>Department</span>
                                                <p>{student.department.name}</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="admission_no">
                                                <span>Class:</span>
                                                <p>{student.batch.batch}</p>
                                            </div>
                                            <div className="admission_no">
                                                <span>Section:</span>
                                                <p>{student.section.section}</p>
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
                <div className="text-center">There is no student.</div>
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

    onCheckStudent(student: any, e: any) {
        const { name, checked } = e.target;
        student.isChecked = checked;
    }

    checkAllStudent(e:any){
        const { checked } = e.target;
        const { studentsData } = this.state;
        this.setState({
            isAllChecked: checked
        });
        let length = studentsData.length;
        for (let i = 0; i < length; i++) {
            const student = studentsData[i];
            student.isChecked = checked;
        }
        this.setState({
            studentsData: studentsData
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
                                    <h4>Attendance</h4>
                                    <div className="rainge">
                                        <div className="min-box">
                                            <label>Min</label>
                                            <select name="min-attendance" onChange={this.onAttendaceChange} value={state.attendance.min}>
                                                <option value="">Min</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                        </div>
                                        <div className="mix-box">
                                            <label>Max</label>
                                            <select name="max-attendance" onChange={this.onAttendaceChange} value={state.attendance.max}>
                                                <option value="">Max</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="box">
                                    <h4>Grades</h4>
                                    <div className="rainge">
                                        <div className="min-box">
                                            <label>Min</label>
                                            <select name="min-grades" onChange={this.onGradesChange} value={state.grades.min}>
                                                <option value="">Min</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                        </div>
                                        <div className="mix-box">
                                            <label>Max</label>
                                            <select name="max-grades" onChange={this.onGradesChange} value={state.grades.max}>
                                                <option value="">Max</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="box">
                                    <h4>Aggregate</h4>
                                    <div className="rainge">
                                        <div className="min-box">
                                            <label>Min</label>
                                            <select name="min-aggregate" onChange={this.onAggregateChange} value={state.aggregate.min}>
                                                <option value="">Min</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                        </div>
                                        <div className="mix-box">
                                            <label>Max</label>
                                            <select name="max-aggregate" onChange={this.onAggregateChange} value={state.aggregate.max}>
                                                <option value="">Max</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-10">
                        <div className="students-main">
                            <div className="students-heading">
                                <h3>Students</h3>
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
                                                <input type="checkbox" className="checkbox" name="AllCheck" onChange={this.checkAllStudent} checked={this.state.isAllChecked} />
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
                                            {this.createStudentJSX()}
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
