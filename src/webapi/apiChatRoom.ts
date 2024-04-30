import { http } from "@/commons/http";

/**
 * API ChatRoom
 */
export namespace ApiChatRoom {
  /**
   * チャットルーム取得
   * ※論理削除されていないもののみ取得
   */
  export const getAllNotLogicalDeleted = async (): Promise<
    {
      chatRoomId: number;
      chatRoomName: string;
      createDatetime: Date;
    }[]
  > => {
    const response = await http.get("/chat-room/get-all-not-logical-deleted");
    return Array.from(response.data.chatRooms).map((item: any) => {
      return {
        chatRoomId: Number(item.chatRoomId),
        chatRoomName: String(item.chatRoomName),
        createDatetime: new Date(item.createDatetime),
      };
    });
  };

  /**
   * 対象チャットルーム取得
   */
  export const getTarget = async (argument: {
    targetChatRoomId: number;
  }): Promise<{
    chatRoomId: number;
    chatRoomName: string;
    createDatetime: Date;
    isLogicalDelete: Date;
  }> => {
    const response = await http.get("/chat-room/get-target", { params: argument });
    const chatRoom = response.data.chatRoom;
    return {
      chatRoomId: Number(chatRoom.chatRoomId),
      chatRoomName: String(chatRoom.chatRoomName),
      createDatetime: new Date(chatRoom.createDatetime),
      isLogicalDelete: new Date(chatRoom.isLogicalDelete),
    };
  };

  /**
   * チャットルーム作成
   */
  export const createNew = async (): Promise<{ newChatRoomId: number }> => {
    const response = await http.post("/chat-room/create-new");
    return { newChatRoomId: Number(response.data.newChatRoomId) };
  };

  /**
   * チャットルーム名更新
   */
  export const updateChatRoomName = async (argument: { targetChatRoomId: number; newChatRoomName: string }): Promise<void> => {
    await http.post("/chat-room/update-chat-room-name", argument);
  };

  /**
   * チャットルーム論理削除
   */
  export const logicalDeleteTarget = async (argument: { targetChatRoomId: number }): Promise<void> => {
    await http.post("/chat-room/logical-delete-target", argument);
  };
}
