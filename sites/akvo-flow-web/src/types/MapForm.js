import React, { Component, Fragment } from 'react';
import {
    Map,
    Marker,
    Popup,
    TileLayer
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const gapi = 'https://maps.googleapis.com/maps/api/geocode/json';
const apikey = 'AIzaSyCIv2SUL6gt0gOgr8M9XLGpGIpEVwaR4A0'

class MapForm extends Component {

    constructor(props) {
        super(props);
		this.state = {
			center: {
				lat: 6.48998,
				lng: 18.10546,
			},
			marker: {
				lat: 6.48998,
				lng: 18.10546,
			},
			zoom: 4,
			draggable: true,
            address: false,
            value:'',
		}
        this.updatePosition = this.updatePosition.bind(this);
        this.toggleDraggable= this.toggleDraggable.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleText = this.handleText.bind(this);
        this.getSpanAddress = this.getSpanAddress.bind(this);
    }

    toggleDraggable = () => {
        this.setState({ draggable: !this.state.draggable })
    }

    updateAddress = () => {
        const newpos = this.state.marker;
        this.props.update(newpos);
        const address = {'address':newpos.lat + ',' + newpos.lng,'key':apikey}
        axios.get(gapi, {params:address})
            .then( res => {
                this.setState({address: res.data.results[0]['formatted_address']})
            })
    }

    updatePosition = (e) => {
        const newpos = {
            lat: e.target._latlng.lat,
            lng: e.target._latlng.lng
        }
        this.setState({ marker: newpos });
        this.updateAddress();
    }

    handleText(e) {
        this.setState({ value: e.target.value });
    }

    handleSearch() {
        const address = {'address': this.state.value ,'key':apikey}
        axios.get(gapi, {params:address})
            .then( res => {
                const newpos= res.data.results[0]['geometry']['location'];
                const newaddress= res.data.results[0]['formatted_address'];
                this.setState({marker:newpos});
                const map = this.refs.map.leafletElement;
                map.panTo(newpos);
                setTimeout(() => {
                    this.setState({center:newpos});
                    this.setState({address:newaddress});
                }, 500);
                this.setState({zoom:17});
            })
    }

    handleClick(e) {
        const newpos = {
            lat: e.latlng.lat,
            lng: e.latlng.lng
        }
        this.setState({ marker: newpos });
        this.updateAddress();
    }

    componentDidMount() {
		let newstate = {
            center: this.props.center,
            marker: this.props.center,
            zoom: 4,
			draggable: true,
            address: false,
            value:'',
        };
        const map = this.refs.map.leafletElement;
        setTimeout(() => {
            map.invalidateSize();
            this.setState(newstate);
            this.updateAddress();
        }, 3000);
    }

    getSpanAddress = () => {
        return (
            <>
                <span className="text-right badge badge-secondary">
                {this.state.address}
                </span>
                <br/>
            </>
        )
    }

    render() {
        const markerPosition = [this.state.marker.lat, this.state.marker.lng]
        return (
            <Fragment>
            <div className="row">
                <div className="col-md-9">
                <input
                    className="form-control"
                    type="text"
                    value={this.state.value}
                    onChange={this.handleText}
                    placeholder="Search Address"
                />
                </div>
                <div className="col-md-3">
                <button
                    className="btn btn-block btn-success"
                    onClick={this.handleSearch}
                >
                    Search
                </button>
                </div>
            </div>
            <br/>
            <Map
                onClick={this.handleClick}
                center={this.state.center}
                zoom={this.state.zoom}
                ref="map"
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    refs="marker"
                    position={markerPosition}
                    draggable={this.state.draggable}
                    onDragend={this.updatePosition}
                >
                    <Popup>
                        <div>Current Location:<br/>
                        Latitude: {this.state.marker.lat} <br/>
                        Longitude: {this.state.marker.lng} <br/>
                        Address: {this.state.address} </div>
                    </Popup>
                </Marker>
            </Map>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <hr/>
                        { this.state.address ? this.getSpanAddress() : "" }
                        <span className="badge badge-success">
                            lat: {this.state.marker.lat}, lng: {this.state.marker.lng}
                        </span>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default MapForm;
