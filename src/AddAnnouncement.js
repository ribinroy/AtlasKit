import React from 'react';
// import styled from 'styled-components';
import Button, { ButtonGroup } from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import EditIcon from '@atlaskit/icon/glyph/edit-filled';
import VidIcon from '@atlaskit/icon/glyph/vid-play';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import DynamicTable from '@atlaskit/dynamic-table';

import AnnouncementConfigDialog from './AnnouncementConfigDialog';

class AddAnnouncement extends React.Component{
    constructor(){
        super()
        this.state = {
            modalOpen: true,
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
                    {key:"announcementContact", name: "announcementContact", content:"Announcement Contact"},
                    {key:"actions", name: "actions", content:"Actions"}
                ]
            },
            announcementsArray: [],

            caption: "Announcements",
            rows: []
        }
        this.handleAnnouncementClick = this.handleAnnouncementClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.saveModal = this.saveModal.bind(this);
        this.deleteThisItem = this.deleteThisItem.bind(this);
    }

    handleAnnouncementClick(event){
        this.setState({
            modalOpen: true
        })
    }

    closeModal(){
        this.setState({
            modalOpen: false
        })
    }

    deleteThisItem(thisItemIndex){
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
        //TO Be done
    }

    saveModal(data){
        // var joined = this.state.announcementsArray.concat(data);
        // this.setState({ announcementsArray: joined })
        debugger;
        var rowItem = [];
        var uniqueIndex = data.announcementTitle + "_" + this.state.rows.length + 1;
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
                    if(key === head.name)
                        value = (key !== "status")?data[key]: data[key]?"Enabled":"Disabled";
                });
            var pushObject = {content:value, name:head.name}
            rowItem.push(pushObject)
        })
        // Object.keys(data).forEach(function(item){
        //     rowItem.push({content:data[item], name:item})
        // })
        var joined = this.state.rows.concat([{cells:rowItem, indexKey: uniqueIndex}]);
        this.setState({ rows: joined })
        console.log(joined)
    }

    render(){
        return(
            <div className="App">
                <ButtonGroup appearance="primary">
                    <Button onClick={this.handleAnnouncementClick}>
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
                
                {this.state.modalOpen && <AnnouncementConfigDialog closeModal={this.closeModal} saveModal={this.saveModal} heading={"New Announcement"}/>}
            </div>
        )
    }
}


export default AddAnnouncement;
