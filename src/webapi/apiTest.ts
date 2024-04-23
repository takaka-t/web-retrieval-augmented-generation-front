import { http } from "@/commons/http";

/**
 * API Test
 */
export namespace ApiTest {
  /**
   * get-test APIのレスポンス
   */
  interface GetTestResponse {
    result: string;
  }
  /**
   * get-test テスト用API
   */
  export const getTest = async (): Promise<GetTestResponse> => {
    const response = await http.get<GetTestResponse>("test/get-test");
    return response.data;
  };
}
