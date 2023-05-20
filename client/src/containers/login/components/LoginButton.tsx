import * as React from 'react'

const styles = {
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 48,
        borderRadius: 4,
        backgroundColor: '#FFDEA8',
        minWidth: 217
    },
    disabled: {

    },
    text: {
        fontSize: 28,
        color: '#000'
    }
}as const;

interface Props {
    onPressButton: () => void
    isDisabled: boolean
}
const LoginButton:React.FC<Props> = ({onPressButton, isDisabled}) => {

    return(
        <button
            disabled={isDisabled}
            style={isDisabled ? { ...styles.container, backgroundColor: '#D9D9D9' } : styles.container}
            onClick={onPressButton}
        >
            <span
                style={styles.text}
            >
                Login
            </span>
        </button>
    )
}

export default LoginButton
