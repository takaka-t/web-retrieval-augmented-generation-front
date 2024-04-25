import { http } from "@/commons/http";

/**
 * API Test
 */
export namespace ApiTest {
  /**
   * get-test テスト用API
   */
  export const getTest = async (): Promise<{ result: string }> => {
    const response = await http.get("test/get-test");
    return { result: String(response.data.result) };
  };
}
