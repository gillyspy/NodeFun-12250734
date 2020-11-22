const products = [];
module.exports = class Product {
    constructor(t, d){
        this.title = t;
        this.description = d; 
        //this.products = products;
    }

    save() {
        products.push(this);
    }

    static fetchAll(){
        return products;
    }
}