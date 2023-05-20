import * as React from 'react'

const styles = {
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 48,
        borderRadius: 8,
        backgroundColor: '#FFDEA8',
        minWidth: 100,
        padding: 12
    },
    text: {
        fontSize: 16
    }
} as const;

interface Props {
    onPressButton: () => void
    name: string
    color?: string
    disabled?: boolean
}

const ItemButton: React.FC<Props> = ({ onPressButton, name = '', color = '#000', disabled = false }) => {

    return (
        <button
            style={styles.container}
            onClick={onPressButton}
            disabled={disabled}
        >
            <h2 style={{...styles.text, color: color}}>
                {name}
            </h2>
        </button>
    )
}

export default ItemButton


