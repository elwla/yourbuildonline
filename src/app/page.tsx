import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Construimos Tus Sueños en Realidad
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experiencia construyendo espacios que inspiran, 
            con calidad, innovación y compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/projects" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Ver Nuestros Proyectos
            </Link>
            <Link 
              href="/about" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Conócenos Más
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Por Qué Elegirnos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad Garantizada</h3>
              <p className="text-gray-600">
                Utilizamos los mejores materiales y seguimos los más altos estándares 
                de construcción para garantizar durabilidad y seguridad.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Visualización Online</h3>
                <p className="text-gray-600">
                  Si no estás en la zona podrás ver los avances por medio de fotografías
                  y vídeos que den muestra de la calidad de la construcción.
                </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Entregas a Tiempo</h3>
              <p className="text-gray-600">
                Cumplimos con los plazos establecidos gracias a nuestra eficiente 
                planificación y gestión de proyectos.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Equipo Experto</h3>
              <p className="text-gray-600">
                Contamos con arquitectos, ingenieros y constructores altamente 
                capacitados y con amplia experiencia en el sector.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Proyectos Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="h-48 bg-blue-900 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">Residencial Las Lomas</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Condominio Residencial</h3>
                <p className="text-gray-600 mb-4">
                  Moderno complejo de viviendas con áreas verdes y amenities exclusivos.
                </p>
                <Link href="/projects" className="text-blue-600 font-semibold hover:text-blue-800">
                  Ver más →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="h-48 bg-green-200 flex items-center justify-center">
                <span className="text-green-600 font-semibold">Torre Corporativa</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Centro Empresarial</h3>
                <p className="text-gray-600 mb-4">
                  Edificio inteligente con tecnología de punta para oficinas corporativas.
                </p>
                <Link href="/projects" className="text-blue-600 font-semibold hover:text-blue-800">
                  Ver más →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="h-48 bg-orange-200 flex items-center justify-center">
                <span className="text-orange-600 font-semibold">Centro Comercial</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Plaza del Sol</h3>
                <p className="text-gray-600 mb-4">
                  Moderno centro comercial con más de 100 locales comerciales y entretenimiento.
                </p>
                <Link href="/projects" className="text-blue-600 font-semibold hover:text-blue-800">
                  Ver más →
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/projects" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Ver Todos los Proyectos
            </Link>
          </div>
        </div>
      </section> */}

      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Empezar Tu Proyecto?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contáctanos hoy mismo para una consulta gratuita y descubre cómo 
            podemos hacer realidad tu proyecto de construcción.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/new" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Crear Nuevo Proyecto
            </Link>
            <Link 
              href="/building" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Revisar Mi Proyecto
            </Link>
          </div>
        </div>
      </section>

      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Proyectos Completados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Años de Experiencia</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Clientes Satisfechos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-gray-600">Profesionales</div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default HomePage;