import React,{useState,useEffect,useRef} from "react";
import { createChart } from 'lightweight-charts';



const CreateChart = ({currency,time}) =>{
 const [lastCandle,setLastCandle] = useState({});
 const [initCandles, setInitCandles] = useState([]);
  const chartRef = useRef();
 const[precision,setPrecision] = useState(3);
const [sizes,setSizes] = useState({
  width:1200,
  height:500
})


  useEffect(()=>{
          

    async function getCandleData(){
      let crrUpper = currency.toUpperCase();
      
        let response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${crrUpper}&interval=${time}&limit=1000`);
        let data = await response.json();
       
        let cData = await data.map((d)=>{
            return {time: d[0]/1000, open:parseFloat(d[1]) , high:parseFloat(d[2]) , low: parseFloat(d[3]), close:parseFloat(d[4]) }
        });
        setInitCandles(cData)
        document.getElementsByClassName('tv-lightweight-charts')[0].remove();
       
    }
     getCandleData();
    
  },[time]);
  

    useEffect(()=>{
  
        const chart = createChart(chartRef.current, { width: sizes.width, height: sizes.height });
        const candles =  chart.addCandlestickSeries();
      
        candles.applyOptions({
          upColor: '#6495ED',
          downColor: '#FF6347',
          wickVisible: true,
          priceScale: {
            position: 'right',
            invertScale: false,
            autoScale:true,
            borderVisible: true,
            borderColor: '#272D35',
            
        },
        ////////////////////////////////////
        priceFormat: {
          type: 'custom',
          minMove: 0.00001,
          formatter: price => '$' + parseFloat(price).toFixed(4),
      },
     
          upColor: '#0ECB81',
          downColor: '#F6465D',
          borderVisible: false,
         
         
      
      });
     
      
     
    chart.applyOptions({
      timeScale: {
          rightOffset: 12,
          barSpacing: 3,
          fixLeftEdge: true,
          lockVisibleTimeRangeOnResize: true,
          rightBarStaysOnScroll: true,
          borderVisible: true,
          borderColor: '#272D35',
          visible: true,
          timeVisible: true,
          secondsVisible: false,
      },
  });
    chart.applyOptions({
      layout: {
          background: {
          color:'#161A1E'
            
          },
          textColor: '#5E6673',
          fontSize: 11,
          fontFamily: 'Calibri',
      },
  });
  chart.applyOptions({
    grid: {
        vertLines: {
          color: '#272D35',
          style: 1,
          visible: true,
        },
        horzLines: {
          color: '#272D35',
          style: 1,
          visible: true,
        },
    },
});
   
      
        candles.setData(initCandles);
     
     
    
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${currency}@kline_${time}`);
      
   
      ws.onmessage = (e)=>{

  const t = JSON.parse(e.data)

  candles.update({
      time: t.k.t/1000,
      open: t.k.o,
      high: t.k.h,
      low: t.k.l,
      close: t.k.c,
    });
  
  };
     return () => ws.close()
     

    },[initCandles,sizes]);

  
     useEffect(()=>{
      const handler = () => {
       if(window.innerWidth <= 1920 && window.innerWidth > 1475){
        setSizes({width:window.innerWidth-640,height:400})
        document.getElementsByClassName('tv-lightweight-charts')[0].remove();
       }
         if(window.innerWidth <= 1475){
          setSizes({width:window.innerWidth-631,height:350})
          document.getElementsByClassName('tv-lightweight-charts')[0].remove();
         }
        
    
    };
    window.addEventListener('resize', handler);
    return () => {
        window.removeEventListener('resize', handler);
      
    };
   
       
     },[])
   useEffect(()=>{
    if(window.innerWidth <= 1920 && window.innerWidth > 1475){
      setSizes({width:window.innerWidth-640,height:400})
      document.getElementsByClassName('tv-lightweight-charts')[0].remove();
     }
     if(window.innerWidth <= 1475){
      setSizes({width:window.innerWidth-631,height:350})
      document.getElementsByClassName('tv-lightweight-charts')[0].remove();
     }
    
   },[]);
   
  

           return(
             <div className='React_fragment'>
               
                <div ref={chartRef}></div> 
              
               
   
             </div>
    
           );

}
  export default CreateChart;