import * as React from 'react'
import ItemButton from '../components/ItemButton'
import Modal from 'react-modal';
import {TypeCatalog} from "../../../consts/types";
import {useCallback, useState} from "react";
import {addCatalog} from "../../../queries/catalog";
import * as consts from '../../../consts/consts'

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        gap: 20,
        position: "relative"
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    header: {
        fontSize: 52,
        color: '#000',
    },
    description: {
        fontSize: 40,
        color: '#808080'
    },
    price: {
        fontSize: 22,
        color: '#0E86D4',
    },
    quantity: {
        fontSize: 22,
        color: '#808080',
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    image: {
        height: 24,
        width: 24,
        marginLeft: 5
    },
    deleteBtn: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 25
    },
} as const;

interface Props {
    onAdd: () => void
    onClose: () => void
    isOpen: boolean
}
const AddCatalog: React.FC<Props> = ({onAdd, onClose, isOpen}) => {
    const [name, setName] = useState<string>('')
    const [vertical, setVertical] = useState<string>('general')
    const [is_primary, setIsPrimary] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const handleAddCatalog = useCallback(async() => {
        if (name === '') {
            setError('all fields are required')
        } else {
            const catalog: TypeCatalog = {
                name: name,
                vertical: vertical,
                is_primary: is_primary
            }
            const res = await addCatalog(catalog)
            if (res === consts.CREATED) {
                onAdd()
                onClose()
            }
        }
    }, [name, vertical, is_primary, onAdd, onClose])

    const handleIsPrimary = useCallback((val: string) => {
        if (val === 'true') {
            setIsPrimary(true)
        }
        if (val === 'false') {
            setIsPrimary(false)
        }
    }, [setIsPrimary])

    const handleName = useCallback((val: string) => {
        setError('')
        setName(val)
    }, [])

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Modal"
        >
            <div style={styles.container}>
                <div style={styles.headerContainer}>
                    <h1>Add New Catalog</h1>
                </div>
                <input
                    placeholder="name"
                    onChange={(e) => handleName(e.target.value)}
                    value={name}
                />
                <div>
                    <select value={vertical} onChange={(e) => setVertical(e.target.value)}>
                        <option value="fashion">fashion</option>
                        <option value="home">home</option>
                        <option value="general">general</option>
                    </select>
                    <p>Selected option: {vertical}</p>
                </div>
                <div>
                    <select value={String(is_primary)} onChange={(e) => handleIsPrimary(e.target.value)}>
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </select>
                    <p>Selected option: {String(is_primary)}</p>
                </div>
                <div style={styles.buttonContainer}>
                    <ItemButton
                        name={'Add'}
                        onPressButton={handleAddCatalog}
                    />
                    <ItemButton
                        name={'Close'}
                        onPressButton={onClose}
                    />
                </div>
            </div>
            {
                <h4>{error}</h4>
            }
        </Modal>
    )
}

export default AddCatalog
