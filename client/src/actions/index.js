// index.js
// This file contains all of the redux functions for updating projects
// TODO: future groups, it would be good if projects could be removed 
//  from redux since projects should not be stored as a global state.

import {
    ADD_PROJECT,
    DELETE_PROJECT,
    SEARCH_PROJECT,
    FILTER_PROJECT,
    FETCH_PROJECT,
    VIEW_PROJECT,
    FILTER_TAGS,
} from "./types";
import axios from "axios";

const apiUrl = "/projects";

//Creating Project
export const createProject = ({
    name,
    owner,
    ownerID,
    contactInfo,
    status,
    statuses,
    description,
    gitRepo,
    tags,
    image,
    userGuide,
    developerGuide,
    installationGuide,
    date,
}) => {
    return (dispatch) => {
        return axios
            .post(`${apiUrl}/add`, {
                name,
                owner,
                ownerID,
                contactInfo,
                status,
                statuses,
                description,
                gitRepo,
                tags,
                image,
                userGuide,
                developerGuide,
                installationGuide,
                date,
            })
            .then((response) => {
                dispatch(createProjectSuccess(response.data));
            })
            .catch((error) => {
                throw error;
            });
    };
};

export const createProjectSuccess = (data) => {
    return {
        type: ADD_PROJECT,
        payload: {
            _id: data._id,
            name: data.name,
            owner: data.owner,
            ownerID: data.ownerID,
            contactInfo: data.contactInfo,
            status: data.status,
            statuses: data.statuses,
            description: data.description,
            gitRepo: data.gitRepo,
            tags: data.tags,
            image: data.image,
            userGuide: data.userGuide,
            developerGuide: data.developerGuide,
            installationGuide: data.installationGuide,
            date: data.date,
        },
    };
};

//Deleting Project
export const deleteProjectSuccess = (id) => {
    return {
        type: DELETE_PROJECT,
        payload: {
            id,
        },
    };
};

export const deleteProject = (id) => {
    return (dispatch) => {
        return axios
            .get(`${apiUrl}/delete/${id}`)
            .then((response) => {
                dispatch(deleteProjectSuccess(response.data));
            })
            .catch((error) => {
                throw error;
            });
    };
};

//Fetching Project
export const fetchProjects = (projects) => {
    return {
        type: FETCH_PROJECT,
        projects,
    };
};

export const fetchAllProjects = () => {
    return (dispatch) => {
        return axios
            .get(apiUrl)
            .then((response) => {
                dispatch(fetchProjects(response.data));
            })
            .catch((error) => {
                throw error;
            });
    };
};

//Searching Project
export const searchProject = (value, projects) => {
    console.log(projects);
    return { type: SEARCH_PROJECT, value, projects };
};

export const searchProjects = (value) => {
    return (dispatch) => {
        return axios
            .get(apiUrl)
            .then((response) => {
                dispatch(searchProject(value, response.data));
            })
            .catch((error) => {
                throw error;
            });
    };
};

//Filtering Project
export const filterProject = (filter, require, exclude, query, projects) => {
    return { type: FILTER_PROJECT, filter, require, exclude, query, projects };
};
export const filterProjects = (filter, require, exclude, query) => {
    return (dispatch) => {
        return axios
            .get(apiUrl)
            .then((response) => {
                dispatch(filterProject(filter, require, exclude, query, response.data));
            })
            .catch((error) => {
                throw error;
            });
    };
};

//Filter by tags
export const filterTag = (include, exclude, projects) => {
    return { type: FILTER_TAGS, include, exclude, projects };
};
export const filterTags = (include, exclude) => {
    return (dispatch) => {
        return axios
            .get(apiUrl)
            .then((response) => {
                console.log(include, exclude, response.data);
                dispatch(filterTag(include, exclude, response.data));
            })
            .catch((error) => {
                throw error;
            });
    };
};

//Viewing Project
export const viewProject = (idvalue, projects) => {
    return { type: VIEW_PROJECT, idvalue, projects };
};

export const viewProjects = (idvalue) => {
    return (dispatch) => {
        return axios
            .get(apiUrl)
            .then((response) => {
                dispatch(viewProject(idvalue, response.data));
            })
            .catch((error) => {
                throw error;
            });
    };
};
