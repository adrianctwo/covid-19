import React from 'react'
import styled from 'styled-components'

const TableBox = styled.div`
    margin-top: 10px;
    height: 500px;
    overflow: scroll;
    overflow-x: hidden;
    background: #002171;
    border-radius: 20px;
    tr:nth-child(odd) {
        background: #5472D3;
    }
    color: white;
    ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    ::-webkit-scrollbar {
        display: none;
    }
`
const TableRow = styled.tr`
    display: flex;
    justify-content: space-between;
    padding: 5px;
    font-size: 20px;
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
