/**
 * 定数
 * ※Object.values(Consts.XXX) で値の配列取得可能
 */
export namespace Consts {
  /** ステータス */
  export const Status = {
    active: "有効",
    delete: "削除",
  } as const;
  export type Status = (typeof Status)[keyof typeof Status];
}
