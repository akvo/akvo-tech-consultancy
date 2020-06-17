export const filterState = {
    list: [{
        id: 1,
        name: 'Loading...',
        parent_id: null,
        values: [],
        donors: {
            count: 1,
            list: []
        },
        organisations: {
            count: 1,
            list: []
        },
        implementing: {
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
        donors: {
            count: 1,
            list: []
        },
        organisations: {
            count: 1,
            list: []
        },
        implementing: {
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
        code: "ke33",
        name: "narok",
        level: 0,
        text: "Loading",
        values: {
            id: 2,
            parent_id: 1,
            subject: "sub_domain",
            name: "Loading",
            value_planned: 0,
            value_achived: 0,
            beneficiaries_planned: 0,
            beneficiaries_achived: 0,
            girl_achived: 0,
            boy_achived: 0,
            woman_achived: 0,
            man_achived: 0
        },
        details: {
            donors: {
                count: 1,
                list: ["Loading"]
            },
            organisations: {
                count: 1,
                list: ["Loading"]
            },
            implementing: {
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
        donors: [],
        organisations: [],
        implementing: [],
        locations: [],
    },
    locations: [{
        id: 1,
        name: 'All Counties',
        code: 'KENYA',
    }],
    selected: {
        location: 1,
        filter: 2,
        type: "planned"
    }
}

export const updateSelectedFilters = (state, id) => {
    return {
        ...state,
    };
}

export const changeFilters = (state, id, depth) => {
    if (depth === 1) {
        let childs = state.filter(x => x.parent_id === id);
        id = childs[0].id;
    }
    return id;
}

export const getOverviews = (state) => {
    let details = state.map(x => x.details);
    let i = 0;
    let overviews = {
        donors: [],
        organisations: [],
        implementing: [],
        all:[]
    }
    do {
        overviews.donors = [...overviews.donors, ...details[i].donors.list];
        overviews.organisations = [...overviews.organisations, ...details[i].organisations.list];
        overviews.implementing = [...overviews.implementing, ...details[i].implementing.list];
        i++;
    } while (i < details.length);
    overviews.all = [...overviews.donors, ...overviews.organisations, ...overviews.implementing];
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
