'use strict'
encryptor = require 'encryptor'
dotty = require 'dotty'

setPassword = (password) ->
  encryptor.setPassword password

encryptBit = (bit) ->
  new Promise (resolve) ->
    type = Object.prototype.toString.call bit
    if type is '[object Array]'
      outArr = []
      for subBit in bit
        subBit = await encryptBit subBit
        outArr.push subBit
      resolve outArr
    else if type is '[object Object]'
      outObj = {}
      for key, subBit of bit
        outObj[key] = await encryptBit subBit
      resolve outObj
    else if type is '[object Number]'
      strBit = bit.toString()
      if strBit.indexOf('.') > -1
        resolve '+F' + await encryptor.encrypt bit.toString()
      else
        resolve '+I' + await encryptor.encrypt bit.toString()
    else if type is '[object Boolean]'
      resolve '+B' + await encryptor.encrypt bit.toString()
    else if type is '[object Date]'
      resolve '+D' + await encryptor.encrypt bit.toString()
    else if type is '[object String]'
      resolve await encryptor.encrypt bit
      
decryptBit = (bit) ->
  new Promise (resolve) ->
    type = Object.prototype.toString.call bit
    if type is '[object Array]'
      outArr = []
      for subBit in bit
        subBit = await decryptBit subBit
        outArr.push subBit
      resolve outArr
    else if type is '[object Object]'
      outObj = {}
      for key, subBit of bit
        outObj[key] = await decryptBit subBit
      resolve outObj
    else if type is '[object String]'
      if bit.indexOf('+') is 0
        switch bit[1]
          when 'I'
            resolve Number.parseInt await encryptor.decrypt bit.slice(2)
          when 'F'
            resolve Number.parseFloat await encryptor.decrypt bit.slice(2)
          when 'B'
            resolve (await encryptor.decrypt bit.slice(2)) is 'true'
          when 'D'
            resolve new Date await encryptor.decrypt bit.slice(2)
      else
        resolve await encryptor.decrypt bit

encryptObject = (obj, encryptFields) ->
  new Promise (resolve) ->
    for field in encryptFields
      val = dotty.get obj, field
      encrypted = await encryptBit val
      dotty.put obj, field, encrypted
    resolve obj
    
    
decryptObject = (obj, encryptFields) ->
  new Promise (resolve) ->
    for field in encryptFields
      val = dotty.get obj, field
      decrypted = await decryptBit val
      dotty.put obj, field, decrypted
    resolve obj

module.exports =
  setPassword: setPassword
  encrypt: encryptObject
  decrypt: decryptObject
