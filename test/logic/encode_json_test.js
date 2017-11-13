import { renderComponent , expect } from '../test_helper';
import encodeJSON from '../../src/logic/encode_json';

describe('encode_json' , () => {

  it('encodes basic example', () => {
    const myArray = [1, 'a'];
    myArray[2] = myArray;
    let encoded = JSON.encodeCycles(myArray);
    expect(encoded).to.deep.equal([ 1, 'a', { '$ref': '$' } ]);
  });

  it('encodes primitives', () => {
    expect(JSON.encodeCycles(42)).to.equal(42);
    expect(JSON.encodeCycles(null)).to.equal(null);
    expect(JSON.encodeCycles('str')).to.equal('str');
    expect(JSON.encodeCycles(false)).to.equal(false);
    expect(JSON.encodeCycles(true)).to.equal(true);
  });

  it('encodes advanced example', () => {
    const myObj = { a: 1, b: 4 };
    myObj.c = myObj;
    myObj.d = { e: { f: myObj }};
    myObj.g = [1, 2, 3, 4, myObj.d.e];
    myObj.h = myObj.d;

    let expectedResult = {
      a: 1,
      b: 4,
      c: { '$ref': '$' },
      d: { e: { f: {"$ref": "$"} } },
      g: [ 1, 2, 3, 4, { '$ref': '$.d.e' } ],
      h: {
        "$ref": "$.d"
      }
    };

    expect(JSON.encodeCycles(myObj)).to.deep.equal(expectedResult);
  })
});
