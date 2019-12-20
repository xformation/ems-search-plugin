import * as React from 'react';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
// import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import "../../css/studentSearchApp.css";

export class VehicleSearchPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="col-2 col-md-2">
                    <div className="bg-white filters-box">
                        <div className="heading">
                            <h5>Filters</h5>
                        </div>
                        <div className="filters-btn">
                            <button className="btn btn-secondary clear-btn">Clear</button>
                            <button className="btn btn-secondary apply-btn">Apply</button>
                        </div>
                        <div className="filterbox">
                            <div className="box">
                                <h4>Attendance</h4>
                                <div className="rainge">
                                    <div className="min-box">
                                        <label>Min</label>
                                        <select>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                    </div>
                                    <div className="mix-box">
                                        <label>Mix</label>
                                        <select>
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
                                <h4>Grades</h4>
                                <div className="rainge">
                                    <div className="min-box">
                                        <label>Min</label>
                                        <select>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                    </div>
                                    <div className="mix-box">
                                        <label>Mix</label>
                                        <select>
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
                                <h4>Aggregate</h4>
                                <div className="rainge">
                                    <div className="min-box">
                                        <label>Min</label>
                                        <select>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                    </div>
                                    <div className="mix-box">
                                        <label>Mix</label>
                                        <select>
                                            <option>6</option>
                                            <option>7</option>
                                            <option>8</option>
                                            <option>9</option>
                                            <option>10</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-2 col-md-10">
                    <div className="students-main">
                        <div className="bg-white students-inner">
                            Testing Testing Testing Testing Testing Testing
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
