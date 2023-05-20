import * as React from 'react'
import CatalogItem from "./CatalogItem";
import {TypeCatalog} from "../../../consts/types";

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 20,
        gap: 10,
        backgroundColor: '#fff',
        width: '100%',
        marginBottom: 40
    },
    itemContainer: {
        backgroundColor: '#fff',
        width: '100%',
        paddingBottom: 20
    },
    scrollView: {
        height: '90%',
        width: '100%',
        alignSelf: 'center',
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,

    }
} as const;

interface Props{
    catalogs: TypeCatalog[]
    onSetPrimary: () => void
    onDelete: () => void
}
const List:React.FC<Props> = ({ catalogs, onSetPrimary, onDelete }) => {

    if (!catalogs) {
        return(
            <div>
                <h1>
                    Catalogs List is Empty
                </h1>
            </div>
        )
    }

    return(
        <div style={styles.container}>
            {catalogs && catalogs.map((item, index) => (
                <div style={styles.itemContainer} key={item._id}>
                    <CatalogItem
                        catalog={item}
                        onDelete={onDelete}
                        onSetPrimary={onSetPrimary}
                    />
                </div>
            ))}
        </div>
    )
}

export default List
