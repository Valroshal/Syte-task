import * as React from 'react';
import Ex from '../../../assets/images/Ex.png'
import {useFormikContext} from "formik";
import {useEffect} from "react";

const styles = {
    container: {
        flex : 1,
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
    onChangePassword: (value: string) => void
}

const PasswordField: React.FC<Props> = ({onChangePassword}) => {
    const { handleBlur, handleChange, values, errors, touched } = useFormikContext<any>();

    useEffect(() => {
        onChangePassword(values.password)
    },[values.password, onChangePassword]);

    return (
        <div>
            <div
                style={(errors.password && touched.password) ? styles.fieldError :styles.field}
            >
                <input
                    placeholder="Password"
                    style={errors.password ? styles.inputTextError : styles.inputText}
                    onChange={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                />
                {(errors.password && touched.password) &&
                    <div>
                        <img
                            alt={'cancel'}
                            src={Ex}
                            style={styles.image}
                        />
                    </div>
                }
            </div>
            {(errors.password && touched.password) &&
                <div style={{paddingTop: 4, paddingBottom: 20}}>
                    <h4 style={styles.errorText}>
                        {errors.password.toString()}
                    </h4>
                </div>
            }
        </div>
    )
};

export default PasswordField;

