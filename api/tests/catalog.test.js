const { describe, it, expect, beforeAll} = require('@jest/globals');
const Catalog = require('../model/catalog');
const {
    addCatalog,
    getCatalogs,
    updateCatalog,
    deleteCatalog,
    bulkDeleteCatalogs,
} = require('../services/catalogController');

describe('addCatalog', () => {
    beforeAll(() => {
        // Mock dependencies
        const {jest} = require('@jest/globals')
        jest.mock('../model/catalog');
    });
    it('should return a 400 status if required values are missing', async () => {
        const {jest} = require('@jest/globals')
        const req = {
            body: {
                name: '',
                vertical: '',
                is_primary: null,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addCatalog(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Add required values' });
    });

    it('should return a 400 status if the catalog already exists', async () => {
        const {jest} = require('@jest/globals')
        const req = {
            body: {
                name: 'Existing Catalog',
                vertical: 'Vertical',
                is_primary: true,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Catalog.findOne = jest.fn().mockResolvedValueOnce({ name: 'Existing Catalog' });

        await addCatalog(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Catalog already exists' });
        expect(Catalog.findOne).toHaveBeenCalledWith({ name: 'Existing Catalog' });
    });

    it('should return a 400 status if the primary catalog for the vertical already exists', async () => {
        const {jest} = require('@jest/globals')
        const req = {
            body: {
                name: 'New Catalog',
                vertical: 'Existing Vertical',
                is_primary: true,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const findOneMock = jest.spyOn(Catalog, 'findOne').mockResolvedValueOnce(null);
        const findMock = jest.spyOn(Catalog, 'find').mockResolvedValueOnce([
            { name: 'Existing Catalog', vertical: 'Existing Vertical', is_primary: true },
        ]);

        await addCatalog(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(findOneMock).toHaveBeenCalledWith({ name: 'New Catalog' });
        expect(findMock).toHaveBeenCalled();

        findOneMock.mockRestore();
        findMock.mockRestore();
    });

    it('should create a new catalog and return a 201 status if all conditions are met', async () => {
        const { jest } = require('@jest/globals');
        const req = {
            body: {
                name: 'New Catalog',
                vertical: 'fashion',
                is_primary: false,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const catalog = {
            name: 'New Catalog',
            vertical: 'fashion',
            is_primary: false,
        }

        Catalog.create = jest.fn().mockResolvedValueOnce(catalog);

        await addCatalog(req, res);

        expect(res.status).toHaveBeenCalledWith(201)
    });
});

describe('getCatalogs', () => {
    beforeAll(() => {
        // Mock dependencies
        const {jest} = require('@jest/globals')
        jest.mock('../model/catalog');
    });
    it('should return catalogs and a success message', async () => {
        const {jest} = require('@jest/globals')
        const catalogs = [
            { _id: '1', name: 'catalog-1', vertical: 'fashion', is_primary: false },
            { _id: '2', name: 'catalog-2',vertical: 'fashion', is_primary: false },
        ];

        const req = {};
        const res = {
            send: jest.fn(),
        };

        await getCatalogs(req, res);
        Catalog.find = jest.fn().mockResolvedValueOnce(catalogs);
        expect(res.send).toHaveBeenCalledWith({
            success: true,
            data: catalogs,
        })
    });

    it('should return a failure message if an error occurs', async () => {
        const {jest} = require('@jest/globals')

        const req = {}; // Provide the necessary request data
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(), // Ensure that this function is a mock function
        };

        Catalog.findOne = jest.fn().mockRejectedValueOnce(new Error('Database error'));

        await getCatalogs(req, res);

        expect(res.send).toHaveBeenCalledWith({ "success": false });
    });
});

describe('updateCatalog', () => {
    it('should return 404 if catalog is not found', async () => {
        const {jest} = require('@jest/globals')
        const req = {
            body: {
                name: 'Nonexistent Catalog',
                is_primary: true,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Catalog.findOneAndUpdate = jest.fn().mockResolvedValueOnce(null);

        await updateCatalog(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Catalog not found' });
        expect(Catalog.findOneAndUpdate).toHaveBeenCalledWith(
            { name: 'Nonexistent Catalog' },
            { is_primary: true },
            { new: true }
        );
    });

    it('should update the catalog and return it', async () => {
        const {jest} = require('@jest/globals')
        const req = {
            body: {
                name: 'Existing Catalog',
                is_primary: true,
            },
        };
        const res = {
            json: jest.fn(),
        };

        const updatedCatalog = { name: 'Existing Catalog', is_primary: true };

        Catalog.findOneAndUpdate = jest.fn().mockResolvedValueOnce(updatedCatalog);

        await updateCatalog(req, res);

        expect(res.json).toHaveBeenCalledWith(updatedCatalog);
        expect(Catalog.findOneAndUpdate).toHaveBeenCalledWith(
            { name: 'Existing Catalog' },
            { is_primary: true },
            { new: true }
        );
    });

    it('should handle errors and return a 500 status', async () => {
        const {jest} = require('@jest/globals')
        const req = {
            body: {
                name: 'Existing Catalog',
                is_primary: true,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Catalog.findOneAndUpdate = jest.fn().mockRejectedValueOnce(new Error('Database error'));

        await updateCatalog(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        expect(Catalog.findOneAndUpdate).toHaveBeenCalled();
    });
});

describe('deleteCatalog', () => {
    it('should return 404 if catalog is not found', async () => {
        const {jest} = require('@jest/globals')
        const req = {
            params: {
                id: 'nonexistent-id',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Catalog.findByIdAndDelete = jest.fn().mockResolvedValueOnce(null);

        await deleteCatalog(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Catalog not found' });
        expect(Catalog.findByIdAndDelete).toHaveBeenCalledWith('nonexistent-id');
    });

    it('should delete the catalog and return success message', async () => {
        const {jest} = require('@jest/globals')
        const req = {
            params: {
                id: 'existing-id',
            },
        };
        const res = {
            json: jest.fn(),
        };

        const deletedCatalog = { _id: 'existing-id' };

        Catalog.findByIdAndDelete = jest.fn().mockResolvedValueOnce(deletedCatalog);

        await deleteCatalog(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Catalog deleted successfully' });
        expect(Catalog.findByIdAndDelete).toHaveBeenCalledWith('existing-id');
    });

    it('should handle errors and return a 500 status', async () => {
        const {jest} = require('@jest/globals')
        const req = {
            params: {
                id: 'existing-id',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Catalog.findByIdAndDelete = jest.fn().mockRejectedValueOnce(new Error('Database error'));

        await deleteCatalog(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        expect(Catalog.findByIdAndDelete).toHaveBeenCalled();
    });
});

describe('bulkDeleteCatalogs', () => {
    it('should delete the specified catalogs and return success message', async () => {
        const {jest} = require('@jest/globals')
        const req = {
            body: {
                catalogIds: ['id1', 'id2', 'id3'],
            },
        };
        const res = {
            json: jest.fn(),
        };

        const deletedCatalogs = { deletedCount: 3 };

        Catalog.deleteMany = jest.fn().mockResolvedValueOnce(deletedCatalogs);

        await bulkDeleteCatalogs(req, res);

        expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Catalogs deleted successfully' });
        expect(Catalog.deleteMany).toHaveBeenCalledWith({ _id: { $in: ['id1', 'id2', 'id3'] } });
    });

    it('should handle errors and return a 500 status', async () => {
        const {jest} = require('@jest/globals')
        const req = {
            body: {
                catalogIds: ['id1', 'id2', 'id3'],
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Catalog.deleteMany = jest.fn().mockRejectedValueOnce(new Error('Database error'));

        await bulkDeleteCatalogs(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        expect(Catalog.deleteMany).toHaveBeenCalled();
    });
});
