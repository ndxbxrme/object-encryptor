(function() {
  'use strict';
  var encryptFields, encryptor, main, testObj;

  encryptor = require('../index.js');

  testObj = {
    pets: ['maggie', 'buddy'],
    noPets: 2,
    pi: 3.14,
    adate: new Date(),
    maggie: 'cat',
    buddy: 'dog',
    thing: {
      subthing: {
        subsubthing: 'ham'
      },
      asubthing: 'boom'
    }
  };

  encryptFields = ['pets', 'noPets', 'adate', 'pi'];

  main = async function() {
    var decrypted, encrypted;
    encryptor.setPassword('bam');
    encrypted = (await encryptor.encrypt(testObj, encryptFields));
    console.log(encrypted);
    decrypted = (await encryptor.decrypt(encrypted, encryptFields));
    return console.log(decrypted);
  };

  main();

}).call(this);

//# sourceMappingURL=test.js.map
