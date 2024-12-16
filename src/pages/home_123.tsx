import React, { useState, useRef, useEffect} from 'react';
import { increase, decrease, addten, reset } from '../stores/store';
import useStore from '../stores/store';


const Home: React.FC = () => {
    //const { count, increase, decrease, addten } = useStore(); 
    //const totalCount = useStore( state => state.count);
    const count = useStore.use.count();
    // const increase = useStore.use.increase();
    // const decrease = useStore.use.decrease();
    // const addten = useStore.use.addten();
    // const reset = useStore.use.reset();


    //const { count, increase, decrease, addten } = useStore(
    //  (store) => ({
    //      count: state.count,
    //      increase: state.increase,
    //      decrease: state.decrease,
    //      addten: state.addten,
    //  }),
    //  shallow
    //);

    //const [count, increase, decrease, addten] = useStore(
    //    (state) => [state.count, state.increase, state.decrease, state.addten] as const,
    //    shallow
    //);

    // 使用 useState 追蹤背景顏色
    const [bgColor, setBgColor] = useState<string>('white');

    // 使用 useRef 追蹤前一個 count
    const prevCountRef = useRef<number>(count);

    const addFive = () => {
      useStore.setState((state)=>({
        count: state.count + 5,
      })); 
    };

    // const [bgColor, setBgColor] = useState<
    //   'lightpink' | 'lightgreen' | undefined
    // >(useStore.getState().count > 5 ? 'lightpink' : 'lightgreen');

    useEffect(() => {
      const unsubscribe = useStore.subscribe(
        (state) => state.count, // 只訂閱 count 值的變化
        (newCount) => {
          const prevCount = prevCountRef.current;
  
          if (newCount !== prevCount) {
            setBgColor(newCount <= 5 ? 'lightpink' : 'lightgreen');
          }
  
          prevCountRef.current = newCount; // 更新 prevCountRef 的值
        }
      );
  
      return () => unsubscribe(); // 清理訂閱，避免記憶體洩漏
    }, []);
  

    return (
        <div style={{ backgroundColor: bgColor, padding: '20px' }}>
          <h1 className="text-3xl font-bold">React + Zustand Counter</h1>
          <p className="text-lg my-4">Current Count: {count}</p>
          <button onClick={increase} className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
            Increase
          </button>
          <button onClick={decrease} className="bg-red-500 text-white px-4 py-2 rounded">
            Decrease
          </button>
          <button onClick={addten} className="bg-red-500 text-white px-4 py-2 rounded">
            Bonus
          </button>
          <button onClick={addFive} className="bg-red-500 text-white px-4 py-2 rounded">
            Add5
          </button>
          <button onClick={reset} className="bg-red-500 text-white px-4 py-2 rounded">
            Reset
          </button>
          <button onClick={useStore.persist.clearStorage} className="bg-red-500 text-white px-4 py-2 rounded">
            Clear storage
          </button>
        </div>
    );
};

export default Home;