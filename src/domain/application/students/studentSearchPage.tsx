import * as React from 'react';
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
            isApiCalled: false
        };
        this.onClickApply = this.onClickApply.bind(this);
        this.onClickClear = this.onClickClear.bind(this);
        this.onAttendaceChange = this.onAttendaceChange.bind(this);
        this.onGradesChange = this.onGradesChange.bind(this);
        this.onAggregateChange = this.onAggregateChange.bind(this);

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
            attendance:{
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
                                        <input type="text" className="input" placeholder="Enter name" />
                                    </div>
                                    <div className="students-table">
                                        <div className="top-head">
                                            <div className="row">
                                                <div className="col-xs-12 col-sm-12 col-md-6 left">
                                                    <input type="checkbox" className="checkbox" />
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
                                                        <li><a href="#"><i className="fa fa-chevron-left"></i> Prev</a></li>
                                                        <li><a href="#">1</a></li>
                                                        <li><a href="#">2</a></li>
                                                        <li><a href="#">3</a></li>
                                                        <li><a href="#">4</a></li>
                                                        <li><a href="#">5</a></li>
                                                        <li><a href="#">Next <i className="fa fa-chevron-right"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="main-contant-row">
                                            <div className="contant-row">
                                                <div className="row">
                                                    <div className="col-xs-6 col-sm-6 col-md-2 image-check">
                                                        <input type="checkbox" className="checkbox" />
                                                        <span><img src="../../img/uicon_m.png" alt="" /></span>
                                                    </div>

                                                    <div className="col-xs-12 col-sm-12 col-md-7 name-contant">
                                                        <div className="name"><a href="#">Jeremy Andrew Rose</a></div>
                                                        <div className="row admission-contant">
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Admission No:</span>
                                                                    <p>951426</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Student Id:</span>
                                                                    <p>2019/21</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Roll No:</span>
                                                                    <p>951426</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Department</span>
                                                                    <p>Computer Science</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Class:</span>
                                                                    <p>First Year</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Section:</span>
                                                                    <p>C</p>
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
                                            <div className="contant-row">
                                                <div className="row">
                                                    <div className="col-xs-6 col-sm-6 col-md-2 image-check">
                                                        <input type="checkbox" className="checkbox" />
                                                        <span><img src="../../img/uicon_m.png" alt="" /></span>
                                                    </div>
                                                    <div className="col-xs-12 col-sm-12 col-md-7 name-contant">
                                                        <div className="name"><a href="#">Jeremy Andrew Rose</a></div>
                                                        <div className="row admission-contant">
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Admission No:</span>
                                                                    <p>951426</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Student Id:</span>
                                                                    <p>2019/21</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Roll No:</span>
                                                                    <p>951426</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Department</span>
                                                                    <p>Computer Science</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Class:</span>
                                                                    <p>First Year</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Section:</span>
                                                                    <p>C</p>
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
                                            <div className="contant-row">
                                                <div className="row">
                                                    <div className="ccol-xs-6 col-sm-6 col-md-2 image-check">
                                                        <input type="checkbox" className="checkbox" />
                                                        <span><img src="../../img/uicon_m.png" alt="" /></span>
                                                    </div>
                                                    <div className="col-xs-12 col-sm-12 col-md-7 name-contant">
                                                        <div className="name"><a href="#">Jeremy Andrew Rose</a></div>
                                                        <div className="row admission-contant">
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Admission No:</span>
                                                                    <p>951426</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Student Id:</span>
                                                                    <p>2019/21</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Roll No:</span>
                                                                    <p>951426</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Department</span>
                                                                    <p>Computer Science</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Class:</span>
                                                                    <p>First Year</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Section:</span>
                                                                    <p>C</p>
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
                                            <div className="contant-row">
                                                <div className="row">
                                                    <div className="col-xs-6 col-sm-6 col-md-2 image-check">
                                                        <input type="checkbox" className="checkbox" />
                                                        <span><img src="../../img/uicon_m.png" alt="" /></span>
                                                    </div>
                                                    <div className="col-xs-12 col-sm-12 col-md-7 name-contant">
                                                        <div className="name"><a href="#">Jeremy Andrew Rose</a></div>
                                                        <div className="row admission-contant">
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Admission No:</span>
                                                                    <p>951426</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Student Id:</span>
                                                                    <p>2019/21</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Roll No:</span>
                                                                    <p>951426</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Department</span>
                                                                    <p>Computer Science</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Class:</span>
                                                                    <p>First Year</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Section:</span>
                                                                    <p>C</p>
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
                                            <div className="contant-row">
                                                <div className="row">
                                                    <div className="col-xs-6 col-sm-6 col-md-2 image-check">
                                                        <input type="checkbox" className="checkbox" />
                                                        <span><img src="../../img/uicon_m.png" alt="" /></span>
                                                    </div>
                                                    <div className="col-xs-12 col-sm-12 col-md-7 name-contant">
                                                        <div className="name"><a href="#">Jeremy Andrew Rose</a></div>
                                                        <div className="row admission-contant">
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Admission No:</span>
                                                                    <p>951426</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Student Id:</span>
                                                                    <p>2019/21</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Roll No:</span>
                                                                    <p>951426</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Department</span>
                                                                    <p>Computer Science</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4">
                                                                <div className="admission_no">
                                                                    <span>Class:</span>
                                                                    <p>First Year</p>
                                                                </div>
                                                                <div className="admission_no">
                                                                    <span>Section:</span>
                                                                    <p>C</p>
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
