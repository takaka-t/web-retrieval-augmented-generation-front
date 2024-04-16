/**
 * ValidationRule型
 * ※vuetifyがtypeをexportしていないため
 */
type ValidationRule = (value: any) => string | true;

/**
 * テキスト入力のルール
 */
export namespace TextInputRule {
  /** 必須 */
  export const required: ValidationRule = (value: any): string | true => {
    return !!value || "必須です。";
  };

  /** 最小文字数 ※最大文字数は maxlength & counter で対応する */
  export const minLength = (minLength: number): ValidationRule => {
    return (value: any): string | true => {
      return !value || String(value).length >= minLength || minLength + "文字以上入力してください";
    };
  };

  /** 正規表現 */
  export const regExp = (regExp: RegExp, errorMessage: string): ValidationRule => {
    return (value: any): string | true => {
      return !value || regExp.test(String(value)) || errorMessage;
    };
  };

  /** 整数値 */
  export const integer: ValidationRule = regExp(new RegExp("^[1-9]+[0-9]*$"), "整数で入力してください");

  /** 数値範囲(最小,最大) */
  export const numberRange = (minNumber: number, maxNumber: number): ValidationRule => {
    return (value: any): string | true => {
      return !value || (Number(value) >= minNumber && Number(value) <= maxNumber) || `${minNumber}以上${maxNumber}以内で入力してください`;
    };
  };

  /** フォーマット(URL) */
  export const url: ValidationRule = regExp(new RegExp("^https?://.+$"), "正しいURLを入力してください");

  /** フォーマット(メール) */
  export const email: ValidationRule = regExp(new RegExp("^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*.)+[a-zA-Z]{2,}$"), "正しいメールアドレスを入力してください");
}
