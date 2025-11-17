import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import ProjectForm from '@/components/projectForm';

// vi.mock('axios');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
}));

const mockedAxios = vi.mocked(axios, true);
const mockUseRouter = vi.mocked(useRouter, true);
const mockUseParams = vi.mocked(useParams, true);

describe('ProjectForm', () => {
    const mockPush = vi.fn();
    const mockRefresh = vi.fn();

    beforeEach(() => {
        cleanup();

        mockUseRouter.mockReturnValue({
            push: mockPush,
            refresh: mockRefresh,
            back: vi.fn(),
            forward: vi.fn(),
            replace: vi.fn(),
            prefetch: vi.fn(),
        });

        mockUseParams.mockReturnValue({});

        mockedAxios.get.mockResolvedValueOnce({
            data: [
                {
                id: '1',
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@example.com',
                userName: 'juanperez',
                },
                {
                id: '2',
                firstName: 'María',
                lastName: 'Gómez',
                email: 'maria@example.com',
                userName: 'mariagomez',
                },
            ],
        });
    })

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Renderizado inicial', () => {
        it('Debe renderizar el fomulario para crear un nuevo proyecto', async () => {
            render(<ProjectForm />);

            await waitFor(() => {
                expect(screen.getByText(/Crear nuevo Proyecto/i)).toBeInTheDocument();
            })

            expect(screen.getByLabelText(/nombre del proyecto/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/descripción:/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/estado del proyecto:/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/usuario asignado:/i)).toBeInTheDocument();
            expect(screen.getByText(/imágenes del proyecto:/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /crear proyecto/i })).toBeInTheDocument();
        })

        it('Debe renderizar el formulario para editar proyecto cuando hay params.id', async () => {
            const mockProject = {
                id: 1,
                name: 'Proyecto Existente',
                description: 'Descripción del proyecto',
                status: 'completado',
                assignedUserId: '1',
                project_images: [
                { id: 1, url: 'http://example.com/image1.jpg', order: 1 },
                { id: 2, url: 'http://example.com/image2.jpg', order: 2 },
                ],
            };

            mockUseParams.mockReturnValue({ id: '1'})
            mockedAxios.get.mockResolvedValueOnce({ data: mockProject})

            render(<ProjectForm />);

            await waitFor(() => {
                expect(screen.getByText(/Editar Proyecto/i)).toBeInTheDocument();
                expect(screen.getByDisplayValue(/Proyecto Existente/i)).toBeInTheDocument();
                expect(screen.getByDisplayValue(/Descripción del proyecto/i)).toBeInTheDocument();
            });

            expect(screen.getByText('Imágenes Existentes (2)')).toBeInTheDocument();
            expect(screen.getByRole('button', {name: /actualizar proyecto/i})).toBeInTheDocument();
        })

        it('Debe mostrar loading al cargar usuarios', () => {
            mockedAxios.get.mockImplementationOnce(() => new Promise(() => {}));

            render(<ProjectForm />);

            expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument();
        })
    })

    describe('Manejo de formulario', () => { 
        it('Debe actualizar los campos del formulario al escribir', async () => {
            render(<ProjectForm />);

            await waitFor(() => {
                expect(screen.getByTestId('usuario-asignado')).toBeInTheDocument();
            });

            const nameInput = screen.getByLabelText(/nombre del proyecto/i);
            const descriptionInput = screen.getByLabelText(/descripción/i);

            fireEvent.change(nameInput, {target: { value: 'Nuevo Proyecto'}});
            fireEvent.change(descriptionInput, {target: { value: 'Nueva descripción'}});

            expect(nameInput).toHaveValue('Nuevo Proyecto');
            expect(descriptionInput).toHaveValue('Nueva descripción');
        })

        it('Debe cambiar el estado del proyecto', async () => {
            render(<ProjectForm />);

            await waitFor(() => {
                expect(screen.getByLabelText(/estado del proyecto:/i)).toBeInTheDocument();
            });

            const statusSelect = screen.getByLabelText(/estado del proyecto:/i);
            fireEvent.change(statusSelect, {target: { value: 'completado'}})

            expect(statusSelect).toHaveValue('completado');
        })

        it('Debe asignar un usuario al proyecto', async () => {
            render(<ProjectForm />);

            await waitFor(() => {
                expect(screen.getByLabelText(/usuario asignado:/i)).toBeInTheDocument();
            });

            const userSelect = screen.getByLabelText(/usuario asignado:/i);
            fireEvent.change(userSelect, { target: {value: '1'}});

            expect(userSelect).toHaveValue('1');
        })
     })

     describe('Manejo de archivos', () => {
        it('debe agregar imágenes al seleccionar archivos', async () => {
            render(<ProjectForm />);

            await waitFor(() => {
                expect(screen.getByLabelText(/usuario asignado:/i)).toBeInTheDocument();
            });

            const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
            const fileInput = screen.getByTestId('file-input');

            fireEvent.change(fileInput, { target: { files: [file] } });

            await waitFor(() => {
                expect(screen.getByText('1 nueva(s) imagen(es) seleccionada(s)')).toBeInTheDocument();
            });
        });

        it('Debe eliminar una imagen nueva', async () => {
            render(<ProjectForm />);

            await waitFor(() => {
                expect(screen.getByLabelText(/usuario asignado:/i)).toBeInTheDocument();
            });

            const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
            const fileInput = screen.getByTestId('file-input');

            fireEvent.change(fileInput, { target: { files: [file] } });

            await waitFor(() => {
                expect(screen.getByText('1 nueva(s) imagen(es) seleccionada(s)')).toBeInTheDocument();
            });

            expect(screen.queryByAltText('Preview 1')).toBeInTheDocument();

            const removeButton = screen.getByText('×').closest('button')!;
            fireEvent.click(removeButton);

            expect(screen.queryByAltText('Preview 1')).not.toBeInTheDocument();
        })
     })
})