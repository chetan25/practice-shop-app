import moment from 'moment';

class Order {
    constructor(id, totalAmount, date, items ) {
       this.id = id;
       this.totalAmount = totalAmount;
       this.items = items;
       this.date = date;
    }

    get readableDate() {
        return moment(this.date).format('MMMM Do YYYY, hh:mm');
    }
}

export default Order;