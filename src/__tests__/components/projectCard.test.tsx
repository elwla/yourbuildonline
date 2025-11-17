import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";
import ProjectCard from "@/components/projectCard";

const mockProjectWithImage = {
    id: 1,
    name: "Proyecto con Imagen",
    description: "Descripción del proyecto con imagen.",
    image_url: "/test-image.jpg",
};

const mockProjectWithoutImage = {
    id: 2,
    name: "Proyecto sin Imagen",
    description: "Descripción del proyecto sin imagen.",
};

describe('ProjectCard Tests', () => {
    afterEach(cleanup);

    it('debe renderizar correctamente con imagen', () => {
        render(<ProjectCard project={mockProjectWithImage} />);

        expect(screen.getByText('Proyecto con Imagen')).toBeInTheDocument();
        expect(screen.getByText('Descripción del proyecto con imagen.')).toBeInTheDocument();
        const imgElement = screen.getByAltText('Proyecto con Imagen') as HTMLImageElement;
        expect(imgElement).toBeInTheDocument();
        expect(imgElement.src).toContain('/test-image.jpg');
    });

    it('debe renderizar correctamente sin imagen', () => {
        render(<ProjectCard project={mockProjectWithoutImage} />);

        expect(screen.getByText('Proyecto sin Imagen')).toBeInTheDocument();
        expect(screen.getByText('Descripción del proyecto sin imagen.')).toBeInTheDocument();
        expect(screen.getByText('Sin imagen')).toBeInTheDocument();
    });

    it('debe tener el enlace correcto al proyecto', () => {
        render(<ProjectCard project={mockProjectWithImage} />);

        const linkElement = screen.getByRole('link', { name: /Ver Proyecto/i }) as HTMLAnchorElement;
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.href).toContain('/projects/1');
    });
});