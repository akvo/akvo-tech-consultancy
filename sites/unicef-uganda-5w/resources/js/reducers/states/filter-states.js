export const filterState = {
    list: [{
        id: 1,
        name: 'Loading...',
        parent_id: null,
        values: [],
        organisations: {
            count: 1,
            list: []
        },
        locations: {
            count: 1,
            list: []
        },
    }, {
        id: 2,
        name: 'Loading...',
        parent_id: 1,
        values: [],
        organisations: {
            count: 1,
            list: []
        },
        locations: {
            count: 1,
            list: []
        },
    }],
    location_values: [{
        id: 2,
        parent_id: null,
        code: "",
        name: "narok",
        level: 0,
        text: "Loading",
        values: {
            id: 2,
            parent_id: 1,
            subject: "sub_domain",
            name: "Loading",
            value_new:0,
            value_quantities:0,
            value_total: 0,
        },
        details: {
            organisations: {
                count: 1,
                list: ["Loading"]
            },
            locations: {
                count: 1,
                list: ["Loading"]
            }
        }
    }],
    organisations: ["Loading..."],
    organisation_values: [{
        id: 1,
        name: "Loading",
        organisations: {
            list :[
                {
                    name:"Loading...",
                    partner: "Loading...",
                    domain: "Loading...",
                    subdomain: "Loading..."
                }
            ],
            domains: ["Loading..."],
            subdomains: ["Loading..."],
            count: 1
        }
    }],
    overviews: {
        organisations: [],
        locations: [],
    },
    locations: [{
        id: 1,
        name: 'ALL DISTRICTS',
        code: 'UGANDA',
    }],
    selected: {
        location: 1,
        filter: {
            domain:1,
            sub_domain:1
        },
        type: "reset"
    }
}

export const updateSelectedFilters = (state, id) => {
    return {
        ...state,
    };
}

export const changeFilters = (state, id, depth) => {
    let filter = state.filter;
    if (depth === 1) {
        let childs = state.list.filter(x => x.parent_id === id);
        filter = {
            domain: id,
            sub_domain: childs[0].id
        }
    }
    if (depth === 2) {
        let that = state.list.find(x => x.id === id);
        filter = {
            domain: that.parent_id,
            sub_domain: id,
        }
    }
    return filter;
}

export const getOverviews = (state) => {
    let details = state.map(x => x.details);
    let i = 0;
    let overviews = {
        organisations: [],
        all:[]
    }
    do {
        overviews.organisations = [...overviews.organisations, ...details[i].organisations.list];
        i++;
    } while (i < details.length);
    overviews.all = [...overviews.organisations];
    return overviews;
}

export const getOrganisations = (state) => {
    let orgs = state.map(x => {
        let location = x.name;
        return x.organisations.list.map(z => {
            return {...z,location: location}
        });
    });
    let data = [];
    let i = 0;
    do {
        data = [...data, ...orgs[i]]
        i++;
    }while(i < orgs.length)
    return data;
}

export const populateAll = (data) => {
    let parent = data.filter(x => x.parent_id === null);
    let childs = data.filter(x => x.parent_id !== null);
    console.log(parent);
    let all_childs = parent.map(x => {
        return childs.filter(c => c.parent_id === x.id);
    });
    console.log(all_childs);
    return true;
}
