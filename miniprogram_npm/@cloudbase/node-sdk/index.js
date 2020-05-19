module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1589813208128, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const cloudbase_1 = require("./cloudbase");
const symbol_1 = require("./const/symbol");
const tcb_admin_node_1 = __importDefault(require("tcb-admin-node"));
module.exports = {
    init: (config) => {
        if (config) {
            const { _useFeature } = config;
            if (_useFeature === false) {
                // 设置用老实例
                return tcb_admin_node_1.default.init(config);
            }
        }
        return new cloudbase_1.CloudBase(config);
    },
    parseContext: (context) => {
        // 校验context 是否正确
        return cloudbase_1.CloudBase.parseContext(context);
    },
    /**
     * 云函数下获取当前env
     */
    SYMBOL_CURRENT_ENV: symbol_1.SYMBOL_CURRENT_ENV
};

}, function(modId) {var map = {"./cloudbase":1589813208129,"./const/symbol":1589813208135}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208129, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@cloudbase/database");
const functions_1 = require("./functions");
const auth_1 = require("./auth");
const wx_1 = require("./wx");
const storage_1 = require("./storage");
const dbRequest_1 = require("./utils/dbRequest");
const log_1 = require("./log");
const code_1 = require("./const/code");
const utils_1 = require("./utils/utils");
const tcb_admin_node_1 = __importDefault(require("tcb-admin-node"));
const GRAY_ENV_KEY = 'TCB_SDK_GRAY_0';
class CloudBase {
    constructor(config) {
        this.init(config);
    }
    static parseContext(context) {
        if (typeof context !== 'object') {
            throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_CONTEXT), { message: 'context 必须为对象类型' }));
        }
        let { memory_limit_in_mb, time_limit_in_ms, request_id, environ, function_version, namespace, function_name, environment } = context;
        let parseResult = {};
        try {
            parseResult.memoryLimitInMb = memory_limit_in_mb;
            parseResult.timeLimitIns = time_limit_in_ms;
            parseResult.requestId = request_id;
            parseResult.functionVersion = function_version;
            parseResult.namespace = namespace;
            parseResult.functionName = function_name;
            // 存在environment 为新架构 上新字段 JSON序列化字符串
            if (environment) {
                parseResult.environment = JSON.parse(environment);
                return parseResult;
            }
            // 不存在environment 则为老字段，老架构上存在bug，无法识别value含特殊字符(若允许特殊字符，影响解析，这里特殊处理)
            const parseEnviron = environ.split(';');
            let parseEnvironObj = {};
            for (let i in parseEnviron) {
                // value含分号影响切割，未找到= 均忽略
                if (parseEnviron[i].indexOf('=') >= 0) {
                    const equalIndex = parseEnviron[i].indexOf('=');
                    const key = parseEnviron[i].slice(0, equalIndex);
                    let value = parseEnviron[i].slice(equalIndex + 1);
                    // value 含, 为数组
                    if (value.indexOf(',') >= 0) {
                        value = value.split(',');
                    }
                    parseEnvironObj[key] = value;
                }
            }
            parseResult.environ = parseEnvironObj;
        }
        catch (err) {
            throw utils_1.E(Object.assign({}, code_1.ERROR.INVALID_CONTEXT));
        }
        CloudBase.scfContext = parseResult;
        return parseResult;
    }
    init(config = {}) {
        let { secretId, secretKey, sessionToken, env, proxy, timeout, serviceUrl, version, headers = {}, credentials, isHttp, throwOnCode, _useFeature } = config;
        if ((secretId && !secretKey) || (!secretId && secretKey)) {
            throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'secretId and secretKey must be a pair' }));
        }
        const newConfig = {
            secretId: secretId,
            secretKey: secretKey,
            sessionToken: sessionToken,
            envName: env,
            proxy,
            isHttp,
            headers: Object.assign({}, headers),
            timeout: timeout || 15000,
            serviceUrl,
            credentials,
            version,
            throwOnCode: throwOnCode !== undefined ? throwOnCode : true,
            _useFeature
        };
        this.config = newConfig;
        // 设置旧实例
        this.oldInstance = tcb_admin_node_1.default.init(config);
    }
    database(dbConfig = {}) {
        database_1.Db.reqClass = dbRequest_1.DBRequest;
        // 兼容方法预处理
        if (Object.prototype.toString.call(dbConfig).slice(8, -1) !== 'Object') {
            throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'dbConfig must be an object' }));
        }
        if (dbConfig && dbConfig.env) {
            // env变量名转换
            dbConfig.envName = dbConfig.env;
            delete dbConfig.env;
        }
        return new database_1.Db(Object.assign(Object.assign(Object.assign({}, this.config), dbConfig), { _oldDbInstance: this.oldInstance.database(dbConfig) }));
    }
    /**
     * 调用云函数
     *
     * @param param0
     * @param opts
     */
    callFunction({ name, data }, opts) {
        return this.preProcess(functions_1.callFunction)({ name, data }, opts);
    }
    auth() {
        return this.preProcess(auth_1.auth)();
    }
    /**
     * openapi调用
     *
     * @param param0
     * @param opts
     */
    callWxOpenApi({ apiName, requestData }, opts) {
        return this.preProcess(wx_1.callWxOpenApi)({ apiName, requestData }, opts);
    }
    /**
     * wxpayapi调用
     *
     * @param param0
     * @param opts
     */
    callWxPayApi({ apiName, requestData }, opts) {
        return this.preProcess(wx_1.callWxPayApi)({ apiName, requestData }, opts);
    }
    /**
     * 微信云调用
     *
     * @param param0
     * @param opts
     */
    callCompatibleWxOpenApi({ apiName, requestData }, opts) {
        return this.preProcess(wx_1.callCompatibleWxOpenApi)({ apiName, requestData }, opts);
    }
    /**
     * 上传文件
     *
     * @param param0
     * @param opts
     */
    uploadFile({ cloudPath, fileContent }, opts) {
        return this.preProcess(storage_1.uploadFile)({ cloudPath, fileContent }, opts);
    }
    /**
     * 删除文件
     *
     * @param param0
     * @param opts
     */
    deleteFile({ fileList }, opts) {
        return this.preProcess(storage_1.deleteFile)({ fileList }, opts);
    }
    /**
     * 获取临时连接
     *
     * @param param0
     * @param opts
     */
    getTempFileURL({ fileList }, opts) {
        return this.preProcess(storage_1.getTempFileURL)({ fileList }, opts);
    }
    /**
     * 下载文件
     *
     * @param params
     * @param opts
     */
    downloadFile(params, opts) {
        return this.preProcess(storage_1.downloadFile)(params, opts);
    }
    /**
     * 获取上传元数据
     *
     * @param param0
     * @param opts
     */
    getUploadMetadata({ cloudPath }, opts) {
        return this.preProcess(storage_1.getUploadMetadata)({ cloudPath }, opts);
    }
    /**
     * 获取logger
     *
     */
    logger() {
        if (!this.clsLogger) {
            this.clsLogger = this.preProcess(log_1.logger)();
        }
        return this.clsLogger;
    }
    // 兼容处理旧sdk
    preProcess(func) {
        const self = this;
        return function (...args) {
            // 默认使用旧tcb实例对象
            const oldInstance = self.oldInstance;
            const functionName = func.name;
            const oldFunc = oldInstance[functionName];
            // 检查用户是否主动设置走新逻辑
            if (self.config) {
                const { _useFeature } = self.config;
                if (_useFeature === true) {
                    return func.call(self, self, ...args);
                }
            }
            if (utils_1.checkIsGray()) {
                return func.call(self, self, ...args);
            }
            return oldFunc.call(oldInstance, ...args);
        };
    }
}
exports.CloudBase = CloudBase;

}, function(modId) { var map = {"./functions":1589813208130,"./auth":1589813208140,"./wx":1589813208141,"./storage":1589813208142,"./utils/dbRequest":1589813208143,"./log":1589813208144,"./const/code":1589813208134,"./utils/utils":1589813208133}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208130, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpRequest_1 = __importDefault(require("../utils/httpRequest"));
const utils_1 = require("../utils/utils");
const code_1 = require("../const/code");
/**
 * 调用云函数
 * @param {String} name  函数名
 * @param {Object} functionParam 函数参数
 * @return {Promise}
 */
async function callFunction(cloudbase, { name, data }, opts) {
    let transformData;
    try {
        transformData = data ? JSON.stringify(data) : '';
    }
    catch (e) {
        throw utils_1.E(Object.assign(Object.assign({}, e), { code: code_1.ERROR.INVALID_PARAM.code, message: '对象出现了循环引用' }));
    }
    if (!name) {
        throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: '函数名不能为空' }));
    }
    const params = {
        action: 'functions.invokeFunction',
        function_name: name,
        request_data: transformData
    };
    return httpRequest_1.default({
        config: cloudbase.config,
        params,
        method: 'post',
        opts,
        headers: Object.assign({ 'content-type': 'application/json' }, (process.env.TCB_ROUTE_KEY ? { 'X-Tcb-Route-Key': process.env.TCB_ROUTE_KEY } : {}))
    }).then(res => {
        if (res.code) {
            return res;
        }
        // if (res.code) {
        //     // return res
        //     throw E({ ...res })
        // } else {
        let result;
        try {
            result = JSON.parse(res.data.response_data);
        }
        catch (e) {
            result = res.data.response_data;
        }
        return {
            result,
            requestId: res.requestId
        };
    });
}
exports.callFunction = callFunction;

}, function(modId) { var map = {"../utils/httpRequest":1589813208131,"../utils/utils":1589813208133,"../const/code":1589813208134}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208131, function(require, module, exports) {

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tracing_1 = require("./tracing");
const utils = __importStar(require("./utils"));
const code_1 = require("../const/code");
const symbol_1 = require("../const/symbol");
const cloudbase_1 = require("../cloudbase");
const request_1 = __importDefault(require("./request"));
const requestHook_1 = require("./requestHook");
const getWxCloudApiToken_1 = require("./getWxCloudApiToken");
const signature_nodejs_1 = require("@cloudbase/signature-nodejs");
const url_1 = __importDefault(require("url"));
const { version } = require('../../package.json');
const { E, second, processReturn, getServerInjectUrl } = utils;
class Request {
    constructor(args) {
        this.defaultEndPoint = 'tcb-admin.tencentcloudapi.com';
        this.inScfHost = 'tcb-admin.tencentyun.com';
        // private openApiHost: string = 'tcb-open.tencentcloudapi.com'
        this.urlPath = '/admin';
        this.defaultTimeout = 15000;
        this.timestamp = new Date().valueOf();
        this.tracingInfo = tracing_1.generateTracingInfo();
        this.args = args;
        this.config = args.config;
    }
    /**
     *
     * 接口action
     */
    getAction() {
        const { params } = this.args;
        const { action } = params;
        return action;
    }
    /**
     * 设置超时warning
     */
    setSlowRequeryWarning(action) {
        const { seqId } = this.tracingInfo;
        const warnStr = `Your current request ${action ||
            ''} is longer than 3s, it may be due to the network or your query performance | [${seqId}]`;
        // 暂针对数据库请求
        const warnTimer = setTimeout(() => {
            console.warn(warnStr);
        }, 3000);
        return warnTimer;
    }
    /**
     * 构造params
     */
    getParams() {
        const args = this.args;
        const config = this.config;
        const { eventId } = this.tracingInfo;
        let params = Object.assign(Object.assign({}, args.params), { envName: config.envName, eventId, 
            // wxCloudApiToken: process.env.WX_API_TOKEN || '',
            wxCloudApiToken: getWxCloudApiToken_1.getWxCloudApiToken(), 
            // 对应服务端 wxCloudSessionToken
            tcb_sessionToken: process.env.TCB_SESSIONTOKEN || '', sessionToken: config.sessionToken, sdk_version: version // todo 可去掉该参数
         });
        // 取当前云函数环境时，替换为云函数下环境变量
        if (params.envName === symbol_1.SYMBOL_CURRENT_ENV) {
            params.envName = process.env.TCB_ENV || process.env.SCF_NAMESPACE;
        }
        // 过滤value undefined
        utils.filterUndefined(params);
        return params;
    }
    /**
     *  构造请求项
     */
    makeReqOpts() {
        // 校验密钥是否存在
        this.validateSecretIdAndKey();
        const config = this.config;
        const args = this.args;
        const url = this.getUrl();
        const method = this.getMethod();
        const params = this.getParams();
        const opts = {
            url,
            method,
            // 先取模块的timeout，没有则取sdk的timeout，还没有就使用默认值
            // timeout: args.timeout || config.timeout || 15000,
            timeout: this.getTimeout(),
            // 优先取config，其次取模块，最后取默认
            headers: this.getHeaders(),
            proxy: config.proxy
        };
        if (config.forever === true) {
            opts.forever = true;
        }
        if (args.method === 'post') {
            if (args.isFormData) {
                opts.formData = params;
                opts.encoding = null;
            }
            else {
                opts.body = params;
                opts.json = true;
            }
        }
        else {
            opts.qs = params;
        }
        return opts;
    }
    /**
     * 协议
     */
    getProtocol() {
        return this.config.isHttp === true ? 'http' : 'https';
    }
    /**
     * 请求方法
     */
    getMethod() {
        return this.args.method || 'get';
    }
    /**
     * 超时时间
     */
    getTimeout() {
        const { opts = {} } = this.args;
        // timeout优先级 自定义接口timeout > config配置timeout > 默认timeout
        return opts.timeout || this.config.timeout || this.defaultTimeout;
    }
    /**
     * 获取
     */
    /**
     * 校验密钥和token是否存在
     */
    validateSecretIdAndKey() {
        const isInSCF = utils.checkIsInScf();
        const { secretId, secretKey } = this.config;
        if (!secretId || !secretKey) {
            // 用户init未传入密钥对，读process.env
            const envSecretId = process.env.TENCENTCLOUD_SECRETID;
            const envSecretKey = process.env.TENCENTCLOUD_SECRETKEY;
            const sessionToken = process.env.TENCENTCLOUD_SESSIONTOKEN;
            if (!envSecretId || !envSecretKey) {
                if (isInSCF) {
                    throw E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'missing authoration key, redeploy the function' }));
                }
                else {
                    throw E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'missing secretId or secretKey of tencent cloud' }));
                }
            }
            else {
                this.config = Object.assign(Object.assign({}, this.config), { secretId: envSecretId, secretKey: envSecretKey, sessionToken: sessionToken });
                return;
            }
        }
    }
    /**
     *
     * 获取headers 此函数中设置authorization
     */
    getHeaders() {
        const config = this.config;
        const { secretId, secretKey } = config;
        const args = this.args;
        const method = this.getMethod();
        const isInSCF = utils.checkIsInScf();
        // Note: 云函数被调用时可能调用端未传递 SOURCE，TCB_SOURCE 可能为空
        const TCB_SOURCE = process.env.TCB_SOURCE || '';
        const SOURCE = isInSCF ? `${TCB_SOURCE},scf` : ',not_scf';
        const url = this.getUrl();
        // 默认
        let requiredHeaders = {
            'User-Agent': `tcb-node-sdk/${version}`,
            'x-tcb-source': SOURCE,
            'x-client-timestamp': this.timestamp,
            'X-SDK-Version': `tcb-node-sdk/${version}`,
            Host: url_1.default.parse(url).host
        };
        if (config.version) {
            requiredHeaders['X-SDK-Version'] = config.version;
        }
        requiredHeaders = Object.assign(Object.assign(Object.assign({}, config.headers), args.headers), requiredHeaders);
        const params = this.getParams();
        const { authorization, timestamp } = signature_nodejs_1.sign({
            secretId: secretId,
            secretKey: secretKey,
            method: method,
            url: url,
            params: params,
            headers: requiredHeaders,
            withSignedParams: true,
            timestamp: second() - 1
        });
        requiredHeaders['Authorization'] = authorization;
        requiredHeaders['X-Signature-Expires'] = 600;
        requiredHeaders['X-Timestamp'] = timestamp;
        return Object.assign({}, requiredHeaders);
    }
    /**
     * 获取url
     * @param action
     */
    getUrl() {
        const protocol = this.getProtocol();
        const isInSCF = utils.checkIsInScf();
        const { eventId, seqId } = this.tracingInfo;
        const { customApiUrl } = this.args;
        const { serviceUrl } = this.config;
        const serverInjectUrl = getServerInjectUrl();
        const defaultUrl = isInSCF
            ? `http://${this.inScfHost}${this.urlPath}`
            : `${protocol}://${this.defaultEndPoint}${this.urlPath}`;
        let url = serviceUrl || serverInjectUrl || customApiUrl || defaultUrl;
        let urlQueryStr = `&eventId=${eventId}&seqId=${seqId}`;
        const scfContext = cloudbase_1.CloudBase.scfContext;
        if (scfContext) {
            urlQueryStr = `&eventId=${eventId}&seqId=${seqId}&scfRequestId=${scfContext.request_id}`;
        }
        if (url.includes('?')) {
            url = `${url}${urlQueryStr}`;
        }
        else {
            url = `${url}?${urlQueryStr}`;
        }
        return url;
    }
}
exports.Request = Request;
// 业务逻辑都放在这里处理
exports.default = async (args) => {
    const req = new Request(args);
    const reqOpts = req.makeReqOpts();
    const config = args.config;
    const action = req.getAction();
    let reqHooks;
    let warnTimer = null;
    if (action === 'wx.openApi' || action === 'wx.wxPayApi') {
        reqHooks = {
            handleData: requestHook_1.handleWxOpenApiData
        };
    }
    if (action.indexOf('database') >= 0) {
        warnTimer = req.setSlowRequeryWarning(action);
    }
    try {
        const res = await request_1.default(reqOpts, reqHooks);
        // 检查res是否为return {code, message}回包
        if (res.code) {
            // 判断是否设置config._returnCodeByThrow = false
            return processReturn(config.throwOnCode, res);
        }
        return res;
    }
    finally {
        if (warnTimer) {
            clearTimeout(warnTimer);
        }
    }
};

}, function(modId) { var map = {"./tracing":1589813208132,"./utils":1589813208133,"../const/code":1589813208134,"../const/symbol":1589813208135,"../cloudbase":1589813208129,"./request":1589813208136,"./requestHook":1589813208137,"./getWxCloudApiToken":1589813208138,"../../package.json":1589813208139}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208132, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
let seqNum = 0;
function getSeqNum() {
    return ++seqNum;
}
function generateEventId() {
    return (Date.now().toString(16) +
        '_' +
        getSeqNum().toString(16));
}
exports.generateTracingInfo = () => {
    const TCB_SEQID = process.env.TCB_SEQID || '';
    const eventId = generateEventId();
    const seqId = TCB_SEQID ? `${TCB_SEQID}-${eventId}` : eventId;
    return { eventId, seqId };
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208133, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const GRAY_ENV_KEY = 'TCB_SDK_GRAY_0';
class TcbError extends Error {
    constructor(error) {
        super(error.message);
        this.code = error.code;
        this.message = error.message;
        this.requestId = error.requestId;
    }
}
exports.TcbError = TcbError;
exports.filterValue = function filterValue(o, value) {
    for (let key in o) {
        if (o[key] === value) {
            delete o[key];
        }
    }
};
exports.filterUndefined = function (o) {
    return exports.filterValue(o, undefined);
};
// export const filterNull = function(o) {
//   return filterValue(o, null)
// }
// export const filterEmptyString = function(o) {
//   return filterValue(o, '')
// }
// export const warpPromise = function warp(fn) {
//   return function(...args) {
//     // 确保返回 Promise 实例
//     return new Promise((resolve, reject) => {
//       try {
//         return fn(...args)
//           .then(resolve)
//           .catch(reject)
//       } catch (e) {
//         reject(e)
//       }
//     })
//   }
// }
exports.E = (errObj) => {
    return new TcbError(errObj);
};
exports.isArray = arr => {
    return arr instanceof Array;
};
exports.camSafeUrlEncode = str => {
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
};
exports.map = (obj, fn) => {
    const o = exports.isArray(obj) ? [] : {};
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            o[i] = fn(obj[i], i);
        }
    }
    return o;
};
exports.clone = obj => {
    return exports.map(obj, function (v) {
        return typeof v === 'object' && v !== undefined && v !== null ? exports.clone(v) : v;
    });
};
exports.checkIsInScf = () => {
    return process.env.TENCENTCLOUD_RUNENV === 'SCF';
};
exports.delay = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
function second() {
    // istanbul ignore next
    return Math.floor(new Date().getTime() / 1000);
}
exports.second = second;
function processReturn(throwOnCode, res) {
    if (throwOnCode === false) {
        // 不抛报错，正常return，兼容旧逻辑
        return res;
    }
    throw exports.E(Object.assign({}, res));
}
exports.processReturn = processReturn;
function checkIsGray() {
    const tcbContextConfig = getTcbContextConfig();
    return tcbContextConfig[GRAY_ENV_KEY] === true;
}
exports.checkIsGray = checkIsGray;
function getServerInjectUrl() {
    const tcbContextConfig = getTcbContextConfig();
    return tcbContextConfig['URL'] || '';
}
exports.getServerInjectUrl = getServerInjectUrl;
function getTcbContextConfig() {
    try {
        if (process.env.TCB_CONTEXT_CNFG) {
            // 检查约定环境变量字段是否存在
            return JSON.parse(process.env.TCB_CONTEXT_CNFG);
        }
        return {};
    }
    catch (e) {
        console.log('parse context error...');
        return {};
    }
}
exports.getTcbContextConfig = getTcbContextConfig;
function getWxUrl(config) {
    const protocal = config.isHttp === true ? 'http' : 'https';
    let wxUrl = protocal + '://tcb-open.tencentcloudapi.com/admin';
    if (exports.checkIsInScf()) {
        wxUrl = 'http://tcb-open.tencentyun.com/admin';
    }
    return wxUrl;
}
exports.getWxUrl = getWxUrl;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208134, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR = {
    INVALID_PARAM: {
        code: 'INVALID_PARAM',
        message: 'invalid param'
    },
    SYS_ERR: {
        code: 'SYS_ERR',
        message: 'system error'
    },
    STORAGE_REQUEST_FAIL: {
        code: 'STORAGE_REQUEST_FAIL',
        message: 'storage request fail'
    },
    STORAGE_FILE_NONEXIST: {
        code: 'STORAGE_FILE_NONEXIST',
        message: 'storage file not exist'
    },
    TCB_CLS_UNOPEN: {
        code: 'TCB_CLS_UNOPEN',
        message: '需要先开通日志检索功能'
    },
    INVALID_CONTEXT: {
        code: 'INVALID_CONTEXT',
        message: '无效的context对象，请使用 云函数入口的context参数'
    }
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208135, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.SYMBOL_CURRENT_ENV = Symbol.for("SYMBOL_CURRENT_ENV");

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208136, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const request_1 = __importDefault(require("request"));
const utils_1 = require("./utils");
exports.default = (opts, reqHooks) => {
    return new Promise((resolve, reject) => {
        request_1.default(opts, function (err, response, body) {
            if (err) {
                return reject(err);
            }
            if (response.statusCode === 200) {
                let res;
                try {
                    res = typeof body === 'string' ? JSON.parse(body) : body;
                    // wx.openApi 调用时，需用content-type区分buffer or JSON
                    if (reqHooks) {
                        const { handleData } = reqHooks;
                        if (handleData) {
                            res = handleData(res, err, response, body);
                        }
                    }
                }
                catch (e) {
                    res = body;
                }
                return resolve(res);
            }
            else {
                const e = utils_1.E({
                    code: response.statusCode,
                    message: ` ${response.statusCode} ${http_1.default.STATUS_CODES[response.statusCode]} | [url: ${opts.url}]`
                });
                reject(e);
            }
        });
    });
};

}, function(modId) { var map = {"request":1589813208136,"./utils":1589813208133}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208137, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 处理wxopenapi返回
 *
 * @param err
 * @param response
 * @param body
 */
exports.handleWxOpenApiData = (res, err, response, body) => {
    // wx.openApi 调用时，需用content-type区分buffer or JSON
    const { headers } = response;
    let transformRes = res;
    if (headers['content-type'] === 'application/json; charset=utf-8') {
        transformRes = JSON.parse(transformRes.toString()); // JSON错误时buffer转JSON
    }
    return transformRes;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208138, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
// 由定时触发器触发时（TRIGGER_SRC=timer）：优先使用 WX_TRIGGER_API_TOKEN_V0，不存在的话，为了兼容兼容旧的开发者工具，也是使用 WX_API_TOKEN
// 非定时触发器触发时（TRIGGER_SRC!=timer）: 使用 WX_API_TOKEN
function getWxCloudApiToken() {
    if (process.env.TRIGGER_SRC === 'timer') {
        return process.env.WX_TRIGGER_API_TOKEN_V0 || process.env.WX_API_TOKEN || '';
    }
    else {
        return process.env.WX_API_TOKEN || '';
    }
}
exports.getWxCloudApiToken = getWxCloudApiToken;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208139, function(require, module, exports) {
module.exports = {
  "_from": "@cloudbase/node-sdk@2.0.0-beta.6",
  "_id": "@cloudbase/node-sdk@2.0.0-beta.6",
  "_inBundle": false,
  "_integrity": "sha512-u2EdndZKCXzsNqJu6a67DUvmMu+znVTcLep8YkpAcOQBS0tCLjCEdIqIO5LuPQ4bG+zWXAbQHY6ysnwSqzAcEg==",
  "_location": "/@cloudbase/node-sdk",
  "_phantomChildren": {},
  "_requested": {
    "type": "version",
    "registry": true,
    "raw": "@cloudbase/node-sdk@2.0.0-beta.6",
    "name": "@cloudbase/node-sdk",
    "escapedName": "@cloudbase%2fnode-sdk",
    "scope": "@cloudbase",
    "rawSpec": "2.0.0-beta.6",
    "saveSpec": null,
    "fetchSpec": "2.0.0-beta.6"
  },
  "_requiredBy": [
    "/wx-server-sdk"
  ],
  "_resolved": "https://registry.npmjs.org/@cloudbase/node-sdk/-/node-sdk-2.0.0-beta.6.tgz",
  "_shasum": "ca51f302167bd23ab508eadfbc915fe33bb43910",
  "_spec": "@cloudbase/node-sdk@2.0.0-beta.6",
  "_where": "D:\\github1\\ConquerFitness-develop\\cloudfunctions\\addData\\node_modules\\wx-server-sdk",
  "author": {
    "name": "lukejyhuang"
  },
  "bugs": {
    "url": "https://github.com/TencentCloudBase/node-sdk/issues"
  },
  "bundleDependencies": false,
  "dependencies": {
    "@cloudbase/database": "1.0.0-beta.2",
    "@cloudbase/signature-nodejs": "1.0.0-beta.0",
    "is-regex": "^1.0.4",
    "jsonwebtoken": "^8.5.1",
    "lodash.merge": "^4.6.1",
    "request": "^2.87.0",
    "request-promise": "^4.2.5",
    "tcb-admin-node": "1.23.0",
    "xml2js": "^0.4.19"
  },
  "deprecated": false,
  "description": "tencent cloud base server sdk for node.js",
  "devDependencies": {
    "@types/jest": "^23.1.4",
    "@types/mocha": "^5.2.4",
    "@types/node": "^10.12.12",
    "@typescript-eslint/eslint-plugin": "^2.16.0",
    "@typescript-eslint/parser": "^2.16.0",
    "babel-eslint": "^10.0.3",
    "coveralls": "^3.0.9",
    "dumper.js": "^1.3.0",
    "eslint": "^6.8.0",
    "eslint-config-alloy": "^3.5.0",
    "eslint-plugin-prettier": "^3.1.2",
    "husky": "^3.1.0",
    "jest": "^23.3.0",
    "lint-staged": "^9.2.5",
    "mocha": "^5.2.0",
    "power-assert": "^1.5.0",
    "prettier": "^1.19.1",
    "ts-jest": "^23.10.4",
    "tslib": "^1.7.1",
    "typescript": "^3.7.4"
  },
  "engines": {
    "node": ">=8.6.0"
  },
  "homepage": "https://github.com/TencentCloudBase/node-sdk#readme",
  "husky": {
    "hooks": {
      "pre-commit": "npm run tsc && git add . && lint-staged"
    }
  },
  "keywords": [
    "node sdk"
  ],
  "license": "MIT",
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "git add"
    ]
  },
  "main": "lib/index.js",
  "name": "@cloudbase/node-sdk",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/TencentCloudBase/node-sdk.git"
  },
  "scripts": {
    "coverage": "jest --detectOpenHandles --coverage",
    "coveralls": "cat ./coverage/lcov.info | coveralls",
    "eslint": "eslint \"./**/*.ts\"",
    "eslint-fix": "eslint --fix \"./**/*.ts\"",
    "test": "jest  --detectOpenHandles --coverage --verbose",
    "tsc": "tsc -p tsconfig.json",
    "tsc:w": "tsc -p tsconfig.json -w",
    "tstest": "mocha --timeout 5000 --require espower-typescript/guess test/**/*.test.ts"
  },
  "typings": "types/index.d.ts",
  "version": "2.0.0-beta.6"
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208140, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils/utils");
const code_1 = require("../const/code");
const cloudbase_1 = require("../cloudbase");
const symbol_1 = require("../const/symbol");
const checkCustomUserIdRegex = /^[a-zA-Z0-9_\-#@~=*(){}[\]:.,<>+]{4,32}$/;
function validateUid(uid) {
    if (typeof uid !== 'string') {
        // console.log('debug:', { ...ERROR.INVALID_PARAM, message: 'uid must be a string' })
        throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'uid must be a string' }));
    }
    if (!checkCustomUserIdRegex.test(uid)) {
        throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: `Invalid uid: "${uid}"` }));
    }
}
function auth(cloudbase) {
    return {
        getUserInfo() {
            const openId = process.env.WX_OPENID || '';
            const appId = process.env.WX_APPID || '';
            const uid = process.env.TCB_UUID || '';
            const customUserId = process.env.TCB_CUSTOM_USER_ID || '';
            const isAnonymous = process.env.TCB_ISANONYMOUS_USER === 'true' ? true : false;
            return {
                openId,
                appId,
                uid,
                customUserId,
                isAnonymous
            };
        },
        async getAuthContext(context) {
            const { environment, environ } = cloudbase_1.CloudBase.parseContext(context);
            const env = environment || environ || {};
            const { TCB_UUID, LOGINTYPE } = env;
            const res = {
                uid: TCB_UUID,
                loginType: LOGINTYPE
            };
            if (LOGINTYPE === 'QQ-MINI') {
                const { QQ_OPENID, QQ_APPID } = env;
                res.appId = QQ_APPID;
                res.openId = QQ_OPENID;
            }
            return res;
        },
        getClientIP() {
            return process.env.TCB_SOURCE_IP || '';
        },
        createTicket: (uid, options = {}) => {
            validateUid(uid);
            const timestamp = new Date().getTime();
            const { credentials } = cloudbase.config;
            let { envName } = cloudbase.config;
            if (!envName) {
                throw new Error('no env in config');
            }
            // 使用symbol时替换为环境变量内的env
            if (envName === symbol_1.SYMBOL_CURRENT_ENV) {
                envName = process.env.TCB_ENV || process.env.SCF_NAMESPACE;
            }
            const { refresh = 3600 * 1000, expire = timestamp + 7 * 24 * 60 * 60 * 1000 } = options;
            const token = jsonwebtoken_1.default.sign({
                alg: 'RS256',
                env: envName,
                iat: timestamp,
                exp: timestamp + 10 * 60 * 1000,
                uid,
                refresh,
                expire
            }, credentials.private_key, { algorithm: 'RS256' });
            return credentials.private_key_id + '/@@/' + token;
        }
    };
}
exports.auth = auth;

}, function(modId) { var map = {"../utils/utils":1589813208133,"../const/code":1589813208134,"../cloudbase":1589813208129,"../const/symbol":1589813208135}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208141, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpRequest_1 = __importDefault(require("../utils/httpRequest"));
const utils_1 = require("../utils/utils");
const code_1 = require("../const/code");
async function callWxOpenApi(cloudbase, { apiName, requestData }, opts) {
    let transformRequestData;
    try {
        transformRequestData = requestData ? JSON.stringify(requestData) : '';
    }
    catch (e) {
        throw utils_1.E(Object.assign(Object.assign({}, e), { code: code_1.ERROR.INVALID_PARAM.code, message: '对象出现了循环引用' }));
    }
    const params = {
        action: 'wx.api',
        apiName,
        requestData: transformRequestData
    };
    return httpRequest_1.default({
        config: cloudbase.config,
        params,
        method: 'post',
        opts,
        headers: {
            'content-type': 'application/json'
        },
        customApiUrl: utils_1.getWxUrl(cloudbase.config)
    }).then(res => {
        if (res.code) {
            return res;
        }
        //     throw E({ ...res })
        // } else {
        let result;
        try {
            result = JSON.parse(res.data.responseData);
        }
        catch (e) {
            result = res.data.responseData;
        }
        return {
            result,
            requestId: res.requestId
        };
        // }
    });
}
exports.callWxOpenApi = callWxOpenApi;
/**
 * 调用wxopenAPi
 * @param {String} apiName  接口名
 * @param {Buffer} requestData
 * @return {Promise} 正常内容为buffer，报错为json {code:'', message:'', resquestId:''}
 */
async function callCompatibleWxOpenApi(cloudbase, { apiName, requestData }, opts) {
    const params = {
        action: 'wx.openApi',
        apiName,
        requestData
    };
    return httpRequest_1.default({
        config: cloudbase.config,
        method: 'post',
        headers: { 'content-type': 'multipart/form-data' },
        params,
        isFormData: true,
        customApiUrl: utils_1.getWxUrl(cloudbase.config),
        opts
    }).then(res => res);
}
exports.callCompatibleWxOpenApi = callCompatibleWxOpenApi;
/**
 * wx.wxPayApi 微信支付用
 * @param {String} apiName  接口名
 * @param {Buffer} requestData
 * @return {Promise} 正常内容为buffer，报错为json {code:'', message:'', resquestId:''}
 */
async function callWxPayApi(cloudbase, { apiName, requestData }, opts) {
    const params = {
        action: 'wx.wxPayApi',
        apiName,
        requestData
    };
    return httpRequest_1.default({
        config: cloudbase.config,
        method: 'post',
        headers: { 'content-type': 'multipart/form-data' },
        params,
        isFormData: true,
        customApiUrl: utils_1.getWxUrl(cloudbase.config),
        opts
    });
}
exports.callWxPayApi = callWxPayApi;

}, function(modId) { var map = {"../utils/httpRequest":1589813208131,"../utils/utils":1589813208133,"../const/code":1589813208134}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208142, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const fs_1 = __importDefault(require("fs"));
const httpRequest_1 = __importDefault(require("../utils/httpRequest"));
const xml2js_1 = require("xml2js");
const utils_1 = require("../utils/utils");
const code_1 = require("../const/code");
async function parseXML(str) {
    return new Promise((resolve, reject) => {
        xml2js_1.parseString(str, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}
exports.parseXML = parseXML;
/*
 * 上传文件
 * @param {string} cloudPath 上传后的文件路径
 * @param {fs.ReadStream} fileContent  上传文件的二进制流
 */
async function uploadFile(cloudbase, { cloudPath, fileContent }, opts) {
    const { data: { url, token, authorization, fileId, cosFileId } } = await getUploadMetadata(cloudbase, { cloudPath }, opts);
    const formData = {
        Signature: authorization,
        'x-cos-security-token': token,
        'x-cos-meta-fileid': cosFileId,
        key: cloudPath,
        file: fileContent
    };
    let body = await new Promise((resolve, reject) => {
        request_1.default({ url, formData: formData, method: 'post' }, function (err, res, body) {
            if (err) {
                reject(err);
            }
            else {
                resolve(body);
            }
        });
    });
    body = await parseXML(body);
    if (body && body.Error) {
        const { Code: [code], Message: [message] } = body.Error;
        if (code === 'SignatureDoesNotMatch') {
            return utils_1.processReturn(cloudbase.config.throwOnCode, Object.assign(Object.assign({}, code_1.ERROR.SYS_ERR), { message }));
        }
        return utils_1.processReturn(cloudbase.config.throwOnCode, Object.assign(Object.assign({}, code_1.ERROR.STORAGE_REQUEST_FAIL), { message }));
    }
    return {
        fileID: fileId
    };
}
exports.uploadFile = uploadFile;
/**
 * 删除文件
 * @param {Array.<string>} fileList 文件id数组
 */
async function deleteFile(cloudbase, { fileList }, opts) {
    if (!fileList || !Array.isArray(fileList)) {
        return utils_1.processReturn(cloudbase.config.throwOnCode, Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'fileList必须是非空的数组' }));
    }
    for (let file of fileList) {
        if (!file || typeof file !== 'string') {
            return utils_1.processReturn(cloudbase.config.throwOnCode, Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'fileList的元素必须是非空的字符串' }));
        }
    }
    let params = {
        action: 'storage.batchDeleteFile',
        fileid_list: fileList
    };
    return httpRequest_1.default({
        config: cloudbase.config,
        params,
        method: 'post',
        opts,
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => {
        if (res.code) {
            return res;
        }
        //     throw E({ ...res })
        // } else {
        return {
            fileList: res.data.delete_list,
            requestId: res.requestId
        };
        // }
    });
}
exports.deleteFile = deleteFile;
/**
 * 获取文件下载链接
 * @param {Array.<Object>} fileList
 */
async function getTempFileURL(cloudbase, { fileList }, opts) {
    if (!fileList || !Array.isArray(fileList)) {
        return utils_1.processReturn(cloudbase.config.throwOnCode, Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'fileList必须是非空的数组' }));
    }
    let file_list = [];
    for (let file of fileList) {
        if (typeof file === 'object') {
            if (!file.hasOwnProperty('fileID') || !file.hasOwnProperty('maxAge')) {
                return utils_1.processReturn(cloudbase.config.throwOnCode, Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'fileList的元素如果是对象，必须是包含fileID和maxAge的对象' }));
            }
            file_list.push({
                fileid: file.fileID,
                max_age: file.maxAge
            });
        }
        else if (typeof file === 'string') {
            file_list.push({
                fileid: file
            });
        }
        else {
            return utils_1.processReturn(cloudbase.config.throwOnCode, Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'fileList的元素如果不是对象，则必须是字符串' }));
        }
    }
    let params = {
        action: 'storage.batchGetDownloadUrl',
        file_list
    };
    // console.log(params);
    return httpRequest_1.default({
        config: cloudbase.config,
        params,
        method: 'post',
        opts,
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => {
        if (res.code) {
            return res;
        }
        // if (res.code) {
        //     throw E({ ...res })
        // } else {
        return {
            fileList: res.data.download_list,
            requestId: res.requestId
        };
        // }
    });
}
exports.getTempFileURL = getTempFileURL;
async function downloadFile(cloudbase, params, opts) {
    let tmpUrl;
    const { fileID, tempFilePath } = params;
    const tmpUrlRes = await getTempFileURL(cloudbase, {
        fileList: [
            {
                fileID,
                maxAge: 600
            }
        ]
    }, opts);
    // console.log(tmpUrlRes);
    const res = tmpUrlRes.fileList[0];
    if (res.code !== 'SUCCESS') {
        return utils_1.processReturn(cloudbase.config.throwOnCode, Object.assign({}, res));
    }
    tmpUrl = res.tempFileURL;
    tmpUrl = encodeURI(tmpUrl);
    let req = request_1.default({
        url: tmpUrl,
        encoding: null,
        proxy: cloudbase.config.proxy
    });
    return new Promise((resolve, reject) => {
        let fileContent = Buffer.alloc(0);
        req.on('response', function (response) {
            if (response && Number(response.statusCode) === 200) {
                if (tempFilePath) {
                    response.pipe(fs_1.default.createWriteStream(tempFilePath));
                }
                else {
                    response.on('data', data => {
                        fileContent = Buffer.concat([fileContent, data]);
                    });
                }
                response.on('end', () => {
                    resolve({
                        fileContent: tempFilePath ? undefined : fileContent,
                        message: '文件下载完成'
                    });
                });
            }
            else {
                reject(response);
            }
        });
    });
}
exports.downloadFile = downloadFile;
async function getUploadMetadata(cloudbase, { cloudPath }, opts) {
    let params = {
        action: 'storage.getUploadMetadata',
        path: cloudPath
    };
    const res = await httpRequest_1.default({
        config: cloudbase.config,
        params,
        method: 'post',
        opts,
        headers: {
            'content-type': 'application/json'
        }
    });
    // if (res.code) {
    //     throw E({
    //         ...ERROR.STORAGE_REQUEST_FAIL,
    //         message: 'get upload metadata failed: ' + res.code
    //     })
    // } else {
    return res;
    // }
}
exports.getUploadMetadata = getUploadMetadata;
async function getFileAuthority(cloudbase, { fileList }) {
    if (!Array.isArray(fileList)) {
        throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: '[node-sdk] getCosFileAuthority fileList must be a array' }));
    }
    if (fileList.some(file => {
        if (!file || !file.path) {
            return true;
        }
        if (['READ', 'WRITE', 'READWRITE'].indexOf(file.type) === -1) {
            return true;
        }
        return false;
    })) {
        throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: '[node-sdk] getCosFileAuthority fileList param error' }));
    }
    const userInfo = this.auth().getUserInfo();
    const { openId, uid } = userInfo;
    if (!openId && !uid) {
        throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: '[node-sdk] admin do not need getCosFileAuthority.' }));
    }
    let params = {
        action: 'storage.getFileAuthority',
        openId,
        uid,
        loginType: process.env.LOGINTYPE,
        fileList
    };
    const res = await httpRequest_1.default({
        config: this.config,
        params,
        method: 'post',
        headers: {
            'content-type': 'application/json'
        }
    });
    if (res.code) {
        throw utils_1.E(Object.assign(Object.assign({}, res), { message: '[node-sdk] getCosFileAuthority failed: ' + res.code }));
    }
    else {
        return res;
    }
}
exports.getFileAuthority = getFileAuthority;

}, function(modId) { var map = {"../utils/httpRequest":1589813208131,"../utils/utils":1589813208133,"../const/code":1589813208134}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208143, function(require, module, exports) {

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpRequest_1 = __importDefault(require("./httpRequest"));
/**
 * 数据库模块的通用请求方法
 *
 * @author haroldhu
 * @internal
 */
class DBRequest {
    /**
     * 初始化
     *
     * @internal
     * @param config
     */
    constructor(config) {
        this.config = config;
    }
    /**
     * 发送请求
     *
     * @param dbParams   - 数据库请求参数
     * @param opts  - 可选配置项
     */
    async send(api, data, opts) {
        const params = Object.assign(Object.assign({}, data), { action: api });
        return httpRequest_1.default({
            config: this.config,
            params,
            method: 'post',
            opts,
            headers: {
                'content-type': 'application/json'
            }
        });
    }
}
exports.DBRequest = DBRequest;

}, function(modId) { var map = {"./httpRequest":1589813208131}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1589813208144, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const code_1 = require("../const/code");
/**
 *
 *
 * @class Log
 */
class Log {
    constructor() {
        this.src = 'app';
        this.isSupportClsReport = true;
        if (`${process.env._SCF_TCB_LOG}` !== '1') {
            this.isSupportClsReport = false;
        }
        else if (!console.__baseLog__) {
            this.isSupportClsReport = false;
        }
        if (!this.isSupportClsReport) {
            // 当前非tcb scf环境  log功能会退化为console
            console.warn('请检查您是否在本地环境 或者 未开通高级日志功能，当前环境下无法上报cls日志，默认使用console');
        }
    }
    /**
     *
     *
     * @param {*} logMsg
     * @param {*} logLevel
     * @returns
     * @memberof Log
     */
    transformMsg(logMsg) {
        // 目前logMsg只支持字符串value且不支持多级, 加一层转换处理
        let realMsg = {};
        realMsg = Object.assign(Object.assign({}, realMsg), logMsg);
        return realMsg;
    }
    /**
     *
     *
     * @param {*} logMsg
     * @param {*} logLevel
     * @memberof Log
     */
    baseLog(logMsg, logLevel) {
        // 判断当前是否属于tcb scf环境
        if (Object.prototype.toString.call(logMsg).slice(8, -1) !== 'Object') {
            throw utils_1.E(Object.assign(Object.assign({}, code_1.ERROR.INVALID_PARAM), { message: 'log msg must be an object' }));
        }
        const msgContent = this.transformMsg(logMsg);
        if (this.isSupportClsReport) {
            ;
            console.__baseLog__(msgContent, logLevel);
        }
        else {
            if (console[logLevel]) {
                console[logLevel](msgContent);
            }
        }
    }
    /**
     *
     *
     * @param {*} logMsg
     * @memberof Log
     */
    log(logMsg) {
        this.baseLog(logMsg, 'log');
    }
    /**
     *
     *
     * @param {*} logMsg
     * @memberof Log
     */
    info(logMsg) {
        this.baseLog(logMsg, 'info');
    }
    /**
     *
     *
     * @param {*} logMsg
     * @memberof Log
     */
    error(logMsg) {
        this.baseLog(logMsg, 'error');
    }
    /**
     *
     *
     * @param {*} logMsg
     * @memberof Log
     */
    warn(logMsg) {
        this.baseLog(logMsg, 'warn');
    }
}
exports.Log = Log;
function logger() {
    return new Log();
}
exports.logger = logger;

}, function(modId) { var map = {"../utils/utils":1589813208133,"../const/code":1589813208134}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1589813208128);
})()
//# sourceMappingURL=index.js.map