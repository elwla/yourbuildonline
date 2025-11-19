import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import ProjectForm from '@/components/projectForm';

// Mocks
vi.mock('axios');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
}));

const mockedAxios = vi.mocked(axios);
const mockUseRouter = vi.mocked(useRouter);
const mockUseParams = vi.mocked(useParams);

// Mock data
const mockUsers = [
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
];

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

describe('ProjectForm', () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();

  beforeEach(() => {
    cleanup();

    // Mock de router
    mockUseRouter.mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
      back: vi.fn(),
      forward: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    });

    // Mock de params vacío por defecto
    mockUseParams.mockReturnValue({});

    // Mock de axios por defecto
    mockedAxios.get.mockImplementation((url) => {
      if (url === '/api/users') {
        return Promise.resolve({ data: mockUsers });
      }
      return Promise.reject(new Error(`URL no mockeada: ${url}`));
    });

    mockedAxios.post.mockResolvedValue({ data: { id: 1 } });
    mockedAxios.put.mockResolvedValue({ data: { id: 1 } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado inicial', () => {
    it('Debe renderizar el formulario para crear un nuevo proyecto', async () => {
      render(<ProjectForm />);

      await waitFor(() => {
        expect(screen.getByText(/Crear Nuevo Proyecto/i)).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/nombre del proyecto/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/descripción:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/estado del proyecto:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/usuario asignado:/i)).toBeInTheDocument();
      expect(screen.getByText(/imágenes del proyecto:/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /crear proyecto/i })).toBeInTheDocument();
    });

    it('Debe renderizar el formulario para editar proyecto cuando hay params.id', async () => {
      // Mock específico para este test
      mockedAxios.get.mockImplementation((url) => {
        if (url === '/api/users') {
          return Promise.resolve({ data: mockUsers });
        }
        if (url === '/api/projects/1') {
          return Promise.resolve({ data: mockProject });
        }
        return Promise.reject(new Error(`URL no mockeada: ${url}`));
      });

      mockUseParams.mockReturnValue({ id: '1' });

      render(<ProjectForm />);

      await waitFor(() => {
        expect(screen.getByText(/Editar Proyecto/i)).toBeInTheDocument();
      });

      // Los campos pueden tardar más en llenarse
      await waitFor(() => {
        expect(screen.getByDisplayValue(/Proyecto Existente/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      await waitFor(() => {
        expect(screen.getByDisplayValue(/Descripción del proyecto/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      expect(screen.getByText('Imágenes Existentes (2)')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /actualizar proyecto/i })).toBeInTheDocument();
    });

    it('Debe mostrar loading al cargar usuarios', () => {
      // Mock que nunca se resuelve
      mockedAxios.get.mockImplementationOnce(() => new Promise(() => {}));

      render(<ProjectForm />);

      expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument();
    });
  });

  describe('Manejo de formulario', () => {
    it('Debe actualizar los campos del formulario al escribir', async () => {
      render(<ProjectForm />);

      await waitFor(() => {
        expect(screen.getByTestId('usuario-asignado')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/nombre del proyecto/i);
      const descriptionInput = screen.getByLabelText(/descripción/i);

      fireEvent.change(nameInput, { target: { value: 'Nuevo Proyecto' } });
      fireEvent.change(descriptionInput, { target: { value: 'Nueva descripción' } });

      expect(nameInput).toHaveValue('Nuevo Proyecto');
      expect(descriptionInput).toHaveValue('Nueva descripción');
    });

    it('Debe cambiar el estado del proyecto', async () => {
      render(<ProjectForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/estado del proyecto:/i)).toBeInTheDocument();
      });

      const statusSelect = screen.getByLabelText(/estado del proyecto:/i);
      fireEvent.change(statusSelect, { target: { value: 'completado' } });

      expect(statusSelect).toHaveValue('completado');
    });

    it('Debe asignar un usuario al proyecto', async () => {
      render(<ProjectForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/usuario asignado:/i)).toBeInTheDocument();
      });

      const userSelect = screen.getByLabelText(/usuario asignado:/i);
      fireEvent.change(userSelect, { target: { value: '1' } });

      expect(userSelect).toHaveValue('1');
    });
  });

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

      // Buscar el botón de eliminar de manera más específica
      const removeButtons = screen.getAllByText('×');
      const removeButton = removeButtons[0].closest('button')!;
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByText('1 nueva(s) imagen(es) seleccionada(s)')).not.toBeInTheDocument();
      });
    });

    it('debe eliminar una imagen existente en modo edición', async () => {
      const simpleMockProject = {
        id: 1,
        name: 'Proyecto Existente',
        description: 'Descripción',
        status: 'construyendo',
        assignedUserId: '',
        project_images: [
          { id: 1, url: 'http://example.com/image1.jpg', order: 1 },
        ],
      };

      // Mock específico para este test
      mockedAxios.get.mockImplementation((url) => {
        if (url === '/api/users') {
          return Promise.resolve({ data: mockUsers });
        }
        if (url === '/api/projects/1') {
          return Promise.resolve({ data: simpleMockProject });
        }
        return Promise.reject(new Error(`URL no mockeada: ${url}`));
      });

      mockUseParams.mockReturnValue({ id: '1' });

      render(<ProjectForm />);

      // Esperar a que se cargue completamente
      await waitFor(() => {
        expect(screen.getByDisplayValue('Proyecto Existente')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Buscar la sección de imágenes existentes
      await waitFor(() => {
        expect(screen.getByText('Imágenes Existentes (1)')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Buscar y hacer clic en el botón de eliminar
      const removeButtons = screen.getAllByText('×');
      const removeButton = removeButtons[0].closest('button')!;
      fireEvent.click(removeButton);

      // Verificar que la imagen se eliminó
      await waitFor(() => {
        expect(screen.queryByAltText('Imagen existente 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Envío del formulario', () => {
    it('debe crear un nuevo proyecto exitosamente', async () => {
      render(<ProjectForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/usuario asignado:/i)).toBeInTheDocument();
      });

      // Llenar formulario
      fireEvent.change(screen.getByLabelText(/nombre del proyecto/i), {
        target: { value: 'Nuevo Proyecto' },
      });
      fireEvent.change(screen.getByLabelText(/descripción:/i), {
        target: { value: 'Descripción del proyecto' },
      });

      // Enviar formulario
      fireEvent.click(screen.getByRole('button', { name: /crear proyecto/i }));

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          '/api/projects',
          expect.any(FormData),
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }, { timeout: 3000 });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/projects');
        expect(mockRefresh).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('debe actualizar un proyecto existente exitosamente', async () => {
      const updateMockProject = {
        id: 1,
        name: 'Proyecto Existente',
        description: 'Descripción',
        status: 'construyendo',
        assignedUserId: '',
        project_images: [],
      };

      // Mock específico
      mockedAxios.get.mockImplementation((url) => {
        if (url === '/api/users') {
          return Promise.resolve({ data: mockUsers });
        }
        if (url === '/api/projects/1') {
          return Promise.resolve({ data: updateMockProject });
        }
        return Promise.reject(new Error(`URL no mockeada: ${url}`));
      });

      mockUseParams.mockReturnValue({ id: '1' });

      render(<ProjectForm />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Proyecto Existente')).toBeInTheDocument();
      }, { timeout: 3000 });

      fireEvent.click(screen.getByRole('button', { name: /actualizar proyecto/i }));

      await waitFor(() => {
        expect(mockedAxios.put).toHaveBeenCalledWith(
          '/api/projects/1',
          expect.any(FormData),
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }, { timeout: 3000 });
    });

    it('debe manejar errores al enviar el formulario', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      // Mock específico para este test
      mockedAxios.post.mockRejectedValueOnce(new Error('Error de red'));

      render(<ProjectForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/usuario asignado:/i)).toBeInTheDocument();
      });

      // Llenar campos requeridos
      fireEvent.change(screen.getByLabelText(/nombre del proyecto/i), {
        target: { value: 'Proyecto Test' }
      });

      fireEvent.change(screen.getByLabelText(/descripción:/i), {
        target: { value: 'Descripción test' }
      });

      // Enviar formulario
      fireEvent.click(screen.getByRole('button', { name: /crear proyecto/i }));

      // Esperar a que se procese el error
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error submitting project:', expect.any(Error));
      }, { timeout: 3000 });

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Error al guardar el proyecto. Por favor, intenta nuevamente.');
      }, { timeout: 3000 });

      consoleSpy.mockRestore();
      alertSpy.mockRestore();
    });

    it('debe mostrar loading durante el envío', async () => {
      // Mock que nunca se resuelve
      mockedAxios.post.mockImplementationOnce(() => new Promise(() => {}));

      render(<ProjectForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/usuario asignado:/i)).toBeInTheDocument();
      });

      // Llenar campos requeridos
      fireEvent.change(screen.getByLabelText(/nombre del proyecto/i), {
        target: { value: 'Proyecto Test' }
      });

      fireEvent.change(screen.getByLabelText(/descripción:/i), {
        target: { value: 'Descripción test' }
      });

      // Enviar formulario
      fireEvent.click(screen.getByRole('button', { name: /crear proyecto/i }));

      // Verificar estado loading
      await waitFor(() => {
        const loadingButton = screen.getByRole('button', { name: /Guardando.../i });
        expect(loadingButton).toBeInTheDocument();
        expect(loadingButton).toBeDisabled();
      });
    });
  });

  describe('Validaciones', () => {
    it('debe requerir nombre y descripción', async () => {
      render(<ProjectForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/usuario asignado:/i)).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/nombre del proyecto/i);
      const descriptionInput = screen.getByLabelText(/descripción:/i);

      expect(nameInput).toBeRequired();
      expect(descriptionInput).toBeRequired();
    });

    it('debe tener estado "construyendo" por defecto', async () => {
      render(<ProjectForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/estado del proyecto:/i)).toBeInTheDocument();
      });

      const statusSelect = screen.getByLabelText(/estado del proyecto:/i);
      expect(statusSelect).toHaveValue('construyendo');
    });
  });
});