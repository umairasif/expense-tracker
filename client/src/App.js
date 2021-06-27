import React, { useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import TransactionContract from "./contracts/TransactionFactroy.json";
import getWeb3 from "./getWeb3";

import "./App.css";

function App () {
  const [storageValue, setStorageValue] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState([]);
  const [tran, setTransactions] = useState([]);


  const doSomething = function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value;
      var transactionType =  document.getElementById('type').value;
      var amount =  document.getElementById('amount').value;
      saveTransaction(name, transactionType, amount);
      
  };
  const saveTransaction = async (name, type, amount) => {
    const result = await contract.methods.createTransaction(accounts[0], name, type, amount).send({ 
      from: accounts[0],
      gas:3000000
    }).on("receipt", function(receipt) {
        alert('Transaction added');
        window.location.reload();
    })
  }

  useEffect(() => {
    const init = async() => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = TransactionContract.networks[networkId];
        const contract = new web3.eth.Contract(
          TransactionContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    init();
  }, []);
  useEffect(()=>{
    const load = async () => {
      // Stores a given value, 5 by default.
      if(contract.length !== 0) {
        const add = await contract.methods.add().call();
        // const res = await contract.methods.createTransaction(accounts[0], 'House', 'income', 150).send({ 
        //   from: accounts[0],
        //   gas:3000000
        // });
        const response = await contract.methods.getTransactionsByOwner().call();
        var temp = [];

        for(var i = 0; i < response.length; i++) {
          const record = await contract.methods.transactions(response[i]).call();
          var obj = {};
          var final = Object.keys(record).map(function(key, index) {
            if(key === 'name' || key === 'transactionType' || key === 'amount') {
              obj[key] = record[key];
            }
          });
          temp.push(obj);
        }
        setTransactions(tran => [...tran, temp]);
      } else {
      }
    }
    if(typeof web3 !== 'undefined'
    && typeof accounts !== 'undefined'
    && typeof contract !== 'undefined'
    && tran.length < 1
    ) {
      load();
    } 
  }, [web3, accounts, contract, tran]);

  let index=0;

  if(typeof tran[0] === 'undefined') {
  } else {
    return (
      <div className="App">
        <form
          onSubmit={doSomething}
        >
          <label>Name</label>
          <input
            type="text"
            id="name"
          />
          <label>Type</label>
          <select name="type" id="type">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <label>Amount</label>
          <input
            type="text"
            id="amount"
          />
          <button>Add transaction</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Transaction Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {tran[0].map(t=>(
              <tr key={index++}>
                <td key={1}>{t.name}</td>
                <td key={2}>{t.transactionType}</td>
                <td key={3}>{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if(typeof web3 === 'undefined') {
    return <div>Loading web3, account and contract</div>;
  } 
  return (
    <div className="App">
      <h1>Good to Go!</h1>
      <p>Your Truffle Box is installed and ready.</p>
      <h2>Smart Contract Example</h2>
      <p>
        If your contracts compiled and migrated successfully, below will show
        a stored value of 5 (by default).
      </p>
      <p>
        Try changing the value stored on <strong>line 42</strong> of App.js.
      </p>
      <div>The stored value is: {storageValue}</div>
    </div>
  );
  
}

export default App;
