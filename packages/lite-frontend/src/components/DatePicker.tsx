import React from "react";

type DatePickerProps = {
    title: string,
    description: string,
    value: string,
    onChange: any

}

const DatePicker = ({ title, description, value, onChange }: DatePickerProps) => {
    return (
        <div style={{ width: '100%' }}>
            <br />
            <label>
                <b>{title}</b><br />
                {description}<br />
                <input type="date" value={value} onChange={onChange} />
            </label>
            <br />
        </div>
    )
}
export default DatePicker;