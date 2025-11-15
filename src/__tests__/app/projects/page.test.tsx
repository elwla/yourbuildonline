import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProjectListPage from '@/app/projects/page';
import axios from 'axios';
import { mock } from 'node:test';

const mockedAxios = vi.mocked(axios, true);

vi.mock('@/components/projectCard', () => ({
    default: ({ project }: any) => (
        <div data-testid="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
        </div>
    ),
}));

const mockProjects = [
  {
    id: 1,
    name: 'Proyecto Test 1',
    description: 'Descripción del proyecto test 1',
    image_url: '/test-image.jpg',
    status: 'completed',
    completed_date: '2024-01-15',
  },
  {
    id: 2,
    name: 'Proyecto Test 2',
    description: 'Descripción del proyecto test 2',
    status: 'completed',
    completed_date: '2024-02-20',
  },
];

describe('ProjectListPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it('debe renderizar la página con proyectos correctamente', async () => {
    // Mock de la respuesta exitosa
    mockedAxios.get.mockResolvedValueOnce({ data: mockProjects });

    // Renderizar el componente async
    const Page = await ProjectListPage();
    render(Page);

    const mainHeading = screen.getByRole('heading', { 
      name: /Proyectos Completados/i,
      level: 1 
    });
    expect(mainHeading).toBeInTheDocument();

    // Verificar que los proyectos se renderizan
    expect(screen.getByText('Proyecto Test 1')).toBeInTheDocument();
    expect(screen.getByText('Proyecto Test 2')).toBeInTheDocument();

    // Verificar que se muestra el contador de proyectos
    expect(screen.getByText('2 Proyectos Finalizados')).toBeInTheDocument();

    // Verificar que las métricas se renderizan
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText(new Date().getFullYear().toString())).toBeInTheDocument();
  });

  it('debe renderizar el mensaje vacío cuando no hay proyectos', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const Page = await ProjectListPage();
    render(Page);

    expect(screen.getByText('No hay proyectos completados')).toBeInTheDocument();

    expect(
      screen.getByText('Actualmente no tenemos proyectos finalizados. ¡Estamos trabajando en ello!')
    ).toBeInTheDocument();

    expect(screen.queryByTestId('project-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-card-2')).not.toBeInTheDocument();

    const mainHeading = screen.getByRole('heading', { 
      name: /Proyectos Completados/i,
      level: 1 
    });
    expect(mainHeading).toBeInTheDocument();
  });

  it('Debe llamar a la API correcta con la URL esperada', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProjects });

    await ProjectListPage();

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/api/projects');
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  })

  it('Debe calcular correctamente la tasa de finalización', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProjects });

    const Page = await ProjectListPage();
    render(Page);

    expect(screen.getByText('100%')).toBeInTheDocument();
  })

  it('Debe renderizar la cantidad correcta de proyectos', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProjects });

    const Page = await ProjectListPage();
    render(Page);

    const projectCards = screen.getAllByTestId(/project-card/);
    expect(projectCards).toHaveLength(mockProjects.length);
  })
});