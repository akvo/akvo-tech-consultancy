import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions'
import { isJsonString } from  '../util/QuestionHandler'
import { PopupImage } from '../util/Popup'
import { checkCustomOption, checkUnit } from '../util/Custom'
import { getApi } from '../util/Api'
import isoLangs from '../util/Languages'
import { getLocalization } from '../util/Utilities';
import MapForm from '../types/MapForm'
import Dexie from 'dexie';
import uuid from 'uuid/v4';

class QuestionType extends Component {

    constructor(props) {
        super(props)
        this.value = localStorage.getItem(this.props.data.id)
        this.other = localStorage.getItem("other_" + this.props.data.id)
        this.state = {
            value: this.value ? this.value : '',
            other: this.other ? this.other : '',
            invalid: false,
            cascade_selected: [],
            cascade_levels: 0,
            custom_cascade: [{
                name:'loading',
                childs: []
            }],
            custom_cascade_other: false,
            custom_cascade_type: 'checkBox'
        }
        this.setDpStorage = this.setDpStorage.bind(this);
        this.setDplStorage = this.setDplStorage.bind(this);
        this.getRadio = this.getRadio.bind(this);
        this.getFile = this.getFile.bind(this);
        this.getGeo = this.getGeo.bind(this);
        this.renderRadio = this.renderRadio.bind(this);
        this.getCascadeDropdown = this.getCascadeDropdown.bind(this);
        this.renderCascade = this.renderCascade.bind(this);
        this.renderCascadeOption = this.renderCascadeOption.bind(this);
        this.fetchCascade = this.fetchCascade.bind(this);
        this.limitCascade = 0;
        this.handleChange = this.handleChange.bind(this);
        this.handleOther = this.handleOther.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleFileUndo = this.handleFileUndo.bind(this);
        this.handleCascadeChange = this.handleCascadeChange.bind(this);
        this.handleMapChange = this.handleMapChange.bind(this);
        this.handleGlobal = this.handleGlobal.bind(this);

        /*CUSTOM*/
        this.getCustomCascade = this.getCustomCascade.bind(this);
        this.handleCustomChange = this.handleCustomChange.bind(this);
        /* END CUSTOM */
    }

    handleGlobal(questionid, qval){
        if (qval === "" || qval === null){
            this.props.replaceAnswers(this.props.value.questions);
        } else {
            this.props.replaceAnswers(this.props.value.questions);
        }
        this.props.changeGroup(this.props.value.groups.active);
        this.props.reduceGroups();
        this.props.checkSubmission();
    }

    handleCascadeChange(targetLevel, text, id, value, code) {
        let vals;
        let storage = {id:targetLevel,text:text, option:parseInt(value)}
        if (code) {
            storage = {...storage, code: code};
        }
        if (localStorage.getItem(id) !== null) {
            let multipleValue = JSON.parse(localStorage.getItem(id))
            let current = multipleValue.filter(x => x.id < targetLevel);
            vals = JSON.stringify([...current, storage])
        } else {
            vals = JSON.stringify([storage])
        }
        localStorage.setItem(this.props.data.id, vals)
        this.handleGlobal(this.props.data.id, vals)
        return true
    }

