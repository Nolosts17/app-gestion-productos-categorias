import React, { useState, useEffect, useRef } from 'react';
import api from '../axiosConfig'; // Importar la configuración de Axios
import { DataTable, Column, Button, Dialog, InputText, Dropdown, Toast } from 'primereact';
import { Toast as ToastType } from 'primereact/toast';

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria_id: number;
    stock: number;
}

const Productos: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const toast = useRef<ToastType>(null);

    useEffect(() => {
        // Fetch products and categories from API
        api.get('/productos').then(response => setProductos(response.data));
        api.get('/categorias').then(response => setCategorias(response.data));
    }, []);

    const handleAddProducto = () => {
        if (selectedProducto) {
            api.post('/productos', selectedProducto)
                .then(() => {
                    setShowDialog(false);
                    // Refresh products
                    api.get('/productos').then(response => setProductos(response.data));
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product added successfully' });
                })
                .catch(error => {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add product: ${error.message}` });
                });
        }
    };

    const handleUpdateProducto = () => {
        if (selectedProducto) {
            api.put(`/productos/${selectedProducto.id}`, selectedProducto)
                .then(() => {
                    setShowDialog(false);
                    // Refresh products
                    api.get('/productos').then(response => setProductos(response.data));
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product updated successfully' });
                })
                .catch(error => {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to update product: ${error.message}` });
                });
        }
    };

    const handleDeleteProducto = (id: number) => {
        api.delete(`/productos/${id}`)
            .then(() => {
                // Refresh products
                api.get('/productos').then(response => setProductos(response.data));
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully' });
            })
            .catch(error => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to delete product: ${error.message}` });
            });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Producto) => {
        if (selectedProducto) {
            setSelectedProducto({
                ...selectedProducto,
                [field]: e.target.value
            });
        }
    };

    const handleDropdownChange = (e: { value: Categoria }) => {
        if (selectedProducto) {
            setSelectedProducto({
                ...selectedProducto,
                categoria_id: e.value.id
            });
        }
    };

    const openNewProductDialog = () => {
        // Initialize the state for a new product
        setSelectedProducto({
            id: 0,
            nombre: '',
            descripcion: '',
            precio: 0,
            categoria_id: 0,
            stock: 0
        });
        setIsEdit(false);
        setShowDialog(true);
    };

    const openEditProductDialog = (producto: Producto) => {
        setSelectedProducto(producto);
        setIsEdit(true);
        setShowDialog(true);
    };

    return (
        <div>
            <Toast ref={toast} />
            <Button label="Add Product" icon="pi pi-plus" onClick={openNewProductDialog} className="p-button-success" />
            <DataTable value={productos}>
                <Column field="id" header="ID" />
                <Column field="nombre" header="Name" />
                <Column field="descripcion" header="Description" />
                <Column field="precio" header="Price" />
                <Column field="categoria_id" header="Category ID" />
                <Column field="stock" header="Stock" />
                <Column body={(rowData: Producto) => (
                    <>
                        <Button
                            label="Edit"
                            icon="pi pi-pencil"
                            className="p-button-info"
                            onClick={() => openEditProductDialog(rowData)}
                        />
                        <Button
                            label="Delete"
                            icon="pi pi-trash"
                            className="p-button-danger"
                            onClick={() => handleDeleteProducto(rowData.id)}
                        />
                    </>
                )} />
            </DataTable>
            <Dialog header={isEdit ? "Edit Product" : "Add Product"} visible={showDialog} onHide={() => setShowDialog(false)}>
                <div className="p-field">
                    <label htmlFor="nombre">Name</label>
                    <InputText
                        id="nombre"
                        value={selectedProducto?.nombre || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'nombre')}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="descripcion">Description</label>
                    <InputText
                        id="descripcion"
                        value={selectedProducto?.descripcion || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'descripcion')}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="precio">Price</label>
                    <InputText
                        id="precio"
                        value={selectedProducto?.precio || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'precio')}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="categoria">Category</label>
                    <Dropdown
                        id="categoria"
                        value={categorias.find(c => c.id === selectedProducto?.categoria_id) || null}
                        options={categorias}
                        onChange={(e: { value: Categoria }) => handleDropdownChange(e)}
                        optionLabel="nombre"
                        placeholder="Select a category"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="stock">Stock</label>
                    <InputText
                        id="stock"
                        value={selectedProducto?.stock || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'stock')}
                    />
                </div>
                <Button
                    label={isEdit ? "Update" : "Save"}
                    icon="pi pi-check"
                    onClick={isEdit ? handleUpdateProducto : handleAddProducto}
                />
            </Dialog>
        </div>
    );
};

export default Productos;


