/**
 * Created by Eli on 23-Feb-17.
 */

define(function (){

    /*
     Utils :: () -> {
        binarySearch
     }
     */

    return  {

        /*
         binarySearch :: (array: Array,
                          element: ArrayElement,
                          Sorter: ( (element1: ArrayElement, element2: ArrayElement) -> int/float )
         ) -> int

         Takes an array, an element, and a sorting function and returns the index where the element should fit in the
         array or where it is in the array.
         */
        binarySearch: function(array, element, compare){

            console.log("Entering a binary search");
            var l = 0; // left index of the search
            var r = array.length-1; // right index of the search
            var m = 0; // average of left and right
            var equivalence; // whether element is less than (<0), equal (==0), or greater than (>0) another element
            while (l < r) {
                m = Math.floor((l + r) >> 1);
                equivalence = compare(element, array[m]);
                if (equivalence == 0) {
                    return m; // the points are equivalent, so mid is already correct
                } else if (equivalence < 0) {
                    r = m; // if point is less than the checking point, set right = mid - 1
                    // if (r<=l) return m
                } else {
                    l = m + 1; // if point is more than the checking point, set left = mid + 1
                    // if (l>=r) return m + 1
                }
            }
            return m; // return the index the element is at (or should go)
        }



    }

});