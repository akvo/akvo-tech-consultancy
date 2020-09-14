
        /*
            let countries = [];
            if (this.props.value.filters.reducer.ids > 0){
                let active_filters = this.props.value.filters.reducer.ids.map(x => x.id);
                    active_filters = this.props.value.filters.childs.filter(x => active_filters.includes(x.id));
                for (let i=0; i<active_filters.length; i++) {
                    if (i === 0) {
                        countries = active_filters[0].country_values;
                    }
                    if (i !== 0) {
                        let intersect = active_filters[i].country_values;
                        countries = intersectionBy(intersect,countries, 'country_id');
                    }
                }
                console.log(countries.length);
            }
        */
