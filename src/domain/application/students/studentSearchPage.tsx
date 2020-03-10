import * as React from 'react';
import { parse } from 'query-string';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
// import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import "../../../css/studentSearchApp.css";
import { studentServices } from '../_services/students.service';
import wsCmsBackendServiceClient from '../../../wsCmsBackendServiceClient';


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
            searchName: "",
            isAllChecked: false,
            branchId: null,
            academicYearId: null,
            departmentId: null,
            user: null,
            departmentList: null,
            batchList: null,
            sectionList: null,
            selectedDepartmentId: null,
            selectedBatchId: null,
            selectedSectionId: null,
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
        this.createSelectbox = this.createSelectbox.bind(this);
        this.createDepartmentSelectbox = this.createDepartmentSelectbox.bind(this);
        this.onChangeSelectDropDown = this.onChangeSelectDropDown.bind(this);
        this.createBatchSelectbox = this.createBatchSelectbox.bind(this);
        this.createSectionSelectbox = this.createSectionSelectbox.bind(this);
    }

    async componentDidMount() {
        this.setState({
            isApiCalled: true
        });
        await studentServices.searchLoggedInUser().then(
            (response: any) => {
                this.setState({
                    user: response
                });
            }
        );
        await this.registerSocket();
        await studentServices.searchDepartment().then(
            (response: any) => {
                this.setState({
                    departmentList: response
                });
            }
        );
        await studentServices.searchBatch().then(
            (response: any) => {
                this.setState({
                    batchList: response
                });
            }
        );
        await studentServices.searchSection().then(
            (response: any) => {
                this.setState({
                    sectionList: response
                });
            }
        );
        let value = parse(window.location.search).value;
        console.log("1. window.location.search :---> ",value);
        if (value) {
            console.log("2. window.location.search :---> ",value);
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
            console.log("3. window.location.search :---> ",value);
            studentServices.searchGetAllStudent().then(
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

    registerSocket() {
        const socket = wsCmsBackendServiceClient.getInstance();
    
        socket.onmessage = (response: any) => {
            let message = JSON.parse(response.data);
            console.log("studentSearchPage. message received from server ::: ", message);
            this.setState({
                branchId: message.selectedBranchId,
                academicYearId: message.selectedAcademicYearId,
                departmentId: message.selectedDepartmentId,
            });
            console.log("studentSearchPage. branchId: ",this.state.branchId);
            console.log("studentSearchPage. ayId: ",this.state.academicYearId);  
            console.log("studentSearchPage. departmentId: ",this.state.departmentId);  
        }
    
        socket.onopen = () => {
            console.log("studentSearchPage. Opening websocekt connection to cmsbackend. User : ",this.state.user.login);
            socket.send(this.state.user.login);
        }
    
        window.onbeforeunload = () => {
            console.log("studentSearchPage. Closing websocket connection with cms backend service");
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

    createSelectbox() {
        const allData = [];
        for (let i = 0; i < 100; i++) {
            allData.push(
                <option value={i + 1}>{i + 1}</option>
            );
        }
        return allData;
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
        const { studentsData, isApiCalled, currentPage, itemsPerPage,branchId, selectedDepartmentId,selectedBatchId ,selectedSectionId } = this.state;
        let retData = [];
        const length = studentsData.length;
        if (length > 0) {
            for (let i = 0; i < length; i++) {
                const student = studentsData[i];
                if(branchId === student.branchId){
                    if(selectedDepartmentId !== null && selectedDepartmentId !== undefined && selectedDepartmentId !== ""){
                        if(parseInt(selectedDepartmentId,10) !== parseInt(student.departmentId,10)){
                                continue;
                        }
                    }
                    if(selectedBatchId !== null && selectedBatchId !== undefined && selectedBatchId !== ""){
                        if(parseInt(selectedBatchId,10) !== parseInt(student.batchId,10)){
                                continue;
                        }
                    }
                    if(selectedSectionId !== null && selectedSectionId !== undefined && selectedSectionId !== ""){
                        if(parseInt(selectedSectionId,10) !== parseInt(student.sectionId,10)){
                                continue;
                        }
                    }
                const pageFactor = Math.floor(i / itemsPerPage);
                if (pageFactor === currentPage) {
                    retData.push(
                        <div className="contant-row">
                            <div className="row">
                                <div className="col-xs-6 col-sm-6 col-md-2 image-check">
                                    <input type="checkbox" className="checkbox" name={student.studentName} onChange={e => this.onCheckStudent(student, e)} checked={student.isChecked} />
                                    <span><img src="public/plugins/cms-ui-search-plugin/img/students.png" alt="" /></span>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-7 name-contant">
                                    <div className="name">{student.studentName} {student.studentMiddleName} {student.studentLastName}</div>
                                    <div className="row admission-contant">
                                        <div className="col-12 col-md-4">
                                            <div className="admission_no">
                                                <span>Admission No:</span>
                                                <p>{student.admissionNo}</p>
                                            </div>
                                            <div className="admission_no">
                                                <span>Student Id:</span>
                                                <p>{student.id}</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="admission_no">
                                                <span>Roll No:</span>
                                                <p>{student.rollNo}</p>
                                            </div>
                                            <div className="admission_no">
                                                <span>Gender</span>
                                                <p>{student.sex}</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="admission_no">
                                                <span>Class:</span>
                                                <p>{student.batchId}</p>
                                            </div>
                                            <div className="admission_no">
                                                <span>Section:</span>
                                                <p>{student.sectionId}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-6 col-sm-12 col-md-3 right-button">
                                    <ul>
                                    <li><a className="fa fa-envelope" href={"mailto:"+student.studentPrimaryEmailId}></a></li>
                                        {/* <li><i className="fa fa-trash"></i></li> */}
                                        <li><i className="fa fa-print"></i></li>
                                        <li><i className="fa fa-cloud-download"></i></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                }
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

    checkAllStudent(e: any) {
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

    onChangeSelectDropDown = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        this.setState({
                [name]: value
        });
    }

    createDepartmentSelectbox(data: any, value: any, key: any, label: any){
        const{branchId} = this.state;
        let retData = [];
        if(data.length > 0){
            for(let i=0; i<data.length;i++){
                let item = data[i];
                if(branchId !== null && branchId !== undefined){
                    if(parseInt(branchId, 10) === parseInt(item.branch.id, 10)){
                        retData.push(
                            <option value={item[value]} key={item[key]}>{item[label]}</option>
                        );
                    }
                }
            }
        } 
        return retData;
    }
    createBatchSelectbox(data: any, value: any, key: any, label: any){
        const{selectedDepartmentId} = this.state;
        let retData = [];
        if(data.length > 0){
            for(let i=0; i<data.length;i++){
                let item = data[i];
                if(selectedDepartmentId !== null && selectedDepartmentId !== undefined){
                    if(parseInt(selectedDepartmentId, 10) === parseInt(item.department.id, 10)){
                        retData.push(
                            <option value={item[value]} key={item[key]}>{item[label]}</option>
                        );
                    }
                }
            }
        } 
        return retData;
    }
    createSectionSelectbox(data: any, value: any, key: any, label: any){
        const{selectedBatchId} = this.state;
        let retData = [];
        if(data.length > 0){
            for(let i=0; i<data.length;i++){
                let item = data[i];
                if(selectedBatchId !== null && selectedBatchId !== undefined){
                    if(parseInt(selectedBatchId, 10) === parseInt(item.batch.id, 10)){
                        retData.push(
                            <option value={item[value]} key={item[key]}>{item[label]}</option>
                        );
                    }
                }
            }
        } 
        return retData;
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
                                                {this.createSelectbox()}
                                            </select>
                                        </div>
                                        <div className="mix-box">
                                            <label>Max</label>
                                            <select name="max-attendance" onChange={this.onAttendaceChange} value={state.attendance.max}>
                                                <option value="">Max</option>
                                                {this.createSelectbox()}
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
                                                {this.createSelectbox()}
                                            </select>
                                        </div>
                                        <div className="mix-box">
                                            <label>Max</label>
                                            <select name="max-grades" onChange={this.onGradesChange} value={state.grades.max}>
                                                <option value="">Max</option>
                                                {this.createSelectbox()}
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
                                                {this.createSelectbox()}
                                            </select>
                                        </div>
                                        <div className="mix-box">
                                            <label>Max</label>
                                            <select name="max-aggregate" onChange={this.onAggregateChange} value={state.aggregate.max}>
                                                <option value="">Max</option>
                                                {this.createSelectbox()}
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
                                    <select className="select" name="selectedDepartmentId" id="selectedDepartmentId" onChange={this.onChangeSelectDropDown} value={this.state.selectedDepartmentId}>
                                            <option value="">Select Department</option>
                                            {   
                                                this.state.departmentList !== null ?
                                                    this.createDepartmentSelectbox(this.state.departmentList, "id", "id", "name")
                                                : null
                                            }
                                        </select>
                                        <select className="select" name="selectedBatchId" id="selectedBatchId" onChange={this.onChangeSelectDropDown} value={this.state.selectedBatchId}>
                                            <option value="">Select Year</option>
                                            {   
                                                this.state.batchList !== null ?
                                                    this.createBatchSelectbox(this.state.batchList, "id", "id", "batch")
                                                : null
                                            }
                                        </select>
                                        <select className="select" name="selectedSectionId" id="selectedSectionId" onChange={this.onChangeSelectDropDown} value={this.state.selectedSectionId} >
                                            <option value="">Select Section</option>
                                            {   
                                                this.state.sectionList !== null ?
                                                    this.createSectionSelectbox(this.state.sectionList, "id", "id", "section")
                                                : null
                                            }
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
                                                        <a className="fa fa-envelope" href="mailto:"></a>
                                                        {/* <li><i className="fa fa-trash"></i></li> */}
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
