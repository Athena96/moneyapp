import React from "react";
import { lightgray } from "../utils/Constants";

type InfoCardProps = {
    icon: any,
    iconDarkMode: any,
    darkMode: boolean,
    title: string,
    description: string,
    value: string
}

const InfoCard = ({ icon, iconDarkMode, darkMode, title, description, value }: InfoCardProps) => {
    return (
        <>
            <div style={{
                backgroundColor: darkMode ? lightgray : 'white',
                margin: '15px',
                padding: '10px',
                borderRadius: '8px',
                width: '35%'
            }}>
                <div style={{ paddingBottom: '10px' }}>
                    <>
                    <span style={{ color: 'gray' }}>{darkMode ? iconDarkMode : icon}</span>
                    {' '}
                    <small style={{ color: darkMode ? 'gray' : 'gray', }}>{title.toUpperCase()}</small>
                    </>
                </div>
                <div style={{ color: darkMode ? 'lightgray' : 'black', fontWeight: '700', fontSize: '20pt', paddingBottom: '20px' }}>
                    {value}
                </div>
                <div style={{ color: darkMode ? 'lightgray' : 'black' }}>
                    {description}
                </div>
            </div>
        </>
    )
}
export default InfoCard;