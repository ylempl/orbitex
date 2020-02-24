import React from 'react'

import TableHead from '../../../common/components/Table/TableHead'
import TableData from '../../../common/components/Table/TableData'
import TableHeader from '../../../common/components/Table/TableHeader'
import TableBody from '../../../common/components/Table/TableBody'
import TableRow from '../../../common/components/Table/TableRow'
import TableActionButtons from '../../../common/components/Table/TableActionButtons'

const ListTable = ({headers, data, handleDelete}) => {
  return (
    <table className="table table-bordered table-hover">
      <TableHead>
        <TableRow>
          <TableHeader
            scope="col"
            headers={headers}
          />
        </TableRow>
      </TableHead>
      <TableBody>
      {data.length > 0 ?
        data.map((item, i) => { return (
          <TableRow key={i}>
            <TableHeader
              scope="row"
              headers={[item.id]}
            />
            <TableData content={item.name}/>
            <TableData content={item.species}/>
            <TableData content={item.gender}/>
            <TableData content={item.homeworld} />
            <TableData>
              <TableActionButtons
                id={item.id}
                handleDelete={handleDelete}
              />
            </TableData>
          </TableRow>
        )})
      :
        <TableRow>
          <TableData content="No Results Found" colspan="100%"/>
        </TableRow>
      }
      </TableBody>
    </table>
  )
}

export default ListTable