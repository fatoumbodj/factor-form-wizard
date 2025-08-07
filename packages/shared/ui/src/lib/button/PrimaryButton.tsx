import { Button, useTheme } from "@mui/material";

type Props = {
     text: string;
     fullWidth: boolean;
     disabled: boolean;
     onClick?: () => void;
     sx?: object;
}
export const PrimaryButton = ({ text, fullWidth, disabled, sx, onClick }: Props) => {
     const theme = useTheme();

     return (
          <Button type="submit"
               variant="contained"
               fullWidth={fullWidth}
               disabled={disabled}
               sx={{ background: theme.palette.primary.main, ...sx }}
               onClick={() => onClick?.()}>
               {text}
          </Button>
     )
}
