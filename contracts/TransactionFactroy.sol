// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TransactionFactroy {

  string public name = "Expense Tracker";
  mapping (uint => address) public transactionToOwner;
  mapping (address => uint) public ownerTransactionCount;
  address public add = msg.sender;

  struct Transaction {
    string name;
    string transactionType;
    uint amount;
  }

  event TransactionCreated(
      string name,
      string transactionType,
      uint amount
  );

  Transaction[] public transactions;
  uint income = 10000;

  function createTransaction(address _owner, string memory _name, string memory _type, uint _amount) public {
    transactions.push(Transaction(_name, _type, _amount));
    uint id = transactions.length - 1;
    transactionToOwner[id] = msg.sender;
    ownerTransactionCount[msg.sender]++;
    emit TransactionCreated(_name, _type, _amount);
  }

  function getTransactionsByOwner() public view returns(uint[] memory) {
    uint[] memory result = new uint[](ownerTransactionCount[msg.sender]);
    uint counter = 0;
    for (uint i = 1; i < transactions.length; i++) {
      if (transactionToOwner[i] == msg.sender) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }
}
