/**
 * ValidationRule型
 * ※vuetifyがtypeをexportしていないため
 */
type ValidationRule = (value: any) => string | true;

/**
 * ファイル入力のルール
 * TODO: value === undefined となることがあるか
 */
export namespace FileInputRule {
  /** 必須 */
  export const required: ValidationRule = (value: any): string | true => {
    const fileArray = value as File[];
    return fileArray.length !== 0 || "必須です";
  };

  /** 有効な拡張子 */
  export const validExtensions = (extensions: string[]): ValidationRule => {
    return (value: any): string | true => {
      const fileArray = value as File[];
      const regExp = new RegExp(`^.+\.(${extensions.join("|")})$`);
      return fileArray.length === 0 || fileArray.some((file) => regExp.test(file.name) === false) === false || `ファイル形式は ${extensions.join(",")} にしてください`;
    };
  };

  /** ファイルサイズ(最大) */
  export const maxFileSize = (maxFileSize: number): ValidationRule => {
    return (value: any): string | true => {
      const fileArray = value as File[];
      return fileArray.length === 0 || fileArray.some((file) => file.size > maxFileSize) === false || `ファイルサイズは${maxFileSize.toLocaleString()}バイト以下にしてください`;
    };
  };
}
