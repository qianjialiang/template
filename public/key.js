
function fSm4() {
  function c(t) {
    for (var e = [], n = 0, r = t.length; n < r; n += 2)
      e.push(parseInt(t.substr(n, 2), 16));
    return e
  }
  function f(t) {
    return t.map((function (t) {
      return t = t.toString(16),
        1 === t.length ? "0" + t : t
    }
    )).join("")
  }
  function l(t) {
    for (var e = [], n = 0, r = t.length; n < r; n++) {
      var i = t.codePointAt(n);
      if (i <= 127)
        e.push(i);
      else if (i <= 2047)
        e.push(192 | i >>> 6),
          e.push(128 | 63 & i);
      else if (i <= 55295 || i >= 57344 && i <= 65535)
        e.push(224 | i >>> 12),
          e.push(128 | i >>> 6 & 63),
          e.push(128 | 63 & i);
      else {
        if (!(i >= 65536 && i <= 1114111))
          throw e.push(i),
          new Error("input is not supported");
        n++,
          e.push(240 | i >>> 18 & 28),
          e.push(128 | i >>> 12 & 63),
          e.push(128 | i >>> 6 & 63),
          e.push(128 | 63 & i)
      }
    }
    return e
  }
  function h(t) {
    for (var e = [], n = 0, r = t.length; n < r; n++)
      t[n] >= 240 && t[n] <= 247 ? (e.push(String.fromCodePoint(((7 & t[n]) << 18) + ((63 & t[n + 1]) << 12) + ((63 & t[n + 2]) << 6) + (63 & t[n + 3]))),
        n += 3) : t[n] >= 224 && t[n] <= 239 ? (e.push(String.fromCodePoint(((15 & t[n]) << 12) + ((63 & t[n + 1]) << 6) + (63 & t[n + 2]))),
          n += 2) : t[n] >= 192 && t[n] <= 223 ? (e.push(String.fromCodePoint(((31 & t[n]) << 6) + (63 & t[n + 1]))),
            n++) : e.push(String.fromCodePoint(t[n]));
    return e.join("")
  }
  function d(t, e) {
    return t << e | t >>> 32 - e
  }
  function p(t) {
    return (255 & s[t >>> 24 & 255]) << 24 | (255 & s[t >>> 16 & 255]) << 16 | (255 & s[t >>> 8 & 255]) << 8 | 255 & s[255 & t]
  }
  function v(t) {
    return t ^ d(t, 2) ^ d(t, 10) ^ d(t, 18) ^ d(t, 24)
  }
  function y(t) {
    return t ^ d(t, 13) ^ d(t, 23)
  }
  function g(t, e, n) {
    for (var r = new Array(4), i = new Array(4), o = 0; o < 4; o++)
      i[0] = 255 & t[0 + 4 * o],
        i[1] = 255 & t[1 + 4 * o],
        i[2] = 255 & t[2 + 4 * o],
        i[3] = 255 & t[3 + 4 * o],
        r[o] = i[0] << 24 | i[1] << 16 | i[2] << 8 | i[3];
    for (var a, s = 0; s < 32; s += 4)
      a = r[1] ^ r[2] ^ r[3] ^ n[s + 0],
        r[0] ^= v(p(a)),
        a = r[2] ^ r[3] ^ r[0] ^ n[s + 1],
        r[1] ^= v(p(a)),
        a = r[3] ^ r[0] ^ r[1] ^ n[s + 2],
        r[2] ^= v(p(a)),
        a = r[0] ^ r[1] ^ r[2] ^ n[s + 3],
        r[3] ^= v(p(a));
    for (var u = 0; u < 16; u += 4)
      e[u] = r[3 - u / 4] >>> 24 & 255,
        e[u + 1] = r[3 - u / 4] >>> 16 & 255,
        e[u + 2] = r[3 - u / 4] >>> 8 & 255,
        e[u + 3] = 255 & r[3 - u / 4]
  }
  function m(t, e, n) {
    for (var r = new Array(4), o = new Array(4), a = 0; a < 4; a++)
      o[0] = 255 & t[0 + 4 * a],
        o[1] = 255 & t[1 + 4 * a],
        o[2] = 255 & t[2 + 4 * a],
        o[3] = 255 & t[3 + 4 * a],
        r[a] = o[0] << 24 | o[1] << 16 | o[2] << 8 | o[3];
    r[0] ^= 2746333894,
      r[1] ^= 1453994832,
      r[2] ^= 1736282519,
      r[3] ^= 2993693404;
    for (var s, c = 0; c < 32; c += 4)
      s = r[1] ^ r[2] ^ r[3] ^ u[c + 0],
        e[c + 0] = r[0] ^= y(p(s)),
        s = r[2] ^ r[3] ^ r[0] ^ u[c + 1],
        e[c + 1] = r[1] ^= y(p(s)),
        s = r[3] ^ r[0] ^ r[1] ^ u[c + 2],
        e[c + 2] = r[2] ^= y(p(s)),
        s = r[0] ^ r[1] ^ r[2] ^ u[c + 3],
        e[c + 3] = r[3] ^= y(p(s));
    if (n === i)
      for (var f, l = 0; l < 16; l++)
        f = e[l],
          e[l] = e[31 - l],
          e[31 - l] = f
  }
  function b(t, e, n) {
    var s = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}
      , u = s.padding
      , d = void 0 === u ? "pkcs#5" : u
      , p = (s.mode,
        s.output)
      , v = void 0 === p ? "string" : p;
    if ("string" === typeof e && (e = c(e)),
      16 !== e.length)
      throw new Error("key is invalid");
    if (t = "string" === typeof t ? n !== i ? l(t) : c(t) : r(t),
      "pkcs#5" === d && n !== i)
      for (var y = a - t.length % a, b = 0; b < y; b++)
        t.push(y);
    var _ = new Array(o);
    m(e, _, n);
    var w = []
      , x = t.length
      , k = 0;
    while (x >= a) {
      var A = t.slice(k, k + 16)
        , E = new Array(16);
      g(A, E, _);
      for (var S = 0; S < a; S++)
        w[k + S] = E[S];
      x -= a,
        k += a
    }
    if ("pkcs#5" === d && n === i) {
      var O = w[w.length - 1];
      w.splice(w.length - O, O)
    }
    return "array" !== v ? n !== i ? f(w) : h(w) : w
  }
  var i = 0
    , o = 32
    , a = 16
    , s = [214, 144, 233, 254, 204, 225, 61, 183, 22, 182, 20, 194, 40, 251, 44, 5, 43, 103, 154, 118, 42, 190, 4, 195, 170, 68, 19, 38, 73, 134, 6, 153, 156, 66, 80, 244, 145, 239, 152, 122, 51, 84, 11, 67, 237, 207, 172, 98, 228, 179, 28, 169, 201, 8, 232, 149, 128, 223, 148, 250, 117, 143, 63, 166, 71, 7, 167, 252, 243, 115, 23, 186, 131, 89, 60, 25, 230, 133, 79, 168, 104, 107, 129, 178, 113, 100, 218, 139, 248, 235, 15, 75, 112, 86, 157, 53, 30, 36, 14, 94, 99, 88, 209, 162, 37, 34, 124, 59, 1, 33, 120, 135, 212, 0, 70, 87, 159, 211, 39, 82, 76, 54, 2, 231, 160, 196, 200, 158, 234, 191, 138, 210, 64, 199, 56, 181, 163, 247, 242, 206, 249, 97, 21, 161, 224, 174, 93, 164, 155, 52, 26, 85, 173, 147, 50, 48, 245, 140, 177, 227, 29, 246, 226, 46, 130, 102, 202, 96, 192, 41, 35, 171, 13, 83, 78, 111, 213, 219, 55, 69, 222, 253, 142, 47, 3, 255, 106, 114, 109, 108, 91, 81, 141, 27, 175, 146, 187, 221, 188, 127, 17, 217, 92, 65, 31, 16, 90, 216, 10, 193, 49, 136, 165, 205, 123, 189, 45, 116, 208, 18, 184, 229, 180, 176, 137, 105, 151, 74, 12, 150, 119, 126, 101, 185, 241, 9, 197, 110, 198, 132, 24, 240, 125, 236, 58, 220, 77, 32, 121, 238, 95, 62, 215, 203, 57, 72]
    , u = [462357, 472066609, 943670861, 1415275113, 1886879365, 2358483617, 2830087869, 3301692121, 3773296373, 4228057617, 404694573, 876298825, 1347903077, 1819507329, 2291111581, 2762715833, 3234320085, 3705924337, 4177462797, 337322537, 808926789, 1280531041, 1752135293, 2223739545, 2695343797, 3166948049, 3638552301, 4110090761, 269950501, 741554753, 1213159005, 1684763257];
    oKey.sm4 = {
    encrypt: function (e, t, n) {
      return b(e, t, 1, n)
    },
    decrypt: function (e, t, n) {
      return b(e, t, 0, n)
    }
  }
}


