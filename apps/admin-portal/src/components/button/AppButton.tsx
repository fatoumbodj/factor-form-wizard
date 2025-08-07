import { PrimaryButton } from "@leasing/ui"

export const AppButton = () => {

    const handleClick = () => {
        console.log('Primary button...');
    }

    return (
        <PrimaryButton
            text="Primary Button"
            fullWidth={false}
            disabled={false} sx={{ fontSize: '20px' }}
            onClick={handleClick} />
    )
}