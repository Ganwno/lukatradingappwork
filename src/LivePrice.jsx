import { useEffect, useState,useRef } from "react/cjs/react.development";
import ScaleLoader from "react-spinners/ScaleLoader";


function LivePrice({currency,tr,fixed}){
    const [trades,setTrades] = useState([]);
    const [tHistory,setTHistory] = useState([]);
  const [fetChed,setFetched] = useState(false);
  const refCurrencyNow = useRef('btcusdt');
    useEffect(()=>{
      refCurrencyNow.current = currency;
    });
    const nowCurrency = refCurrencyNow.current;



    useEffect(()=>{
  
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${currency}@trade`);
        ws.onmessage = (e)=>{
         
          const parsedData = JSON.parse(e.data);
         
            if(parsedData.s === currency.toUpperCase()){
              setTrades(parsedData);
             tr(parsedData)
            }
          
            setFetched(true); 
      }
   
    
      return () => ws.close()
    },[currency]);




    useEffect(()=>{
      if(tHistory.length <=19){
        if(trades.s === currency.toUpperCase()){
          setTHistory(()=>{
       
            let temp = tHistory;
           
            temp.push(trades);
             return[...temp]
             
           });
        } else if(nowCurrency !== currency){
          setTHistory([ ])
          setFetched(false);
        }
        
      
    
    }
    else if(trades.s === currency.toUpperCase()){
    
     let shorter = tHistory;
     shorter = shorter.slice(1,20);
      setTHistory([...shorter,trades]);
     
    }
    else if(nowCurrency !== currency){
      setTHistory([ ])
      setFetched(false);
    }
  
    },[trades,currency])

  

    function kFormatter(num) {
      return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
  }

  const list = tHistory.map((e,i)=>{
    let date = new Date(e.T);
  if(e.m === false){return <li key={i}  className='JohnJoLi' ><div className='row'> 
  
    <div style={{color:'green'}}>{parseFloat(e.p)
    .toFixed(fixed)
    }</div> 
    
    <div className="e_q">{kFormatter(e.q)} </div>  <div>{date.toString().slice(16,25)} </div>  </div></li>;}

  if(e.m === true){return <li key={i}  className='JohnJoLi'>
    
    <div className = 'row'>   <div style={{color:'rgb(150, 4, 4)'}}>{parseFloat(e.p)
    .toFixed(fixed)
    }</div>  <div className="e_q">{kFormatter(e.q)}</div>  <div>{date.toString().slice(16,25)}</div> </div></li>;}

  });
 
return(
    
    <div className='price-live' style={fetChed ? {width:'auto'}:{ width: '321px'}}>
     
        
      
{ fetChed ?<div > <div className='lp'><span>Live Trades</span></div> <ul className='flex-column' > <li className='c-w'><span>Price</span>  <span style={{marginLeft:'10px'}}>Amount</span>  <span>Time</span>   </li>{list} </ul> </div>:  <div style={{width:'321px',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>  <ScaleLoader color={'#00B7FF'}/> </div> }
  
      
     </div>

);

}
export default LivePrice;









