import React from "react";
import "./styles.css";
import * as Flex from '@twilio/flex-ui';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { debounce } from "lodash";

const styles = {
    contained: {
        borderRadius: "0px",
        textTransform: "uppercase",
        margin: "0", 
        padding: "4px 20px",
        fontWeight: "bold",
        fontFamily: "inherit",
        fontSize: "11px",
    }
  };

class BulkSkills extends React.Component {

    state = {
        workers: {},
        selectedWorkers: null,
        search: "",
        showMessage: null,
        error: null
    }

    componentDidMount() {
        this.getWorkers();
    }

    getWorkers = () => {
        Flex.Manager.getInstance().insightsClient.instantQuery('tr-worker').then((q) => {
            
            q.on('searchResult', (items) => {

                this.setState({ 
                    error: null,
                    workers: items,
                    selectedWorkers: Object.keys(items).reduce((pr, cur) => {
                        const name =  
                            items[cur].attributes.full_name || 
                            items[cur].friendly_name;
    
                        return [...pr, name]
                    }, []),
                    showMessage: null
                });

            });

            let expression = this.state.search;

            if(!expression.match(/data\..*/) && expression !== ""){
                expression = `data.attributes.full_name CONTAINS "${expression}" OR data.friendly_name CONTAINS "${expression}"`
            }

            q.search(expression).catch(() => {
                this.setState({ error: "Invalid query" })
            });
        });
    }

    updateWorkerList = debounce((search) => {
        this.setState({ 
            search
        });
        this.getWorkers();
    }, 300);

    handleInputChange = (event) => {
        this.updateWorkerList(event.target.value);
    };

    updateWorkersAttributes = () => {


        this.setState({ showMessage: "Loading" });

        const sid = this.props.worker.sid;

        const workers = Object.keys(this.state.workers).reduce((pr, cur) => {
            const worker = this.state.workers[cur];

            if(this.state.selectedWorkers.includes(
                worker.attributes.full_name || 
                worker.friendly_name
            )) {
                return [...pr, worker];
            }

            return pr;
        }, []);

        // alert("Clicked")

    
        setTimeout(() => this.setState({ showMessage: "Saved" }), 1000);

    }

    handleChange = (event) => {
        const { selectedWorkers } = this.state

        this.setState({
            selectedWorkers: event.target.checked ? 
                [ ...selectedWorkers, event.target.name] : 
                selectedWorkers.filter(elem => elem !== event.target.name),
            showMessage: null
        })
    };

    render () {

        const { classes } = this.props;

        const numberOfChecked = this.state.selectedWorkers ? 
            Object.keys(this.state.selectedWorkers).length : 0;

        const error = 
            ((numberOfChecked === 0 && this.state.search !== "") || this.state.error) && 
            ((this.state.error) || "No worker matched");

        return (
            <div className="bulkWrapper">
                <div className="bulkTitle">
                    Copy Skills to multiple agents
                </div>
                <div className="inputWrapper">
                    <input 
                        type="text" 
                        className="input" 
                        onChange={this.handleInputChange}
                        placeholder="Select using expression"
                    />
                </div>
                {
                error && 
                    <div className="bulkResultDescription">{error}</div>
                }
                <div className="bulkList">
                    {Object.keys(this.state.workers).map(workerSid => {

                        const name = 
                            this.state.workers[workerSid].attributes.full_name || 
                            this.state.workers[workerSid].friendly_name;

                        return (
                            <FormControlLabel
                                key={workerSid}
                                control={
                                    <Checkbox 
                                        checked={
                                            this.state.selectedWorkers ? 
                                                this.state.selectedWorkers.includes(name) : 
                                                false
                                        } 
                                        onChange={this.handleChange} 
                                        name={name} 
                                        className="label"
                                        color="primary"
                                    />
                                }
                                label={name}
                            />
                        )
                    })}
                </div>
                <div className="bulkButtons">
                    <div className="bulkButtonDescription">
                        {  
                            this.state.showMessage ? 
                                <span className="bold">{this.state.showMessage}</span> : 
                                (<div><span className="bold">{numberOfChecked}</span> selected</div>)
                        }
                    </div>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        classes={{
                            contained: classes.contained
                        }}
                        onClick={this.updateWorkersAttributes}
                        disabled={error != null || this.state.showMessage}
                    >
                        Apply
                    </Button>
                </div>
            </div>
        )
    } 

}

const mapStateToProps = state => {

    const workerAttributes = state.flex.worker.attributes;

    return {
        workerAttributes
    }
};


export default connect(mapStateToProps)(withStyles(styles)(BulkSkills));