var oKey = {
  // 1 四川 2 浙江
  type: 1,
  newKey: () => {
    function r(e, t) {
      var n, a, i = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), r = [];
      if (t = t || i.length,
        e)
        for (n = 0; n < e; n++)
          r[n] = i[0 | Math.random() * t];
      else
        for (r[8] = r[13] = r[18] = r[23] = "-",
          r[14] = "4",
          n = 0; n < 36; n++)
          r[n] || (a = 0 | 16 * Math.random(),
            r[n] = i[19 == n ? 3 & a | 8 : a]);
      return r.join("")
    }
    
    return r(16, 61)
  },

  keyFilter:(e) => {
    for (var t = "", n = 0; n < e.length; n++)
      "" === t ? t = e.charCodeAt(n).toString(16) : t += e.charCodeAt(n).toString(16)
    return t
  },

  // 四川
  client_id: '7ede9cef518555089c0e890ae17e5ce1',
  redirect_uri: 'https://etax.sichuan.chinatax.gov.cn/login-web/api/third/sso/login/redirect?qd=KEXIN&channelId=web&goto=30010666',
}

if (oKey.type === 2) {
  oKey.client_id = 'xdf6a5cd4cx74bfca46x3bbfcxa4c4xf'
  oKey.redirect_uri = 'https://etax.zhejiang.chinatax.gov.cn/zjgfdzswj/main/kx/skip.html?service=https://etax.zhejiang.chinatax.gov.cn/zjgfdzswj/main/home/wdxx/index.html'
}

fSm4()

// console.log(sm4.encrypt(JSON.stringify(obj), uu(key)))
// console.log(sm4.decrypt('5e6587f489e846d1830b478249b78db31f866d4717aeeaa13c6623d005d93525', uu(key)))