    handleFile(event) {
        const file = event.target.files[0];
        const id = this.props.data.id
        const ext = file.name.substring(file.name.lastIndexOf('.'))
        const acceptedformats = [".jpg", ".jpeg", ".png", ".gif", ".mp4"];
        const fileId = uuid() + ext;
        const that = this;
        const db = new Dexie('akvoflow');
        db.version(1).stores({files: 'id'});
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            db.files.put({id: fileId, fileName: file.name, blob: reader.result, qid:id})
            .then(() => {
                let files = JSON.parse(localStorage.getItem('__files__') || '{}');
                files[fileId] = file.name;
                localStorage.setItem(id, fileId);
                localStorage.setItem(fileId, file.name);
                localStorage.setItem('__files__', JSON.stringify(files));
                that.setState({ value: fileId })
                that.handleGlobal(id, fileId)
                that.setState({blob:reader.result});
                if (!acceptedformats.includes(ext)) {
                    alert("invalid formats");
                    this.handleFileUndo(event);
                }
                return;
            })
            .catch((e) => {
                console.error(e);
            });
        });
        reader.readAsDataURL(file);
        return;
    }

    handleFileUndo(event) {
        const id = this.props.data.id
        const fileId = this.state.value
        const that = this;
        let fileList = JSON.parse(localStorage.getItem('__files__'));
        let newFiles = {};
        for (let f in fileList) {
            if (f !==  fileId) {
                newFiles = {...newFiles, [f]: fileList[f]}
            }
        }
        localStorage.setItem('__files__', JSON.stringify(newFiles));
        const db = new Dexie('akvoflow');
        db.version(1).stores({files: 'id'});
        db.files.delete(fileId)
        .then((result) => {
            localStorage.removeItem(id)
            localStorage.removeItem(fileId)
            that.setState({ value: null })
            that.handleGlobal(id, fileId)
        })
        .catch((error) => {
            console.error(error);
        })

    }

    handleMapChange(value) {
        let id = this.props.data.id
        value = value.lat + '|' + value.lng + '|0';
        localStorage.setItem(id, value);
        this.setState({value: value});
        let datapoints = parseInt(localStorage.getItem('_dplOrder'));
        if (datapoints === id){
            localStorage.setItem('_dataPointLocation', value)
        };
        this.handleGlobal(id, value);
    }

    handleChange(event) {
        let id = this.props.data.id
        let value = event.target.value
        let target = event.target.id;
        if(event.target.attributes['data-validator']){
            localStorage.setItem('V-' + id, value);
            let lastanswer = localStorage.getItem(id);
            this.handleGlobal(lastanswer, id);
            return true;
        };
        if (target.split("_")[0]) {
            return this.handleOther(target, value);
        }
        if (this.props.data.type === "cascade") {
            let ddindex = event.target.selectedIndex
            let text = event.target[ddindex].text
            let targetLevel = parseInt(event.target.name.split('-')[2]) + 1
            let code = event.target.selectedOptions[0].getAttribute("data-code");
            this.handleCascadeChange(targetLevel, text, id, value, code);
            let selected = this.state.cascade_selected;
            let iterate_cascade = targetLevel;
            do {
                selected[iterate_cascade] = 0;
                iterate_cascade++
            } while (iterate_cascade < this.state.cascade_levels)
            selected[targetLevel - 1] = parseInt(value);
            this.setState({cascade_selected: selected})
            if (this.limitCascade > targetLevel) {
                this.getCascadeDropdown(value, targetLevel, 0, false)
            }
        }
        else if (this.props.data.options && this.props.data.options.allowMultiple)  {
            let multipleValue = [];
            let existValue = [];
			value = JSON.parse(value);
            if (localStorage.getItem(id) !== null) {
                multipleValue = JSON.parse(localStorage.getItem(id))
            }
            if (multipleValue.length > 0) {
                existValue = multipleValue.map((val) =>{
                    return val["text"];
                });
            }
            if (existValue.indexOf(value.text) === -1) {
                multipleValue.push(value)
                existValue.push(value.text)
            } else {
				multipleValue.splice(existValue.indexOf(value.text), 1)
            }
			if (multipleValue.length > 0) {
            	localStorage.setItem(id, JSON.stringify(multipleValue))
            	this.setState({value: multipleValue})
                this.handleGlobal(id, value)
			} else {
				localStorage.removeItem(id)
            	this.setState({value: ""})
			}
            if(this.props.data.options.allowOther) {
				let otherOpt = JSON.stringify({"text":"Other Option"})
                if (value === otherOpt && event.target.checked){
                    let otherClass = "other_" + this.props.data.id.toString();
                    this.setState({[otherClass]: true});
                }
                if (value === otherOpt && !event.target.checked){
                    let otherClass = "other_" + this.props.data.id.toString();
                    this.setState({[otherClass]: false});
                }
            }
            this.handleGlobal(id, value)
        } else if (this.props.data.options && !this.props.data.options.allowMultiple)  {
            let parsedValue = [JSON.parse(value)];
            let optval = JSON.stringify(parsedValue);

            let childs = this.props.value.questions.filter(x => x.dependency !== undefined);
            let dependentValue = false;
            let match = false;
            childs = childs.find(x => parseInt(x.dependency.question) === id);
            if (childs) {
                dependentValue = childs.dependency["answer-value"].split("|");
                parsedValue = parsedValue.map(x => x.text);
                match = dependentValue.some(r=> parsedValue.includes(r))
                if (!match) {
                    localStorage.removeItem(childs.id);
                }
            }
            localStorage.setItem(id, optval)
            this.setState({value: optval})
            this.handleGlobal(id, optval)
        } else {
            if (this.props.data.validation){
                this.setState({invalid:false});
                let min = this.props.data.validation.minVal;
                let max = this.props.data.validation.maxVal;
                let invalid = parseInt(value) < parseInt(min);
                if (invalid) {
                    this.setState({invalid:true});
                }
                invalid = parseInt(value) > parseInt(max);
                if (invalid) {
                    this.setState({invalid:true});
                }
            };
            localStorage.setItem(id, value)
            this.setState({value: value})
            this.handleGlobal(id, value)
        }
        if(value === "") {
            this.setState({value: value})
            localStorage.removeItem(id)
            this.handleGlobal(id, value)
        }
        if (this.props.data.localeNameFlag) {
            let a = JSON.parse(localStorage.getItem('_dpOrder'));
            let names = []
            a.map((b) => {
                let c = localStorage.getItem(b)
                if (c) {
                    if (isJsonString(c) && isNaN(c)) {
                        let opts = JSON.parse(c);
                        if (opts.length > 1) {
                            let cascade = opts.map(x => x.text)
                            cascade.forEach(name => {
                                names.push(name)
                            });
                        }
                        if (opts.length === 1) {
                            names.push(opts[0].text);
                        }
                    } else {
                        names.push(c)
                    }
                }
                return true
            })
            let edited = names.join(" - ")
            localStorage.setItem("_dataPointName", edited)
            this.props.reduceDataPoint(localStorage.getItem('_dataPointName'))
        }
        this.props.reduceGroups();
    }

    handleOther(target, value) {
        let history = "";
        if (localStorage.getItem(target)) {
            history = localStorage.getItem(target);
        }
        history = value;
        localStorage.setItem(target, history);
        this.setState({other:history});
    }

    setDpStorage () {
        if (localStorage.getItem('_dpOrder')) {
            let a = JSON.parse(localStorage.getItem('_dpOrder'));
            if (!a.includes(this.props.data.id)) {
                a.push(this.props.data.id)
            }
            localStorage.setItem('_dpOrder', JSON.stringify(a));
        } else {
            localStorage.setItem('_dpOrder', JSON.stringify([this.props.data.id]));
        }

    }

    setDplStorage () {
        localStorage.setItem('_dplOrder', this.props.data.id);
    }

    getRadio (data, unique) {
        if (data.options.option === undefined) {
            return "";
        }
        let arrayOpt = Array.isArray(data.options.option) ? data.options.option : [data.options.option];
        let opts = {
            ...data.options,
            option: arrayOpt
        }
        if (opts.allowMultiple === undefined) {
            opts = {...opts, allowMultiple: false}
        }
        let radioType = (opts.allowMultiple ? "checkbox" : "radio")
        let ao = opts.allowOther;
        let other = {text: "Other", value:"Other Option"};
        let olang = {"en":"other"};
        if (ao) {
            if ( opts.option.length > 0 ) {
                let oi = opts.option.length + 1;
                let main = opts.option.map((opt, i) =>
                    this.renderRadio(false, opts.lang[i], opt, i, data.id, radioType, unique)
                )
                other = this.renderRadio(true, olang , other, oi, data.id, radioType, unique)
                return [...main, other];
            }
            let main = this.renderRadio(false, opts.lang[0], opts.option, 0, data.id, radioType, unique)
            other = this.renderRadio(true, olang, other, 1 , data.id, radioType, unique)
            return [...main, other];
        }
        return (
            (opts.option.map((opt, i) => this.renderRadio(false, opts.lang[i], opt, i, data.id, radioType, unique)))
        )
    }

    renderRadio (o, lang, opt, i, id, radioType, unique) {
        let activeLang = this.props.value.lang.active;
        let localization = getLocalization(activeLang, lang, 'span', 'trans-lang-opt');
        let dataval = opt.code !== undefined
            ? JSON.stringify({"text":opt.value,"code":opt.code})
            : JSON.stringify({"text":opt.value})
        let storage = JSON.parse(localStorage.getItem(id));
        let checked = () => (false);
        if (storage) {
            storage = storage.map((val) => {
                if(typeof val === 'object') {
                    return val['text'];
                }
                let parsed = JSON.parse(val);
                return parsed['text'];
            });
            if (storage.indexOf(opt.value) >= 0) {
                checked = () => (true)
            }
        }
        if (o) {
            let oname = "other_"+id.toString();
            return (
                <div key={unique + '-div-radio-' + i.toString()} >
                    <div className="form-check" >
                        <input
                            key={unique + '-radio-' + i.toString()}
                            className="form-check-input"
                            type={radioType}
                            name={id}
                            value={dataval}
                            onChange={this.handleChange}
                            checked={checked()}
                        />
                        <label
                            className="form-check-label badge badge-secondary"
                            htmlFor={"input-" + (id).toString()}
                            dangerouslySetInnerHTML={{__html:localization}}
                        />
                    </div>
                <hr/>
                    <div className={checked() ? "":"hidden"}>
                        <label
                            className="form-label"
                            htmlFor={oname}>
                            Other Answer:
                        </label>
                        <input
                            className="form-control"
                            key={unique + "-radio-other-" + i.toString()}
                            value={this.state.other}
                            type="text"
                            name={oname}
                            id={oname}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
            )
        }
        return (
            <div className="form-check"
                 key={unique + '-div-radio-' + i.toString()}
            >
                <input
                    key={unique + '-radio-' + i.toString()}
                    className="form-check-input"
                    type={radioType}
                    name={id}
                    value={dataval}
                    onChange={this.handleChange}
                    checked={checked()}
            />
                <label
                    className="form-check-label"
                    dangerouslySetInnerHTML={{__html:localization}}
                    htmlFor={"input-" + (id+i).toString()}/>
            </div>
        )
    }

    getCascade (opts, lv, unique) {
        if (Array.isArray(opts.levels.level)){
            let l = opts.levels.level.length - 1
            return opts.levels.level.map((opt, i) => {
                this.limitCascade = i + 1
                return this.renderCascade(opt, i, l, unique, opts.id)
            });
        }
        this.limitCascade = 1;
        return this.renderCascade(opts.levels.level, 0, 0, unique, opts.id);
    }

    renderCascade (opt, i, l, unique, id) {
        let cascades = []
        let choose_options = "cascade_" + i
        let dropdown = this.state[this.state[choose_options]];
        let cascade = dropdown !== undefined ? (
            <div key={unique + '-dropdown-' + i}>
            <div>{opt.text}</div>
            <select
                className="form-control"
                type="select"
                value={this.state.cascade_selected[i]}
                name={ this.props.data.id.toString() + '-' + i}
                onChange={this.handleChange}
            >
                <option key={unique + '-cascade-options-' + 0} value=''>Please Select</option>
                {this.renderCascadeOption(dropdown,(i+1),opt.text, unique)}
            </select>
            </div>
        ) : (
            <div key={unique + '-dropdown-' + i}>
            <div>{opt.text}</div>
            <select
                className="form-control"
                type="select"
                name={ this.props.data.id.toString() + '-' + i}
                onChange={this.handleChange}
            >
                <option data-code={false} key={unique + '-cascade-options-' + 0} value=''>Please Select</option>
            </select>
            </div>
        );
        if (dropdown === undefined && this.state.cascade_selected[i - 1] !== undefined) {
            if (this.state["options_" + this.state.cascade_selected[i - 1].toString()] === undefined) {
                setTimeout(() => {
                    this.getCascadeDropdown(this.state.cascade_selected[i - 1], i, 0, true);
                }, 1000)
            }
        }
        cascades.push(cascade);
        if (this.limitCascade <= i) {
            this.handleChange()
        }
        return cascades.map((x, i) => x)
    }

    renderCascadeOption (data,targetLevel, text, unique) {
        if(data) {
            return data.map((x, i) => {
                let code = x.code !== null || x.code !== "" ? x.code :  false;
                let options = (
                    <option
                        key={unique + '-cascade-options-' + i}
                        data-code={code}
                        value={parseInt(x.id)}
                    >
                        {x.name}
                    </option>
                )
                return options
            })
        }
    }

    getCascadeDropdown(lv, ix, selected_value, init) {
        if (this.props.data.type === "cascade") {
            let url = 'cascade/' + this.props.value.instanceName + '/' + this.props.data.cascadeResource + '/' + lv
            let options = "options_" + lv
            let cascade = "cascade_" + ix
            let res = false;
            /*
            let availcasc = this.props.value.cascade;
            let isavailable = false;
            if (availcasc.length > 0) {
                isavailable = true;
            }
            if (isavailable) {
                res = availcasc.find(x => {
                    return x.url === url;
                });
            }
            */
            if (!res) {
                console.log(lv, ix, url, options, cascade, selected_value, init);
                this.fetchCascade(lv, ix, url, options, cascade, selected_value, init);
            }
            return;
        }
    }

    fetchCascade(lv, ix, url, options, cascade, selected_value, init) {
        let optlev = this.props.data.levels.level;
        getApi(url).then(res => {
            if (res.length === 0) {
                return res
            }
            try {
                this.setState({
                    [options]: res,
                    [cascade]: [options],
                    value: (res[ix] === undefined) ? res[0]['id'] : res[ix]['id'],
                    levels: Array.isArray(optlev) ? optlev.length - 1 : 0
                })
            } catch (err) {
                localStorage.removeItem(this.props.data.id)
            }
            return res
        }).then((res) => {
            this.props.storeCascade({
                url:url,
                data:res
            })
            if (init) {
                let selected = this.state.cascade_selected;
                this.setState({cascade_selected: selected});
                return;
            }
        })
    }

    getInput(data, unique, validation, answered, type) {
        let validator = "";
        let invalid = this.state.invalid ? " is-invalid" : "";
        if (this.state.invalid) {
            validator = validation.minVal ? "Min Value (" + parseInt(validation.minVal) + ") " : validator;
            validator = validation.maxVal ? validator + "Max Value (" + parseInt(validation.maxVal) + ")" : validator;
        }
        let unit = checkUnit(data);
        const FormInput =
            <input
                className={"form-control" + invalid}
                value={answered ? answered : ""}
                type={type}
                max={validation.maxVal ? parseInt(validation.maxVal) : ""}
                min={validation.minVal ? parseInt(validation.minVal) : ""}
                key={unique}
                name={'Q-' + data.id.toString()}
                onChange={this.handleChange}
            />;
        return (
            <div>
                <span className="text-danger text-sm">{validator}</span>
                {unit ? (
                    <div className="input-group">
                        {FormInput}
                        <div className="input-group-append"><span className="input-group-text">{unit}</span></div>
                    </div>
                ) : FormInput}
            </div>
        )
    }

    getDoubleEntry(data, unique, answered, type) {
        let validator = localStorage.getItem('V-'+data.id);
        validator = validator !== null ? validator : "";
        return (
            <div>
            <input
                className="form-control"
                type={type}
                defaultValue={validator}
                key={'validation-' + unique}
                name={'V-' + data.id.toString()}
                data-validator={true}
                onChange={this.handleChange}
            />
                <div>Confirm Input</div>
            <input
                className="form-control"
                value={answered ? answered : ""}
                type={type}
                key={unique}
                name={'Q-' + data.id.toString()}
                onChange={this.handleChange}
            />
            </div>
        )
    }

    getInputOther(data, unique, answered, type) {
        return (
            <input
                className={data.type === "photo" ? "form-control-file" : "form-control"}
                value={answered ? answered : ""}
                key={unique}
                type={type}
                name={'Q-' + data.id.toString()}
                onChange={this.handleChange}
            />
        )
    }

    getFile(data, unique, answered, type) {
        if (answered) {
            const fileName = localStorage.getItem(answered)
            return (
                <div>
                    <span className="mr-2">
                        {fileName}
                    </span>
                    <input
                        key={answered}
                        type="button"
                        name={'Q-' + data.id.toString() + '-undo'}
                        className="btn btn-danger btn-sm"
                        value="Undo"
                        onClick={this.handleFileUndo} />
                    <button
                        className="ml-2 btn btn-secondary btn-sm"
                        onClick={e => PopupImage(fileName, unique, this.state.blob)}
                    >
                    View Image
                    </button>
                    <img alt={fileName} className="hidden" id={unique} src={this.state.blob}/>
                </div>
            )
        }

        return (
          <input
              key={unique}
              type="file"
              className="form-control-file"
              aria-label="Upload File"
              accept={type + '/*'}
              name={'Q-' + data.id.toString()}
              onChange={this.handleFile}
              multiple={false}
          />
        )
    }

    getTextArea(data, unique, answered, type) {
        return (
            <textarea
                key={unique}
                rows="3"
                className="form-control"
                value={answered ? answered : ""}
                type={type}
                onChange={this.handleChange}
                name={'Q-' + data.id.toString()}
            />
        )
    }

    getGeo(data, unique) {
        let id = this.props.data.id;
        let pos = {lat:51.505, lng:-0.09};
        if (localStorage.getItem(id)) {
            pos = localStorage.getItem(id);
            pos = pos.split('|');
            pos = {lat: pos[0], lng: pos[1]};
        }
        return (
            <MapForm
                center={pos}
                zoom={13}
                update={this.handleMapChange}
            />
        );
    }

    /* CUSTOM */
    handleCustomChange(event, childs, hasOther) {
        let id = this.props.data.id;
        let value = event.target.value;
        if (this.state.custom_cascade_type === "radio") {
            this.setState({custom_cascade_other:value === "Other"});
            localStorage.setItem(id, value);
            this.setState({value: value});
            this.handleGlobal(id, value);
            return;
        }
        let multipleValue = [];
        let existValue = [];
        if (localStorage.getItem(id) !== null) {
            multipleValue = localStorage.getItem(id).split('|')
        }
        if (multipleValue.length > 0) {
            existValue = multipleValue.map((val) =>{
                return val;
            });
        }
        if (existValue.indexOf(value) === -1) {
            if (hasOther) {
                this.setState({custom_cascade_other:true});
            }
            multipleValue.push(value)
            existValue.push(value)
        } else {
            if (hasOther) {
                this.setState({custom_cascade_other:false});
            }
            multipleValue.splice(existValue.indexOf(value), 1)
        }
        if (multipleValue.length > 0) {
            localStorage.setItem(id, multipleValue.join("|"))
            this.setState({value: multipleValue})
            this.handleGlobal(id, value)
        } else {
            localStorage.removeItem(id)
            this.setState({value: ""})
        }
        if(value === "") {
            this.setState({value: value})
            localStorage.removeItem(id)
        }
        this.handleGlobal(id, value)
    }

    getCustomCascade(id, data, unique, level, index, margin, parent="") {
        const active = this.props.value.lang.active;
        return data.map((x, i) => {
            let value = parent !== "" ? (parent + " > " + x.name) : x.name;
            let checked = false;
            let selected = localStorage.getItem(id);
            if (selected !== null) {
                checked = selected.split('|').includes(value);
            }
            let indeterminate = false;
            let lang = x.lang ? x.lang : {"en":x.name};
            let localization = getLocalization(active, lang, 'span','trans-lang-opt', level === 0);
            let grandParent =  x.name !== "Other" && level === 0 && x.childs.length !== 0;
            if (grandParent) {
                return (
                    <div
                        style={{marginLeft: margin + "rem"}}
                        key={unique + '-radio-' + level + '-' + index + '-' + i.toString()}>
                        <div className="parent-options" dangerouslySetInnerHTML={{__html:localization}}/>
                        { x.childs.length > 0
                            ? this.getCustomCascade(id, x.childs, unique, level + 1, i, margin + .2, value)
                            : ""}
                        { level === 0 ? <hr/> : ""}
                    </div>
                )
            }
            return (
                <div
                    style={{marginLeft: margin + "rem"}}
                    key={unique + '-radio-' + level + '-' + index + '-' + i.toString()}>
                    <input
                        className="form-check-input"
                        type={this.state.custom_cascade_type}
                        name={"input-" + unique}
                        onChange={e => this.handleCustomChange(e, x.childs, x.hasOther)}
                        checked={checked}
                        disabled={x.childs.length > 0}
                        value={value}
                        ref={e => e && (e.indeterminate = indeterminate)}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={"input-" + unique}
                        dangerouslySetInnerHTML={{__html:localization}}/>
                    { x.childs.length > 0
                        ? this.getCustomCascade(id, x.childs, unique, level + 1, i, margin + .2, value)
                        : ""}
                    { level === 0 ? <hr/> : ""}
                </div>
            )
        });
    }
    /* END-CUSTOM */

    componentDidMount () {
        /* CUSTOM */
        if (this.props.data.type === "text") {
            let customOption = checkCustomOption(this.props.data);
            if (customOption) {
                getApi('json/' + customOption.url).then(res => {
                    res = res.map(x => ({...x, hasOther:false}));
                    this.setState({
                        custom_cascade: [...res, {name: 'Other', childs:[], hasOther:true}],
                        custom_cascade_type: customOption.type
                    });
                    let multipleValue = localStorage.getItem(this.props.data.id.toString())
                    if (multipleValue) {
                        multipleValue = multipleValue.split('|');
                        if (multipleValue.includes("Other")) {
                            this.setState({custom_cascade_other:true});
                        }
                    }
                });
            }
        }
        /* END CUSTOM */
        if (this.props.data.type === "cascade"){
            let cascade_selected = [];
            if (this.props.data.levels.level.text !== undefined) {
                this.setState({cascade_levels: 1});
                this.setState({cascade_selected: [0]});
            } else {
                this.setState({cascade_levels: this.props.data.levels.level.length});
                for (let i=0; i < this.props.data.levels.level.length; i++) {
                    cascade_selected = [...cascade_selected, 0]
                }
                this.setState({cascade_selected: cascade_selected});
            }
            let selected_cascade = localStorage.getItem(this.props.data.id)
            selected_cascade = selected_cascade !== null ? JSON.parse(selected_cascade) : false;
            if (selected_cascade) {
                selected_cascade.forEach((sc, i) => {
                    cascade_selected[i] = sc.option;
                    if (i === 0) {
                        this.getCascadeDropdown(i, i, sc.option, true);
                        return;
                    }
                    this.getCascadeDropdown(selected_cascade[i - 1].option, i, sc.option, true);
                    return;
                });
                this.setState({cascade_selected: cascade_selected});
            } else {
                this.getCascadeDropdown(0, 0, 0, true)
            }
        }
        if (localStorage.getItem(this.props.data.id) !== null){
            this.props.checkSubmission();
            this.props.reduceGroups();
            if (this.props.data.type === "photo") {
                const db = new Dexie('akvoflow');
                db.version(1).stores({files: 'id'});
                db.files.get(this.state.value).then(value => {
                    this.setState({'blob':value.blob});
                });
            }
        };
    }

    render() {
        let data = this.props.data
        let key = 'question-form-' + data.id.toString()
        let formtype = data.type
        let answered = localStorage.getItem(data.id)
        if (data.localeNameFlag) {
            this.setDpStorage();
        }
        if ('localeLocationFlag' in data){
            this.setDplStorage()
        }
        /* CUSTOM */
        let customOption = checkCustomOption(data);
        if (customOption) {
            formtype = "custom-cascade";
        }
        /* END CUSTOM */
        switch(formtype) {
            case "option":
                return this.getRadio(data, key)
            case "cascade":
                return this.getCascade(data,0, key)
            case "number":
                if(data.requireDoubleEntry) {
                    return this.getDoubleEntry(data, key, answered, formtype);
                }
                return this.getInput(data, key, data.validationRule, answered, formtype)
            case "photo":
                return this.getFile(data, key, answered, "image")
            case "video":
                return this.getFile(data, key, answered, "video")
            case "date":
                return this.getInputOther(data, key, answered, formtype)
            case "geo":
                return this.getGeo(data, key)
            /* CUSTOM */
            case "custom-cascade":
                return (
                    <div>
                        {this.getCustomCascade(data.id, this.state.custom_cascade, key, 0, 0, 1.25)}
                        <div className={this.state.custom_cascade_other ? "" : "hidden"}>
                            <label
                                className="form-label"
                                htmlFor={data.id.toString() + "_OTHER"}>
                                Other Answer:
                            </label>
                            <input
                                className="form-control"
                                key={data.id + "-radio-other"}
                                value={this.state.other}
                                type="text"
                                name={"other_" + data.id.toString()}
                                id={"other_" + data.id.toString()}
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>
                )
            /* END CUSTOM */
            default:
                if(data.requireDoubleEntry) {
                    return this.getDoubleEntry(data, key, answered, formtype);
                }
                return this.getTextArea(data, key, answered, formtype)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionType);
