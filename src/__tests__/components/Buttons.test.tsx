import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import Buttons from '@/components/Buttons';

const mockedAxios = vi.mocked(axios, true);

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

const { useRouter } = await import('next/navigation');

describe('Buttons Component', () => {
    let confirmSpy: any;
    let alertSpy: any;
    let pushMock: any;

    beforeEach(() => {
        cleanup();
        alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
        pushMock = vi.fn();

        vi.mocked(useRouter).mockReturnValue({
            push: pushMock,
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn(),
            replace: vi.fn(),
            prefetch: vi.fn(),
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
  });

    it('Deben renderizarse los bottones correctamente', () => {
        render(<Buttons projectId={1}/>);

        const editButton = screen.getByRole('button', { name: /Editar/i });
        const deleteButton = screen.getByRole('button', { name: /Eliminar/i });

        expect(editButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
    });

    it('Debe llamar a la API de eliminación al hacer clic en Eliminar y confirmar', async () => {
        vi.spyOn(window, 'confirm').mockReturnValueOnce(true);
        mockedAxios.delete.mockResolvedValueOnce({ status: 204 });

        render(<Buttons projectId={1}/>);

        const deleteButton = screen.getByRole('button', { name: /Eliminar/i });
        await fireEvent.click(deleteButton);
        expect(mockedAxios.delete).toHaveBeenCalledWith('/api/projects/1');
        expect(alertSpy).toHaveBeenCalledWith('Proyecto eliminado exitosamente.');
    });

    it('No debe llamar a la API de eliminación si se cancela', async () => {
        render(<Buttons projectId={1} />);

        const deleteButton = screen.getByRole('button', { name: /Eliminar/i });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(mockedAxios.delete).not.toHaveBeenCalled();
            expect(alertSpy).not.toHaveBeenCalled();
        }); 
    });

    it('Debe redirigir a la página de edición al hacer clic en Editar', async () => {
        render(<Buttons projectId={1} />);

        const editButton = screen.getByRole('button', { name: /Editar/i });
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith('/projects/edit/1');
        });
    });

    it('Debe redirigir a la página de edición al hacer clic en Editar', async () => {
        render(<Buttons projectId={1} />);

        const editButton = screen.getByRole('button', { name: /Editar/i });
        fireEvent.click(editButton);

        await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith('/projects/edit/1');
        });
    });

    it('Debe redirigir a /projects después de eliminar exitosamente', async () => {
        confirmSpy.mockReturnValueOnce(true);
        mockedAxios.delete.mockResolvedValueOnce({ status: 204 });

        render(<Buttons projectId={1} />);

        const deleteButton = screen.getByRole('button', { name: /Eliminar/i });
        fireEvent.click(deleteButton);

        await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith('/projects');
        });
    });
});