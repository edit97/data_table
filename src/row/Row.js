import {useState} from "react";
import './row.css'

export function Row(props) {
    const {row, depth} = props
    const {cols, rows} = row
    const [isOpen, setOpen] = useState(false)
    const maxLength = 10

    const toggle = () => {
        setOpen(!isOpen)
    }

    return (
        <>
            <tr className={'row'} onClick={toggle}>
                {depth > 0 && <td style={{width:20* depth +'px'}} colSpan={depth}/>}
                {cols?.map((col, index) => {
                    const colSpan = index === 0 ? maxLength - cols.length - depth : 0
                    return (
                        <td className={'col'} colSpan={colSpan} key={index}>{col}</td>
                    )
                })}
            </tr>
            {isOpen && rows?.map((row, index) => (
                <Row row={row} depth={depth + 1}  key={index}/>
            ))
            }
        </>
    )
}