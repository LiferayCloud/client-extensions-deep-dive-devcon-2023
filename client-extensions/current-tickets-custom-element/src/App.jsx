import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';

function App() {
  const [count, setCount] = useState(0)
  const [rows, setRows] = useState([]);

  const columns = [
	{ key: 'id', name: 'ID' },
	{ key: 'title', name: 'Title' }
  ];

  return (
    <DataGrid columns={columns} rows={rows} onRowsChange={setRows} />
  )
}

export default App
