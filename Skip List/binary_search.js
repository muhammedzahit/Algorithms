// binary search deneme
let list = [1,2,3,4,5,6,7]

function binary_search(lower, upper, list, search) {
    if(upper < lower)
        return -1
    let mid = Math.floor((lower + upper) / 2)
    if(list[mid] == search)
        return mid
    if(list[mid] > search)
        return binary_search(lower, mid - 1, list, search)
    else
        return binary_search(mid + 1, upper, list, search)
}
 
console.log(binary_search(0, list.length - 1, list, 10))

export default binary_search