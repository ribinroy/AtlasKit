import React from 'react';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Textfield from '@atlaskit/textfield';
import Select from '@atlaskit/select';
import TextArea from '@atlaskit/textarea';
import Range from '@atlaskit/range';
import { DatePicker } from '@atlaskit/datetime-picker';
import Toggle from '@atlaskit/toggle';
import { Editor } from '@atlaskit/editor-core';
import { JIRATransformer } from '@atlaskit/editor-jira-transformer';
// import { JIRASchema as schema } from '@atlaskit/editor-common';

class AnnouncementConfigDialog extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            announcementTitle: "",
            type: false,
            messageType: false,
            announcementMessage: false,
            announcementContact: "",
            frequency: false,
            count: false,
            startDate: "",
            endDate: "",
            status: true
        }

        var realSchema = false;
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.saveData = this.saveData.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.handleRichText = this.handleRichText.bind(this);
    }

    handleCloseModal(){
        this.props.closeModal();
    }

    handleRichText(event){
        const serializer = new JIRATransformer(this.realSchema);
        var editorContent = event.dom.innerHTML;
        // To encode editor content as markdown
        // serializer.encode(editorContent);
        // To convert HTML to editor content
        // serializer.parse(editorContent);
        debugger;
        this.setState({
            announcementMessage:serializer.parse(editorContent)
        })
        
    }

    saveData(){
        this.props.saveModal(this.state);
        this.handleCloseModal();
    }
    
    schemaFunction(schema){
        this.realSchema = schema;
    }

    disabledDay(type){
        if(this.state.startDate && this.state.endDate){
            if(new Date(this.state.startDate) > new Date(this.state.endDate)){
                //swap
                var currentStartDate = this.state.startDate;
                var currentEndDate = this.state.endDate;
                this.setState({
                    startDate:currentEndDate,
                    endDate:currentStartDate,
                })
            }
        }
        if(type === "end" && this.state.startDate){
            var date = new Date(this.state.startDate);
            var secondDate = new Date(date);
            secondDate.setDate(secondDate.getDate() + 1)
            var array = [this.getISODate(date), this.getISODate(secondDate)];
            return array;
        }
        else if(type === "start" && this.state.endDate){
            date = new Date(this.state.endDate);
            secondDate = new Date(date);
            secondDate.setDate(secondDate.getDate() - 1)
            array = [this.getISODate(date), this.getISODate(secondDate)];
            return array;
        }
    }

    getISODate(date){
        return date.toISOString().split("T")[0];
    }

    handleDataChange(event){
        debugger;
        if(event.target === undefined){
            //select element
            this.setState({
                [event.name]:event.value
            })
            return
        }
        const {name, value, type, checked} = event.target 
        if(type === "checkbox"){
            this.setState({
                [name]:checked
            })
        }
        else{
            //text, textarea, select
            this.setState({
                [name]:value
            })
        }
    }

    render(){
        const actions = [
            { text: 'Save', onClick: this.saveData },
            { text: 'Close', onClick:  this.handleCloseModal},
        ];

        const formElementStyle = {
            marginBottom: '15px'
        };

        return(
            <ModalTransition>
                <Modal actions={actions} heading={this.props.heading}>
                    <div style={formElementStyle}>
                        <label htmlFor="announcementTitle">Announcement Title</label>
                        <Textfield name="announcementTitle" placeholder="Announcement Title" maxLength="50" autoComplete="off" onChange={this.handleDataChange}/>
                    </div>
                    
                    <div style={formElementStyle}>
                        <label htmlFor="type" style={{marginBottom:`10px`}}>Type</label>
                        <Select
                            className="single-select"
                            classNamePrefix="react-select"
                            onChange={this.handleDataChange}
                            options={[
                            { label: 'Info', value: 'Info', name:"type"},
                            { label: 'Warning', value: 'Warning',name:"type" },
                            { label: 'Error', value: 'Error', name:"type" },
                            { label: 'Success', value: 'Success', name:"type" },
                            ]}
                            placeholder="Type"
                        />
                    </div>

                    <div style={formElementStyle}>
                        <label htmlFor="messageType" style={{marginBottom:`10px`}}>Announcement Type</label>
                        <Select
                            className="single-select"
                            name="messageType"
                            classNamePrefix="react-select"
                            onChange={this.handleDataChange}
                            options={[
                            { label: 'Rich Text Editor', value: 'Rich Text Editor', name:"messageType"},
                            { label: 'HTML', value: 'HTML',name:"messageType" },
                            ]}
                            placeholder="Announcement Type"
                        />
                    </div>

                    {(this.state.messageType === "Rich Text Editor" || !this.state.messageType) &&
                        <div style={formElementStyle}>
                            <label htmlFor="announcementMessage" style={{marginBottom:`10px`}}>Announcement Message</label>
                            <Editor
                                appearance="comment" 
                                name="announcementMessage"
                                contentTransformerProvider={schema =>
                                    this.schemaFunction(schema)
                                }
                                onChange={this.handleRichText}
                            />
                        </div>
                    }

                    {this.state.messageType === "HTML" &&
                        <div style={formElementStyle}>
                            <label htmlFor="announcementMessage" style={{marginBottom:`10px`}}>Announcement Message</label>
                            <TextArea
                                name="announcementMessage"
                                onChange={this.handleDataChange}
                                autoComplete="off"
                                placeholder="Announcement HTML"
                            />
                        </div>
                    }

                    <div style={formElementStyle}>
                        <label htmlFor="announcementContact">Announcement Contact</label>
                        <Textfield name="announcementContact" placeholder="Announcement POC" type="Email" autoComplete="off" onChange={this.handleDataChange}/>
                    </div>

                    <div style={formElementStyle}>
                        <label htmlFor="frequency" style={{marginBottom:`10px`}}>Frequency</label>
                        <Select
                            className="single-select"
                            name="frequency"
                            classNamePrefix="react-select"
                            onChange={this.handleDataChange}
                            options={[
                            { label: 'Run for ‘N’ number of times', value: 'Run for ‘N’ number of times', name:"frequency"},
                            { label: 'Run per session', value: 'Run per session',name:"frequency" },
                            { label: 'Always', value: 'Always',name:"frequency" },
                            ]}
                            placeholder="Announcement Type"
                        />
                    </div>

                    {this.state.frequency === "Run for ‘N’ number of times" &&
                        <div style={formElementStyle}>
                            <label htmlFor="count">Range</label>
                            <Range name="count" step={1} onChange={value => this.setState({count:value})} defaultValue={0} min={1} max={100}/>
                            <p>The current value is: {this.state.count}</p>
                        </div>
                    }

                    <div style={formElementStyle}>
                        <label htmlFor="startDate">Start Date</label>
                        <DatePicker name="startDate" value={this.state.startDate} disabled={this.disabledDay("start")} onChange={value => this.setState({startDate:value})} />
                    </div>

                    <div style={formElementStyle}>
                        <label htmlFor="endDate">End Date</label>
                        <DatePicker name="endDate" value={this.state.endDate} disabled={this.disabledDay("end")} onChange={value => this.setState({endDate:value})} />
                    </div>

                    <div style={formElementStyle}>
                        <label htmlFor="status">Do not remimd me</label>
                        <Toggle name="status" isDefaultChecked isChecked={this.state.status} onChange={value => this.setState({status:!this.state.status})} />
                    </div>
                </Modal>
            </ModalTransition>
        )
    }
}


export default AnnouncementConfigDialog;
