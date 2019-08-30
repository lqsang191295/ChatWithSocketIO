//Link: https://practice.geeksforgeeks.org/problems/final-destination/0
//Tìm tất cả đường đi
// Check array indexOf other array
const maxx = 3;
const maxy = 3;
const matrix = [];
//
const queue = []; // Chứa item chuẩn bị được quét
const scaned = []; // Chứa item đã quét qua
const result = []; // Kết quả đường đi ngắn nhất

function init() {
    for(let i = 0; i < maxx; i ++) {
        let row = [];
        for(let j = 0; j < maxy; j++) {
            row[j] = 0;
        }
        matrix[i] = row;
    }
}
init();
// Hàm xử lý khi gặp điểm cuối
const pointEnd = [2, 1];
const handleEndPoint = (position) => {
    if(position[0] == pointEnd[0] && position[1] == pointEnd[1]) {
        console.log('End --- queue', queue)
        console.log('End --- scaned', scaned)
        console.log('End --- result', result)
        return
    }
}
// Hàm xử lý khi quét qua 1 điểm
const handlePointed = (item) => {
    const path = getPath(item.position, 3); // 6: mảng 5x5
    queue.push(...path); // Đặt đường đi của position vào queue
    if(!isQueued(item.position)) {
        result.push(item); // Đặt đường đi vào trong result
    }
    scaned.push(item); // Đặt vị trí (0, 0) đã quét
    handleEndPoint(item.position);
}
// Lấy đường đi hợp lệ của 1 điểm --- n là số cạnh ma trận
const getPath = (position, n) => {
    let paths = [];
    const x = position[0], y = position[1];
    if(x - 1 > 0 && !isScaned([x - 1, y])) paths.push({position: [x - 1, y], parent: position});
    if(x + 1 < n && !isScaned([x + 1, y])) paths.push({position: [x + 1, y], parent: position});
    if(y - 1 > 0 && !isScaned([x, y - 1])) paths.push({position: [x, y - 1], parent: position});
    if(y + 1 < n && !isScaned([x, y + 1])) paths.push({position: [x, y + 1], parent: position});
    return paths;
}
// Check xem trong mảng scaned có chứa item đó chưa
const isItemInArray = (array, item) => {
    const n = array.length;
    for (let i = 0; i < n; i++) {
        if (array[i]['position'][0] == item[0] && array[i]['position'][1] == item[1]) {
            return true;
        }
    }
    return false;
}
// Check scaned
const isScaned = (val) => {
    return isItemInArray(scaned, val);
}
// Check queue
const isQueued = (val) => {
    return isItemInArray(queue, val);
}
// Xu ly vi tri start
handlePointed({position: [0, 0], parent: null})
//
var i = 0;
function run() {
    // if(i == 2) {
    //     return
    // }
    if(queue.length == 0) return;
    const item = queue.shift();
    if(item) {
        handlePointed(item);
        // i++;
        run();

    }
    return;
}
run();


