import TableHOC from "./Table";

const columns = [
    {
        Header : "Id",
        accessor : "_id"
    },
    {
        Header : "Quantity",
        accessor : "quantity"
    },
    {
        Header : "Amount",
        accessor : "amount"
    },
    {
        Header : "Status",
        accessor : "status"
    }
]

const DashBoardTable = ({data}) => {
  return (
    TableHOC({columns,data,boxClass : "transaction-box",heading : "Latest Transactions"})()
  )
}

export default DashBoardTable