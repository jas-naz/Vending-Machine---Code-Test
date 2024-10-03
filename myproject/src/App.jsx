import { useEffect, useState } from 'react'
import './App.css'

/*/ Create a vending machine application that takes in a 
list of items and a 
list of coins.
// The vending machine should 
allow the user to select an item and 
insert coins to pay for the item.
// The vending machine should 
return the item if the user has inserted enough money.
// If the user has not inserted enough money, 
the vending machine should return the coins that were inserted.
// The vending machine should also 
return the item and any remaining change if the user has inserted more money than the item costs
*/
const testdata = {
  items: [
    {
      name: 'Candy',
      price: 1.00
    },
    {
      name: 'Soda',
      price: 1.50
    },
    {
      name: 'Chips',
      price: 2.00
    }
  ],
  coins: [
    {
      name: 'Nickel',
      value: 0.05
    },
    {
      name: 'Dime',
      value: 0.10
    },
    {
      name: 'Quarter',
      value: 0.25
    }
  ]
}

function VendingMachine() {
  const [data, setData] = useState(structuredClone(testdata));

  const [cost, setCost] = useState(0);
  const [coins, setCoins] = useState(null);
  const [total, setTotal] = useState(0);
  const [returns, setReturns] = useState(null);
  const [resetData,setResetData] = useState(false);

  useEffect(() => {
    (data.coins) && setCoins(data.coins.sort((a, b) => Number(b.value) - Number(a.value)).map((item) => {
      return item;
    }));
    
  }, [resetData]);
  
  function reset() {
    setCost(0);
    setTotal(0);
    setData(testdata);
    setResetData(!resetData);
  }

  function handleItemClick(e) {
    setReturns([]);
    setCost(e.target.value);
    console.log(e.target.value);
    // setCoins(coins + 1);
  }
  function handleCoinClick(e) {
    const newCoins = [...coins];
    setCoins(newCoins.map((item) => {
      if (item.value == e.target.value)
      {
        let con = item;
        con.coin = (con.coin) ? con.coin + 1 : 1;
        
        setTotal(doTotalPaid);
        return con;
      } else
      {
        return item;
      }
    }));
    console.log(coins);
  }
  function doTotalPaid() {
    let total = 0;
    coins.map((item) => {
      if (item.coin > 0) {
        total = Number(total) + (Number(item.coin) * Number(item.value));
      }
      console.log("total:", total);
    })
    return total;
  }
  function deliverItem() {
    if (cost <= total) {
      alert("Change" + (Number(total) - Number(cost)));
    }
  }
  // If the user has not inserted enough money, 
  // the vending machine should return the coins that were inserted.
  function returnCoins(e) { 
    let remaining = e.target.value; // 1.00
    let coinStr = [];

    coins.map((item) => {
      if (item.coin > 0 && item.value <= remaining)
      {
        const count = Math.floor(item.coin);
        coinStr.push(`${ item.name } x ${ count }`);
        // console.log("returned", count);
      }
    })
    
    setReturns(coinStr);
    reset();
  }

  return <>
    {data.items.map((item, i) => {
      return <button key={i}
        onClick={handleItemClick}
        value={item.price}
      >{item.name} ${item.price}</button>
    })}
    <div>Cost: ${cost}</div>
    {/* <div><input value={cost} type="text" placeholder="Cost" /></div> */}
    <div>Insert coins:</div>
    {coins && coins.map((item, i) => {
      return <button key={i}
        onClick={handleCoinClick}
        value={item.value}
        disabled={(cost) < 0.05}>{item.name} ${item.value} x {item.coin}</button>
    })}

    <div>
      {(total > 0) && `Total paid: ${total}`}
    </div>
    
    <div>
      <button value={cost} onClick={deliverItem}
        disabled={(total) < 0.05}>Pay now</button>
      {total &&
        <button value={total} onClick={returnCoins}>Return</button>
      }
    </div>

    <div>return coins:</div>
    {/* <input type="text" /> */}
    {returns && returns.map((item, i) => {
      return <div key={i} style={{color: "lightblue"}}>{item}</div>
    })}
  </>

}

function App() {
  return (
    <VendingMachine />
  )
}

export default App
