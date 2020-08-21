import React from 'react'
import './InformationBox.css'

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
