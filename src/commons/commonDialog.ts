/**
 *  共通ダイアログ
 */
export namespace CommonDialog {
  /**
   * 処理の確認
   * @param process XXXをYYYします
   * @returns 結果
   */
  export const confirmProcess = (process: String): Boolean => {
    return confirm(`${process}\nよろしいですか？`);
  };

  /**
   * 検証エラーアラート
   */
  export const alertValidationError = (): void => {
    return alert("入力が不正です");
  };

  /**
   * 完了アラート
   * @param process XXXのYYY
   */
  export const alertComplete = (process: String): void => {
    return alert(`${process}\n完了しました`);
  };
}
