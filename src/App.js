import {useEffect, useState} from "react";
import  json from './data.json'

import {Row} from "./row/Row";
import {getData} from "./helpers";

function App() {
  const [data, setData] = useState([])

  useEffect(()=>{
      setData(getData(json))
  },[])

  return (
    <div className="App">
      <table className={'table-wrapper'}>
        <thead>
        <tr>
          <th />
        </tr>
        </thead>

        <tbody>
        {data?.map((row, index) => (
            <Row row={row} depth={0} key={index}/>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
