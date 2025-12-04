import isArray from '../utils/types/isArray';
/**
 * A reducer function to flatten an array by one level.
 * Can be used with `Array.prototype.reduce`.
 *
 * @param {Array} res - The accumulator array to store flattened elements.
 * @param {any} arr - The current element being processed, which can be an array or a single value.
 * 
 * @returns {Array} - The flattened array with `arr` merged into `res`.
 *
 * @example
 * const flattened = [[1, 2], [3, 4]].reduce(FLATTEN, []);
 * console.log(flattened); // [1, 2, 3, 4]
 */
export function FLATTEN(res = [], arr) {
    return Array.isArray(arr) ? res.concat(arr) : (res.push(arr), res);
}

/**
 * Flattens an array to a specified depth. If no depth is specified, it flattens the array completely.
 *
 * @param {Array} arr - The array to be flattened. Can contain nested arrays at various depths.
 * @param {number} [level] - The maximum depth to flatten. If omitted, the array will be fully flattened.
 * 
 * @returns {Array} - A new flattened array.
 *
 * @throws {TypeError} - Throws an error if `arr` is not an array.
 *
 * @example
 * const result = flatten([1, [2, [3, [4]]]], 1);
 * console.log(result); // [1, 2, [3, [4]]]
 *
 * @example
 * const result = flatten([1, [2, [3, [4]]]]);
 * console.log(result); // [1, 2, 3, 4]
 */
export function flatten(arr, level) {
    if (!Array.isArray(arr)) {
        throw new TypeError('Invalid argument, Please pass a valid array.');
    }

    const result = [];
    if (level === undefined) {
        return recursiveFlatten(arr, result);
    } else {
        return recursiveFlattenWithDepth(arr, result, level);
    }
}

/**
 * Recursively flattens an array completely.
 *
 * @param {Array} arr - The array to be flattened.
 * @param {Array} result - The accumulator array for flattened elements.
 * 
 * @returns {Array} - The completely flattened array.
 */
function recursiveFlatten(arr, result) {
    for (const item of arr) {
        if (Array.isArray(item)) {
            recursiveFlatten(item, result);
        } else {
            result.push(item);
        }
    }
    return result;
}

/**
 * Recursively flattens an array to a specified depth.
 *
 * @param {Array} arr - The array to be flattened.
 * @param {Array} result - The accumulator array for flattened elements.
 * @param {number} level - The depth to which the array should be flattened.
 * 
 * @returns {Array} - The array flattened to the specified depth.
 */
function recursiveFlattenWithDepth(arr, result, level) {
    for (const item of arr) {
        if (Array.isArray(item) && level > 0) {
            recursiveFlattenWithDepth(item, result, level - 1);
        } else {
            result.push(item);
        }
    }
    return result;
}



