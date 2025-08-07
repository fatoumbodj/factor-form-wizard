
import { styled } from '@mui/material/styles';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Link from '@mui/material/Link';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: (theme.vars || theme).palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: 'center',
    },
}));

type Props = {
    text: string;
}
export const HeaderBreadcrumbs = ({ text }: Props) => {
    return (
        <StyledBreadcrumbs
            aria-label='breadcrumb'
            separator={<NavigateNextRoundedIcon fontSize='small' />}
        >
            <Link
                underline='hover'
                color='inherit'
                sx={{ color: 'text.primary', fontWeight: 600 }}
            >
                Crédit Bail
            </Link>

            <Link
                underline='hover'
                color='inherit'
                sx={{ color: 'text.primary', fontWeight: 600 }}
            >
                {text}
            </Link>
        </StyledBreadcrumbs>
    )
}