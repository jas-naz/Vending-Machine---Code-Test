import { useEffect, useState } from 'react'
import { formatMoney, roundCeil } from './utilities.js'
import './App.css'

/*/ Create a vending machine application that takes in a 
-list of items and a 
-list of coins.
// The vending machine should 
-allow the user to select an item and 
-insert coins to pay for the item.
// The vending machine should 
return the item if the user has inserted enough money.
// If the user has not inserted enough money, JN-Not sure if this is the correct behaviour
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
      // coin: 2,
      name: 'Nickel',
      value: 0.05
    },
    {
      // coin: 10,
      name: 'Dime',
      value: 0.10
    },
    {
      // coin: 3,
      name: 'Quarter',
      value: 0.25
    }
  ]
}

function VendingMachine() {
  const [data, setData] = useState(structuredClone(testdata));

  const [cost, setCost] = useState(0); // Cost of item selected
  const [coins, setCoins] = useState(null);
  const [total, setTotal] = useState(0); // Total calue of coins inserted
  const [returns, setReturns] = useState(null);
  const [resetData, setResetData] = useState(false);
  const [selected, setSelected] = useState(null);
  const [delivered, setDelivered] = useState(null);
  const [message, setMessage] = useState(null);
  const [totalReturned, setTotalReturned] = useState(0);

  useEffect(() => {
    (data.coins) &&
      setCoins(structuredClone(testdata)
        .coins.sort((a, b) => Number(b.value) - Number(a.value))
        .map((item) => {
          return item;
    }));
    
  }, [data.coins, resetData]);
  
  function reset() {
    setCost(0);
    setTotal(0);
    setData(testdata);
    setResetData(!resetData);
    setMessage(null);
  }

  function handleItemClick(e) {
    const item = data.items.find(item => item.name === e.target.value);
    setSelected(item);
    setCost(item.price);
    setReturns([]);
    setTotalReturned(0);
  }
  function handleCoinClick(e) {
    const newCoins = [...coins];
    setCoins(newCoins.map((item) => {
      if (item.value == e.target.value)
      {
        setMessage(null);
        setTotal(doTotalPaid);
        let con = item;
        con.coin = (con.coin) ? con.coin + 1 : 1;

        return con;
      } else
      {
        return item;
      }
    }));
  }
  // function removeCoins() {
  //   setCoins(coins.map((item) => {
  //     return item.coin > 0;
  //   }));
  // }
  function doTotalPaid() {
    let total = 0;
    coins.map((item) => {
      if (item.coin > 0) {
        total = Number(total) + (Number(item.coin) * Number(item.value));
      }
    })
    return total;
  }
  function deliverItem() {
    if (cost <= total)
    {
      setDelivered(
        delivered ? `${ delivered }, ${ selected.name }` : selected.name
      );
      setSelected(null);
      reset();
      returnCoins(total - cost);
    } else
    {
      setMessage("Sorry, you didn't enter enough money to pay for this item.");
    }
  }
  // If the user has not inserted enough money, ???
  // the vending machine should return the coins that were inserted.
  function coinReturn(e) {
    let remaining = e.target.value;
    returnCoins(remaining)
  }
  function returnCoins(rem) { 
    let remaining = roundCeil(rem);
    let coinStr = [];
    let totRet = [];
    
    // return exact coins
    coins.map((item) => {
      if (item.coin > 0 && item.value <= remaining)
      {
        
        const count = Number(item.coin);
        let tmpCount = 0;

        if ((count * Number(item.value)) <= remaining)
        {
          tmpCount = count;
          remaining = remaining - (count * Number(item.value));
        } else
        {
          for (let i = 0; i < count; i++)
          {
            if (roundCeil(remaining) >= item.value) {
              tmpCount++;
              remaining = roundCeil(remaining - item.value);
            }
          }
        }
        totRet.push(item.value * tmpCount);
        coinStr.push(`${ item.name } x ${ tmpCount }`);
      }
    })
    
    setTotalReturned(totRet.reduce((partialSum, a) => partialSum + a, totalReturned));
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
      onClick={coinReturn}
      total={total}
    />
    {message && <h4 className="message">{message}</h4>}
    {delivered && <>
      <h3>Delivered:</h3>
      <div className="delivered">{delivered}</div>
    </>
    }
    <CoinReturn returns={returns} />
    {totalReturned > 0 &&
      <div>Total Returned: {formatMoney(totalReturned)}</div>
    }
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
        disabled={(cost) < 0.05}>{item.name} {formatMoney(item.value)} x {item.coin}</button>
    })}
    <div
      className={ (cost > total) ? "totalsError" : "totals" }
    >
      {(total > 0) && `Total paid: ${ formatMoney(total) } 
        ${ (cost > total) && ", add " + formatMoney(cost - total) }`}
    </div>
  </>
}

const Checkout = ({cost, deliverItem, onClick, total}) => {
  return <>
    <h2>Checkout:</h2>
    <div>
      <button value={cost} onClick={deliverItem}
        disabled={(total) < 0.05}>Pay now</button>
      
      {(total > 0) &&
        <button value={total} onClick={onClick}>Return</button>
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
