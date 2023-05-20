import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
    password: Yup
        .string()
        .min(5, 'Use at least 5 characters.')
        .max(20, 'Too Long!')
        .required('Please enter password'),
    email: Yup
        .string()
        .email('Please enter valid email address - yourname@domain.com')
        .required('Please enter valid email address'),
});
