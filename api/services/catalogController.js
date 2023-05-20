const Catalog = require('../model/catalog');

const addCatalog = async (req, res) => {
    try {
        const { name, vertical, is_primary } = req.body;

        if (name === '' || vertical === '' || is_primary === null) {
            return res.status(400).json({ error: 'Add required values' });
        }

        // Validate if catalog exists in our database
        const existingCatalog = await Catalog.findOne({ name });
        if (existingCatalog) {
            return res.status(400).json({ error: 'Catalog already exists' });
        }

        // Check if the primary catalog for this vertical already exists
        if (is_primary === true) {
            const catalogs = await Catalog.find().exec();
            const primaryCatalogExists = catalogs.some(
                (cat) => cat.vertical === vertical && cat.is_primary === true && is_primary === true
            );
            if (primaryCatalogExists) {
                return res.status(400).json({ error: 'The primary catalog for this vertical already exists' });
            }
        }

        // Create catalog in our database
        const catalog = await Catalog.create({
            name,
            vertical,
            is_primary,
        });

        // Return new catalog
        return res.status(201).json(catalog);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
};

const getCatalogs = async (req, res) => {
    try {
        const catalogs = await Catalog.find().exec();
        res.send({
            success: true,
            data: catalogs,
        });
    } catch (err) {
        console.log(err);
        res.send({
            success: false,
        });
    }
};

const updateCatalog = async (req, res) => {
    try {
        const { name, is_primary } = req.body;

        const updatedCatalog = await Catalog.findOneAndUpdate(
            { name },
            { is_primary },
            { new: true }
        );

        if (!updatedCatalog) {
            return res.status(404).json({ error: 'Catalog not found' });
        }

        return res.json(updatedCatalog);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteCatalog = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCatalog = await Catalog.findByIdAndDelete(id);

        if (!deletedCatalog) {
            return res.status(404).json({ error: 'Catalog not found' });
        }

        return res.json({ success: true, message: 'Catalog deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const bulkDeleteCatalogs = async (req, res) => {
    try {
        const { catalogIds } = req.body;

        const deletedCatalogs = await Catalog.deleteMany({ _id: { $in: catalogIds } });

        if (deletedCatalogs.deletedCount === 0) {
            return res.status(404).json({ error: 'No catalogs found' });
        }

        return res.json({ success: true, message: 'Catalogs deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addCatalog,
    getCatalogs,
    updateCatalog,
    deleteCatalog,
    bulkDeleteCatalogs,
};
