import fsPromises from 'fs/promises';
import fs from 'fs'
import { fileURLToPath } from 'url';
import path, { join, dirname } from 'path';
import HashTable from './HashTable.js';
import Employee from './Employee.js';
import express from 'express';



const app = express();
app.use(express.json()); // 用于解析 application/json 类型的请求体
app.all("*", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', ['mytoken', 'Content-Type']);
    next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const contactsPath = path.resolve(__dirname, './contacts.dat');

app.use('/', (req, res, next) => {
    console.log('界面传送中...');
    next();
}, express.static(join(__dirname, 'vue')));

async function save_contacts(hashTable) {
    await fsPromises.writeFile(contactsPath, JSON.stringify(hashTable.table));
}

async function load_contacts() {
    const data = await fsPromises.readFile(contactsPath, { encoding: 'utf-8' });
    const tableData = JSON.parse(data);
    let hashTable = new HashTable(tableData.length);
    hashTable.table = tableData.map(each => each !== null ? new Employee(each.phone_number, each.name, each.address) : null);
    return hashTable;
}

// 获取表的内容
app.get('/contacts', async (_, res) => {
    console.log("收到请求");
    const hashTable = await load_contacts();
    res.status(200).json(hashTable.table);
});

// 插入新的记录
app.get('/insert', async (req, res) => {
    console.log("收到请求");
    const { phone_number, name, address } = req.query;
    let hashTable = new HashTable(100);
    if (fs.existsSync(contactsPath)) { //　如果数据文件存在，则加载内容
        hashTable = await load_contacts();
    }
    let employee = new Employee(phone_number, name, address);
    hashTable.insert(employee);
    await save_contacts(hashTable); // 保存更新后的表到文件
    res.status(200).json({ message: '添加联系人成功！' });
});

// 通过电话号码搜索记录
app.get('/query', async (req, res) => {
    console.log("收到请求");
    const { phone_number } = req.query;
    let hashTable;
    if (fs.existsSync(contactsPath)) {
        hashTable = await load_contacts();
        let result = hashTable.search(phone_number);
        if (result) {
            res.status(200).json({ data: result });
        } else {
            res.status(404).json({ message: "没有找到此电话号码的联系人" });
        }
    } else {
        res.status(404).json({ message: "没有联系人可以搜索" });
    }
});

const port = 3000;
app.listen(port, '127.0.0.1', () => console.log(`服务器正在监听端口 ${port}`));
