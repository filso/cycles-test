import { renderComponent , expect } from '../test_helper';
import encodeJSON from '../../src/logic/encode_json';

describe('encode_json' , () => {

  it('encodes basic example', () => {
    const myArray = [1, 'a'];
    myArray[2] = myArray;
    let encoded = JSON.encCycles(myArray);
    expect(encoded).to.deep.equal([ 1, 'a', { '$ref': '$' } ]);
  });

  it('encodes primitives', () => {
    expect(JSON.encCycles(42)).to.equal(42);
    expect(JSON.encCycles(null)).to.equal(null);
    expect(JSON.encCycles('str')).to.equal('str');
    expect(JSON.encCycles(false)).to.equal(false);
    expect(JSON.encCycles(true)).to.equal(true);
  });

  it('encodes advanced example', () => {
    const myObj = { a: 1, b: 4 };
    myObj.c = myObj;
    myObj.d = [5, 6, { e: { f: myObj }}];
    myObj.g = [1, 2, 3, 4, myObj.d[2]];
    myObj.h = myObj.d;

    let expectedResult = {
      a: 1,
      b: 4,
      c: { '$ref': '$' },
      d: [5, 6, { e: { f: {"$ref": "$"} } }],
      g: [ 1, 2, 3, 4, { '$ref': '$.d[2]' } ],
      h: {
        "$ref": "$.d"
      }
    };

    expect(JSON.encCycles(myObj)).to.deep.equal(expectedResult);
  })
});
