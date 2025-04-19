import { sendGAEvent } from "@next/third-parties/google"

// Google Analyticsイベント送信用のユーティリティ関数
export const trackEvent = (eventName: string, parameters?: Record<string, string | number | boolean>) => {
  try {
    sendGAEvent(eventName, parameters || {})
    console.log(`Analytics event tracked: ${eventName}`, parameters)
  } catch (error) {
    console.error("Failed to track analytics event:", error)
  }
}

// よく使われるイベントの定義
export const AnalyticsEvents = {
  // ページビュー関連
  PAGE_VIEW: "page_view",

  // ユーザーアクション関連
  BUTTON_CLICK: "button_click",
  LINK_CLICK: "link_click",
  FORM_SUBMIT: "form_submit",

  // サービス関連
  SERVICE_VIEW: "service_view",
  SERVICE_INQUIRY: "service_inquiry",

  // コンバージョン関連
  CONTACT_FORM_SUBMIT: "contact_form_submit",
  QUOTE_REQUEST: "quote_request",

  // エンゲージメント関連
  SCROLL_DEPTH: "scroll_depth",
  TIME_ON_PAGE: "time_on_page",
}
