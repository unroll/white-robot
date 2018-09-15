const { parseString } = require('xml2js');
const RequestHelper = require('./request.helper');


class WeChatHelper {

    constructor() {
        this.requester = new RequestHelper();
        this.device = ("e" + Date.now().toString()).padEnd(15, '463782').slice(0, 16)
    }

    get uuid() {
        if (!this._uuid) {
            const timestamp = Date.now();
            const jsloginUri = `https://login.wx.qq.com/jslogin?appid=wx782c26e4c19acffb&redirect_uri=https%3A%2F%2Fwx.qq.com%2Fcgi-bin%2Fmmwebwx-bin%2Fwebwxnewloginpage&fun=new&lang=zh_CN&_=${timestamp}`;
            this._uuid = this.requester.get(jsloginUri)
                .then(response => response.text())
                .then(text => /uuid\s?=\s?"(\S+)"/g.exec(text)[1]);
        }
        return this._uuid;
    }

    get code() {
        const timestamp = Date.now();
        return this.uuid
            .then(uuid => `https://login.wx.qq.com/cgi-bin/mmwebwx-bin/login?loginicon=true&uuid=${uuid}&tip=0&r=${~timestamp}&_=${timestamp}`)
            .then(uri => this.requester.get(uri))
            .then(response => response.text())
            .then(text => text2object(text))
    }

    get qrcode() {
        return this.uuid
            .then(uuid => `https://login.weixin.qq.com/qrcode/${uuid}`);
    }

    get redirect() {
        return new Promise((resolve, reject) => {
            const start = Date.now()
            const loop = () => this.code
                .then(obj => {
                    if (obj.code === 200) {
                        return resolve(`${obj.redirect_uri}&fun=new&version=v2`)
                    } else if (Date.now() - start > 15 * 60 * 1000) {
                        return reject(new Error('timeout'))
                    }
                    loop()
                })
            loop()
        })
    }

    get ticket() {
        return this.redirect
            .then(uri => this.requester.get(uri))
            .then(response => response.text())
            .then(xml => xml2obj(xml))
    }

    init() {
        return this.ticket
            .then(ticket => {
                const content = { "BaseRequest": { "Uin": ticket.wxuin, "Sid": ticket.wxsid, "Skey": ticket.skey, "DeviceID": this.device } }
                return this.requester.post(`https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxinit?r=${~Date.now()}`, content)
            })
            .then(response => response.json())
    }

    invalid() {
        this._uuid = null;
    }
}

function xml2obj(xml) {
    return new Promise((resolve, reject) => {
        parseString(xml, (err, result) => {
            if (err) return reject(err)
            return resolve(result)
        })
    })
}

function text2object(text) {
    // window.code=408
    // window.code=201;window.userAvatar = 'data:img/jpg;base64,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';
    // 正则表达式不是太熟练，换个简单但是不是太安全的方法
    const preText = text.replace(/window\./g, 'this.');
    const result = new(function() {
        eval(preText);
    })();
    return result;
}

module.exports = WeChatHelper;