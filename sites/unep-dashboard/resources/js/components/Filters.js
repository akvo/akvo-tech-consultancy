import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import { Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import countBy from 'lodash/countBy';
import uniq from 'lodash/uniq';
import intersection from 'lodash/intersection';
import { flatten, parentDeep } from '../data/utils.js';

const getNested = (data, results=[]) => {
    data.forEach(x => {
        results = [...results, x];
        if (x.childrens.length > 0){
            results = [...results, ...x.childrens];
            return getNested(x.childrens, results);
        }
    });
    return results;
}

class Filters extends Component {
    constructor(props) {
        super(props);
        this.getList = this.getList.bind(this);
        this.removeFilters = this.removeFilters.bind(this);
    }

    removeFilters(x) {
        let nestedId = getNested(x.childrens, [x.id]);
        nestedId = nestedId.map(x => x.id);
        let active = this.props.value.data.filters;
        let intersect = intersection(nestedId, active);
        this.props.data.remove.filters(x.id, intersect);
    }

    getList() {
        let badges = this.props.value.page.badges;
        if (badges) {
            return badges.map((x, i) => (
                <Badge
                className="badge-list"
                    onClick={e => this.removeFilters(x)}
                    key={i}
                    variant="dark">
                        <FontAwesomeIcon
                            className="fas-badge"
                            color="white"
                            icon={["fas", "times-circle"]}
                        />
                            {x.name} [{x.count}]
                </Badge>
            ));
        }
        return "";
    }

    render() {
        return (
            <div className="nav-filter-list">
                {this.getList()}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
