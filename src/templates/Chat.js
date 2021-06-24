import React, {Component} from 'react';
import {Chat, Common} from '../components';
import {database} from '../firebase/index'

class ChatTemplate extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        const memberIds = this.props.messages.userIds;
        let photoList = {},
            msgs = this.props.messages.msgs;

        const queryUserPhoto = (id) => {
            return new Promise(resolve => {
                return database.ref('users').child(id).once('value', (snapshot) => {
                    const userValue = snapshot.val();
                    const userPhoto = (userValue.photoPath) ? userValue.photoPath : "https://firebasestorage.googleapis.com/v0/b/react-chat-e2fd7.appspot.com/o/no-profile-icon.jpeg?alt=media&token=d161ba6c-1112-4cba-b538-0f650943ef9f"
                    return resolve(userPhoto)
                })
            })
        };

        // Add icons for each member in the group or private chat
        for (let memberId of Object.keys(memberIds)) {
            photoList[memberIds[memberId]] = await queryUserPhoto(memberIds[memberId])
        }


        database.ref('chatRoom').child(this.props.messages.userId).child(this.props.messages.roomId).child('messages').on('child_added', snapshot => {
            const message = snapshot.val();
            if (message.from_id) {
                const isMyMessage = (message.from_id === this.props.messages.userId);
                msgs.push({
                    image: (photoList[message.from_id]) ? photoList[message.from_id] : "https://firebasestorage.googleapis.com/v0/b/react-chat-e2fd7.appspot.com/o/no-profile-icon.jpeg?alt=media&token=d161ba6c-1112-4cba-b538-0f650943ef9f",
                    isMyMessage: isMyMessage,
                    text: message.message
                });
            }
            this.setState({
                msgs: msgs,
            });
        });
    }

    componentDidUpdate() {
        const scrollArea = document.getElementById("scroll-area");
        scrollArea.scrollTop = scrollArea.scrollHeight;
    }

    componentWillUnmount() {
        return database.ref('chatRoom').child(this.props.messages.userId).child(this.props.messages.roomId).off()
    }

    render() {
        return (
            <div className="p-chat">
                <Common.NavBar
                    value={this.props.messages}
                    actions={this.props.actions.messages}
                    back={this.props.actions.messages.backToRooms}
                    configure={this.props.actions.messages.configure}
                    signOut={this.props.actions.messages.signOut}
                />
                <div className="p-chat__area" id="scroll-area">
                    {this.props.messages.msgs.map((m, i) => (
                        <Chat.AlignItemsList key={i} msgs={m} />
                    ))}
                </div>
                <div className="c-grid__row">
                    <Chat.TextInput
                        onChange={this.props.actions.messages.change}
                        value={this.props.messages.value}
                    />
                    <Chat.SendButton
                        onClick={this.props.actions.messages.submit}
                        value={this.props.messages.value}
                        roomId={this.props.messages.roomId}
                        fromId={this.props.messages.userId}
                        toId={this.props.messages.partnerId}
                        userIds={this.props.messages.userIds}
                    />
                </div>
            </div>
        );
    }
}

export default ChatTemplate