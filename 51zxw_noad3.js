// ========= Part 2 公共函数 =========
/*************************************************
 * 51ZXW NoAD
 * Part 2 - Common Utils (Draft)
 *************************************************/

const DEBUG = false;

function log(...msg) {
    if (DEBUG) {
        console.log("[51ZXW]", ...msg);
    }
}

function safeParse(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        log("JSON Parse Error", e);
        return null;
    }
}

function safeStringify(obj) {
    try {
        return JSON.stringify(obj);
    } catch (e) {
        log("JSON Stringify Error", e);
        return null;
    }
}

function isBase64(text) {

    if (typeof text !== "string") return false;

    if (text.length < 16) return false;

    return /^[A-Za-z0-9+/=\r\n]+$/.test(text);
}

function decodeBase64(str) {

    try {

        if (typeof atob === "function") {
            return atob(str);
        }

        if (typeof Buffer !== "undefined") {
            return Buffer.from(str, "base64").toString();
        }

    } catch (e) {
        log("Base64 Decode Error", e);
    }

    return null;
}

function encodeBase64(str) {

    try {

        if (typeof btoa === "function") {
            return btoa(str);
        }

        if (typeof Buffer !== "undefined") {
            return Buffer.from(str).toString("base64");
        }

    } catch (e) {
        log("Base64 Encode Error", e);
    }

    return null;
}

function parseBody(body) {

    let obj = safeParse(body);

    if (obj) {

        return {
            type: "json",
            data: obj
        };
    }

    if (isBase64(body)) {

        const raw = decodeBase64(body);

        if (raw) {

            obj = safeParse(raw);

            if (obj) {

                return {
                    type: "base64",
                    data: obj
                };
            }
        }
    }

    return {
        type: "unknown",
        data: null
    };
}

function buildBody(result) {

    if (!result || !result.data) {
        return $response.body;
    }

    const text = safeStringify(result.data);

    if (!text) {
        return $response.body;
    }

    if (result.type === "base64") {

        return encodeBase64(text) || $response.body;
    }

    return text;
}
// log()
...

// safeParse()
...

// parseBody()
...

// buildBody()
...

// ========= Part 3 开屏广告 =========
/*************************************************
 * Part 3 - Splash AD (Draft)
 *************************************************/

function clearSplash(obj) {

    if (!obj || typeof obj !== "object") {
        return obj;
    }

    // 接口成功返回
    if (obj.success === true) {

        if (!obj.AdConfig) {
            obj.AdConfig = {};
        }

        const ad = obj.AdConfig;

        // 关闭广告
        ad.DisableAD = true;

        // 清空广告图片
        if ("OneselfAdPic" in ad)
            ad.OneselfAdPic = "";

        // 清空广告跳转
        if ("OneselfAdValue" in ad)
            ad.OneselfAdValue = "";

        // 清空广告类型
        if ("OneselfAdType" in ad)
            ad.OneselfAdType = "";

        // 不投放任何渠道
        if ("Channels" in ad)
            ad.Channels = [];

        // 常见广告字段（兼容处理）
        const removeKeys = [
            "Img",
            "Image",
            "ImageUrl",
            "Pic",
            "PicUrl",
            "Banner",
            "BannerUrl",
            "JumpUrl",
            "JumpType",
            "JumpValue",
            "Video",
            "VideoUrl",
            "Duration",
            "StayTime",
            "Interval",
            "ShowTime"
        ];

        removeKeys.forEach(key => {
            if (key in ad) {
                switch (typeof ad[key]) {

                    case "boolean":
                        ad[key] = false;
                        break;

                    case "number":
                        ad[key] = 0;
                        break;

                    case "string":
                        ad[key] = "";
                        break;

                    default:
                        ad[key] = null;
                }
            }
        });

        // 如果有广告列表，清空
        if (Array.isArray(ad.List))
            ad.List = [];

        if (Array.isArray(ad.AdList))
            ad.AdList = [];

        if (Array.isArray(ad.Items))
            ad.Items = [];
    }

    return obj;
}
// clearSplash()

// ========= Part 4 首页弹窗 =========
/*****************************************
 * 51ZXW NoAD - Draft Part 4
 * 首页弹窗 / 运营活动处理（草案）
 *****************************************/

function clearHomeModal(obj) {
  if (!obj || typeof obj !== "object") return obj;

  // 常见返回结构
  if (obj.success === true) {
    if (obj.data) {
      obj.data = {};
    }

    if (obj.result) {
      obj.result = {};
    }
  }

  return obj;
}

function clearPromotion(obj) {
  if (!obj || typeof obj !== "object") return obj;

  if (obj.success === true) {

    // 常见活动字段
    if ("promotion" in obj)
      obj.promotion = null;

    if ("activity" in obj)
      obj.activity = null;

    if ("discount" in obj)
      obj.discount = null;

    if ("banner" in obj)
      obj.banner = [];

    if ("popup" in obj)
      obj.popup = [];

    if ("list" in obj && Array.isArray(obj.list))
      obj.list = [];

    if (obj.data && typeof obj.data === "object") {

      if ("popup" in obj.data)
        obj.data.popup = [];

      if ("banner" in obj.data)
        obj.data.banner = [];

      if ("activity" in obj.data)
        obj.data.activity = [];

      if ("promotion" in obj.data)
        obj.data.promotion = [];

      if ("dialog" in obj.data)
        obj.data.dialog = null;
    }
  }

  return obj;
}
// clearHomeModal()

// ========= Main =========
/*************************************************
 * Part 5 - Main Entry (Draft)
 *************************************************/

(function () {

    try {

        const parsed = parseBody($response.body);

        // 无法解析时直接放行
        if (!parsed || !parsed.data) {
            return $done({});
        }

        let json = parsed.data;
        const url = $request.url || "";

        log("Processing:", url);

        if (url.includes("QueryFirstTimeEnterAdConfig")) {

            json = clearSplash(json);

        } else if (url.includes("HomePageModalType")) {

            json = clearHomeModal(json);

        } else if (url.includes("VCoinDiscountPromotion")) {

            json = clearPromotion(json);

        } else if (url.includes("AppGlobalConfig")) {

            json = clearGlobalConfig(json);

        } else {

            log("Skip:", url);
        }

        parsed.data = json;

        const body = buildBody(parsed);

        return $done({
            body
        });

    } catch (err) {

        log("Unhandled Error:", err);

        // 异常时放行原始响应
        return $done({});
    }

})();
// 主入口
