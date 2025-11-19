// src/__tests__/components/TruncatedUrlWithCopy.test.tsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TruncatedUrlWithCopy from '@/components/TruncatedUrlWithCopy';

// Mock de navigator.clipboard
const mockWriteText = vi.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
});

describe('TruncatedUrlWithCopy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado', () => {
    it('debe renderizar la URL truncada correctamente', () => {
      const longUrl = 'https://www.ejemplo.com/ruta/muy/larga/que/necesita/ser/truncada';
      render(<TruncatedUrlWithCopy url={longUrl} />);

      expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
      expect(screen.getAllByText(/https:/)[0]).toBeInTheDocument();
    });

    it('debe renderizar la URL completa si es más corta que maxLength', () => {
      const shortUrl = 'https://ejemplo.com';
      render(<TruncatedUrlWithCopy url={shortUrl} maxLength={50} />);

      expect(screen.getAllByText(shortUrl)[0]).toBeInTheDocument();
      expect(screen.queryByText(/\.\.\./)).not.toBeInTheDocument();
    });

    it('debe aplicar className personalizado', () => {
      const url = 'https://ejemplo.com';
      const { container } = render(<TruncatedUrlWithCopy url={url} className="mi-clase-personalizada" />);

      expect(container.firstChild).toHaveClass('mi-clase-personalizada');
    });

    it('debe mostrar el botón de copiar con el texto correcto', () => {
      const url = 'https://ejemplo.com';
      render(<TruncatedUrlWithCopy url={url} />);

      expect(screen.getByRole('button', { name: /copiar/i })).toBeInTheDocument();
      expect(screen.getByText('Copiar')).toBeInTheDocument();
    });
  });

  describe('Funcionalidad de truncado', () => {
    it('debe truncar URLs largas correctamente', () => {
      const longUrl = 'https://www.midominio.com/ruta/muy/muy/larga/que/necesita/ser/truncada/para/caber/en/el/espacio';
      render(<TruncatedUrlWithCopy url={longUrl} maxLength={40} />);

      const displayedUrl = screen.getByText(/\.\.\./).textContent;
      expect(displayedUrl?.length).toBeLessThanOrEqual(43);
    });

    it('debe mantener el inicio y final de la URL al truncar', () => {
        const url = 'https://www.dominioejemplo.com/ruta/ejemplo';
        render(<TruncatedUrlWithCopy url={url} maxLength={30} />);

        const displayedUrl = screen.getByText(/\.\.\./).textContent;
        
        expect(displayedUrl).toMatch(/^https:\/\//);
        expect(displayedUrl).toContain('...');
        expect(displayedUrl?.length).toBeLessThanOrEqual(33);
    });
  });

  describe('Funcionalidad de copiado', () => {
    it('debe copiar la URL completa al hacer clic en el botón', async () => {
      const url = 'https://ejemplo.com';
      mockWriteText.mockResolvedValueOnce(undefined);

      render(<TruncatedUrlWithCopy url={url} />);

      const copyButton = screen.getByRole('button', { name: /copiar/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(url);
      });
    });

    it('debe mostrar "Copiado!" temporalmente después de copiar', async () => {
      const url = 'https://ejemplo.com';
      mockWriteText.mockResolvedValueOnce(undefined);

      render(<TruncatedUrlWithCopy url={url} />);

      const copyButton = screen.getByRole('button', { name: /copiar/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText('Copiado!')).toBeInTheDocument();
        expect(screen.queryByText('Copiar')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Copiar')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('debe manejar errores al copiar', async () => {
      const url = 'https://ejemplo.com';
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockWriteText.mockRejectedValueOnce(new Error('Error de clipboard'));

      render(<TruncatedUrlWithCopy url={url} />);

      const copyButton = screen.getByRole('button', { name: /copiar/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error al copiar: ', expect.any(Error));
      });

      expect(screen.getByText('Copiar')).toBeInTheDocument();
      expect(screen.queryByText('Copiado!')).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('debe establecer un timeout para revertir el estado de copiado', async () => {
      const url = 'https://ejemplo.com';
      mockWriteText.mockResolvedValueOnce(undefined);
      
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

      render(<TruncatedUrlWithCopy url={url} />);

      const copyButton = screen.getByRole('button', { name: /copiar/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText('Copiado!')).toBeInTheDocument();
      });

      expect(setTimeoutSpy).toHaveBeenCalled();
      
      setTimeoutSpy.mockRestore();
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener el título correcto en el botón de copiar', () => {
      const url = 'https://ejemplo.com';
      render(<TruncatedUrlWithCopy url={url} />);

      const copyButton = screen.getByRole('button', { name: /copiar/i });
      expect(copyButton).toHaveAttribute('title', 'Copiar URL completa');
    });

    it('debe tener el tooltip nativo con la URL completa', () => {
      const url = 'https://www.ejemplo.com/ruta/muy/larga';
      render(<TruncatedUrlWithCopy url={url} />);

      const urlElement = screen.getAllByText(/https:/)[0];
      expect(urlElement.closest('div')).toHaveAttribute('title', url);
    });
  });

  describe('Casos edge', () => {
    it('debe manejar URLs vacías', () => {
      render(<TruncatedUrlWithCopy url="" />);

      expect(screen.getAllByText('')[0]).toBeInTheDocument();
    });

    it('debe manejar maxLength muy pequeño', () => {
      const url = 'https://ejemplo.com';
      render(<TruncatedUrlWithCopy url={url} maxLength={5} />);

      expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
    });
  });
});