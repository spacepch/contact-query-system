class HashTable {
    constructor(size) {
        this.size = size;
        this.table = new Array(size).fill(null);
    }

    // 创建一个数组索引，原理是用手机号码的长度模上整个哈希表的大小
    hash_function(key) {
        return parseInt(key) % this.size;
    }



    // 由于我们的手机号码长度与哈希表大小是固定的所以每创建一个数组索引都是一样的，
    // 因此出现了哈希冲突,解决哈希冲突的策略是二次探测（步长为i的平方）
    insert(employee) {
        let index = this.hash_function(employee.phone_number);
        if (this.table[index] === null) {
            this.table[index] = employee;
            console.log("存储成功！");
        } else {
            let i = 1;
            while (true) {
                let new_index = (index + i * i) % this.size;
                if (this.table[new_index] === null) {
                    this.table[new_index] = employee;
                    console.log("原地址已满，以分配新地址");
                    break;
                }
                i++;
                if (i === this.size) {
                    throw new Error('Hash table is full!');
                }
            }
        }
    }

    search(phone_number) {
        let index = this.hash_function(phone_number);
        if (this.table[index] !== null && this.table[index].phone_number === phone_number) {
            return this.table[index];
        } else {
            let i = 1;
            while (true) {
                let new_index = (index + i * i) % this.size;
                if (this.table[new_index] !== null && this.table[new_index].phone_number === phone_number) {
                    return this.table[new_index];
                }
                i++;
                if (i === this.size) {
                    return null;
                }
            }
        }
    }
}

export default HashTable;