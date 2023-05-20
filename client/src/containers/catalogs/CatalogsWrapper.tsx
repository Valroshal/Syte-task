import * as React from 'react'
import List from "./components/List";
import { useCallback, useEffect, useState } from "react"
import {addCatalog, fetchCatalogs} from '../../queries/catalog'
import {TypeCatalog} from "../../consts/types";
import ItemButton from "./components/ItemButton";
import AddCatalog from "./components/AddCatalog";

const styles = {
    container: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: 20,
        flex: 1,
    },
} as const;

const CatalogsWrapper = () => {
    const [initialCatalogs, setInitialProducts] = useState<TypeCatalog[]>([])
    const [filteredCatalogs, setFilteredProducts] = useState<TypeCatalog[]>([])
    const [modalVisible, setModalVisible] = useState(false)

    useEffect( () => {
        handleFetchCatalogs().then()
    }, [])

    const handleFetchCatalogs = async () => {
        const pr = await fetchCatalogs()
        setInitialProducts(Array.from(pr.data))
        setFilteredProducts(pr.data)
    }

    const handlePrimary = useCallback(() => {
        handleFetchCatalogs().then()
    }, [])

    const handleDelete = useCallback(() => {
        handleFetchCatalogs().then()
    }, [])

    const handleAddCatalog = useCallback(() => {
        handleFetchCatalogs().then()
    }, [])

    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }

    if (filteredCatalogs.length < 1) {
        return null
    }

    return(
        <div style={styles.container}>
            <ItemButton onPressButton={toggleModal} name={'Add New Catalog'} />
            {modalVisible &&
                <AddCatalog
                    isOpen={modalVisible}
                    onAdd={handleAddCatalog}
                    onClose={toggleModal}
                />
            }
            <List catalogs={filteredCatalogs} onSetPrimary={handlePrimary} onDelete={handleDelete}/>
        </div>
    )
}

export default CatalogsWrapper
