/** 消息类型 */
export enum MessageType {
    POST_SCORE,
    FRIEND_CIRCLE,
    FRIEND_RANK,
    CLEAR,

}


export class Message {
    type: MessageType;
    payload?: any;

    constructor(type: MessageType, payload?: any) {
        this.type = type;
        this.payload = payload;
    }
}