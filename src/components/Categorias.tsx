import React, { useState, useEffect, useRef } from 'react';
import { DataTable, Column, Button, Dialog, InputText, Toast } from 'primereact';
import { Toast as ToastType } from 'primereact/toast';
import api from '../axiosConfig';

interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
}

const Categorias: React.FC = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const toast = useRef<ToastType>(null);

    useEffect(() => {
        // Fetch categories from API
        api.get('/categorias')
            .then(response => setCategorias(response.data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleAddCategoria = () => {
        if (selectedCategoria) {
            api.post('/categorias', selectedCategoria)
                .then(() => {
                    setShowDialog(false);
                    api.get('/categorias').then(response => setCategorias(response.data));
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Categoría añadida exitosamente' });
                })
                .catch(error => {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: `Error al añadir categoría: ${error.message}` });
                });
        }
    };

    const handleEditCategoria = () => {
        if (selectedCategoria) {
            api.put(`/categorias/${selectedCategoria.id}`, selectedCategoria)
                .then(() => {
                    setShowDialog(false);
                    api.get('/categorias').then(response => setCategorias(response.data));
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Categoría actualizada exitosamente' });
                })
                .catch(error => {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: `Error al actualizar categoría: ${error.message}` });
                });
        }
    };

    const handleDeleteCategoria = (id: number) => {
        api.delete(`/categorias/${id}`)
            .then(() => {
                api.get('/categorias').then(response => setCategorias(response.data));
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Categoría eliminada exitosamente' });
            })
            .catch(error => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: `Error al eliminar categoría: ${error.message}` });
            });
    };

    const openNewCategoryDialog = () => {
        setSelectedCategoria({ id: 0, nombre: '', descripcion: '' });
        setIsEdit(false);
        setShowDialog(true);
    };

    const openEditCategoryDialog = (categoria: Categoria) => {
        setSelectedCategoria(categoria);
        setIsEdit(true);
        setShowDialog(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Categoria) => {
        if (selectedCategoria) {
            setSelectedCategoria({
                ...selectedCategoria,
                [field]: e.target.value
            });
        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <Button label="Add Category" icon="pi pi-plus" onClick={openNewCategoryDialog} className="p-button-success" />
            <DataTable value={categorias}>
                <Column field="id" header="ID" />
                <Column field="nombre" header="Nombre" />
                <Column field="descripcion" header="Descripción" />
                <Column body={(rowData: Categoria) => (
                    <>
                        <Button label="Edit" icon="pi pi-pencil" className="p-button-info" onClick={() => openEditCategoryDialog(rowData)} />
                        <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={() => handleDeleteCategoria(rowData.id)} />
                    </>
                )} />
            </DataTable>
            <Dialog header={isEdit ? "Edit Category" : "Add Category"} visible={showDialog} onHide={() => setShowDialog(false)}>
                <div className="p-field">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText
                        id="nombre"
                        value={selectedCategoria?.nombre || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'nombre')}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="descripcion">Descripción</label>
                    <InputText
                        id="descripcion"
                        value={selectedCategoria?.descripcion || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'descripcion')}
                    />
                </div>
                <Button
                    label={isEdit ? "Update" : "Save"}
                    icon="pi pi-check"
                    onClick={isEdit ? handleEditCategoria : handleAddCategoria}
                />
            </Dialog>
        </div>
    );
};

export default Categorias;
