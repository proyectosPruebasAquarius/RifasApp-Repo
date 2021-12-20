function removeSellNumbers(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}
module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0, No: [] };
        }
        storedItem.qty++
            storedItem.price = storedItem.item.precio * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.precio;
        console.log({ carrito: oldCart })
    };

    this.reduceByOne = function(id) {


        if (this.items[id].qty > 1) {
            //delete this.items[id];
            //console.log('riot');
            this.items[id].qty--;
            this.items[id].price -= this.items[id].item.precio;
            this.totalQty--;
            this.totalPrice -= this.items[id].item.precio;
        }
    };
    this.remove = function(id) {
        //this.items[id].price -= this.items[id].item.price;
        /*this.totalQty--;
        this.totalPrice -= this.items[id].item.price;
        delete this.items[id];*/

        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.addNumbers = function(id, number) {

        console.log('itemsdelcar', this.items[id])
        var storedItem = this.items[id];
        // Numero existente, hizo doble click remover del arreglo
        if (typeof this.items[id].No === 'undefined') {

            this.items[id]['No'] = [number];
            console.log('itemsdelcarD', this.items[id])
        } else {
            if (storedItem.No.find(e => e == number)) {
                let newArray = removeSellNumbers(storedItem.No, number);
                this.items[id].No = newArray;
            } else {
                console.log('desdeaca');
                this.items[id].No.splice(this.items[id].No.length, 0, number);
            }
        }

    };

    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        };
        return arr;
    };
};