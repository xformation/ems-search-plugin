import * as React from 'react';
import { parse } from 'query-string';
import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
// import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import "../../../css/StudentSearchApp.css";
import { teacherServices } from '../_services/teachers.service';
import wsCmsBackendServiceClient from '../../../wsCmsBackendServiceClient';

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
        this.createDepartmentSelectbox = this.createDepartmentSelectbox.bind(this);
        this.onChangeSelectDropDown = this.onChangeSelectDropDown.bind(this);
        this.createBatchSelectbox = this.createBatchSelectbox.bind(this);
        this.createSectionSelectbox = this.createSectionSelectbox.bind(this);
        this.typeOfFacultyFilter = this.typeOfFacultyFilter.bind(this);
    }

    async componentDidMount() {
        this.setState({
            isApiCalled: true
        });
        await teacherServices.searchLoggedInUser().then(
            (response: any) => {
                this.setState({
                    user: response
                });
            }
        );
        await this.registerSocket();
        await teacherServices.searchDepartment().then(
            (response: any) => {
                this.setState({
                    departmentList: response
                });
            }
        );
        await teacherServices.searchBatch().then(
            (response: any) => {
                this.setState({
                    batchList: response
                });
            }
        );
        await teacherServices.searchSection().then(
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
            console.log("3. window.location.search :---> ",value);
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

    registerSocket() {
        const socket = wsCmsBackendServiceClient.getInstance();
    
        socket.onmessage = (response: any) => {
            let message = JSON.parse(response.data);
            console.log("teacherSearchPage. message received from server ::: ", message);
            this.setState({
                branchId: message.selectedBranchId,
                academicYearId: message.selectedAcademicYearId,
                departmentId: message.selectedDepartmentId,
            });
            console.log("teacherSearchPage. branchId: ",this.state.branchId);
            console.log("teacherSearchPage. ayId: ",this.state.academicYearId);  
            console.log("teacherSearchPage. departmentId: ",this.state.departmentId);  
        }
    
        socket.onopen = () => {
            console.log("teacherSearchPage. Opening websocekt connection to cmsbackend. User : ",this.state.user.login);
            socket.send(this.state.user.login);
        }
    
        window.onbeforeunload = () => {
            console.log("teacherSearchPage. Closing websocket connection with cms backend service");
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

    typeOfFacultyFilter() {
        const {visiting,permanent,fulltime, parttime} = this.state;
            let result = [];
            const { allData } = this.state;
            if (visiting === "1" || permanent === "1" || fulltime === "1" || parttime === "1") {
                if (allData && allData.length > 0) {
                    for (let i = 0; i < allData.length; i++) {
                        let teacher = allData[i];
                        if (visiting === "1" && teacher.staffType.toLowerCase() === "visiting") {
                            result.push(teacher);
                        }else if (permanent === "1" && teacher.staffType.toLowerCase() === "permanent") {
                            result.push(teacher);
                        }else if (fulltime === "1" && teacher.staffType.toLowerCase() === "fulltime") {
                            result.push(teacher);
                        }else if (parttime === "1" && teacher.staffType.toLowerCase() === "parttime") {
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
        // }
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
        const { passing, subjects, visiting, permanent,fulltime, parttime } = this.state;
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
        // if (visiting === "1" || permanent === "1" || fulltime === "1" || parttime === "1") {
        //     console.log("Type of faculy filter :::::::");
            this.typeOfFacultyFilter();
        // }
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
            },
            visiting: "0",
            permanent: "0",
            fulltime: "0",
            parttime: "0"
        });
    }

    onChangeCheckbox(e: any) {
        const { name, checked } = e.target;
        this.setState({
            [name]: checked ? "1" : "0"
        });
    }

    createTeacherJSX() {
        const { teachersData, isApiCalled, currentPage, itemsPerPage, branchId, selectedDepartmentId } = this.state;
        let retData = [];
        const length = teachersData.length;
        if (length > 0) {
            for (let i = 0; i < length; i++) {
                const teacher = teachersData[i];
                if(branchId === teacher.branch.id){
                    if(selectedDepartmentId !== null && selectedDepartmentId !== undefined && selectedDepartmentId !== ""){
                        if(parseInt(selectedDepartmentId,10) !== parseInt(teacher.department.id,10)){
                                continue;
                        }
                    }
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
                                                    <span>Employee Id:</span>
                                                    <p>{teacher.employeeId}</p>
                                                </div>
                                                <div className="admission_no">
                                                    <span>Designation:</span>
                                                    <p>{teacher.designation}</p>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <div className="admission_no">
                                                    <span>Teacher Id:</span>
                                                    <p>{teacher.id}</p>
                                                </div>
                                                <div className="admission_no">
                                                    <span>Status:</span>
                                                    <p>{teacher.status}</p>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <div className="admission_no">
                                                    <span>Type of Faculty:</span>
                                                    <p>{teacher.staffType}</p>
                                                </div>
                                                <div className="admission_no">
                                                    <span>Department</span>
                                                    <p>{teacher.department.name}</p>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <div className="admission_no">
                                                    <span>Branch:</span>
                                                    <p>{teacher.branch.branchName}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-6 col-sm-12 col-md-3 right-button">
                                        <ul>
                                            <li><a className="fa fa-envelope" href={"mailto:"+teacher.teacherEmailAddress}></a></li>
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
    createSelectbox() {
        const allData = [];
        for (let i = 0; i < 100; i++) {
            allData.push(
                <option value={i + 1}>{i + 1}</option>
            );
        }
        return allData;
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
                                    <h4>Passing rate</h4>
                                    <div className="rainge">
                                        <div className="min-box">
                                            <label>Min</label>
                                            <select name="min-passing" onChange={this.onPassingChange} value={state.passing.min}>
                                                <option value="">Min</option>
                                                {this.createSelectbox()}
                                            </select>
                                        </div>
                                        <div className="mix-box">
                                            <label>Max</label>
                                            <select name="max-passing" onChange={this.onPassingChange} value={state.passing.max}>
                                                <option value="">Max</option>
                                                {this.createSelectbox()}
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
                                                {this.createSelectbox()}
                                            </select>
                                        </div>
                                        <div className="mix-box">
                                            <label>Max</label>
                                            <select name="max-subjects" onChange={this.onSubjectsChange} value={state.subjects.max}>
                                                <option value="">Max</option>
                                                {this.createSelectbox()}
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
                                                    <input type="checkbox" className="checkbox" name="AllCheck" onChange={this.checkAllTeacher} checked={this.state.isAllChecked} />
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
