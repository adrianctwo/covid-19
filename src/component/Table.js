import React from 'react'
import styled from 'styled-components'

const TableBox = styled.div`
    overflow: scroll;
    height: 400px;
    overflow-x: hidden;
    tr:nth-child(odd) {
    background: lightgray;
  }
`
const TableRow = styled.tr`
    display: flex;
    justify-content: space-between;
`

const TableData = styled.td`
    padding: 5px;
`

function table({ countries }) {
    return (
        <TableBox>
            {countries.map(({country, cases, index}) => (
                <TableRow>
                    <TableData>{country}</TableData>
                    <TableData>{cases}</TableData>
                </TableRow>
            ))}
        </TableBox>
    )
}

export default table
