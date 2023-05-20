import * as React from 'react'
import {Formik} from 'formik'
import {useCallback, useEffect, useState} from "react"
import { LoginSchema } from "./loginUtils"
import LoginButton from "./components/LoginButton"
import * as consts from '../../consts/consts'
import { retrieveTokenFromStorage } from "../../localStorage/localStorage"
import {userLogin} from "../../queries/catalog";
import PasswordField from "./components/PasswordField";
import EmailField from "./components/EmailField";
import {useNavigate} from "react-router-dom";
import {TypeFormValues} from "../../consts/types";


const styles = {
    container: {
        display: "flex",
        height: "100%",
        backgroundColor: '#FFFFFF',
    },
    innerContainer: {
        display: "flex",
        flexDirection: "column",
        padding : 20,
        paddingTop: 91,
    },
    header: {
        fontSize: 32,
        color: "#28230E",
        alignItems: "center",
    },
    subHeader: {
        fontSize: 16,
        fontStyle: "normal",
        color: "#28230E",
        fontWeight: "400",
    },
    field: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(141, 141, 141, 0.15)',
        marginBottom: 20,
        shadowColor: '#000',
        backgroundColor: "white" ,
        shadowOffset: {width: 6, height: 6},
        shadowRadius: 10,
        shadowOpacity: 0.15,
        elevation: 1,
    },
    fieldError: {
        flexDirection: 'row',
        justifyContent: "space-between",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EC6868',
        shadowColor: '#000',
        backgroundColor: "#FFE8E8" ,
        shadowOffset: {width: 6, height: 6},
        shadowRadius: 10,
        shadowOpacity: 0.15,
        elevation: 1,
    },
    inputText: {
        padding: 10,
        paddingVertical:13.5,
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
    },
    errorText: {
        fontSize: 12,
        color: '#BA0000',
    },
}as const;

const Login = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loginError, setLoginError] = useState<string>('')

    useEffect(() => {
        handleLoggedInUser().then()
    },[])

    const handleLoggedInUser = async() => {
        const res = await retrieveTokenFromStorage()
        if (res === consts.SUCCESS) {
            navigate("/catalogs")
        }
    }

    const onSubmitSend = useCallback(async (values: TypeFormValues) => {//TODO add type
        if (values) {
            console.log('values', values)
            const res = await userLogin(values.email, values.password)
            if (typeof res === 'string') {
                navigate("/catalogs")
            } else {
                setLoginError("incorrect credentials")
            }
        }
    }, [])

    return (
        <div style={styles.container}>
            <div style={styles.innerContainer}>
                <h1 style={styles.header}>
                    Login
                </h1>
                <h4
                    style={{...styles.subHeader, display: "flex", flexWrap: "wrap", paddingBottom: 14}}
                >
                    Please enter your credentials to enter
                </h4>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={(values: TypeFormValues) => {
                        onSubmitSend(values).then()
                    }}
                >
                    {({handleSubmit, touched}) => (
                        <>
                            <EmailField
                                onChangeEmail={(val:string) => {
                                    setEmail(val)
                                    setLoginError('')
                                }}
                            />
                            <PasswordField
                                onChangePassword={(val:string) => {
                                    setPassword(val)
                                    setLoginError('')
                                }}
                            />
                            <div style={{paddingTop: 5}}>
                                <LoginButton
                                    onPressButton={handleSubmit}
                                    isDisabled={!(touched.email || touched.password )}
                                />
                            </div>
                        </>
                    )}
                </Formik>
                <p>
                    {loginError}
                </p>
            </div>
        </div>
    )
}

export default Login

