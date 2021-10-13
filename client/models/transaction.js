class Transaction {
  constructor(id, title,amount,dateTime,transactionMoment) {
    this.id = id;
    this.title = title;
    this.amount = amount;
    this.dateTime = dateTime;
    this.transactionMoment = transactionMoment
  }
}

export default Transaction;
