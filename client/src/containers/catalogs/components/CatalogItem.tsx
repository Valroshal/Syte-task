import * as React from 'react'
import ItemButton from '../components/ItemButton'
import { useCallback } from "react";
import {deleteCatalog, updateCatalog} from '../../../queries/catalog'
import * as consts from '../../../consts/consts'
import {TypeCatalog} from "../../../consts/types";

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#EADDCA',
        borderStyle: 'solid',
        borderColor: '#000',
        borderWidth: 1,
        minHeight: 170
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    header: {
        fontSize: 30,
        color: '#000',
        margin: 5
    },
    description: {
        fontSize: 22,
        color: '#808080'
    },
    image: {
        height: 24,
        width: 24,
        marginLeft: 5
    },
    buttonContainer: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
    },
} as const;

interface Props {
    catalog: TypeCatalog
    onDelete: () => void
    onSetPrimary: () => void
}

const CatalogItem: React.FC<Props> = ({ catalog, onDelete, onSetPrimary }) => {
    const handlePrimary = useCallback(async () => {
        const is_primary = !catalog.is_primary
        updateCatalog(catalog.name, is_primary).then(res => {
            if (res === consts.SUCCESS) {
                onSetPrimary()
            }
        })
    }, [onSetPrimary, catalog.is_primary, catalog.name])

    const handleDelete = useCallback(async () => {
        catalog._id && deleteCatalog(catalog._id).then(res => {
            if (res === consts.SUCCESS) {
                onDelete()
            }
        })
    }, [onDelete, catalog._id])

    return(
        <div
            style={styles.container}
            key={catalog?._id}
        >
            <div style={styles.headerContainer}>
                <h1 style={styles.header}>{catalog?.name}</h1>
                {catalog?.is_primary ?
                    <p style={{margin:5}}>primary</p>
                    : null
                }
            </div>
            <div style={styles.buttonContainer}>
                <ItemButton
                    name={'Delete Item'}
                    color={'red'}
                    onPressButton={handleDelete}
                />
                <ItemButton
                    name={'Make Primary'}
                    onPressButton={handlePrimary}
                />
            </div>

        </div>
    )
}

export default CatalogItem
