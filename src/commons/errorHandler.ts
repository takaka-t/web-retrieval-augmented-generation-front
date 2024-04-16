import type { App } from "vue";

export const errorHandler = {
  install: (app: App<Element>) => {
    // vue
    app.config.errorHandler = (err: unknown) => {
      handler(err);
    };

    // vue 以外
    window.addEventListener("error", (event) => {
      handler(event.error);
    });

    // Promise reject
    window.addEventListener("unhandledrejection", (event) => {
      handler(event.reason);
    });
  },
};

const handler = (err: unknown) => {
  console.log("エラーハンドル", err);
  alert(`エラーが発生しました。\n通信状況を確認して画面を再読み込みしてください。`);

  //   if (err instanceof MissingConnectionError) {
  //     // ...
  //   } else if (err instanceof Error) {
  //     // ...
  //   }
};
