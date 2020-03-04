
import intersectL from './intersectL';
/**
 * intersection of a list of sets (sorted arrays)
 * Intersects list sorted array sets (array that issorted and has no duplicates)
 * @param  {[Array]]} sortedL Array of sorted array representing a set (no duplicated)
 * @return {[Array]}         sorted array with no duplicates (a set)
 */
export default function intersect(sortedL/*list od sets*/) {
	return intersectL(Array.prototype.slice.call(arguments));
}

