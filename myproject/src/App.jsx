import { useEffect, useState } from 'react'
import { formatMoney } from './utilities.js'
import './App.css'

/*/ Create a vending machine application that takes in a 
-list of items and a 
-list of coins.
// The vending machine should 
-allow the user to select an item and 
-insert coins to pay for the item.
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
  const [resetData, setResetData] = useState(false);
  const [selected, setSelected] = useState(null);
  const [delivered, setDelivered] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    (data.coins) && setCoins(data.coins.sort((a, b) => Number(b.value) - Number(a.value)).map((item) => {
      return item;
    })); // console.log("Reloading data:");
    
  }, [data.coins, resetData]);
  
  function reset() {
    setCost(0);
    setTotal(0);
    setData(testdata);
    setResetData(!resetData);
    setMessage(null);
  }

  function handleItemClick(e) {
    // find item in 
    const item = data.items.find(item => item.name === e.target.value);
    setReturns([]);
    setSelected(item);
    setCost(item.price);
    // console.log(e.target.value);
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
    // console.log(coins);
  }
  function doTotalPaid() {
    let total = 0;
    coins.map((item) => {
      if (item.coin > 0) {
        total = Number(total) + (Number(item.coin) * Number(item.value));
      }
      // console.log("total:", total);
    })
    return total;
  }
  function deliverItem() {
    // const change = Number(total) - Number(cost);
    if (cost <= total)
    {
      // alert(`Thank you! ${ (change != 0) ? 'Change, ' + change : '' } `);
      delivered ?
        setDelivered(`${ delivered }, ${ selected.name }`) :
        setDelivered(selected.name); 
      setSelected(null);
      reset();
      // TODO: return change
    } else
    {
      setMessage("Sorry, you didn't enter enough money to pay for this item.");
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
    <ChooseItem
      cost={cost}
      data={data}
      onClick={handleItemClick}
    />
    <InsertCoins
      coins={coins}
      cost={cost}
      onClick={handleCoinClick}
      total={total}
    />
    <Checkout
      cost={cost}
      deliverItem={deliverItem}
      returnCoins={returnCoins}
      total={total}
    />
    {delivered && <>
      <h3>Delivered:</h3>
      <div style={{ color: "#00aa23" }}>{delivered}</div>
    </>
    }
    {message && <h4 style={{ color: "#1199ad" }}>{message}</h4>}
    <CoinReturn returns={ returns } />
  </>
}

const ChooseItem = ({cost, data, onClick}) => {
  return <>
    <h2>Choose Item:</h2>
    {data.items.map((item, i) => {
      return <button key={i}
        onClick={onClick}
        value={item.name}
      >{item.name} ${item.price}</button>
    })}
    {(cost > 0) &&
      <div>Cost: {formatMoney(cost)}</div>
    }
  </>
}

const InsertCoins = ({coins, cost, onClick, total }) => {
  return <>
    <h2>Insert coins:</h2>
    {coins && coins.map((item, i) => {
      return <button key={i}
        onClick={onClick}
        value={item.value}
        disabled={(cost) < 0.05}>{item.name} ${item.value} x {item.coin}</button>
    })}
    <div style={{ color: (cost > total) ? "#c51d07" : "lightblue" }}>
      {(total > 0) && `Total paid: ${ formatMoney(total) } 
        ${ (cost > total) && ", add " + formatMoney(cost - total) }`}
    </div>
  </>
}

const Checkout = ({cost, deliverItem, returnCoins, total}) => {
  return <>
    <h2>Checkout:</h2>
    <div>
      <button value={cost} onClick={deliverItem}
        disabled={(total) < 0.05}>Pay now</button>
      
      {(total > 0) &&
        <button value={total} onClick={returnCoins}>Return</button>
      }
    </div>
  </>
}

const CoinReturn = ({returns}) => {
  return <>
    <h3>Coin return:</h3>
    {(!returns || returns.length == 0) && "*Empty*"}
    {(returns && returns.length > 0) && returns.map((item, i) => {
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
