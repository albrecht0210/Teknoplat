import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";

let Criteria = ({ criteria }) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`${criteria.criteria}-content`}
                id={`${criteria.criteria}-header`}
            >
                <Stack direction="row" spacing={1}>
                    <Typography>{`${criteria.criteria} - ${criteria.weight * 100}%` }</Typography>
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                {/* <Typography sx={{ mb: 2 }}>{ criteria.description }</Typography> */}
            </AccordionDetails>
        </Accordion>
    )
}

function CriteriaList() {
    const { criterias } = useSelector((state) => state.criteria);

    let content;

    if (criterias.length === 0) {
        content = null;
    } else {
        content = criterias.map((criteria, index) => (
            <Criteria key={index} criteria={criteria} />
        ));
    }

    return (
        <Box>
            { content }
        </Box>
    );
}

export default CriteriaList;