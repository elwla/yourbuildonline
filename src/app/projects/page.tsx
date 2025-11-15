/**
 * Página de lista de proyectos completados.
 *
 * Esta página es un Server Component de Next.js (es async) que:
 * - Recupera la lista de proyectos desde la API local en /api/projects
 * - Renderiza una cuadrícula de tarjetas usando components/projectCard
 * - Muestra estados vacíos y una sección de métricas simples
 *
 * Notas:
 * - La llamada a la API se realiza con axios hacia http://localhost:3000/api/projects.
 * - Mantener esta función como Server Component permite fetch directo en el servidor.
 * - Si quieres convertirla en Client Component, añade "use client" y mueve la lógica de fetch a useEffect.
 */
import ProjectCard from "@/components/projectCard";
import axios from "axios";

/**
 * Representa un proyecto devuelto por la API.
 *
 * @typedef {Object} Project
 * @property {number} id - Identificador único del proyecto.
 * @property {string} name - Nombre del proyecto.
 * @property {string} description - Descripción breve.
 * @property {string} [image_url] - URL de la imagen del proyecto (opcional).
 * @property {string} [status] - Estado (e.g., "completed", "in-progress") (opcional).
 * @property {string[]} [technologies] - Tecnologías usadas (opcional).
 * @property {string} [completed_date] - Fecha de finalización (ISO) (opcional).
 */
interface Project {
    id: number;
    name: string;
    description: string;
    image_url?: string;
    status?: string;
    technologies?: string[];
    completed_date?: string;
}

/**
 * Recupera la lista de proyectos desde la API local.
 *
 * - Endpoint: GET http://localhost:3000/api/projects
 * - Retorna una promesa que resuelve en un array de Project.
 * - Lanza la excepción si axios falla — considerar capturar/transformar errores según necesidad.
 *
 * @returns {Promise<Project[]>} Array de proyectos.
 */
const loadProjects = async (): Promise<Project[]> => {
    const response = await axios.get('http://localhost:3000/api/projects');
    return response.data;
}

/**
 * Componente de página que muestra los proyectos.
 *
 * Este componente es asíncrono y se ejecuta en el servidor (Server Component).
 * Se encarga de:
 *  - Cargar proyectos mediante loadProjects
 *  - Renderizar la UI de la lista, estado vacío y una sección de métricas
 *
 * Consideraciones:
 *  - Para evitar llamadas innecesarias en tiempo de cliente, mantener la carga en el servidor.
 *  - Si la API está protegida o depende de cabeceras del request, mover la llamada a una ruta API interna
 *    que haga la agregación necesaria.
 *
 * @returns {JSX.Element} Markup de la página.
 */
const ProjectListPage = async () => {
    const allProjects = await loadProjects();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-8 px-4">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto text-center mb-12 animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                    <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
                    Proyectos Completados
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-4">
                    Explora nuestros proyectos exitosamente finalizados
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        {allProjects.length} Proyectos Finalizados
                    </span>
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto mt-6 rounded-full"></div>
            </div>

            {allProjects.length > 0 ? (
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                        {allProjects.map((project: Project, index: number) => (
                            <div 
                                key={project.id}
                                className="animate-scale-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <ProjectCard data-testid="project-card" project={project} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto text-center py-16 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No hay proyectos completados</h3>
                        <p className="text-slate-600 mb-6">Actualmente no tenemos proyectos finalizados. ¡Estamos trabajando en ello!</p>
                        <div className="w-12 h-1 bg-slate-300 mx-auto rounded-full"></div>
                    </div>
                </div>
            )}

            {allProjects.length > 0 && (
                <div className="max-w-7xl mx-auto mt-16 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-emerald-600 mb-2">{allProjects.length}</div>
                                <div className="text-slate-600">Proyectos Completados</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-emerald-600 mb-2">
                                    {Math.round(allProjects.length / allProjects.length * 100)}%
                                </div>
                                <div className="text-slate-600">Tasa de Finalización</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-emerald-600 mb-2">
                                    {new Date().getFullYear()}
                                </div>
                                <div className="text-slate-600">Año en Curso</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectListPage;