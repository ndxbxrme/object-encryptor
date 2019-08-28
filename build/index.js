(function() {
  'use strict';
  var decryptBit, decryptObject, dotty, encryptBit, encryptObject, encryptor, setPassword;

  encryptor = require('encryptor');

  dotty = require('dotty');

  setPassword = function(password) {
    return encryptor.setPassword(password);
  };

  encryptBit = function(bit) {
    return new Promise(async function(resolve) {
      var i, key, len, outArr, outObj, strBit, subBit, type;
      type = Object.prototype.toString.call(bit);
      if (type === '[object Array]') {
        outArr = [];
        for (i = 0, len = bit.length; i < len; i++) {
          subBit = bit[i];
          subBit = (await encryptBit(subBit));
          outArr.push(subBit);
        }
        return resolve(outArr);
      } else if (type === '[object Object]') {
        outObj = {};
        for (key in bit) {
          subBit = bit[key];
          outObj[key] = (await encryptBit(subBit));
        }
        return resolve(outObj);
      } else if (type === '[object Number]') {
        strBit = bit.toString();
        if (strBit.indexOf('.') > -1) {
          return resolve('+F' + (await encryptor.encrypt(bit.toString())));
        } else {
          return resolve('+I' + (await encryptor.encrypt(bit.toString())));
        }
      } else if (type === '[object Boolean]') {
        return resolve('+B' + (await encryptor.encrypt(bit.toString())));
      } else if (type === '[object Date]') {
        return resolve('+D' + (await encryptor.encrypt(bit.toString())));
      } else if (type === '[object String]') {
        return resolve((await encryptor.encrypt(bit)));
      }
    });
  };

  decryptBit = function(bit) {
    return new Promise(async function(resolve) {
      var i, key, len, outArr, outObj, subBit, type;
      type = Object.prototype.toString.call(bit);
      if (type === '[object Array]') {
        outArr = [];
        for (i = 0, len = bit.length; i < len; i++) {
          subBit = bit[i];
          subBit = (await decryptBit(subBit));
          outArr.push(subBit);
        }
        return resolve(outArr);
      } else if (type === '[object Object]') {
        outObj = {};
        for (key in bit) {
          subBit = bit[key];
          outObj[key] = (await decryptBit(subBit));
        }
        return resolve(outObj);
      } else if (type === '[object String]') {
        if (bit.indexOf('+') === 0) {
          switch (bit[1]) {
            case 'I':
              return resolve(Number.parseInt((await encryptor.decrypt(bit.slice(2)))));
            case 'F':
              return resolve(Number.parseFloat((await encryptor.decrypt(bit.slice(2)))));
            case 'B':
              return resolve(((await encryptor.decrypt(bit.slice(2)))) === 'true');
            case 'D':
              return resolve(new Date((await encryptor.decrypt(bit.slice(2)))));
          }
        } else {
          return resolve((await encryptor.decrypt(bit)));
        }
      }
    });
  };

  encryptObject = function(obj, encryptFields) {
    return new Promise(async function(resolve) {
      var encrypted, field, i, len, val;
      for (i = 0, len = encryptFields.length; i < len; i++) {
        field = encryptFields[i];
        val = dotty.get(obj, field);
        encrypted = (await encryptBit(val));
        dotty.put(obj, field, encrypted);
      }
      return resolve(obj);
    });
  };

  decryptObject = function(obj, encryptFields) {
    return new Promise(async function(resolve) {
      var decrypted, field, i, len, val;
      for (i = 0, len = encryptFields.length; i < len; i++) {
        field = encryptFields[i];
        val = dotty.get(obj, field);
        decrypted = (await decryptBit(val));
        dotty.put(obj, field, decrypted);
      }
      return resolve(obj);
    });
  };

  module.exports = {
    setPassword: setPassword,
    encrypt: encryptObject,
    decrypt: decryptObject
  };

}).call(this);

//# sourceMappingURL=index.js.map
