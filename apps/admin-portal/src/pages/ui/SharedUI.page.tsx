import { Container, Grid } from "@mui/material"
import { AppButton } from "../../components/button/AppButton"
import { FormExample } from "../../components/form/FormExample"

export const SharedUIPage = () => {
    return (
        <>
            <h1>Shared UI</h1>
            <Container>
                <Grid container spacing={2}>
                    <Grid size={8}>
                        < FormExample />
                    </Grid>
                    <Grid size={4}>
                        <AppButton />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}