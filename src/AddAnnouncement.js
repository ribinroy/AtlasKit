import React from 'react';
// import styled from 'styled-components';
import Button, { ButtonGroup } from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import EditIcon from '@atlaskit/icon/glyph/edit-filled';
import VidIcon from '@atlaskit/icon/glyph/vid-play';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import DynamicTable from '@atlaskit/dynamic-table';
import { JIRATransformer } from '@atlaskit/editor-jira-transformer';

import AnnouncementConfigDialog from './AnnouncementConfigDialog';

class Dynamic extends React.Component {
	markup (val) {
		return { __html: val }
	}
	
	render () {
		return <div dangerouslySetInnerHTML={this.markup(this.props.html)} />;
	}
}

class TimeFormat extends React.Component {
	markup (val) {
		return { __html: val }
	}
	
	render () {
        const formatedDate = (new Date(this.props.date)).toString().split(":")[0] + ":" + (new Date(this.props.date)).toString().split(":")[1] // DAY Month date year HH:MM
		return <span>{formatedDate}</span>;
	}
}

class AddAnnouncement extends React.Component{
    constructor(){
        super()
        this.state = {
            modalOpen: false,
            editModelOpen: false,
            head: {
                cells:[
                    {key:"name", name: "announcementTitle", content:"Title", isSortable: true},
                    {key:"type", name: "type", content:"Type"},
                    {key:"messageType", name: "messageType", content:"Message Type"},
                    {key:"announcementMessage", name: "announcementMessage", content:"Announcement Message"},
                    {key:"startDate", name: "startDate", content:"Start Date"},
                    {key:"endDate", name: "endDate", content:"End Date"},
                    {key:"frequency", name: "frequency", content:"Frequency"},
                    {key:"count", name: "count", content:"Count"},
                    {key:"status", name: "status", content:"Status"},
                    {key:"allowUserToReply", name: "allowUserToReply", content:"User Reply"},
                    {key:"announcementContact", name: "announcementContact", content:"Announcement Contact"},
                    {key:"actions", name: "actions", content:"Actions"}
                ]
            },
            announcementsArray: [],
            editInformations: false,
            caption: "Announcements",
            rows: []
        }
        this.handleAnnouncementClick = this.handleAnnouncementClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.saveModal = this.saveModal.bind(this);
        this.deleteThisItem = this.deleteThisItem.bind(this);
        this.editSaveModal = this.editSaveModal.bind(this);
        
    }

    handleAnnouncementClick(event){
        this.setState({
            modalOpen: true
        })
    }

    closeModal(){
        this.setState({
            modalOpen: false,
            editModelOpen: false
        })
    }

    deleteThisItem(thisItemIndex){
        if(!window.confirm("Please confirm"))
            return false;
        var array = [...this.state.rows]; // make a separate copy of the array
        var index = false;
        array.forEach(function(item, itemIndex){
            index = item.indexKey === thisItemIndex?itemIndex:index
        })
        if(index !== false){
            array.splice(index, 1);
            this.setState({rows: array});
        }
    }

    editThisItem(thisItemIndex){
        var array = [...this.state.rows]; // make a separate copy of the array
        var index = false;
        array.forEach(function(item, itemIndex){
            index = item.indexKey === thisItemIndex?itemIndex:index
        })
        var currentData = {};
        array[index].cells.forEach(function(item){
            currentData[item.name] = item.content
        })
        currentData["editKey"] =  array[index].indexKey;
        this.setState({
            editInformations:currentData,
        }, function(){
            this.setState({
                editModelOpen: true
            });
        })
    }

    editSaveModal(data){
        var uniqueIndex = data.editKey;
        var rowItem = this.getSavedDataObject(data, uniqueIndex);
        var array = [...this.state.rows]; // make a separate copy of the array
        var index = false;
        array.forEach(function(item, itemIndex){
            index = item.indexKey === uniqueIndex?itemIndex:index
        })
        
        array.splice(index, 1);
        array.splice(index,0,{cells:rowItem, indexKey: uniqueIndex})
        this.setState({rows: array});
    }

    saveModal(data){
        var uniqueIndex = data.announcementTitle + "_" + this.state.rows.length + 1;
        var rowItem = this.getSavedDataObject(data, uniqueIndex);
        var joined = this.state.rows.concat([{cells:rowItem, indexKey: uniqueIndex}]);
        this.setState({ rows: joined })
        console.log(joined)
    }

    getSavedDataObject(data, uniqueIndex){
        var rowItem = [];
        var _this = this;
        this.state.head.cells.forEach(function(head){
            var value = "";
            if(head.name === "actions"){
                value =  <div>
                            <span  onClick={() => _this.editThisItem(uniqueIndex)}>
                                <EditIcon />
                            </span>
                            <span>
                                <VidIcon />
                            </span>
                            <span>
                                <RefreshIcon />
                            </span>
                            <span  onClick={() => _this.deleteThisItem(uniqueIndex)}>
                                <TrashIcon />
                            </span>
                        </div>
            }
            else
                Object.keys(data).forEach(function(key) {
                    if(key === head.name){
                        if(key === "announcementMessage"){
                            value = data[key];
                            // if(data["messageType"] == "Rich Text Editor"){
                            //     // for JIRA Transformer
                            //     const serializer = new JIRATransformer(data[key].type.schema);
                            //     // To encode editor content as markdown
                            //     value = serializer.encode(data[key]);
                            //     value = <Dynamic html={value}/>
                            // }
                            value = <Dynamic html={value}/>
                        }
                        else if(key === "startDate" || key === "endDate"){
                            value = <TimeFormat date={data[key]}/>
                        }
                        else
                            value = (key !== "status")?(key !== "allowUserToReply")?data[key]: data[key]?"Allowed":"Not allowed": data[key]?"Enabled":"Disabled";
                    }
                });
            var pushObject = {content:value, name:head.name}
            rowItem.push(pushObject)
        })
        return rowItem;
    }

    render(){
        return(
            <div className="App">
                <ButtonGroup appearance="default">
                    <Button onClick={this.handleAnnouncementClick} appearance={'default'}>
                        <AddIcon primaryColor="#333" size="medium" style={{marginTop:`5px`}}></AddIcon>
                        <span>Add announcement</span>
                    </Button>
                </ButtonGroup>
                {this.state.rows.length > 0 &&
                    <DynamicTable
                        caption={this.state.caption}
                        head={this.state.head}
                        rows={this.state.rows}
                        rowsPerPage={10}
                        defaultPage={1}
                        loadingSpinnerSize="large"
                        isLoading={false}
                        isFixedSize
                        defaultSortKey="name"
                        defaultSortOrder="ASC"
                        onSort={() => console.log('onSort')}
                        onSetPage={() => console.log('onSetPage')}
                    />
                }
                
                {this.state.modalOpen && 
                    <AnnouncementConfigDialog 
                        closeModal={this.closeModal}
                        saveModal={this.saveModal}
                        heading={"New Announcement"}
                    />
                }

                {this.state.editModelOpen && 
                    <AnnouncementConfigDialog 
                        closeModal={this.closeModal}
                        saveModal={this.editSaveModal}
                        heading={"Edit Announcement"}
                        editInformations={this.state.editInformations}
                    />
                }
            </div>
        )
    }
}


export default AddAnnouncement;
