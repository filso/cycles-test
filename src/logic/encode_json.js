// This doesn't export anything, but modifies the global JSON object

function recursive(target, refs, path) {
  // If it's a primitve, just return
  if (target instanceof Array === false && target instanceof Object === false) {
    return target;
  }

  refs.push({
    target,
    path
  });

  // Clone the target, we assume it's either an array or an object
  let ret = target instanceof Array ? [] : {};
  for (let prop in target) {
    let a = target[prop];
    if (a instanceof Array || a instanceof Object) {
      let found = refs.find((ref) => ref.target === a);
      if (found) {
        // If found a reference to this object already
        ret[prop] = {'$ref': found.path};
      } else {
        // Otherwise run recursively
        let newPath = target instanceof Array ? `${path}[${prop}]` : `${path}.${prop}`;
        ret[prop] = recursive(target[prop], refs, newPath);
      }
    } else {
      ret[prop] = target[prop];
    }
  }
  return ret;
}

JSON.encCycles = (target) => {
  let refs = [];
  return recursive(target, refs, '$');
};