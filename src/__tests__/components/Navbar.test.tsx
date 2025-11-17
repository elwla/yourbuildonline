import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import NavBar from '@/components/Navbar';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

import { useSession, signOut } from 'next-auth/react';

const mockUseSession = vi.mocked(useSession);
const mockSignOut = vi.mocked(signOut);

describe('NavBar Component', () => {
    beforeEach(() => {
        cleanup();
        mockUseSession.mockReturnValue({
            data: null,
            status: 'unauthenticated',
            update: vi.fn(),
        });
        mockSignOut.mockResolvedValue(undefined as any);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('Debe renderizarse con los links correctos cuando no esta loggueado', () => {
        render(<NavBar />);

        expect(screen.getByRole('link', { name: /Tu Construcción Online/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Proyectos/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Acerca de/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Contactanos/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /Crear nuevo proyecto/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /Revisa tu proyecto/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /Logout/i })).not.toBeInTheDocument();
    });

    it('Debe mostrar el estado Cargando... cuando se inicia el componente', () => {
        mockUseSession.mockReturnValue({
            data: null,
            status: 'loading',
            update: vi.fn(),
        });

        render(<NavBar />);

        expect(screen.getByText('Cargando...')).toBeInTheDocument();
    })

    it('Debe renderizar los links para usuario autenticado', () => {
        mockUseSession.mockReturnValue({
            data: {
                user: {
                    name: 'Test User',
                    email: 'test@example.com',
                },
                expires: '2025-12-31',
            },
            status: 'authenticated',
            update: vi.fn(),
        })

        render(<NavBar />);

        expect(screen.getByRole('link', { name: /Revisa tu proyecto/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /Login/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /Regístrate/i })).not.toBeInTheDocument();
    });

    it('Debe renderizar los links para usuario ADMIN autenticado', () => {
        mockUseSession.mockReturnValue({
            data: {
                user: {
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'admin',
                },
                expires: '2025-12-31',
            },
            status: 'authenticated',
            update: vi.fn(),
        })

        render(<NavBar />);

        expect(screen.getByRole('link', { name: /Crear nuevo proyecto/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Revisa tu proyecto/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /Login/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /Regístrate/i })).not.toBeInTheDocument();
    });
});