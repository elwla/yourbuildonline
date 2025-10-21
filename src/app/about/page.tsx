import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Sobre Nosotros
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Expertos en nuestra área, con serierdad y compromiso construimos confianza, calidad y sueños en cada proyecto
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestra Misión</h2>
              <p className="text-gray-600 text-lg">
                Transformar ideas en espacios funcionales y sostenibles, superando 
                las expectativas de nuestros clientes mediante soluciones innovadoras 
                y un compromiso inquebrantable con la calidad y la seguridad.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestra Visión</h2>
              <p className="text-gray-600 text-lg">
                Ser la empresa constructora líder reconocida por nuestra excelencia, 
                innovación y contribución al desarrollo urbano sostenible, creando 
                legados arquitectónicos que enriquezcan la vida de las comunidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Nuestra Historia
            </h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-600 text-lg mb-6">
                Fundada en 2025, <strong className="text-blue-600">Your Construcción Online</strong> nació 
                con la visión de revolucionar el sector de la construcción mediante 
                la combinación de tradición artesanal con tecnología de vanguardia.
              </p>
              <p className="text-gray-600 text-lg mb-6">
                Comenzamos como un pequeño equipo de apasionados por la arquitectura 
                y la ingeniería, y hoy somos una empresa consolidada con diferentes 
                proyectos en construcción.
              </p>
              <p className="text-gray-600 text-lg">
                Nuestro crecimiento ha sido impulsado por valores fundamentales: 
                <strong className="text-blue-600"> integridad, calidad y compromiso</strong> 
                con cada cliente y cada proyecto.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad</h3>
              <p className="text-gray-600">
                No comprometemos la excelencia. Cada detalle cuenta en la búsqueda 
                de la perfección.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Compromiso</h3>
              <p className="text-gray-600">
                Nos dedicamos completamente a cada proyecto como si fuera nuestro propio sueño.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovación</h3>
              <p className="text-gray-600">
                Adoptamos nuevas tecnologías y métodos para ofrecer soluciones vanguardistas.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trabajo en Equipo</h3>
              <p className="text-gray-600">
                Colaboramos estrechamente con clientes y colegas para lograr resultados excepcionales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Nuestro Equipo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">JD</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Juan Díaz</h3>
              <p className="text-blue-600 font-medium mb-2">Director General</p>
              <p className="text-gray-600 text-sm">
                Más de 20 años de experiencia en gestión de proyectos de construcción 
                y desarrollo inmobiliario.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-green-600 font-bold text-xl">MR</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">María Rodríguez</h3>
              <p className="text-blue-600 font-medium mb-2">Arquitecta Principal</p>
              <p className="text-gray-600 text-sm">
                Especialista en diseño sostenible y planificación urbana con 
                maestría en arquitectura bioclimática.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xl">CP</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Carlos Pérez</h3>
              <p className="text-blue-600 font-medium mb-2">Ingeniero Estructural</p>
              <p className="text-gray-600 text-sm">
                Experto en cálculo estructural y supervisor de obras con 
                especialización en estructuras complejas.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tienes un Proyecto en Mente?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a nuestra lista de clientes satisfechos y hagamos realidad tu visión juntos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Contáctanos
            </Link>
            <Link 
              href="/projects" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Ver Proyectos
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
              <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-gray-600">Profesionales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Clientes Satisfechos</div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default AboutPage;