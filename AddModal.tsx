import React, {Component} from 'react';
import {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TextInput} from 'react-native';
import {Button} from 'react-native-elements';
import DatePicker from 'react-native-date-picker';
import Utils from './Utils';

type AddModalProps = {
    visible: boolean,
    editingItem: any,
    onCancel: () => void,
    onOK: (editingItem:any, content:string, date:Date) => void,
};

class AddModal extends Component<AddModalProps> {
    state = {
        date: new Date(),
        content: '',
        datePickerOpen: false,
    };

    componentDidUpdate(prevProps: Readonly<AddModalProps>, prevState: Readonly<{}>, snapshot?: any) {
        if (this.props.visible && prevProps.visible !== this.props.visible) {
            if (this.props.editingItem) {
                this.setState({
                    content: this.props.editingItem.content,
                    date: new Date(this.props.editingItem.time)
                });
            } else {
                this.setState({
                    content: '',
                    date: new Date(),
                });
            }
        }
    }

    render() {
        const {content, date, datePickerOpen} = this.state;
        return (
            <View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.props.visible}
                    onRequestClose={() => {
                        this.setState({visible: false});
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TextInput multiline placeholder="What's up?" onChangeText={text => this.setState({content:text})} value={content} style={styles.input}/>
                            <Button type='clear' title={Utils.simpleDateTime(date)} onPress={()=>this.setState({datePickerOpen: true})}/>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '50%', marginTop: 20}}>
                                <Button title='OK' type='clear' onPress={
                                    ()=>this.props.onOK(this.props.editingItem, content, date)}/>
                                <Button title='Cancel' type='clear' onPress={this.props.onCancel}/>
                            </View>
                        </View>
                    </View>
                </Modal>
                <DatePicker
                    modal
                    mode='datetime'
                    open={datePickerOpen}
                    date={date}
                    onConfirm={(date)=>{this.setState({date: date, datePickerOpen: false});}}
                    onCancel={()=>this.setState({datePickerOpen:false})}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: 'white',
        padding: 35,
        alignItems: 'center',
        elevation: 5,
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    input: {
        width: '90%',
        margin: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        fontSize: 16,
    },
});

export default AddModal;