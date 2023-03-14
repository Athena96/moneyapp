import React from "react";
import { lightgray } from "../utils/Constants";

type MoneyTextBoxProps = {
    darkMode: boolean,
    title: string,
    description: string,
    value: string,
    onChange: any
}

const MoneyTextBox = ({ darkMode, title, description, value, onChange }: MoneyTextBoxProps) => {
    return (
        <>
            <br />
            <div style={{
                backgroundColor: `${darkMode ? lightgray : 'white'}`,
                color: darkMode ? 'lightgray' : 'black',
                paddingLeft: '10px',
                paddingBottom: '10px',
                borderRadius: '8px',
                border: `${darkMode ? '' : '0.5px solid black'}`
            }}>
                <div style={{ fontWeight: '350', fontSize: '20pt' }}>
                    <b>{title}</b>
                </div>
                <div>
                    {description}
                </div>
                <div>
                    <span className="currencyinput">$
                        <input style={{ width: '75%', borderRadius: '8px' }} type="text" value={value} onChange={onChange} />
                    </span>
                </div>
            </div>
        </>
    )
}
export default MoneyTextBox;
