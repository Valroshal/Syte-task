import * as React from 'react';
import Ex from '../../../assets/images/Ex.png'
import { useFormikContext } from "formik";
import { useEffect } from "react";

const styles = {
    container: {
        flex : 1,
        backgroundColor: '#F5F5F5',
    },
    field: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        marginBottom: 20,
        backgroundColor: "white",
    },
    fieldError: {
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EC6868',
    },
    inputText: {
        padding: 10,
        paddingTop: 13.5,
        paddingBottom: 13.5,
        alignItems: "flex-start",
        fontSize: 16,
        color: '#6C6C6C',
    },
    inputTextError: {
        padding: 10,
        paddingTop: 13.5,
        paddingBottom: 13.5,
        alignItems: "flex-start",
        fontSize: 16,
        color: '#EC6868',
        backgroundColor: "#FFE8E8" ,
    },
    errorText: {
        fontSize: 12,
        color: '#BA0000',
    },
    image: {
        width: 20,
        height:20,
        marginHorizontal: 18,
        marginVertical : 14
    },
} as const;

interface Props{
    onChangeEmail: (value: string) => void
}

const EmailField: React.FC<Props> = ({onChangeEmail}) => {
    const {handleBlur, handleChange, values, errors, touched } = useFormikContext<any>();

    useEffect(() => {
        onChangeEmail(values.email)
    },[values.email, onChangeEmail]);

    return (
        <div>
            <div
                style={(errors.email && touched.email) ? styles.fieldError : styles.field}
            >
                <input
                    placeholder="Email"
                    style={errors.email ? styles.inputTextError : styles.inputText}
                    onChange={handleChange('email')}
                    value={values.email}
                    onBlur={handleBlur('email')}
                />
                {(errors.email && touched.email) && (
                    <div>
                        <img
                            alt={'cancel'}
                            src={Ex}
                            style={styles.image}
                        />
                    </div>
                )}
            </div>
            {errors.email && touched.email &&
                <div style={{paddingTop: 4 ,paddingBottom: 20}}>
                    <h4 style={styles.errorText}>
                        {errors.email.toString()}
                    </h4>
                </div>
            }
        </div>
    )
};

export default EmailField;
