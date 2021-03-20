import { transform, isEqual, isArray, isObject } from 'lodash';

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
const difference = (origObj, newObj) => {
  function changes(newObj, origObj) {
    let arrayIndexCounter = 0
    return transform(newObj, function (result, value, key) {
      if (!isEqual(value, origObj[key])) {
        let resultKey = isArray(origObj) ? arrayIndexCounter++ : key
        result[resultKey] = (isObject(value) && isObject(origObj[key])) ? changes(value, origObj[key]) : value
      }
    })
  }
  return changes(newObj, origObj)
}

export default difference;