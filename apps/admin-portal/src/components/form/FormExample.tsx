import { useForm } from '@tanstack/react-form';
import { LoginSchema } from './FormSchemaExample';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { PrimaryButton } from '@leasing/ui';

export const FormExample = () => {
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validators: {
            onChange: LoginSchema,
        },
        onSubmit: async ({ value }) => {
            console.log(value)
        },
    })

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
            >
             
                <div>
                    <form.Field
                        name="email"
                        children={(field) => {
                            return (
                                <>
                                    <FormControl>
                                        <FormLabel htmlFor="email">Email</FormLabel>
                                        <TextField
                                            error={!!field.state.meta.errors?.length}
                                            helperText={field.state.meta.errors?.[0]?.message || ''}
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="your@email.com"
                                            autoComplete="email"
                                            autoFocus
                                            fullWidth
                                            variant="outlined"
                                        />
                                    </FormControl>
                                </>
                            )
                        }}
                    />
                </div>
                <div className='mb-3'>
                    <form.Field
                        name="password"
                        children={(field) => (
                            <>
                                <FormControl>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <TextField
                                        error={!!field.state.meta.errors?.length}
                                        helperText={field.state.meta.errors?.[0]?.message || ''}
                                        name="password"
                                        placeholder="••••••"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        autoFocus
                                        fullWidth
                                        variant="outlined"
                                    />
                                </FormControl>
                            </>
                        )}
                    />
                </div>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <PrimaryButton 
                        text={isSubmitting ? '...' : '  Sign in'}
                        fullWidth 
                        disabled={!canSubmit} 
                        sx={{fontSize: '20px', width: '40%'}} 
                       />
                    )}
                />
            </form>
        </div>
    )
}

