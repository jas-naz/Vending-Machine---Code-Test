import { useEffect, useState } from 'react'
import './App.css'

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
  const [cost, setCost] = useState(0);
  const [coins, setCoins] = useState(null);
  const [total, setTotal] = useState(0);
  const [returns, setReturns] = useState(null);
  const [data, setData] = useState(testdata);

  useEffect(() => {
    setCoins(testdata.coins.map((item) => {
      return item;
    }));
    console.log(coins);
    // const fetchData = async () => {
    //   fetch('./fakeDta.json')
    //     .then(res => res.json())
    //     .then(data => setSchedules(data))
    //     .finally(() => setLoading(false))
    // };

    // fetchData();
  }, []);
  
  function handleItemClick(e) {
    setCost(e.target.value);
    console.log(e.target.value);
    // setCoins(coins + 1);
  }
  function handleCoinClick(e) {
    setCoins(coins.map((item) => {
      if (item.value == e.target.value)
      {
        let coin = item;
        coin.coin = (coin.coin) ? coin.coin + 1 : 1;
        
        setTotal(doTotalPaid);
        return coin;
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
      console.log("delivered");
      alert("Change", Number(total) - Number(cost));
    }
  }
  function returnCoins(amt) {
    let remaining = amt;
    let coinStr = [];
    coins && coins.map((item) => {
      if (item.coin > 0 && item.value >= remaining) {
        coinStr.push(`${item.name} x ${amt/item.value}`);
      }
    })
    setReturns(coinStr);
  }

  return <>
    {data.items.map((item, i) => {
      return <button key={i}
        onClick={handleItemClick}
        value={item.price}
      >{item.name} ${item.price}</button>
    })}
    <div>Cost: {cost}</div>
    {/* <div><input value={cost} type="text" placeholder="Cost" /></div> */}
    <div>coins:</div>
    {coins && coins.map((item, i) => {
      return <button key={i}
        onClick={handleCoinClick}
        value={item.value}
        disabled={(cost) < 0.05}>{item.name} ${item.value} x {item.coin}</button>
    })}
    <br />
    {(total) && <div>Total paid: ${total}</div>}

    <button value={cost} onClick={deliverItem}>Pay now</button>
    <button value={cost} onClick={returnCoins(total)}>Return</button>

    <div>return coins:</div>
    <input type="text" />
    {returns && returns.map((item, i) => {
      return <div key={i}>{item}</div>
    })}
  </>

}

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <VendingMachine />
    </>
  )
}

export default App
