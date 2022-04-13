import binary_search from "./binary_search.js"
 
 // skip list
const LEVEL_PROBABILITY = 0.5
class node{
    constructor(value){
        this.value = value
        this.next = null
        this.prev = null
    }
}

class linked_list{
    constructor(){
        this.head = null
        this.last = null
    }

    add(value){
        if(this.head == null){
            this.head = new node(value)
            this.last = this.head
        }        
        else{
            this.last.next = new node(value)
            this.last.next.prev = this.last
            this.last = this.last.next
        }
    }

    delete_node(delete_node){
        let current_node = this.head
        let prev_node = null
        while(current_node){
            if(delete_node == current_node && prev_node == null){
                this.head = current_node.next
                this.head.prev = null
                return
            }
            else if(delete_node == current_node){
                prev_node.next = current_node.next
                current_node.prev = prev_node
                return
            }
            prev_node = current_node
            current_node = current_node.next
        }
    }

    delete(value){
        let current = this.head
        while (current){
            if(current.value == value){
                this.delete_node(current)
            }
        }
    }
}

class skip_list extends linked_list{
    constructor(){
        super()
        this.size = 0
        this.level_size = 0
    }
    add(value, probability = LEVEL_PROBABILITY){
        super.add(value)
        this.size += 1
        if(Math.floor(Math.log2(this.size)) > this.level_size){
            this.level_size += 1
        }
        this.add_level(this.last, probability)
    }

    find_level_prev(val, level_index){
        let current_node = this.head
        let prev_node = null
        while(current_node){
            if(current_node.levels && current_node.levels[level_index]){
                prev_node = current_node
            }
            current_node = current_node.next
        }
        return prev_node
    }

    add_level(current_node, probability) {
        if(!current_node.levels)
                current_node.levels = {}
            
        let level_index = 1
        while(Math.random() > probability && level_index <= this.level_size){
            

            let prev_node = this.find_level_prev(current_node.value, level_index)
            if(prev_node)
                console.log(prev_node.value, current_node.value)

            current_node.levels[level_index] = new node(current_node.value)
            current_node.levels[level_index].base = current_node

            if(prev_node){
                prev_node.levels[level_index].next = current_node.levels[level_index]
                current_node.levels[level_index].prev = prev_node.levels[level_index]
            }
           
            level_index += 1
        }
    }

    delete(value){
        super.delete(value)
        this.size -= 1
        if(Math.floor(Math.log(this.size)) < this.level_size){
            this.level_size -= 1
            this.delete_level()
        }
    }

    delete_level(){
        let current_node = this.head
        let prev_node = null

        while(current_node){
            if(current_node.levels[this.level_size]){
                current_node.levels.delete(this.level_size + 1)
            }
        }
    }

    print_nodes(){
        let current_node = this.head
        let prints = ""
        while(current_node){
            prints += `VALUE : ${current_node.value}\n`

            if(current_node.levels){
                for(var i = 0; i < this.level_size; i++){
                    if(current_node.levels[i]){
                        prints += `LEVEL ${i} : ${current_node.levels[i].base.value}\n`
                        if(current_node.levels[i].next)
                            prints += `LEVEL ${i} NEXT : ${current_node.levels[i].next.value}\n`
                    }
                }
            }

            current_node = current_node.next
            prints += "-----------------------\n\n"
        }
        return prints
    }

    find_number(number){
        let current_node = this.last

        let level_index = this.level_size
        let prev = null
        while(current_node && level_index != 0){
            prev = null
            if(current_node.levels[level_index].prev)
                prev = current_node.levels[level_index].prev.base

            if(!prev){
                prev = this.head
                if(number <= current_node.value && number >= prev.value){
                    level_index -= 1
                    continue
                }
                else
                    return null
            }
            else{
                if(number <= current_node.value && number >= prev.value){
                    level_index -= 1
                    continue
                }
                else
                    current_node = prev
            }

        }
        
        console.log(current_node.value, prev.value, number)

        if(!current_node)
            return null

        if(prev.value == number)
            return prev

        while(current_node && current_node != prev){
            if(current_node.value == number){
                return current_node
            }
            current_node = current_node.prev
        }

        return null
        
    }

}

function compare(number){
    console.time("skip list")
    if(skip_list_ex.find_number(number))
        console.log("bulundu")
    else
        console.log("bulunamadi")
    console.timeEnd("skip list")

    console.time("binary_search")
    if(binary_search(0, list.length-1,list, number))
        console.log("bulundu")
    else
        console.log("bulunamadi")
    console.timeEnd("binary_search")
}

let list = []
for (let i = 0; i < 10000; i++){
    list.push(Math.floor(Math.random() * 10001))
}
list.sort(function(a, b){return a-b})



let skip_list_ex = new skip_list()
for(let i = 0; i < list.length-1; i++){
    skip_list_ex.add(list[i])
}
skip_list_ex.add(list[list.length-1], 0)

//console.log(skip_list_ex.print_nodes())

compare(list[2000])
compare(list[4000])
compare(list[6000])
compare(list[8000])



