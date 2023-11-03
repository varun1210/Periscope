import { Typography } from "@mui/material"
import Card from "@mui/material/Card"
export default function PostingTile ( {title, company, salary} ) {
    // const temp = "Software Dev Engineer"
    // const temp2 = "Walmart"
    // const temp3 = 100000
    return (
        <Card variant="outlined">
            <Typography variant="subtitle1" sx={{fontWeight : 'bold'}}>{title}</Typography>
            <Typography variant="p">{company}</Typography>
            <br />
            <Typography variant="p">{salary}</Typography>
        </Card>
    )    
}