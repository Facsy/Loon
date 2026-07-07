/*
 * 51ZXW NoAD
 * Common
 */

const DEBUG = true;

function log(...msg) {
    if (DEBUG) console.log("[51ZXW]", ...msg);
}

function safeParse(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}

function safeStringify(obj) {
    try {
        return JSON.stringify(obj);
    } catch (e) {
        return "";
    }
}

function decodeBase64(str) {

    try {

        if (typeof atob === "function")
            return atob(str);

    } catch (e) {}

    return null;
}

function encodeBase64(str) {

    try {

        if (typeof btoa === "function")
            return btoa(str);

    } catch (e) {}

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

    let txt = decodeBase64(body);

    if (txt) {

        obj = safeParse(txt);

        if (obj) {

            return {

                type: "base64",

                data: obj

            };

        }

    }

    return {

        type: "raw",

        data: null

    };

}

function buildBody(result) {

    if (!result.data)
        return $response.body;

    let txt = safeStringify(result.data);

    if (result.type === "json")
        return txt;

    if (result.type === "base64")
        return encodeBase64(txt);

    return $response.body;

}
/*
 * Splash Cleaner
 */

function clearSplash(json) {

    if (!json) return json;

    if (!json.AdConfig)
        return json;

    let ad = json.AdConfig;

    ad.DisableAD = true;

    ad.Channels = [];

    ad.OneselfAdPic = "";

    ad.OneselfAdValue = "";

    ad.OneselfAdType = "";

    [
        "Image",
        "ImageUrl",
        "Pic",
        "PicUrl",
        "Banner",
        "BannerUrl",
        "JumpUrl",
        "JumpType",
        "JumpValue"
    ].forEach(key => {

        if (key in ad)

            delete ad[key];

    });

    return json;

}
/*
 * Generic Cleaner
 */

function walk(obj) {

    if (!obj)

        return;

    if (typeof obj !== "object")

        return;

    Object.keys(obj).forEach(key => {

        let value = obj[key];

        if (/banner/i.test(key))

            obj[key] = [];

        if (/popup/i.test(key))

            obj[key] = [];

        if (/activity/i.test(key))

            obj[key] = [];

        if (/promotion/i.test(key))

            obj[key] = [];

        if (/advert/i.test(key))

            obj[key] = [];

        if (/dialog/i.test(key))

            obj[key] = null;

        walk(value);

    });

}

function clearHomeModal(json) {

    walk(json);

    return json;

}

function clearPromotion(json) {

    walk(json);

    return json;

}

function clearGlobalConfig(json) {

    walk(json);

    return json;

}
/*
 * Router
 */

const url = $request.url;

const result = parseBody($response.body);

if (!result.data) {

    $done({});

}

let json = result.data;

switch (true) {

    case /QueryFirstTimeEnterAdConfig/i.test(url):

        log("Splash");

        json = clearSplash(json);

        break;

    case /HomePageModalType/i.test(url):

        log("HomeModal");

        json = clearHomeModal(json);

        break;

    case /VCoinDiscountPromotion/i.test(url):

        log("Promotion");

        json = clearPromotion(json);

        break;

    case /AppGlobalConfig/i.test(url):

        log("Global");

        json = clearGlobalConfig(json);

        break;

}

result.data = json;

$done({

    body: buildBody(result)

});
