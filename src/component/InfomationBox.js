import React from 'react'
import styled from 'styled-components'
import './InformationBox.css'
const CardTitle = styled.h3``
const CardCases = styled.p``
const CardTotal = styled.p``


function InfomationBox({ title, cases, isRed, active, total, ...props }) {
    return (
        <div onClick={props.onClick} className={`card ${active && 'card--selected'} ${isRed && 'card--red'}`}>
            <div className="cardTitle">{title}</div>
            <div className={`cardCases ${!isRed && "card--green"}`}>{cases} today</div>
            <div className="cardTotal">{total} total cases</div>
        </div>
    )
}

export default InfomationBox
