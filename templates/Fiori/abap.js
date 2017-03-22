// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
(function(g) {
    var l;
    if (typeof define === "function") {
        l = define;
    } else {
        if ((typeof jQuery !== "undefined") && jQuery.sap) {
            l = function(m, d, a) {
                var b = [];
                d.forEach(function(c) {
                    jQuery.sap.require(c);
                    b.push(jQuery.sap.getObject(c));
                });
                jQuery.sap.setObject(m, a.apply(g, b));
            };
        } else {
            l = function(m, d, a) {
                if (d && (d.length > 0)) {
                    throw new Error("Cannot resolve dependencies");
                }
                a();
            };
        }
    }
    l("sap.net.xhr", [],
    function() {
        "use strict";
        var p, a, b, c, N, _, X, L, E, C, I, S;
        if (XMLHttpRequest._SAP_ENHANCED) {
            return {};
        }
        p = ["loadstart", "progress", "abort", "error", "load", "timeout", "loadend"];
        a = p.concat("readystatechange");
        function m(e, h) {
            h.forEach(function(i) {
                var k, n, t;
                t = e[i];
                if (t) {
                    n = "_" + i;
                    k = e[n];
                    if (!k) {
                        e[n] = t;
                    }
                }
            });
        }
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function(e, h) {
                h = h || 0;
                return (this.substr(h, e.length) === e);
            }
        }
        function d(x, e) {
            return (typeof x[e] === "function");
        }
        function f(x, e) {
            var h, i, n;
            h = true;
            n = e.length;
            for (i = 0; i < n; ++i) {
                h = h && d(x, e[i]);
                if (!h) {
                    break;
                }
            }
            return h;
        }
        function j(x) {
            return (typeof x === "object") && (x !== null) && f(x, ["error", "warning", "info", "debug"]);
        }
        function o(e) {
            this.logger = e;
        }
        L = o.prototype;
        L.error = function(h) {
            try {
                this.logger.error(h);
            } catch(e) {}
        };
        L.warning = function(h) {
            try {
                this.logger.warning(h);
            } catch(e) {}
        };
        L.info = function(h) {
            try {
                this.logger.info(h);
            } catch(e) {}
        };
        L.debug = function(h) {
            try {
                this.logger.debug(h);
            } catch(e) {}
        };
        N = function() {};
        c = {
            error: N,
            warning: N,
            info: N,
            debug: N
        };
        b = new o(c);
        function q(x) {
            var t;
            t = typeof x;
            return (t === "function") || ((t === "object") && (x !== null) && (typeof x.handleEvent === "function"));
        }
        function r(x, e, h) {
            try {
                if (typeof x === "function") {
                    x.call(e.currentTarget, e);
                } else {
                    x.handleEvent(e);
                }
            } catch(i) {
                if (h) {
                    try {
                        h.warning("Exception in " + e.type + " event handler: " + i.message);
                    } catch(e) {}
                }
            }
        }
        function s(e) {
            var i, n;
            n = e.length;
            for (i = 0; i < n; ++i) {
                this[e[i]] = [];
            }
            this.subscriptions = {};
            this.bufferedEvents = [];
        }
        E = s.prototype;
        E.add = function(t, e) {
            var k, h, i, n;
            if (q(e)) {
                h = this[t];
                if (h) {
                    k = true;
                    n = h.length;
                    for (i = 0; i < n; ++i) {
                        if (h[i] === e) {
                            k = false;
                            break;
                        }
                    }
                    if (k) {
                        h.push(e);
                    }
                }
            }
        };
        E.remove = function(t, e) {
            var h, i, n;
            if (q(e)) {
                h = this[t];
                if (h) {
                    n = h.length;
                    for (i = 0; i < n; ++i) {
                        if (h[i] === e) {
                            if (n === 1) {
                                this[t] = [];
                            } else {
                                h.splice(i, 1);
                            }
                            break;
                        }
                    }
                }
            }
        };
        E.dispatch = function(k) {
            var h, t, x, i, n;
            if (this.suspend) {
                this.bufferedEvents.push(k);
            } else {
                x = k.type;
                h = this[x];
                if (h) {
                    h = h.slice();
                    n = h.length;
                    for (i = 0; i < n; ++i) {
                        r(h[i], k, b);
                    }
                }
                t = this["on" + x];
                if (t) {
                    try {
                        t.call(k.currentTarget, k);
                    } catch(A) {
                        try {
                            b.warning("Exception in on" + x + " callback: " + A.message);
                        } catch(e) {}
                    }
                }
            }
        };
        E.clearEvents = function() {
            this.bufferedEvents = [];
        };
        E.releaseEvents = function() {
            var k, n, e;
            e = this.bufferedEvents;
            n = e.length;
            if (n > 0) {
                this.clearEvents();
                for (k = 0; k < n; ++k) {
                    this.dispatch(e[k]);
                }
            }
        };
        E.hasSubscribers = function(t) {
            var h, e;
            h = this[t];
            if (h) {
                e = (h.length > 0) || this["on" + t];
            } else {
                e = false;
            }
            return e;
        };
        E.subscribed = function(t) {
            return (this.subscriptions[t] ? true: false);
        };
        E.subscribe = function(t) {
            this.subscriptions[t] = true;
        };
        E.unsubscribe = function(t) {
            delete this.subscriptions[t];
        };
        _ = XMLHttpRequest;
        XMLHttpRequest._SAP_ENHANCED = true;
        X = _.prototype;
        _.EventHandlers = s;
        m(X, ["abort", "open", "setRequestHeader", "send", "addEventListener", "removeEventListener"]);
        X._saveOnEvent = function(t) {
            var e, h, i, k;
            e = "on" + t;
            i = this[e];
            h = this._getHandlers();
            if (h[e]) {
                k = (i !== N);
            } else {
                k = !!i;
            }
            if (k) {
                h[e] = i;
                this[e] = N;
            }
        };
        X._getHandlers = function() {
            var h;
            h = this._handlers;
            if (!h) {
                h = new s(a);
                this._handlers = h;
            }
            return h;
        };
        X.handleEvent = function(e) {
            if ((e.type === "readystatechange") && (this.readyState > 2)) {
                this._checkEventSubscriptions();
            }
            this._getHandlers().dispatch(e);
        };
        X.suspendEvents = function() {
            this._getHandlers().suspend = true;
        };
        X.resumeEvents = function(e) {
            var h;
            h = this._getHandlers();
            h.suspend = false;
            if (e) {
                h.releaseEvents();
            }
        };
        X.getEventHandler = function() {
            var x, h;
            h = this._fnHandler;
            if (!h) {
                x = this;
                h = function(e) {
                    x.handleEvent(e);
                };
                this._fnHandler = h;
            }
            return h;
        };
        X._checkEventSubscription = function(t, h) {
            h = h || this._getHandlers();
            this._saveOnEvent(t);
            if (h.hasSubscribers(t)) {
                if (!h.subscribed(t)) {
                    this._addEventListener(t, this.getEventHandler());
                    h.subscribe(t);
                }
            } else {
                if (h.subscribed(t)) {
                    this._removeEventListener(t, this.getEventHandler());
                    h.unsubscribe(t);
                }
            }
        };
        X._checkEventSubscriptions = function() {
            var h, i, n;
            h = this._getHandlers();
            n = a.length;
            for (i = 0; i < n; ++i) {
                this._checkEventSubscription(a[i], h);
            }
        };
        X.addEventListener = function(t, e) {
            this._getHandlers().add(t, e);
            this._checkEventSubscription(t);
        };
        X.removeEventListener = function(t, e) {
            this._getHandlers().remove(t, e);
            this._checkEventSubscription(t);
        };
        X.abort = function() {
            var e;
            try {
                e = this._channel;
                if (e) {
                    b.debug("Aborting request " + e.method + " " + e.url);
                    e.aborting();
                    this._abort();
                    e.aborted();
                } else {
                    b.debug("Aborting request");
                    this._abort();
                }
                this._getHandlers().clearEvents();
            } catch(h) {
                b.warning("Failed to abort request: " + h.message);
                e["catch"](h);
            }
        };
        X.open = function(e, h, i, k, n) {
            var t, x;
            b.debug("Opening request " + e + " " + h);
            x = arguments.length;
            if (x <= 2) {
                i = true;
            }
            this._getHandlers().clearEvents();
            t = _.channelFactory.create(this, e, h, i, k, n);
            this._channel = t;
            this._checkEventSubscription("readystatechange");
            try {
                this._clearParams();
                t.opening();
                if (x <= 2) {
                    this._open(e, h);
                } else {
                    this._open(e, h, i, k, n);
                }
                t.opened();
                this._addEventListener("readystatechange", this.getEventHandler());
            } catch(A) {
                b.warning("Failed to open request " + e + " " + h + ": " + A.message);
                t["catch"](A);
            }
        };
        X.setRequestHeader = function(h, e) {
            var i, n;
            this._setRequestHeader(h, e);
            n = h.toLowerCase();
            i = this.headers;
            if (i[n]) {
                i[n] += ", " + e;
            } else {
                i[n] = e;
            }
        };
        X.setRequestHeaders = function(h) {
            var e, k, i, n;
            if (typeof h === "object") {
                k = Object.getOwnPropertyNames(h);
                n = k.length;
                for (i = 0; i < n; ++i) {
                    e = k[i];
                    this.setRequestHeader(e, h[e]);
                }
            }
        };
        X.send = function(e) {
            var h, i, k;
            this._checkEventSubscriptions();
            try {
                h = this._channel;
                if (h) {
                    i = h.method;
                    k = h.url;
                    b.debug("Sending request " + i + " " + k);
                    h.sending();
                }
                this._saveParams(e);
                this._send(e);
                if (h) {
                    h.sent();
                }
            } catch(n) {
                if (i) {
                    b.warning("Failed to send request " + i + " " + k + ": " + n.message);
                } else {
                    b.warning("Failed to send request: " + n.message);
                }
                if (h) {
                    h["catch"](n);
                }
            }
        };
        X.getRequestHeader = function(h) {
            return this.headers[h.toLowerCase()];
        };
        X.deleteRepeatHeader = function(h) {
            delete this.headers[h.toLowerCase()];
        };
        X.setRepeatHeader = function(h, e) {
            this.headers[h.toLowerCase()] = e;
        };
        X.reopen = function() {
            var e;
            e = this._channel;
            if (e) {
                b.debug("Reopening request " + e.method + " " + e.url);
            } else {
                throw new TypeError("Cannot reopen request");
            }
            this._checkEventSubscription("readystatechange");
            try {
                e.reopening();
                e.opening();
                this._open(e.method, e.url, e.async, e.username, e.password);
                e.opened();
                this._restoreParams();
            } catch(h) {
                b.warning("Failed to reopen request " + method + " " + url + ": " + h.message);
                e["catch"](h);
            }
        };
        X.repeat = function() {
            var e;
            e = this._channel;
            if (!e) {
                throw new TypeError("Cannot repeat request");
            }
            this.reopen();
            this.send(this._data);
        };
        Object.defineProperties(X, {
            "channel": {
                enumerable: true,
                get: function() {
                    return this._channel;
                }
            },
            "headers": {
                enumerable: true,
                get: function() {
                    var h;
                    h = this._headers;
                    if (!h) {
                        h = {};
                        this._headers = h;
                    }
                    return h;
                }
            }
        });
        X._clearParams = function() {
            delete this._headers;
            delete this._withCredentials;
            delete this._timeout;
            delete this._data;
        };
        X._restoreParams = function() {
            var t, h;
            if (this._headers) {
                h = this._headers;
                this._headers = {};
                this.setRequestHeaders(h);
            }
            if (this._withCredentials) {
                this.withCredentials = true;
            }
            t = this._timeout;
            if (t) {
                this.timeout = t;
            }
        };
        X._saveParams = function(e) {
            var t;
            if ((e !== undefined) && (e !== null)) {
                this._data = e;
            }
            if (this.withCredentials) {
                this._withCredentials = true;
            }
            t = this.timeout;
            if (t) {
                this._timeout = t;
            }
        };
        Object.defineProperties(XMLHttpRequest, {
            "logger": {
                get: function() {
                    return b;
                },
                set: function(e) {
                    if (j(e)) {
                        b.logger = e;
                    } else {
                        b.logger = c;
                    }
                }
            }
        });
        function u(x, e, h, i, k, n) {
            this.filters = [];
            this.xhr = x;
            this.method = e;
            this.url = h;
            this.async = !!i;
            if (k !== undefined) {
                this.username = k;
            }
            if (n !== undefined) {
                this.password = n;
            }
        }
        C = u.prototype;
        C._process = function(e) {
            var h, k, i, n;
            h = this.filters;
            n = h.length;
            for (i = 0; i < n; ++i) {
                k = h[i];
                if (typeof k[e] === "function") {
                    k[e].call(k, this);
                }
            }
        };
        C.aborting = function() {
            this._process("aborting");
        };
        C.aborted = function() {
            this._process("aborted");
        };
        C.opening = function() {
            this._process("opening");
        };
        C.opened = function() {
            this._process("opened");
        };
        C.sending = function() {
            this._process("sending");
        };
        C.sent = function() {
            this._process("sent");
        };
        C.reopening = function() {
            this._process("reopening");
        };
        C["catch"] = function(e) {
            var h, k, i, n;
            h = this.filters;
            n = h.length;
            for (i = 0; i < n; ++i) {
                k = h[i]["catch"];
                if (typeof k === "function") {
                    e = k(e, this);
                    if (!e) {
                        break;
                    }
                }
            }
            if (e) {
                throw e;
            }
        };
        function v() {
            this.p = [];
            this.r = [];
            this.f = [];
        }
        I = v.prototype;
        I.add = function(i) {
            switch (typeof i) {
            case "string":
                this.p.push(i);
                break;
            case "object":
                if (i instanceof RegExp) {
                    this.r.push(i);
                } else {
                    throw new TypeError("Unsupported ignore type");
                }
                break;
            case "function":
                this.f.push(i);
                break;
            default:
                throw new TypeError("Unsupported ignore type");
            }
        };
        I.ignored = function(i) {
            var e;
            e = this._prefix(i) || this._regexp(i) || this._function(i);
            return e;
        };
        I.clear = function() {
            this.p = [];
            this.r = [];
            this.f = [];
        };
        I._prefix = function(i) {
            var e, k, n, h;
            h = false;
            e = this.p;
            n = e.length;
            for (k = 0; k < n; ++k) {
                if (i.startsWith(e[k])) {
                    h = true;
                    break;
                }
            }
            return h;
        };
        I._regexp = function(i) {
            var e, k, n, h;
            h = false;
            e = this.r;
            n = e.length;
            for (k = 0; k < n; ++k) {
                if (e[k].test(i)) {
                    h = true;
                    break;
                }
            }
            return h;
        };
        I._function = function(i) {
            var e, k, n, h;
            h = false;
            e = this.f;
            n = e.length;
            for (k = 0; k < n; ++k) {
                try {
                    if (e[k](i)) {
                        h = true;
                        break;
                    }
                } catch(t) {}
            }
            return h;
        };
        function w(x) {
            var t;
            t = typeof x;
            return (t === "function") || ((t === "object") && (x !== null) && (typeof x.addFilter === "function"));
        }
        function y(x, e) {
            if (typeof x === "function") {
                x(e);
            } else {
                x.addFilter(e);
            }
        }
        function z() {
            this._filterFactories = [];
            this.ignore = new v();
        }
        S = z.prototype;
        S.addFilterFactory = function(e) {
            var h, k, i, n;
            if (!w(e)) {
                throw new TypeError("addFilterFactory expects a FilterFactory or a function parameter");
            }
            k = this._filterFactories;
            h = true;
            n = k.length;
            for (i = 0; i < n; ++i) {
                if (k[i] === e) {
                    h = false;
                    break;
                }
            }
            if (h) {
                this._filterFactories.push(e);
            }
        };
        S.removeFilterFactory = function(e) {
            var h, i, n;
            h = this._filterFactories;
            n = h.length;
            for (i = 0; i < n; ++i) {
                if (h[i] === e) {
                    h.splice(i, 1);
                    break;
                }
            }
        };
        S.getFilterFactories = function() {
            return this._filterFactories.slice();
        };
        S.create = function(x, e, h, k, t, A) {
            var B, D, i, n;
            B = new u(x, e, h, k, t, A);
            if (!this.ignore.ignored(h)) {
                D = this._filterFactories;
                n = D.length;
                for (i = 0; i < n; ++i) {
                    y(D[i], B);
                }
            }
            return B;
        };
        XMLHttpRequest.channelFactory = new z();
        return {};
    });
})(this);
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
if (window.jQuery && window.jQuery.sap && window.jQuery.sap.declare) {
    window.jQuery.sap.declare("sap.ui.Device", false);
}
if (typeof window.sap !== "object" && typeof window.sap !== "function") {
    window.sap = {};
}
if (typeof window.sap.ui !== "object") {
    window.sap.ui = {};
} (function() {
    if (typeof window.sap.ui.Device === "object" || typeof window.sap.ui.Device === "function") {
        var c = "1.28.23";
        window.sap.ui.Device._checkAPIVersion(c);
        return;
    }
    var d = {};
    function p(i, w) {
        return ("000" + String(i)).slice( - w);
    }
    var F = 0,
    E = 1,
    W = 2,
    I = 3,
    D = 4,
    T = 5;
    var g = function() {
        this.defaultComponent = 'DEVICE';
        this.sWindowName = (window.top == window) ? "": "[" + window.location.pathname.split('/').slice( - 1)[0] + "] ";
        this.log = function(i, s, a) {
            a = a || this.defaultComponent || '';
            var b = new Date(),
            e = {
                time: p(b.getHours(), 2) + ":" + p(b.getMinutes(), 2) + ":" + p(b.getSeconds(), 2),
                date: p(b.getFullYear(), 4) + "-" + p(b.getMonth() + 1, 2) + "-" + p(b.getDate(), 2),
                timestamp: b.getTime(),
                level: i,
                message: s || "",
                component: a || ""
            };
            if (window.console) {
                var f = e.date + " " + e.time + " " + this.sWindowName + e.message + " - " + e.component;
                switch (i) {
                case F:
                case E:
                    console.error(f);
                    break;
                case W:
                    console.warn(f);
                    break;
                case I:
                    console.info ? console.info(f) : console.log(f);
                    break;
                case D:
                    console.debug ? console.debug(f) : console.log(f);
                    break;
                case T:
                    console.trace ? console.trace(f) : console.log(f);
                    break;
                }
            }
            return e;
        };
    };
    var l = new g();
    l.log(I, "Device API logging initialized");
    d._checkAPIVersion = function(s) {
        var v = "1.28.23";
        if (v != s) {
            l.log(W, "Device API version differs: " + v + " <-> " + s);
        }
    };
    var h = {};
    function j(e, f, a) {
        if (!h[e]) {
            h[e] = [];
        }
        h[e].push({
            oListener: a,
            fFunction: f
        });
    }
    function k(e, f, a) {
        var b = h[e];
        if (!b) {
            return this;
        }
        for (var i = 0,
        q = b.length; i < q; i++) {
            if (b[i].fFunction === f && b[i].oListener === a) {
                b.splice(i, 1);
                break;
            }
        }
        if (b.length == 0) {
            delete h[e];
        }
    }
    function n(e, a) {
        var b = h[e],
        f;
        if (b) {
            b = b.slice();
            for (var i = 0,
            q = b.length; i < q; i++) {
                f = b[i];
                f.fFunction.call(f.oListener || window, a);
            }
        }
    }
    var O = {
        "WINDOWS": "win",
        "MACINTOSH": "mac",
        "LINUX": "linux",
        "IOS": "iOS",
        "ANDROID": "Android",
        "BLACKBERRY": "bb",
        "WINDOWS_PHONE": "winphone"
    };
    function o(a) {
        a = a || navigator.userAgent;
        var b, e;
        function f() {
            var s = navigator.platform;
            if (s.indexOf("Win") != -1) {
                var t = /Windows NT (\d+).(\d)/i;
                var v = a.match(t);
                var w = "";
                if (v[1] == "6") {
                    if (v[2] == 1) {
                        w = "7";
                    } else if (v[2] > 1) {
                        w = "8";
                    }
                } else {
                    w = v[1];
                }
                return {
                    "name": O.WINDOWS,
                    "versionStr": w
                };
            } else if (s.indexOf("Mac") != -1) {
                return {
                    "name": O.MACINTOSH,
                    "versionStr": ""
                };
            } else if (s.indexOf("Linux") != -1) {
                return {
                    "name": O.LINUX,
                    "versionStr": ""
                };
            }
            l.log(I, "OS detection returned no result");
            return null;
        }
        b = /Windows Phone (?:OS )?([\d.]*)/;
        e = a.match(b);
        if (e) {
            return ({
                "name": O.WINDOWS_PHONE,
                "versionStr": e[1]
            });
        }
        if (a.indexOf("(BB10;") > 0) {
            b = /\sVersion\/([\d.]+)\s/;
            e = a.match(b);
            if (e) {
                return {
                    "name": O.BLACKBERRY,
                    "versionStr": e[1]
                };
            } else {
                return {
                    "name": O.BLACKBERRY,
                    "versionStr": '10'
                };
            }
        }
        b = /\(([a-zA-Z ]+);\s(?:[U]?[;]?)([\D]+)((?:[\d._]*))(?:.*[\)][^\d]*)([\d.]*)\s/;
        e = a.match(b);
        if (e) {
            var i = /iPhone|iPad|iPod/;
            var q = /PlayBook|BlackBerry/;
            if (e[0].match(i)) {
                e[3] = e[3].replace(/_/g, ".");
                return ({
                    "name": O.IOS,
                    "versionStr": e[3]
                });
            } else if (e[2].match(/Android/)) {
                e[2] = e[2].replace(/\s/g, "");
                return ({
                    "name": O.ANDROID,
                    "versionStr": e[3]
                });
            } else if (e[0].match(q)) {
                return ({
                    "name": O.BLACKBERRY,
                    "versionStr": e[4]
                });
            }
        }
        b = /\((Android)[\s]?([\d][.\d]*)?;.*Firefox\/[\d][.\d]*/;
        e = a.match(b);
        if (e) {
            return ({
                "name": O.ANDROID,
                "versionStr": e.length == 3 ? e[2] : ""
            });
        }
        return f();
    }
    function r(a) {
        d.os = o(a) || {};
        d.os.OS = O;
        d.os.version = d.os.versionStr ? parseFloat(d.os.versionStr) : -1;
        if (d.os.name) {
            for (var b in O) {
                if (O[b] === d.os.name) {
                    d.os[b.toLowerCase()] = true;
                }
            }
        }
    }
    r();
    d._setOS = r;
    var B = {
        "INTERNET_EXPLORER": "ie",
        "EDGE": "ed",
        "FIREFOX": "ff",
        "CHROME": "cr",
        "SAFARI": "sf",
        "ANDROID": "an"
    };
    var u = navigator.userAgent;
    /*!
	 * Taken from jQuery JavaScript Library v1.7.1
	 * http://jquery.com/
	 *
	 * Copyright 2011, John Resig
	 * Dual licensed under the MIT or GPL Version 2 licenses.
	 * http://jquery.org/license
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 * Copyright 2011, The Dojo Foundation
	 * Released under the MIT, BSD, and GPL Licenses.
	 *
	 * Date: Mon Nov 21 21:11:03 2011 -0500
	 */
    function y(a) {
        var b = (a || u).toLowerCase();
        var e = /(webkit)[ \/]([\w.]+)/;
        var f = /(opera)(?:.*version)?[ \/]([\w.]+)/;
        var i = /(msie) ([\w.]+)/;
        var q = /(trident)\/[\w.]+;.*rv:([\w.]+)/;
        var s = /(edge)[ \/]([\w.]+)/;
        var t = /(mozilla)(?:.*? rv:([\w.]+))?/;
        var v = s.exec(b) || q.exec(b) || e.exec(b) || f.exec(b) || i.exec(b) || b.indexOf("compatible") < 0 && t.exec(b) || [];
        var w = {
            browser: v[1] || "",
            version: v[2] || "0"
        };
        w[w.browser] = true;
        return w;
    }
    function z(a) {
        var b = y(a);
        var e = a || u;
        var f;
        if (b.mozilla) {
            f = /Mobile/;
            if (e.match(/Firefox\/(\d+\.\d+)/)) {
                var v = parseFloat(RegExp.$1);
                return {
                    name: B.FIREFOX,
                    versionStr: "" + v,
                    version: v,
                    mozilla: true,
                    mobile: f.test(e)
                };
            } else {
                return {
                    mobile: f.test(e),
                    mozilla: true
                };
            }
        } else if (b.webkit) {
            var i = e.toLowerCase().match(/webkit[\/]([\d.]+)/);
            var w;
            if (i) {
                w = i[1];
            }
            f = /Mobile/;
            if (e.match(/(Chrome|CriOS)\/(\d+\.\d+).\d+/)) {
                var v = parseFloat(RegExp.$2);
                return {
                    name: B.CHROME,
                    versionStr: "" + v,
                    version: v,
                    mobile: f.test(e),
                    webkit: true,
                    webkitVersion: w
                };
            } else if (e.match(/FxiOS\/(\d+\.\d+)/)) {
                var v = parseFloat(RegExp.$1);
                return {
                    name: B.FIREFOX,
                    versionStr: "" + v,
                    version: v,
                    mobile: true,
                    webkit: true,
                    webkitVersion: w
                };
            } else if (e.match(/Android .+ Version\/(\d+\.\d+)/)) {
                var v = parseFloat(RegExp.$1);
                return {
                    name: B.ANDROID,
                    versionStr: "" + v,
                    version: v,
                    mobile: f.test(e),
                    webkit: true,
                    webkitVersion: w
                };
            } else {
                var q = /(Version|PhantomJS)\/(\d+\.\d+).*Safari/;
                if (q.test(e)) {
                    var s = q.exec(e);
                    var v = parseFloat(s[2]);
                    return {
                        name: B.SAFARI,
                        versionStr: "" + v,
                        version: v,
                        mobile: f.test(e),
                        webkit: true,
                        webkitVersion: w,
                        phantomJS: s[1] === "PhantomJS"
                    };
                } else {
                    return {
                        mobile: f.test(e),
                        webkit: true,
                        webkitVersion: w
                    };
                }
            }
        } else if (b.msie || b.trident) {
            var v;
            if (document.documentMode && !a) {
                if (document.documentMode === 7) {
                    v = 8.0;
                } else {
                    v = parseFloat(document.documentMode);
                }
            } else {
                v = parseFloat(b.version);
            }
            return {
                name: B.INTERNET_EXPLORER,
                versionStr: "" + v,
                version: v,
                msie: true,
                mobile: false
            };
        } else if (b.edge) {
            var v = v = parseFloat(b.version);
            return {
                name: B.EDGE,
                versionStr: "" + v,
                version: v,
                edge: true
            };
        }
        return {
            name: "",
            versionStr: "",
            version: -1,
            mobile: false
        };
    }
    d._testUserAgent = z;
    function A() {
        d.browser = z();
        d.browser.BROWSER = B;
        if (d.browser.name) {
            for (var b in B) {
                if (B[b] === d.browser.name) {
                    d.browser[b.toLowerCase()] = true;
                }
            }
        }
    }
    A();
    d.support = {};
    d.support.touch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
    if (d.browser.phantomJS) {
        d.support.touch = false;
    }
    d.support.pointer = !!window.PointerEvent;
    d.support.matchmedia = !!window.matchMedia;
    var m = d.support.matchmedia ? window.matchMedia("all and (max-width:0px)") : null;
    d.support.matchmedialistener = !!(m && m.addListener);
    if (d.browser.safari && d.browser.version < 6) {
        d.support.matchmedialistener = false;
    }
    d.support.orientation = !!("orientation" in window && "onorientationchange" in window);
    d.support.retina = (window.retina || window.devicePixelRatio >= 2);
    d.support.websocket = ('WebSocket' in window);
    d.support.input = {};
    d.support.input.placeholder = ('placeholder' in document.createElement("input"));
    d.media = {};
    var R = {
        "SAP_3STEPS": "3Step",
        "SAP_4STEPS": "4Step",
        "SAP_6STEPS": "6Step",
        "SAP_STANDARD": "Std"
    };
    d.media.RANGESETS = R;
    d.media._predefinedRangeSets = {};
    d.media._predefinedRangeSets[R.SAP_3STEPS] = {
        points: [520, 960],
        unit: "px",
        name: R.SAP_3STEPS,
        names: ["S", "M", "L"]
    };
    d.media._predefinedRangeSets[R.SAP_4STEPS] = {
        points: [520, 760, 960],
        unit: "px",
        name: R.SAP_4STEPS,
        names: ["S", "M", "L", "XL"]
    };
    d.media._predefinedRangeSets[R.SAP_6STEPS] = {
        points: [241, 400, 541, 768, 960],
        unit: "px",
        name: R.SAP_6STEPS,
        names: ["XS", "S", "M", "L", "XL", "XXL"]
    };
    d.media._predefinedRangeSets[R.SAP_STANDARD] = {
        points: [600, 1024],
        unit: "px",
        name: R.SAP_STANDARD,
        names: ["Phone", "Tablet", "Desktop"]
    };
    var _ = R.SAP_STANDARD;
    var C = d.support.matchmedialistener ? 0 : 100;
    var G = {};
    var H = null;
    function J(f, t, a) {
        a = a || "px";
        var q = "all";
        if (f > 0) {
            q = q + " and (min-width:" + f + a + ")";
        }
        if (t > 0) {
            q = q + " and (max-width:" + t + a + ")";
        }
        return q;
    }
    function K(a) {
        if (!d.support.matchmedialistener && H == Q()[0]) {
            return;
        }
        if (G[a].timer) {
            clearTimeout(G[a].timer);
            G[a].timer = null;
        }
        G[a].timer = setTimeout(function() {
            var b = M(a, false);
            if (b) {
                n("media_" + a, b);
            }
        },
        C);
    }
    function L(s, i) {
        var q = G[s].queries[i];
        var a = {
            from: q.from,
            unit: G[s].unit
        };
        if (q.to >= 0) {
            a.to = q.to;
        }
        if (G[s].names) {
            a.name = G[s].names[i];
        }
        return a;
    }
    function M(a, b) {
        if (G[a]) {
            var e = G[a].queries;
            var f = null;
            for (var i = 0,
            s = e.length; i < s; i++) {
                var q = e[i];
                if ((q != G[a].currentquery || b) && d.media.matches(q.from, q.to, G[a].unit)) {
                    if (!b) {
                        G[a].currentquery = q;
                    }
                    if (!G[a].noClasses && G[a].names && !b) {
                        N(a, G[a].names[i]);
                    }
                    f = L(a, i);
                }
            }
            return f;
        }
        l.log(W, "No queryset with name " + a + " found", 'DEVICE.MEDIA');
        return null;
    }
    function N(s, a, b) {
        var e = "sapUiMedia-" + s + "-";
        P(e + a, b, e);
    }
    function P(s, b, a) {
        var e = document.documentElement;
        if (e.className.length == 0) {
            if (!b) {
                e.className = s;
            }
        } else {
            var f = e.className.split(" ");
            var q = "";
            for (var i = 0; i < f.length; i++) {
                if ((a && f[i].indexOf(a) != 0) || (!a && f[i] != s)) {
                    q = q + f[i] + " ";
                }
            }
            if (!b) {
                q = q + s;
            }
            e.className = q;
        }
    }
    function Q() {
        return [document.documentElement.clientWidth, document.documentElement.clientHeight];
    }
    function S(v, a) {
        if (a === "em" || a === "rem") {
            var s = window.getComputedStyle ||
            function(e) {
                return e.currentStyle;
            };
            var x = s(document.documentElement).fontSize;
            var f = (x && x.indexOf("px") >= 0) ? parseFloat(x, 10) : 16;
            return v * f;
        }
        return v;
    }
    function U(f, t, e) {
        f = S(f, e);
        t = S(t, e);
        var w = Q()[0];
        var a = f < 0 || f <= w;
        var b = t < 0 || w <= t;
        return a && b;
    }
    function V(f, t, a) {
        var q = J(f, t, a);
        var b = window.matchMedia(q);
        return b && b.matches;
    }
    d.media.matches = d.support.matchmedia ? V: U;
    d.media.attachHandler = function(f, a, s) {
        var b = s || _;
        j("media_" + b, f, a);
    };
    d.media.detachHandler = function(f, a, s) {
        var b = s || _;
        k("media_" + b, f, a);
    };
    d.media.initRangeSet = function(s, a, b, e, f) {
        var t;
        if (!s) {
            t = d.media._predefinedRangeSets[_];
        } else if (s && d.media._predefinedRangeSets[s]) {
            t = d.media._predefinedRangeSets[s];
        } else {
            t = {
                name: s,
                unit: (b || "px").toLowerCase(),
                points: a || [],
                names: e,
                noClasses: !!f
            };
        }
        if (d.media.hasRangeSet(t.name)) {
            l.log(I, "Range set " + t.name + " hase already been initialized", 'DEVICE.MEDIA');
            return;
        }
        s = t.name;
        t.queries = [];
        t.timer = null;
        t.currentquery = null;
        t.listener = function() {
            return K(s);
        };
        var v, w, x;
        var v1 = t.points;
        for (var i = 0,
        w1 = v1.length; i <= w1; i++) {
            v = (i == 0) ? 0 : v1[i - 1];
            w = (i == v1.length) ? -1 : v1[i];
            x = J(v, w, t.unit);
            t.queries.push({
                query: x,
                from: v,
                to: w
            });
        }
        if (t.names && t.names.length != t.queries.length) {
            t.names = null;
        }
        G[t.name] = t;
        if (d.support.matchmedialistener) {
            var x1 = t.queries;
            for (var i = 0; i < x1.length; i++) {
                var q = x1[i];
                q.media = window.matchMedia(q.query);
                q.media.addListener(t.listener);
            }
        } else {
            if (window.addEventListener) {
                window.addEventListener("resize", t.listener, false);
                window.addEventListener("orientationchange", t.listener, false);
            } else {
                window.attachEvent("onresize", t.listener);
            }
        }
        t.listener();
    };
    d.media.getCurrentRange = function(s) {
        if (!d.media.hasRangeSet(s)) {
            return null;
        }
        return M(s, true);
    };
    d.media.hasRangeSet = function(s) {
        return s && !!G[s];
    };
    d.media.removeRangeSet = function(s) {
        if (!d.media.hasRangeSet(s)) {
            l.log(I, "RangeSet " + s + " not found, thus could not be removed.", 'DEVICE.MEDIA');
            return;
        }
        for (var x in R) {
            if (s === R[x]) {
                l.log(W, "Cannot remove default rangeset - no action taken.", 'DEVICE.MEDIA');
                return;
            }
        }
        var a = G[s];
        if (d.support.matchmedialistener) {
            var q = a.queries;
            for (var i = 0; i < q.length; i++) {
                q[i].media.removeListener(a.listener);
            }
        } else {
            if (window.removeEventListener) {
                window.removeEventListener("resize", a.listener, false);
                window.removeEventListener("orientationchange", a.listener, false);
            } else {
                window.detachEvent("onresize", a.listener);
            }
        }
        N(s, "", true);
        delete h["media_" + s];
        delete G[s];
    };
    var X = {
        "TABLET": "tablet",
        "PHONE": "phone",
        "DESKTOP": "desktop",
        "COMBI": "combi"
    };
    d.system = {};
    function Y(a, b) {
        var t = Z(b);
        var i = d.os.windows && d.os.version >= 8;
        var e = d.os.windows && d.os.version === 7;
        var s = {};
        s.tablet = ((d.support.touch && !e) || i || !!a) && t;
        s.phone = d.os.windows_phone || ((d.support.touch && !e) || !!a) && !t;
        s.desktop = (!s.tablet && !s.phone) || i || e;
        s.combi = (s.desktop && s.tablet);
        s.SYSTEMTYPE = X;
        for (var f in X) {
            P("sap-" + X[f], !s[X[f]]);
        }
        return s;
    }
    function Z(a) {
        var u = a || navigator.userAgent;
        var i = d.os.windows && d.os.version >= 8;
        if (d.os.name === d.os.OS.IOS) {
            return /ipad/i.test(u);
        } else {
            if (d.support.touch) {
                if (i) {
                    return true;
                }
                if (d.browser.chrome && d.os.android && d.os.version >= 4.4) {
                    return ! /Mobile Safari\/[.0-9]+/.test(u);
                } else {
                    var b = window.devicePixelRatio ? window.devicePixelRatio: 1;
                    if (d.os.android && d.browser.webkit && (parseFloat(d.browser.webkitVersion) > 537.10)) {
                        b = 1;
                    }
                    var t = (Math.min(window.screen.width / b, window.screen.height / b) >= 600);
                    if (r1() && (window.screen.height === 552 || window.screen.height === 553) && (/Nexus 7/i.test(u))) {
                        t = true;
                    }
                    return t;
                }
            } else {
                var e = (/(?=android)(?=.*mobile)/i.test(u));
                return (d.browser.msie && u.indexOf("Touch") !== -1) || (d.os.android && !e);
            }
        }
    }
    function $(a) {
        d.system = Y(a);
        if (d.system.tablet || d.system.phone) {
            d.browser.mobile = true;
        }
    }
    $();
    d._getSystem = Y;
    d.orientation = {};
    d.resize = {};
    d.orientation.attachHandler = function(f, a) {
        j("orientation", f, a);
    };
    d.resize.attachHandler = function(f, a) {
        j("resize", f, a);
    };
    d.orientation.detachHandler = function(f, a) {
        k("orientation", f, a);
    };
    d.resize.detachHandler = function(f, a) {
        k("resize", f, a);
    };
    function a1(i) {
        i.landscape = r1(true);
        i.portrait = !i.landscape;
    }
    function b1() {
        a1(d.orientation);
        n("orientation", {
            landscape: d.orientation.landscape
        });
    }
    function c1() {
        d1(d.resize);
        n("resize", {
            height: d.resize.height,
            width: d.resize.width
        });
    }
    function d1(i) {
        i.width = Q()[0];
        i.height = Q()[1];
    }
    function e1() {
        var w = d.orientation.landscape;
        var i = r1();
        if (w != i) {
            b1();
        }
        if (!j1) {
            j1 = window.setTimeout(f1, 150);
        }
    }
    function f1() {
        c1();
        j1 = null;
    }
    var g1 = false;
    var h1 = false;
    var i1;
    var j1;
    var k1;
    var l1 = Q()[1];
    var m1 = Q()[0];
    var n1 = false;
    var o1;
    var p1 = /INPUT|TEXTAREA|SELECT/;
    var q1 = d.os.ios && d.browser.name === "sf" && ((d.system.phone && d.os.version >= 7 && d.os.version < 7.1) || (d.system.tablet && d.os.version >= 7));
    function r1(f) {
        if (d.support.touch && d.support.orientation) {
            if (n1 && f) {
                return ! d.orientation.landscape;
            }
            if (n1) {
                return d.orientation.landscape;
            }
        } else {
            if (d.support.matchmedia && d.support.orientation) {
                return !! window.matchMedia("(orientation: landscape)").matches;
            }
        }
        var s = Q();
        return s[0] > s[1];
    }
    function s1(e) {
        if (e.type == "resize") {
            if (q1 && p1.test(document.activeElement.tagName) && !g1) {
                return;
            }
            var w = Q()[1];
            var i = Q()[0];
            var t = new Date().getTime();
            if (w === l1 && i === m1) {
                return;
            }
            h1 = true;
            if ((l1 != w) && (m1 == i)) {
                if (!o1 || (t - o1 > 300)) {
                    n1 = (w < l1);
                }
                c1();
            } else {
                m1 = i;
            }
            o1 = t;
            l1 = w;
            if (k1) {
                window.clearTimeout(k1);
                k1 = null;
            }
            k1 = window.setTimeout(u1, 1200);
        } else if (e.type == "orientationchange") {
            g1 = true;
        }
        if (i1) {
            clearTimeout(i1);
            i1 = null;
        }
        i1 = window.setTimeout(t1, 50);
    }
    function t1() {
        if (g1 && h1) {
            b1();
            c1();
            g1 = false;
            h1 = false;
            if (k1) {
                window.clearTimeout(k1);
                k1 = null;
            }
        }
        i1 = null;
    }
    function u1() {
        g1 = false;
        h1 = false;
        k1 = null;
    }
    d._update = function(a) {
        u = navigator.userAgent;
        l.log(W, "Device API values manipulated: NOT PRODUCTIVE FEATURE!!! This should be only used for test purposes. Only use if you know what you are doing.");
        A();
        r();
        $(a);
    };
    d1(d.resize);
    a1(d.orientation);
    window.sap.ui.Device = d;
    if (d.support.touch && d.support.orientation) {
        window.addEventListener("resize", s1, false);
        window.addEventListener("orientationchange", s1, false);
    } else {
        if (window.addEventListener) {
            window.addEventListener("resize", e1, false);
        } else {
            window.attachEvent("onresize", e1);
        }
    }
    d.media.initRangeSet();
    if (sap.ui.define) {
        sap.ui.define("sap/ui/Device", [],
        function() {
            return d;
        });
    }
} ());
// Copyright (c) 2009-2014 SAP SE, All Rights Reserved
this.sap = this.sap || {}; (function() {
    "use strict";
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(t) {
            if (typeof this !== "function") {
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }
            var a = Array.prototype.slice.call(arguments, 1),
            T = this,
            N = function() {},
            b = function() {
                return T.apply(this instanceof N ? this: t, a.concat(Array.prototype.slice.call(arguments)));
            };
            N.prototype = this.prototype;
            b.prototype = new N();
            return b;
        };
    }
    sap.ui2 = sap.ui2 || {};
    sap.ui2.srvc = sap.ui2.srvc || {};
    if (sap.ui2.srvc.log) {
        return;
    }
    var c;
    if (typeof jQuery === 'function' && jQuery.sap) {
        jQuery.sap.declare("sap.ui2.srvc.utils");
    }
    function q() {
        return typeof jQuery === 'function' && jQuery.sap && jQuery.sap.log;
    }
    function f(m, d, C) {
        return (m || "") + " - " + (d || "") + " " + (C || "");
    }
    sap.ui2.srvc.log = {
        debug: function(m, d, C) {
            if (q()) {
                jQuery.sap.log.debug(m, d, C);
                return;
            }
            if (typeof console === "object") {
                if (typeof console.debug === "function") {
                    console.debug(f(m, d, C));
                } else {
                    console.log(f(m, d, C));
                }
            }
        },
        error: function(m, d, C) {
            if (q()) {
                jQuery.sap.log.error(m, d, C);
                return;
            }
            if (typeof console === "object") {
                console.error(f(m, d, C));
            }
        },
        info: function(m, d, C) {
            if (q()) {
                jQuery.sap.log.info(m, d, C);
                return;
            }
            if (typeof console === "object") {
                console.info(f(m, d, C));
            }
        },
        warning: function(m, d, C) {
            if (q()) {
                jQuery.sap.log.warning(m, d, C);
                return;
            }
            if (typeof console === "object") {
                console.warn(f(m, d, C));
            }
        }
    };
    sap.ui2.srvc.absoluteUrl = function(u, b) {
        b = b || location.href;
        if (b.indexOf('://') < 0 && b.charAt(0) !== '/') {
            throw new sap.ui2.srvc.Error("Illegal base URL: " + b, "sap.ui2.srvc");
        }
        if (!u || u.indexOf('://') >= 0 || u.charAt(0) === '/') {
            return this.addCacheBusterTokenUsingUshellConfig(u);
        }
        if (b.search(/^([^:]*:)?\/\/[^\/]+$/) < 0) {
            b = b.replace(/\/[^\/]*$/, '');
        }
        return this.addCacheBusterTokenUsingUshellConfig(b + '/' + u);
    };
    sap.ui2.srvc.call = function(s, F, a) {
        var m;
        if (a) {
            setTimeout(function() {
                sap.ui2.srvc.call(s, F, false);
            },
            0);
            return;
        }
        try {
            s();
        } catch(e) {
            m = e.message || e.toString();
            sap.ui2.srvc.log.error("Call to success handler failed: " + m, e.stack, "sap.ui2.srvc");
            if (F) {
                F(m);
            }
        }
    };
    sap.ui2.srvc.get = function(u, x, s, F, X, C) {
        if (typeof s !== "function") {
            throw new sap.ui2.srvc.Error("Missing success handler", "sap.ui2.srvc");
        }
        if (typeof F !== "function") {
            throw new sap.ui2.srvc.Error("Missing error handler", "sap.ui2.srvc");
        }
        if (x && C) {
            throw new sap.ui2.srvc.Error("Caching of XML responses not supported", "sap.ui2.srvc");
        }
        if (typeof sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig === "function") {
            u = sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig(u);
        }
        X = X || new XMLHttpRequest();
        X.onreadystatechange = function() {
            var r, o;
            if (this.readyState !== 4) {
                return;
            }
            sap.ui2.srvc.get.pending -= 1;
            if (this.status !== 200) {
                sap.ui2.srvc.log.error("Error " + this.status + " in response for URL " + u, null, "sap.ui2.srvc");
                F(u + ": " + this.status + " " + this.statusText, this.responseText);
                return;
            }
            sap.ui2.srvc.log.debug("Received response for URL " + u, null, "sap.ui2.srvc");
            if (x) {
                o = this.responseXML;
                if (o === null || !o.documentElement) {
                    F(u + ": no valid XML");
                    return;
                }
                r = o;
            } else {
                r = this.responseText;
                if (C) {
                    c.put(u, r);
                }
            }
            sap.ui2.srvc.call(s.bind(null, r), F);
        };
        if (!x && c.containsKey(u)) {
            sap.ui2.srvc.log.debug("Return cached response for URL " + u, null, "sap.ui2.srvc");
            sap.ui2.srvc.call(s.bind(null, c.get(u)), F);
        } else {
            try {
                X.open("GET", u, true);
                X.send();
                sap.ui2.srvc.get.pending += 1;
                sap.ui2.srvc.log.debug("Sent request to URL " + u, null, "sap.ui2.srvc");
            } catch(e) {
                sap.ui2.srvc.log.error("Error '" + (e.message || e) + "' in request to URL " + u, null, "sap.ui2.srvc");
                throw e;
            }
        }
    };
    sap.ui2.srvc.addCacheBusterToken = function(u, p, r, t) {
        if (p.test(u)) {
            u = u.replace(p, r);
            u = u.replace(/\[CacheBusterToken\]/g, t);
        }
        return u;
    };
    sap.ui2.srvc.removeCBAndNormalizeUrl = function(u) {
        var m, U, C, s;
        if (typeof u !== "string" || u === "") {
            return u;
        }
        m = u.match(/(.*)(\/~[\w\-]+~[A-Z0-9]?)(.*)/);
        if (m) {
            U = m[1];
            C = m[2];
            s = m[3];
        }
        function n(u) {
            return new URI(u).normalizePathname().toString();
        }
        function a(p) {
            var S = new URI(p).segment(),
            i,
            P = 0;
            for (i = 0; i < S.length && P >= 0; i++) {
                if (S[i] === "..") {
                    P = P - 1;
                } else {
                    P = P + 1;
                }
            }
            return P < 0;
        }
        if (C) {
            if (s && a(s)) {
                u = U + s;
            }
        }
        return n(u);
    };
    sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig = function(u) {
        var C = window["sap-ushell-config"] && window["sap-ushell-config"].cacheBusting,
        p = C && C.patterns,
        s = u,
        P = [],
        S,
        r = [];
        P = sap.ui2.srvc.getParameterMap();
        S = P["sap-ushell-nocb"] && P["sap-ushell-nocb"][0];
        if (S === 'true' || S === 'X') {
            return u;
        }
        if (!C || typeof u !== "string" || u === "" || /[\/=]~[\w\-]+~[A-Z0-9]?[\/#\?\&]/.test(u) || /[\/=]~[\w\-]+~[A-Z0-9]?$/.test(u)) {
            return u;
        }
        if (C && C.urls) {
            if (u.charAt(u.length - 1) === "/") {
                u = u.substr(0, u.length - 1);
            }
            if (C.urls.hasOwnProperty(u)) {
                return u + "/" + C.urls[u].cacheBusterToken;
            }
            if (C.urls.hasOwnProperty(u + "/")) {
                return u + "/" + C.urls[u + "/"].cacheBusterToken;
            }
        }
        if (!p) {
            return u;
        }
        Object.keys(p).forEach(function(a) {
            if (p.hasOwnProperty(a)) {
                var R = p[a];
                R.pattern = new RegExp(a);
                r.push(R);
            }
        });
        r.sort(function(R, o) {
            return R.order - o.order;
        });
        r.every(function(R) {
            if (R.pattern.test(u)) {
                if (!R.cacheBusterToken) {
                    R.cacheBusterToken = C.cacheBusterToken;
                }
                s = sap.ui2.srvc.addCacheBusterToken(u, R.pattern, R.replacement, R.cacheBusterToken);
                return false;
            }
            return true;
        });
        return s;
    };
    sap.ui2.srvc.get.clearCache = function() {
        c = new sap.ui2.srvc.Map();
    };
    sap.ui2.srvc.get.pending = 0;
    sap.ui2.srvc.getFormFactor = function() {
        var s = sap.ui.Device.system;
        return s.desktop ? s.SYSTEMTYPE.DESKTOP: (s.tablet ? s.SYSTEMTYPE.TABLET: (s.phone ? s.SYSTEMTYPE.PHONE: undefined));
    };
    sap.ui2.srvc.getParameterMap = function(s) {
        var i, n, r = {},
        k, v, I, K, S = arguments.length > 0 ? s: location.search;
        if (S && S.charAt(0) !== "?") {
            throw new sap.ui2.srvc.Error("Illegal search string " + S, "sap.ui2.srvc");
        }
        if (!S || S === "?") {
            return {};
        }
        K = S.substring(1).replace(/\+/g, ' ').split(/[&;]/);
        for (i = 0, n = K.length; i < n; i += 1) {
            k = K[i];
            v = "";
            I = k.indexOf("=");
            if (I >= 0) {
                v = k.slice(I + 1);
                v = decodeURIComponent(v);
                k = k.slice(0, I);
            }
            k = decodeURIComponent(k);
            if (!Object.prototype.hasOwnProperty.call(r, k)) {
                r[k] = [];
            }
            r[k].push(v);
        }
        return r;
    };
    sap.ui2.srvc.getParameterValue = function(u, n) {
        var p, Q;
        if (typeof n !== "string") {
            throw new sap.ui2.srvc.Error("Missing parameter name", "sap.ui2.srvc");
        }
        u = u.split('#')[0];
        Q = u.indexOf("?");
        if (Q >= 0) {
            p = sap.ui2.srvc.getParameterMap(u.slice(Q));
            if (p[n]) {
                return p[n][0];
            }
        }
        return "";
    };
    sap.ui2.srvc.isArray = function(o) {
        return Object.prototype.toString.apply(o) === '[object Array]';
    };
    sap.ui2.srvc.parseXml = function(x) {
        var X;
        if (!x || typeof x !== "string") {
            return null;
        }
        X = new DOMParser().parseFromString(x, "text/xml");
        if (X.getElementsByTagName("parsererror").length) {
            throw new sap.ui2.srvc.Error("Invalid XML: " + x, "sap.ui2.srvc");
        }
        return X;
    };
    sap.ui2.srvc.testPublishAt = function(o) {};
    if (sap.ui2.srvc.Error === undefined) {
        sap.ui2.srvc.Error = function(m, C) {
            var t = new Error(m);
            t.name = "sap.ui2.srvc.Error";
            sap.ui2.srvc.log.error(m, null, C);
            return t;
        };
    }
    sap.ui2.srvc.Map = function() {
        this.entries = {};
    };
    sap.ui2.srvc.Map.prototype.put = function(k, v) {
        var o = this.get(k);
        this.entries[k] = v;
        return o;
    };
    sap.ui2.srvc.Map.prototype.containsKey = function(k) {
        if (typeof k !== "string") {
            throw new sap.ui2.srvc.Error("Not a string key: " + k, "sap.ui2.srvc");
        }
        return Object.prototype.hasOwnProperty.call(this.entries, k);
    };
    sap.ui2.srvc.Map.prototype.get = function(k) {
        if (this.containsKey(k)) {
            return this.entries[k];
        }
    };
    sap.ui2.srvc.Map.prototype.keys = function() {
        return Object.keys(this.entries);
    };
    sap.ui2.srvc.Map.prototype.remove = function(k) {
        delete this.entries[k];
    };
    sap.ui2.srvc.Map.prototype.toString = function() {
        var r = ['sap.ui2.srvc.Map('];
        r.push(JSON.stringify(this.entries));
        r.push(')');
        return r.join('');
    };
    sap.ui2.srvc.get.clearCache();
} ()); (function() {
    "use strict";
    var S, l, a, u, b, I, c, H = 2;
    S = {
        AUTHENTICATED: 0,
        UNAUTHENTICATED: 1,
        PENDING: 2
    };
    a = ["xhrlogon", "xhrlogoncomplete", "xhrlogonfailed", "xhrlogonaborted"];
    b = XMLHttpRequest.logger;
    function d(e) {
        return (e >= 200 && e < 300) || (e === 304);
    }
    function f(e) {
        var i;
        i = document.createEvent("Event");
        i.initEvent(e, false, true);
        return i;
    }
    function g(e) {
        var i;
        if (u) {
            i = f(e);
        } else {
            try {
                i = new Event(e);
            } catch(k) {
                u = true;
                i = f(e);
            }
        }
        return i;
    }
    function p(e) {
        var i, k, n, x, y;
        i = /(?:,|^)\s*(\w+)\s*=\s*"((?:[^"\\]|\\.)*)"/g;
        y = {};
        k = i.exec(e);
        while (k !== null) {
            n = k[1];
            x = k[2].replace(/\\(.)/g, "$1");
            y[n] = x;
            k = i.exec(e);
        }
        return y;
    }
    function X(e, i, x) {
        this.channel = e;
        this.event = i;
        this.header = x;
    }
    function h() {
        this.p = [];
        this.r = [];
        this.f = [];
    }
    I = h.prototype;
    I.add = function(i) {
        switch (typeof i) {
        case "string":
            this.p.push(i);
            break;
        case "object":
            if (i instanceof RegExp) {
                this.r.push(i);
            } else {
                throw new TypeError("Unsupported ignore type");
            }
            break;
        case "function":
            this.f.push(i);
            break;
        default:
            throw new TypeError("Unsupported ignore type");
        }
    };
    I.ignored = function(i) {
        var e;
        e = this._prefix(i) || this._regexp(i) || this._function(i);
        return e;
    };
    I.clear = function() {
        this.p = [];
        this.r = [];
        this.f = [];
    };
    I._prefix = function(i) {
        var e, k, n, x;
        x = false;
        e = this.p;
        n = e.length;
        for (k = 0; k < n; ++k) {
            if (i.startsWith(e[k])) {
                x = true;
                break;
            }
        }
        return x;
    };
    I._regexp = function(i) {
        var e, k, n, x;
        x = false;
        e = this.r;
        n = e.length;
        for (k = 0; k < n; ++k) {
            if (e[k].test(i)) {
                x = true;
                break;
            }
        }
        return x;
    };
    I._function = function(i) {
        var e, k, n, x;
        x = false;
        e = this.f;
        n = e.length;
        for (k = 0; k < n; ++k) {
            try {
                if (e[k](i)) {
                    x = true;
                    break;
                }
            } catch(y) {}
        }
        return x;
    };
    function L(e) {
        if (l) {
            throw new Error("XHR Logon Manager already created");
        }
        b.info("Starting XHR Logon Manager");
        this.queue = [];
        this.realms = {};
        this.handlers = new XMLHttpRequest.EventHandlers(a);
        if (e) {
            this._filterFactory = e;
        }
        this._initializeTrustedOrigins();
        this._registerFilterFactory();
        window.addEventListener("message", this.getEventHandler());
    }
    L.prototype.triggerLogonOnSyncRequest = true;
    L.prototype.addEventListener = function(e, i) {
        this.handlers.add(e, i);
    };
    L.prototype.removeEventListener = function(e, i) {
        this.handlers.remove(e, i);
    };
    L.prototype.dispatchLogonEvent = function(e) {
        var i;
        i = g("xhrlogon");
        i.request = e;
        this.handlers.dispatch(i);
    };
    L.prototype.dispatchLogonCompletedEvent = function(x) {
        var e;
        e = g("xhrlogoncomplete");
        e.xhrLogon = x;
        this.handlers.dispatch(e);
    };
    L.prototype.dispatchLogonFailedEvent = function(x) {
        var e;
        e = g("xhrlogonfailed");
        e.xhrLogon = x;
        this.handlers.dispatch(e);
    };
    L.prototype.dispatchLogonAbortedEvent = function(e) {
        var i;
        i = g("xhrlogonaborted");
        i.realm = e;
        this.handlers.dispatch(i);
    };
    L.prototype.getRealmStatus = function(n) {
        var e;
        e = this.realms[n];
        if (e === undefined) {
            e = S.UNAUTHENTICATED;
            this.realms[n] = e;
        }
        return e;
    };
    L.prototype.onXHRLogon = function(e) {
        var i, k, n;
        b.info("Authentication requested for " + e.channel.url);
        if (this.handlers.hasSubscribers("xhrlogon")) {
            i = e.header.realm;
            if (this.pending) {
                b.debug("Pending authentication process, queueing request");
                if (this.getRealmStatus(i) === S.AUTHENTICATED) {
                    this.realms[i] = S.UNAUTHENTICATED;
                }
                this.queue.push(e);
            } else {
                b.debug("Dispatching authentication request");
                this.realms[i] = S.PENDING;
                this.pending = e;
                this.dispatchLogonEvent(e);
            }
        } else {
            b.info("No authentication handler registered");
            k = this.queue;
            this.queue = [];
            k.push(e);
            if (this.pending) {
                k.push(this.pending);
                this.pending = undefined;
            }
            this.abort(k);
        }
    };
    L.prototype.onXHRLogonCompleted = function(x) {
        var e, k, y, H1, I1, i, n;
        e = x.realm;
        y = this.queue;
        H1 = [];
        I1 = [];
        k = d(x.status);
        this.realms[e] = (k ? S.AUTHENTICATED: S.UNAUTHENTICATED);
        if (e === this.pending.header.realm) {
            H1.push(this.pending);
        } else {
            y.push(this.pending);
        }
        this.pending = undefined;
        n = y.length;
        for (i = 0; i < n; ++i) {
            if (y[i].header.realm === e) {
                H1.push(y[i]);
            } else {
                I1.push(y[i]);
            }
        }
        this.queue = I1;
        if (H1.length > 0) {
            if (k) {
                b.info("Authentication succeeded for realm " + e + ", repeating requests.");
                this.retry(H1);
            } else {
                b.warning("Authentication failed for realm " + e);
                this.abort(H1);
            }
        }
        if (k) {
            this.dispatchLogonCompletedEvent(x);
        } else {
            this.dispatchLogonFailedEvent(x);
        }
        if (this.queue.length > 0) {
            this.onXHRLogon(this.queue.shift());
        }
    };
    L.prototype.abortXHRLogon = function(e) {
        var k, x, y, i, n;
        e = e || this.pending.header.realm;
        k = this.queue;
        x = [];
        y = [];
        this.realms[e] = S.UNAUTHENTICATED;
        if (e === this.pending.header.realm) {
            x.push(this.pending);
        } else {
            k.push(this.pending);
        }
        this.pending = undefined;
        n = k.length;
        for (i = 0; i < n; ++i) {
            if (k[i].header.realm === e) {
                x.push(k[i]);
            } else {
                y.push(k[i]);
            }
        }
        this.queue = y;
        if (x.length > 0) {
            b.warning("Authentication aborted for realm " + e);
            this.abort(x);
        }
        this.dispatchLogonAbortedEvent(e);
        if (this.queue.length > 0) {
            this.onXHRLogon(this.queue.shift());
        }
    };
    L.prototype.retry = function(e) {
        var i, n, k, x;
        n = e.length;
        for (i = 0; i < n; ++i) {
            try {
                k = e[i].channel;
                if (k.async) {
                    x = k.xhr;
                    x.resumeEvents();
                    x.repeat();
                }
            } catch(y) {}
        }
    };
    L.prototype.abort = function(e) {
        var i, n, k, x;
        n = e.length;
        for (i = 0; i < n; ++i) {
            try {
                k = e[i].channel;
                if (k.async) {
                    x = k.xhr;
                    x.resumeEvents(true);
                }
            } catch(y) {}
        }
    };
    L.prototype.abortAll = function() {
        var e;
        e = this.queue;
        this.queue = [];
        if (this.pending) {
            e.push(this.pending);
            this.pending = undefined;
        }
        this.abort(e);
    };
    L.prototype.shutdown = function() {
        b.info("XHR Logon Manager shutdown");
        window.removeEventListener("message", this.getEventHandler());
        this.abortAll();
        this._unregisterFilterFactory();
    };
    L.prototype.handleEvent = function(e) {
        var i, x, k;
        x = /^\s*\{\s*"xhrLogon"/;
        i = e.data;
        if (x.test(i)) {
            try {
                if (this.isTrusted(e.origin)) {
                    k = JSON.parse(i);
                    this.onXHRLogonCompleted(k.xhrLogon);
                } else {
                    xhrLogon.warning("Received xhrlogon message from untrusted origin " + e.origin);
                }
            } catch(n) {
                b.warning("Invalid xhrLogon message: " + i);
            }
        }
    };
    L.prototype._initializeTrustedOrigins = function() {
        var e, i, k;
        k = {};
        e = window.location;
        i = e.protocol;
        k[i + "//" + e.host] = true;
        if (e.port === "") {
            switch (i) {
            case "http":
                k[i + "//" + e.host + ":80"] = true;
                break;
            case "https":
                k[i + "//" + e.host + ":443"] = true;
                break;
            }
        }
        this._trustedOrigins = k;
    };
    L.prototype.isTrusted = function(e) {
        return ( !! this._trustedOrigins[e]);
    };
    L.prototype.addTrustedOrigin = function(e) {
        this._trustedOrigins[e] = true;
    };
    L.prototype.getEventHandler = function() {
        var e, i;
        e = this._eventHandler;
        if (!e) {
            i = this;
            e = function(k) {
                i.handleEvent(k);
            };
            this._eventHandler = e;
        }
        return e;
    };
    L.prototype._getFilterFactory = function() {
        var e, i;
        e = this._filterFactory;
        if (!e) {
            i = this;
            e = function(k) {
                k.filters.push(new j(i, k));
            };
            this._filterFactory = e;
        }
        return e;
    };
    L.prototype._registerFilterFactory = function() {
        if (XMLHttpRequest.channelFactory) {
            XMLHttpRequest.channelFactory.addFilterFactory(this._getFilterFactory());
        }
    };
    L.prototype._unregisterFilterFactory = function() {
        if (XMLHttpRequest.channelFactory) {
            XMLHttpRequest.channelFactory.removeFilterFactory(this._getFilterFactory());
            delete this._filterFactory;
        }
    };
    L.prototype.createIgnoreList = function() {
        this.ignore = new h();
    };
    function j(e, i) {
        this.manager = e;
        this.channel = i;
        if (!this.manager.ignore || !this.manager.ignore.ignored(i.url)) {
            i.xhr._addEventListener("readystatechange", this);
        }
    }
    j.prototype.sending = function(e) {
        var x;
        if (this.manager.ignore && this.manager.ignore.ignored(e.url)) {
            return;
        }
        x = e.xhr;
        if (!x.getRequestHeader("X-XHR-Logon")) {
            x.setRequestHeader("X-XHR-Logon", "accept=\"iframe\"");
        }
        if (!x.getRequestHeader("X-Requested-With")) {
            x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        }
    };
    j.prototype.handleEvent = function(e) {
        var i, x, k, n, y;
        i = this.channel;
        x = i.xhr;
        if (x.readyState < H) {
            return;
        }
        if (x.readyState === H) {
            if (c === undefined) {
                try {
                    y = x.status;
                    c = !!y;
                } catch(H1) {
                    c = false;
                }
                if (!y) {
                    return;
                }
            } else if (!c) {
                return;
            }
        }
        x._removeEventListener("readystatechange", this);
        if (x.status === 403) {
            n = x.getResponseHeader("x-xhr-logon");
            if (n) {
                if (i.async) {
                    i.xhr.suspendEvents();
                }
                if (i.async || this.manager.triggerLogonOnSyncRequest) {
                    k = p(n);
                    this.manager.onXHRLogon(new X(i, e, k));
                }
            }
        }
    };
    var F, m;
    function D() {
        var e;
        function s() {
            if (document.body) {
                document.body.appendChild(e);
                document.removeEventListener("readystatechange", s);
            }
        }
        this.create = function() {
            e = document.createElement("iframe");
            e.id = "sap-ushell_abap-logon";
            e.style.display = "none";
            if (document.body) {
                document.body.appendChild(e);
            } else {
                document.addEventListener("readystatechange", s);
            }
            return e;
        };
        this.destroy = function() {
            if (e) {
                document.body.removeChild(e);
                e = undefined;
            }
        };
        this.show = function() {
            if (e) {
                e.style.display = "block";
                e.style.position = "absolute";
                e.style.top = 0;
                e.style.left = 0;
                e.style.width = "100%";
                e.style.height = "100%";
                e.style.zIndex = 9999;
                e.style.border = 0;
                e.style.background = "white";
            }
        };
    }
    function m(e) {
        var i, k;
        this.cancelXHRLogon = function() {
            e.abortXHRLogon();
        };
        this.handleEvent = function(n) {
            var x, y;
            function H1(I1) {
                return function() {
                    setTimeout(function() {
                        I1.show();
                    },
                    300);
                };
            }
            switch (n.type) {
            case "xhrlogon":
                if (k) {
                    sap.ui2.srvc.log.error("Ignoring concurrent xhrlogon event", n, "sap.ushell_abap.bootstrap.abap");
                    return;
                }
                k = i;
                y = n.request.channel.url.split("#", 1)[0];
                y += (y.indexOf("?") < 0) ? "?": "&";
                y += "xhr-logon=iframe";
                x = k.create();
                x.src = y;
                if (!x.onload) {
                    x.onload = H1(k);
                }
                break;
            case "xhrlogonaborted":
            case "xhrlogoncomplete":
            case "xhrlogonfailed":
                k.destroy();
                k = undefined;
                break;
            default:
                sap.ui2.srvc.log.warning("Ignoring unknown event", n, "sap.ushell_abap.bootstrap.abap");
            }
        };
        this.setLogonFrameProvider = function(n, x) {
            if (this.bLogonFrameProviderFinal) {
                return;
            }
            this.bLogonFrameProviderFinal = !!x;
            i = n;
        };
        e.addEventListener("xhrlogon", this);
        e.addEventListener("xhrlogonaborted", this);
        e.addEventListener("xhrlogoncomplete", this);
        e.addEventListener("xhrlogonfailed", this);
    }
    XMLHttpRequest.logger = sap.ui2.srvc.log;
    F = new m(new L());
    F.getInstance = function() {
        return F;
    };
    m = F;
    F.setLogonFrameProvider(new D());
    var u, o;
    o = {
        info: function(e) {
            if (XMLHttpRequest.logger && XMLHttpRequest.logger.info) {
                XMLHttpRequest.logger.info(e);
            }
        },
        warning: function(e) {
            if (XMLHttpRequest.logger && XMLHttpRequest.logger.warning) {
                XMLHttpRequest.logger.warning(e);
            }
        }
    };
    function f(e) {
        var i;
        i = document.createEvent("Event");
        i.initEvent(e, false, true);
        return i;
    }
    function g(e) {
        var i;
        if (u) {
            i = f(e);
        } else {
            try {
                i = new Event(e);
            } catch(k) {
                u = true;
                i = f(e);
            }
        }
        return i;
    }
    function q(e, i, k, n) {
        if (e.addEventListener) {
            e.addEventListener(i, k, n);
        } else if (e.attachEvent) {
            e.attachEvent("on" + i, k);
        }
    }
    function r(e) {
        this.provider = e;
    }
    r.frameCounter = 0;
    Object.defineProperty(r.prototype, 'src', {
        get: function() {
            return this.url;
        },
        set: function(e) {
            this.initialize(e);
        }
    });
    r.prototype.initialize = function(e) {
        var i, k = this;
        this.close();
        this.closed = false;
        this.url = e;
        this.createPollingFrame();
        q(this.frame, "load",
        function() {
            if (i) {
                clearTimeout(i);
            }
            i = setTimeout(function() {
                if (!k.window) {
                    k.createWindow();
                }
            },
            500);
        });
    };
    r.prototype.closeFrame = function() {
        if (this.frame) {
            document.body.removeChild(this.frame);
            this.frame = undefined;
        }
    };
    r.prototype.close = function() {
        try {
            this.closed = true;
            if (this.pollIntervalId) {
                clearInterval(this.pollIntervalId);
                this.pollIntervalId = undefined;
            }
            if (this.windowIntervalId) {
                clearInterval(this.windowIntervalId);
                this.windowIntervalId = undefined;
            }
            this.closeFrame();
            if (this.window) {
                setTimeout(function() {
                    window.focus();
                },
                100);
                this.window.close();
                this.window = undefined;
            }
        } catch(e) {
            o.warning("Error while closing logon window: " + e.message);
        }
    };
    r.prototype.cancelLogon = function() {
        if (!this.closed) {
            o.warning("XHR Logon cancelled");
            this.close();
            m.getInstance().cancelXHRLogon();
        }
    };
    function s() {
        if (document.body) {
            document.body.appendChild(this.frame);
            document.removeEventListener("readystatechange", s);
        }
    }
    r.prototype.createPollingFrame = function() {
        var e, i;
        r.frameCounter += 1;
        i = "xhrLogonFrame" + r.frameCounter;
        e = document.createElement("iframe");
        e.id = i;
        e.style.display = "none";
        this.frame = e;
        e.src = this.url;
        if (document.body) {
            document.body.appendChild(e);
        } else {
            document.addEventListener("readystatechange", s.bind(this));
        }
    };
    r.prototype.onWindowOpenFailed = function() {
        o.warning("Failed to open logon window");
        this.provider.dispatchWindowFailedEvent();
        this.cancelLogon();
    };
    r.prototype.createWindow = function() {
        var e, i = this;
        e = window.open(this.url);
        if (!e) {
            return this.onWindowOpenFailed();
        }
        this.window = e;
        q(e, "load",
        function() {
            o.info("Logon window opened");
            if (i.windowTimeout) {
                clearTimeout(i.windowTimeout);
            }
            if (i.pollIntervalId) {
                clearInterval(i.pollIntervalId);
            }
            i.pollIntervalId = setInterval(function() {
                i.poll();
            },
            3000);
            if (!i.windowIntervalId) {
                i.windowIntervalId = setInterval(function() {
                    var e = i.window;
                    try {
                        if (!e || e.closed) {
                            i.cancelLogon();
                        } else if (typeof e.notifyParent === "function") {
                            i.poll();
                        }
                    } catch(k) {
                        o.warning("Logon polling failed: " + k.message);
                    }
                },
                300);
            }
            setTimeout(function() {
                i.poll();
            },
            300);
        });
        q(e, "close",
        function() {
            i.cancelLogon();
        });
        setTimeout(function() {
            try {
                if (i.window) {
                    i.window.focus();
                }
            } catch(k) {
                o.warn("Failed to switch focus to logon window");
            }
        },
        300);
        this.windowTimeout = setTimeout(function() {
            i.onWindowOpenFailed();
        },
        5000);
    };
    r.prototype.poll = function() {
        if (this.window && this.window.closed) {
            this.cancelLogon();
        } else {
            this.closeFrame();
            this.createPollingFrame();
        }
    };
    function A() {
        this.handlers = new XMLHttpRequest.EventHandlers(["windowfailed"]);
    }
    A.prototype.create = function() {
        this.frameProxy = new r(this);
        return this.frameProxy;
    };
    A.prototype.destroy = function() {
        if (this.frameProxy) {
            this.frameProxy.close();
            this.frameProxy = undefined;
        }
    };
    A.prototype.show = function() {};
    A.prototype.addEventListener = function(e, i) {
        this.handlers.add(e, i);
    };
    A.prototype.removeEventListener = function(e, i) {
        this.handlers.remove(e, i);
    };
    A.prototype.dispatchWindowFailedEvent = function() {
        var e = this,
        i = g("windowfailed");
        setTimeout(function() {
            e.handlers.dispatch(i);
        },
        0);
    };
    sap.ushell_abap = sap.ushell_abap || {};
    sap.ushell_abap.bootstrap = sap.ushell_abap.bootstrap || {};
    var P = "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/" + "PageSets('%2FUI2%2FFiori2LaunchpadHome')?$expand=Pages/" + "PageChipInstances/Chip/ChipBags/ChipProperties,Pages/PageChipInstances/" + "RemoteCatalog,Pages/PageChipInstances/ChipInstanceBags/" + "ChipInstanceProperties,AssignedPages,DefaultPage",
    t = "/sap/opu/odata/UI2/INTEROP",
    T = "TargetMappings",
    v = false,
    N = false,
    w, z, B, C, E, G, J, K, U, M, O, Q;
    function R(i) {
        if (i === undefined) {
            return undefined;
        }
        try {
            return JSON.parse(JSON.stringify(i));
        } catch(e) {
            sap.ui2.srvc.log.error("Could not clone object", null, "sap.ushell_abap.bootstrap");
            return undefined;
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function V() {
        return location.href;
    }
    function W(e, i) {
        var k = i || sap.ui2.srvc.getParameterMap();
        return k[e] && k[e][0];
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function Y() {
        var i, e, k = V(),
        n = k.indexOf("#");
        if (n < 0) {
            return "";
        }
        e = decodeURI(k.slice(n + 1));
        i = e.indexOf("&/");
        return i < 0 ? e: e.slice(0, i);
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function Z(n) {
        N = n;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function $(n) {
        v = n;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function _(e) {
        var i = sap.ui.getCore(),
        k = i.getConfiguration(),
        n = k.getFormatSettings();
        sap.ui2.srvc.log.debug("setSapui5Settings()", JSON.stringify(e), "sap.ushell_abap.bootstrap.abap");
        if (e.language) {
            k.setLanguage(e.language);
        }
        if (e.legacyDateFormat) {
            n.setLegacyDateFormat(e.legacyDateFormat);
        }
        if (e.legacyDateCalendarCustomizing) {
            n.setLegacyDateCalendarCustomizing(e.legacyDateCalendarCustomizing);
        }
        if (e.legacyNumberFormat) {
            n.setLegacyNumberFormat(e.legacyNumberFormat);
        }
        if (e.legacyTimeFormat) {
            n.setLegacyTimeFormat(e.legacyTimeFormat);
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function a1(e, n) {
        function H1(e, n) {
            var I1, J1, K1, i, L1;
            if (typeof n !== "object") {
                return;
            }
            function M1(x, y) {
                var P1 = {},
                i, k, Q1;
                for (i = x.length - 1; i >= 0; i = i - 1) {
                    P1[x[i]] = x[i];
                }
                for (i = y.length - 1; i >= 0; i = i - 1) {
                    P1[y[i]] = y[i];
                }
                Q1 = [];
                for (k in P1) {
                    if (P1.hasOwnProperty(k)) {
                        Q1.push(P1[k]);
                    }
                }
                return Q1.sort();
            }
            function N1(k) {
                return (typeof k === "object") && !sap.ui2.srvc.isArray(k);
            }
            function O1(k, x, L1) {
                if (!Object.hasOwnProperty.call(x, L1)) {
                    return;
                }
                if (N1(k[L1]) && N1(x[L1])) {
                    H1(k[L1], x[L1]);
                } else {
                    k[L1] = x[L1];
                }
            }
            I1 = Object.getOwnPropertyNames(e);
            J1 = Object.getOwnPropertyNames(n);
            K1 = M1(I1, J1);
            for (i = 0; i < K1.length; i = i + 1) {
                L1 = K1[i];
                O1(e, n, L1);
            }
        }
        if (typeof n !== "object") {
            return;
        }
        H1(e, JSON.parse(JSON.stringify(n)));
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function b1(e) {
        var i = W("sap-ushell-reload"),
        k;
        if (i) {
            if (i === "X" || i === "true") {
                k = true;
            } else {
                k = false;
            }
        }
        if (k !== undefined) {
            jQuery.sap.getObject("services.ShellNavigation.config", 0, e).reload = k;
        }
    }
    function c1(e) {}
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function d1(e) {
        jQuery.sap.getObject("sap-ushell-config.services.Container.adapter.config", 0).bootTheme = R(e);
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function e1(e) {
        if (!e) {
            sap.ui2.srvc.log.error("extractSystemThemeRoot: mandatory parameter oStartupServiceResult not supplied");
        }
        if (e.themeRoot) {
            return e.themeRoot;
        }
        if (e.client) {
            sap.ui2.srvc.log.warning("Theme root was not contained in startup service result. A fallback to /sap/public/bc/themes/~client-<client number> is used", null, "sap.ushell_abap.bootstrap");
            return "/sap/public/bc/themes/~client-" + e.client;
        }
        sap.ui2.srvc.log.error("extractSystemThemeRoot: Could not determine system theme root");
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function f1(e) {
        var i, k;
        if (e && e.userProfile) {
            i = e.userProfile.filter(function(n) {
                return n.id === "THEME";
            });
            k = i.length ? i[0] : {};
            if (k.value) {
                return k.value;
            }
        }
        if (e && e.theme) {
            return e.theme;
        }
        return "";
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function g1(e, J) {
        if (e && e.indexOf("sap_") === 0) {
            return "";
        }
        return J;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function h1(e, J) {
        var i, k, n;
        i = f1(e);
        if (i.indexOf('@') > 0) {
            n = i.split('@', 2);
            i = n[0];
            k = n[1];
            return {
                theme: i,
                root: k
            };
        }
        k = g1(i, J);
        if (i) {
            return {
                theme: i,
                root: k
            };
        }
        return undefined;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function i1(J) {
        var e, i, k, n;
        e = W("sap-theme");
        if (e) {
            if (e.indexOf('@') > 0) {
                i = e.split('@', 2);
                k = i[0];
                n = i[1];
                return {
                    theme: k,
                    root: n
                };
            }
            k = e;
            n = g1(k, J);
            return {
                theme: k,
                root: n
            };
        }
        return undefined;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function j1() {
        if (sap.ui2.srvc.getParameterMap()['sap-theme']) {
            return true;
        }
        return false;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function k1(K, J) {
        var U, e = {},
        i;
        if (j1()) {
            U = i1(J);
            i = U;
            sap.ui2.srvc.log.debug("theme: URL theme = '" + i.theme + "' theme root = '" + i.root + "'", null, "sap.ushell_abap.bootstrap");
        } else if (K) {
            i = K;
            sap.ui2.srvc.log.debug("theme: startup service theme = '" + i.theme + "' theme root = '" + i.root + "'", null, "sap.ushell_abap.bootstrap");
            if (i.root) {
                sap.ui.getCore().applyTheme(i.theme, i.root + "/UI5/");
            } else {
                sap.ui.getCore().applyTheme(i.theme);
            }
        } else {
            e.theme = jQuery.sap.getObject("sap-ui-config.theme");
            if (e.theme) {
                e.root = jQuery.sap.getObject("sap-ui-config.themeRoots." + e.theme);
                if (!e.root) {
                    e.root = g1(e.theme, J);
                }
                i = {
                    theme: e.theme,
                    root: e.root
                };
                sap.ui2.srvc.log.debug("theme: html file theme = '" + i.theme + "' theme root = '" + i.root + "'", null, "sap.ushell_abap.bootstrap");
            } else {
                i = {
                    theme: "",
                    root: ""
                };
                sap.ui2.srvc.log.error("Could not determine theme", null, "sap.ushell_abap.bootstrap");
            }
        }
        d1(i);
        return i;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function l1(G) {
        var e = sap.ui2.srvc.getParameterMap(),
        i = W("sap-locale", e),
        k = {},
        n;
        jQuery.sap.getObject("sap-ushell-config.services.Container.adapter", 0).config = G;
        n = jQuery.sap.getObject("sap-ushell-config.services.SupportTicket.config", 0);
        if (n.enabled !== false) {
            n.enabled = (G.isEmbReportingActive === true);
        }
        n = jQuery.sap.getObject("sap-ushell-config.services.LaunchPage.adapter.config.services", 0);
        n.targetMappings = G.services && G.services.targetMappings;
        n = jQuery.sap.getObject("sap-ushell-config.services.Personalization.adapter.config.services", 0);
        n.personalization = G.services && G.services.personalization;
        n = jQuery.sap.getObject("sap-ushell-config.services.Personalization.config", 0);
        n.seed = G.seed;
        if (G.initialTarget && G.initialTarget.length > 0) {
            G.target = Y();
        }
        if (!i) {
            k = {
                language: G.languageBcp47 || G.language,
                legacyDateFormat: G.dateFormat,
                legacyDateCalendarCustomizing: G.tislcal,
                legacyNumberFormat: G.numberFormat === "" ? " ": G.numberFormat,
                legacyTimeFormat: G.timeFormat
            };
        }
        k1(K, J);
        _(k);
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function m1(e, i) {
        var k = sap.ui2.srvc.getFormFactor(),
        n = Y(),
        x = sap.ui2.srvc.getParameterMap(),
        y = "/sap/bc/ui2/start_up?";
        function H1(K1) {
            var L1 = x[K1];
            if (L1) {
                y += K1 + "=" + encodeURIComponent(L1[0]) + "&";
            }
        }
        function I1(n) {
            if (!n) {
                return false;
            }
            return (n.indexOf("Shell-runStandaloneApp") === 0) || (n.indexOf("Action-search") === 0);
        }
        function J1() {
            return window['sap-ushell_abap-bootstrap-abap-noInitialTarget'] !== undefined;
        }
        if (n) {
            Z(true);
            if (!I1(n) && !J1()) {
                y += "target=" + encodeURIComponent(n) + "&";
                if (k) {
                    y += "formFactor=" + encodeURIComponent(k) + "&";
                }
            }
        }
        H1("sap-language");
        H1("sap-client");
        sap.ui2.srvc.get(y + "shellType=FLP&depth=0", false,
        function(K1) {
            e(JSON.parse(K1));
        },
        i);
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function n1() {
        var e = window["sap-ushell-config"] && window["sap-ushell-config"].launchpadConfiguration && window["sap-ushell-config"].launchpadConfiguration.configurationFile,
        i = (e && e["sap-ushell-config-url"]) || (sap.ui2.srvc.getParameterMap()["sap-ushell-config-url"] && sap.ui2.srvc.getParameterMap()["sap-ushell-config-url"][0]),
        k;
        if (!i) {
            return undefined;
        }
        k = /^((.*)\/)?[A-Za-z0-9_]+\.json$/.exec(i);
        if (!k) {
            sap.ui2.srvc.log.error("URL for config file does not match restrictions. Url is:\"" + i + "\"", null, "sap.ushell_abap.bootstrap");
            return undefined;
        }
        if ((k[1] === undefined && e && e.configurationFileFolderWhitelist && e.configurationFileFolderWhitelist.hasOwnProperty("") && e.configurationFileFolderWhitelist[""]) || (e && e.configurationFileFolderWhitelist && e.configurationFileFolderWhitelist.hasOwnProperty(k[1]) && e.configurationFileFolderWhitelist[k[1]] === true)) {
            return i;
        }
        sap.ui2.srvc.log.error("URL for config file does not match restrictions. Url is:\"" + i + "\"", null, "sap.ushell_abap.bootstrap");
        return undefined;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function o1(i, k) {
        var n = n1();
        if (n) {
            sap.ui2.srvc.get(n, false,
            function(x) {
                var y;
                try {
                    y = JSON.parse(x);
                } catch(e) {
                    k("parse error in server config file '" + n + "' with content: '" + x + "'");
                    return;
                }
                i(y);
            },
            k);
        } else {
            sap.ui2.srvc.call(i.bind(null, {}), k);
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function p1(e) {
        if (N) {
            return undefined;
        }
        var i = new jQuery.Deferred();
        jQuery.sap.require("sap.ui.thirdparty.datajs");
        OData.read.$cache = OData.read.$cache || new sap.ui2.srvc.Map();
        OData.read.$cache.put(e, i.promise());
        return i;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function q1(e, i, k, n) {
        if (i === 200) {
            e.resolve(JSON.parse(n).d, k);
        } else {
            e.reject(n);
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function r1(e, i) {
        if (N) {
            return;
        }
        var x = new XMLHttpRequest();
        x.open("GET", e, true);
        x.setRequestHeader("X-CSRF-Token", "fetch");
        x.setRequestHeader("Accept", "application/json");
        x.onreadystatechange = function() {
            if (this.readyState !== 4) {
                return;
            }
            i(x.status, x.getResponseHeader("x-csrf-token"), x.responseText);
        };
        x.send();
    }
    function s1() {
        window['sap-ushell-core-ext-early'] = new jQuery.Deferred();
        jQuery.sap.includeScript("../../resources/sap/fiori/core-ext.js", undefined,
        function() {
            window['sap-ushell-core-ext-early'].resolve();
        });
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function t1() {
        if (!Q) {
            Q = new A();
        }
        return Q;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function u1() {
        window.setTimeout(function() {
            window.location.reload();
        },
        0);
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function v1() {
        var e = "Authentication required\n\nLogon window cannot be opened - ensure pop-ups are not blocked";
        window.alert(e);
        u1();
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function w1() {
        var e = "Authentication required",
        i = "Logon window cannot be opened - ensure pop-up windows are not blocked";
        if (jQuery.sap.isDeclared("sap.m.MessageBox", true)) {
            jQuery.sap.require("sap.m.MessageBox");
            if (jQuery.sap.isDeclared("sap.ushell.resources", true)) {
                jQuery.sap.require("sap.ushell.resources");
                e = sap.ushell.resources.i18n.getText("bootstrap.xhr.authenticationRequired");
                i = sap.ushell.resources.i18n.getText("bootstrap.xhr.windowOpenFailed");
            }
            sap.m.MessageBox.show(i, {
                icon: sap.m.MessageBox.Icon.ERROR,
                title: e,
                actions: [sap.m.MessageBox.Action.OK],
                onClose: u1.bind(this)
            });
        } else {
            v1();
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function x1(e, i, k, n) {
        var x = e && e.xhrLogon && e.xhrLogon.mode,
        y;
        if (x === "window") {
            y = t1();
            y.removeEventListener("windowfailed", n);
            y.addEventListener("windowfailed", k);
            i.setLogonFrameProvider(y, true);
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function y1(e, w, i) {
        l1(e);
        a1(window["sap-ushell-config"], w);
        b1(window["sap-ushell-config"]);
        c1(window["sap-ushell-config"]);
        jQuery.sap.declare("sap.ui2.srvc.utils");
        if (!window['sap-ui-debug']) {
            jQuery.sap.preloadModules('sap.ushell.library-preload', false);
            jQuery.sap.preloadModules('sap.ushell_abap.library-preload', false);
        }
        jQuery.sap.require("sap.ushell.services.Container");
        sap.ushell.bootstrap("abap", {
            abap: "sap.ushell_abap.adapters.abap",
            hana: "sap.ushell_abap.adapters.hana"
        }).done(function() {
            sap.ushell.Container.oFrameLogonManager = F;
            if (W("sap-ushell-core-ext-early")) {
                s1();
            }
        }).always(function() {
            if (window.f2p) {
                window.f2p.add(window.f2p.m.endShell);
            }
            i();
            x1(window["sap-ushell-config"], F, w1, v1);
        });
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function z1() {
        var e = jQuery.sap.registerModulePath;
        jQuery.sap.registerModulePath = function(i, k) {
            var n = sap.ui2.srvc.removeCBAndNormalizeUrl(k),
            x = sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig(n);
            e(i, x);
        };
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function A1(e) {
        var i, k, n = false;
        if (e.services) {
            if (e.services.targetMappings) {
                k = e.services.targetMappings;
            } else {
                k = {};
                e.services.targetMappings = k;
                n = true;
            }
        } else {
            k = {};
            e.services = {
                targetMappings: k
            };
            n = true;
        }
        if (!k.baseUrl || !k.relativeUrl) {
            k.baseUrl = t;
            e.services.targetMappings.baseUrl = t;
            e.services.targetMappings.relativeUrl = T;
            k.relativeUrl = T;
            n = true;
        }
        if (n) {
            sap.ui2.srvc.log.warning("URL for TargetMappings service not found in startup service result; fallback to default; cache invalidation might fail", null, "sap.ushell_abap.bootstrap");
        }
        i = k.baseUrl;
        if (k.baseUrl.lastIndexOf("/") !== k.baseUrl.length - 1) {
            i += "/";
        }
        i += k.relativeUrl;
        if (k.cacheId) {
            i += "?sap-cache-id=" + k.cacheId;
        }
        return i;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function B1() {
        if (v && O && w) {
            $(false);
            sap.ui2.srvc.log.debug("sync: point for startupResult, serverConfig and UI5 - executing ushell bootstrap", null, "sap.ushell_abap.bootstrap");
            C = p1(A1(G));
            y1(G, w, O);
            O = w = undefined;
        }
        if (z && B) {
            sap.ui2.srvc.log.debug("sync: point for pageSet request and UI5 - executing odata cache fill for page set request", null, "sap.ushell_abap.bootstrap");
            B.unshift(z);
            q1.apply(null, B);
            z = B = undefined;
        }
        if (C && E) {
            sap.ui2.srvc.log.debug("sync: point for target mappings request and UI5 - executing odata cache fill for target mappings", null, "sap.ushell_abap.bootstrap");
            E.unshift(C);
            q1.apply(null, E);
            C = E = undefined;
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function C1(e) {
        var i = ['ar', 'fa', 'he', 'iw'];
        e = e.toLowerCase().substring(0, 2);
        return i.indexOf(e) >= 0;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function D1() {
        var e = window.document.getElementById("sap-ushell-bootstrap"),
        i;
        if (e) {
            i = e.src.split('/').slice(0, -4).join('/');
        } else {
            sap.ui2.srvc.log.warning("Cannot determine bootstrap script path: no element with ID 'sap-ushell-bootstrap' found.", null, "sap.ushell_abap.bootstrap");
        }
        return i;
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function E1(K, e) {
        var i = e.languageBcp47 || '',
        k = C1(i),
        n,
        x,
        y,
        H1,
        I1;
        I1 = window.document.createElement('link');
        y = k ? "library-RTL.css": "library.css";
        if (K.theme.indexOf("sap_") === 0) {
            x = D1();
            if (x) {
                n = x + "/sap/fiori/themes/";
            }
        } else {
            n = K.root + "/UI5/sap/fiori/themes/";
        }
        if (n) {
            I1.setAttribute('href', n + K.theme + "/" + y);
            I1.setAttribute('rel', 'stylesheet');
            I1.setAttribute('id', 'sap-ui-theme-sap.fiori');
            window.document.head.appendChild(I1);
        }
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function F1() {
        if (window['sap-ushell_abap-bootstrap-abap-noOData']) {
            Z(true);
        }
        x1(window["sap-ushell-config"], F, v1);
        m1(function(e) {
            G = e;
            J = e1(G);
            K = h1(G, J);
            if (!j1() && K) {
                sap.ui2.srvc.log.debug("theme: load theme from startup service via window", null, "sap.ushell_abap.bootstrap");
                E1(K, G);
            }
            $(true);
            r1(A1(G),
            function(i, k, n) {
                E = Array.prototype.slice.call(arguments);
                B1();
            });
            B1();
        },
        function(e) {
            sap.ui2.srvc.log.error("start_up request failed: " + e, null, "sap.ushell_abap.bootstrap");
            G = {};
            $(true);
            B1();
        });
        r1(P,
        function(i, e, k) {
            B = Array.prototype.slice.call(arguments);
            B1();
        });
        o1(function(e) {
            w = e;
            B1();
        },
        function(e) {
            sap.ui2.srvc.log.error("Could not load server configuration: " + e, null, "sap.ushell_abap.bootstrap.abap");
            w = {};
            B1();
        });
    }
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function G1(e) {
        O = e;
        z1();
        z = p1(P);
        B1();
        XMLHttpRequest.logger = jQuery.sap.log.getLogger("sap.net.xhr");
    }
    if (window.f2p) {
        f2p.add(f2p.m.startShell);
    }
    F1();
    window['sap-ui-config'] = window['sap-ui-config'] || {};
    window['sap-ui-config']["xx-bootTask"] = G1;
} ());