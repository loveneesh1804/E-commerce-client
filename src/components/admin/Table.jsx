import React from 'react';
import { useTable } from 'react-table';

const Table = ({columns,data,boxClass,heading}) => {
    
  return function TableHoc(){
    const {getTableProps,getTableBodyProps,rows,prepareRow,headerGroups} = useTable({columns,data})
    return (
        <div className={boxClass}>
            <h2 className="table-head">{heading}</h2>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(el=>(
                        <tr {...el.getHeaderGroupProps()}>
                            {
                                el.headers.map(col => (
                                    <th {...col.getHeaderProps()}> {col.render("Header")}</th>
                                ))
                            }
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()} >
                    {rows.map(row => {
                        prepareRow(row);
                        
                        return <tr {...row.getRowProps()}>
                            {
                                row.cells.map((cell)=>(
                                    <td {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                    </td>
                                ))
                            }
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
  }
}

export default Table