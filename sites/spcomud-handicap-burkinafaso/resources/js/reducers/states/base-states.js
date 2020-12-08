export const baseState = {
    surveys: [{
        id: 0,
        name: "Loading",
        registration_id: null,
        forms: [],
    }],
    // Need to figure it out what will we store here
    data: [{
        id: 1,
        form_instance_id: 1,
        org_type: 18,
        org_name: 24,
        activity: 1,
        region: 954,
        district: 955,
        domain: 11,
        sub_domain: 36,
        completion_date: "2020-07-31",
        quantity: 1,
        total: 0,
        new: 0
    }],
    options: [{
        id: 1,
        code: "Loading",
        name: "Loading",
        text: "Loading",
        unit: false
    }],
    cascades: [{
        id: 18,
        parent_id: 1,
        code: "Loading",
        name: "Loading",
        level: 0,
        text: "Loading",
    }],
    config: [{
        id: [1,2],
        name:"Loading",
        on:"cascades",
        lv:1
    }]
}
