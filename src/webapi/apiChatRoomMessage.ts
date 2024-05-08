import { http } from "@/commons/http";

/**
 * API ChatRoomMessage
 */
export namespace ApiChatRoomMessage {
  /**
   * 対象チャットルームのチャットルームメッセージ取得
   * ※論理削除されていないもののみ取得
   */
  export const getAllNotLogicalDeleted = async (argument: {
    targetChatRoomId: number;
  }): Promise<
    {
      chatRoomId: number;
      chatRoomMessageId: number;
      isSenderBot: boolean;
      messageContent: string;
      sendDatetime: Date;
    }[]
  > => {
    const response = await http.get("/chat-room-message/get-all-not-logical-deleted", { params: argument });
    return Array.from(response.data.chatRoomMessages).map((item: any) => {
      return {
        chatRoomId: Number(item.chatRoomId),
        chatRoomMessageId: Number(item.chatRoomMessageId),
        isSenderBot: Boolean(item.isSenderBot),
        messageContent: String(item.messageContent),
        sendDatetime: new Date(item.sendDatetime),
      };
    });
  };

  /**
   * 対象チャットルームのチャットルームメッセージ送信
   */
  export const sendNew = async (argument: { targetChatRoomId: number; newChatRoomMessage: string }): Promise<void> => {
    await http.post("/chat-room-message/send-new", argument);
  };

  /**
   * チャットルーム論理削除
   */
  export const logicalDeleteTarget = async (argument: { targetChatRoomId: number; targetChatRoomMessageId: number }): Promise<void> => {
    await http.post("/chat-room-message/logical-delete-target", argument);
  };
}
