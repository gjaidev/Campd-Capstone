import React from "react";
import { connect } from "react-redux";
import { filterProjects } from "../../actions/index";
import { Button, Form } from "react-bootstrap";
import "./FilterProjects.scss";

class FilterProjects extends React.Component {
    state = {
        filters: [],
    };

    /**
     * Perform default filter (not showing unapproved)
     */
    componentDidMount() {
        this.props.onFilter(this.state.filters);
    }

    handleFilter = (e) => {
        if (e.target.checked) {
            this.setState({
                filters: [...this.state.filters, e.target.id],
            });
        } else {
            const i = this.state.filters.indexOf(e.target.id);
            this.setState({
                filters: this.state.filters.filter((_, index) => index !== i),
            });
        }
    };

    componentDidUpdate() {
        this.props.onFilter(this.state.filters);
    }

    handleReset = (e) => {
        this.setState({
            filters: [],
        });
        this.refs["activeCheckbox"].checked = false;
        this.refs["proposalCheckbox"].checked = false;
        this.refs["recruitingCheckbox"].checked = false;
        this.refs["pausedCheckbox"].checked = false;
        this.refs["stoppedCheckbox"].checked = false;
        this.refs["archivedCheckbox"].checked = false;
        this.refs["pendingCheckbox"].checked = false;
    };

    render() {
        this.props.onFilter(this.state.filters);
        return (
            <div className="filter-projects">
                <h5>Filter Projects: </h5>
                <Form>
                    <Form.Check
                        onChange={this.handleFilter}
                        type="checkbox"
                        id="isProposal"
                        ref="proposalCheckbox"
                        label="Proposal"
                    />
                    <Form.Check
                        onChange={this.handleFilter}
                        type="checkbox"
                        id="isActive"
                        ref="activeCheckbox"
                        label="Active"
                    />
                    <Form.Check
                        onChange={this.handleFilter}
                        type="checkbox"
                        id="isRecruiting"
                        ref="recruitingCheckbox"
                        label="Recruiting"
                    />
                    <Form.Check
                        onChange={this.handleFilter}
                        type="checkbox"
                        id="isPaused"
                        ref="pausedCheckbox"
                        label="Paused"
                    />
                    <Form.Check
                        onChange={this.handleFilter}
                        type="checkbox"
                        id="isStopped"
                        ref="stoppedCheckbox"
                        label="Stopped"
                    />
                    <Form.Check
                        onChange={this.handleFilter}
                        type="checkbox"
                        id="isArchived"
                        ref="archivedCheckbox"
                        label="Archived"
                    />
                    <Form.Check
                        onChange={this.handleFilter}
                        type="checkbox"
                        id="showPending"
                        ref="pendingCheckbox"
                        label="Include pending projects?"
                    />
                    <Button variant="dark" onClick={this.handleReset} type="button" value="">
                        Reset
                    </Button>
                </Form>
            </div>
        );
    }
}

function mapStateToProps({ projects }) {
    return { value: projects.value };
}

function mapDispatchToProps(dispatch) {
    return {
        onFilter: (value) => {
            dispatch(filterProjects(value));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterProjects);
