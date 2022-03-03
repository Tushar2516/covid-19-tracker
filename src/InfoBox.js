import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import "./InfoBox.css";
function InfoBox({title, cases, total,active,isRed, ...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && "infoBox--red"}`}>
            <CardContent>
                {/* Title */}
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                {/* Number Of Cases */}
                <h3 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>{cases}</h3>
                {/* Total Cases */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
